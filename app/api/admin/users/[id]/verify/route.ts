import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { verifyUserSchema, uuidSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse } from "@/lib/types"

interface VerifyUserResult {
  userId: string
  verified: boolean
  notes?: string
  updatedAt: string
}

// PUT /api/admin/users/[id]/verify - Verify or unverify a user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentUser(supabase)
    if (!user || !hasRole(user, [UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const { id } = await params
    const validation = uuidSchema.safeParse(id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid user ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const verifyValidation = verifyUserSchema.safeParse(body)
    
    if (!verifyValidation.success) {
      const errors: Record<string, string> = {}
      verifyValidation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        { ok: false, message: "Invalid verification data", errors },
        { status: 400 }
      )
    }

    const { verified, notes } = verifyValidation.data

    // Check if user exists
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', id)
      .single()

    if (fetchError || !targetUser) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      )
    }

    // Update user verification status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        verified,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, verified, updated_at')
      .single()

    if (updateError) {
      console.error('User verification error:', updateError)
      return NextResponse.json(
        { ok: false, message: "Failed to update user verification" },
        { status: 500 }
      )
    }

    // Log the verification action (optional - could be added to an audit table)
    console.log(`Admin ${user.email} ${verified ? 'verified' : 'unverified'} user ${targetUser.email}${notes ? ` with notes: ${notes}` : ''}`)

    const result: VerifyUserResult = {
      userId: updatedUser.id,
      verified: updatedUser.verified,
      notes,
      updatedAt: updatedUser.updated_at,
    }

    return NextResponse.json({
      ok: true,
      data: result,
      message: `User ${verified ? 'verified' : 'unverified'} successfully`,
    } as ApiResponse<VerifyUserResult>)
  } catch (error) {
    console.error('User verification error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
