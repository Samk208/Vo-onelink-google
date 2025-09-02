import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { verificationReviewSchema, uuidSchema } from "@/lib/validators"
import { UserRole, type OnboardingApiResponse, type VerificationRequest } from "@/lib/types"

export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user and check admin permissions
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    // Validate request ID
    const requestIdValidation = uuidSchema.safeParse(params.requestId)
    if (!requestIdValidation.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate review data
    const validation = verificationReviewSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid review data",
          fieldErrors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { status, rejection_reason } = validation.data

    // Validate rejection reason is provided when rejecting
    if (status === 'rejected' && !rejection_reason) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Rejection reason is required when rejecting",
          fieldErrors: { rejection_reason: ["Rejection reason is required"] }
        },
        { status: 400 }
      )
    }

    // Get verification request to check it exists and is in correct state
    const { data: verificationRequest, error: fetchError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('id', params.requestId)
      .single()

    if (fetchError) {
      console.error('Verification request fetch error:', fetchError)
      return NextResponse.json(
        { ok: false, error: "Verification request not found" },
        { status: 404 }
      )
    }

    // Check if request is in a reviewable state
    if (!['submitted', 'in_review'].includes(verificationRequest.status)) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Cannot review request with status: ${verificationRequest.status}`,
          fieldErrors: { status: [`Request must be submitted or in review to be reviewed`] }
        },
        { status: 400 }
      )
    }

    // Update verification request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('verification_requests')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.requestId)
      .select()
      .single()

    if (updateError) {
      console.error('Verification request update error:', updateError)
      return NextResponse.json(
        { ok: false, error: "Failed to update verification request" },
        { status: 500 }
      )
    }

    // If verified, update user profile role
    if (status === 'verified') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: verificationRequest.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', verificationRequest.user_id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        // Don't fail the request, but log the error
        console.warn(`Failed to update profile role for user ${verificationRequest.user_id}`)
      }
    }

    // TODO: In production, send notification to user about review result
    // This could be:
    // - Send email notification
    // - Create in-app notification
    // - Send webhook event
    // - Update user dashboard status

    console.log(`Verification request ${params.requestId} ${status} by admin ${user.id}`)

    return NextResponse.json({
      ok: true,
      data: updatedRequest,
      message: `Verification request ${status} successfully`
    } as OnboardingApiResponse<VerificationRequest>)
  } catch (error) {
    console.error('Verification review error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
