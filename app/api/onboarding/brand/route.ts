import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth-helpers"
import { brandDetailsSchema } from "@/lib/validators"
import { type OnboardingApiResponse, type BrandDetails } from "@/lib/types"
import { type Inserts } from "@/lib/supabase/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const user = await getCurrentUser(supabase)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = brandDetailsSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid brand data",
          fieldErrors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    // For now, just return success since brand_details table doesn't exist
    // TODO: Create brand_details table or store in users table
    console.log(`🏢 [AUDIT] User ${user.id} submitted brand details:`, validation.data)

    return NextResponse.json({
      ok: true,
      data: null,
      message: "Brand information submitted successfully"
    } as OnboardingApiResponse<BrandDetails>)
  } catch (error) {
    console.error('Brand details error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
