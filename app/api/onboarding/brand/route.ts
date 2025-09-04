import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth-helpers"
import { brandDetailsSchema } from "@/lib/validators"
import { type OnboardingApiResponse, type BrandDetails } from "@/lib/types"

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

    // Upsert brand details
    const brandData = {
      user_id: user.id,
      company_name: validation.data.companyName,
      business_type: validation.data.industry, // Map industry to business_type
      website: validation.data.companyWebsite,
      description: validation.data.description,
      industry: validation.data.industry,
      company_size: validation.data.companySize,
      business_registration_number: validation.data.businessRegistrationNumber,
      tax_id: validation.data.taxId,
      updated_at: new Date().toISOString(),
    }

    const { data: brand, error } = await supabase
      .from('brand_details')
      .upsert(
        brandData,
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Brand details upsert error:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to update brand information" },
        { status: 500 }
      )
    }

    console.log(`🏢 [AUDIT] User ${user.id} updated brand details`)

    return NextResponse.json({
      ok: true,
      data: brand,
      message: "Brand information updated successfully"
    } as OnboardingApiResponse<BrandDetails>)
  } catch (error) {
    console.error('Brand details error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
