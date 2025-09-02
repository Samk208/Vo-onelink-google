import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-helpers"
import { brandCompanySchema, brandCommissionDefaultsSchema } from "@/lib/validators"
import { type OnboardingApiResponse, type BrandCompany, type BrandCommissionDefaults } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { company, commission } = body
    
    // Validate company data
    const companyValidation = brandCompanySchema.safeParse(company)
    if (!companyValidation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid company data",
          fieldErrors: companyValidation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    // Validate commission data
    const commissionValidation = brandCommissionDefaultsSchema.safeParse(commission)
    if (!commissionValidation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid commission data",
          fieldErrors: commissionValidation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    // Start transaction
    const { data, error } = await supabase.rpc('upsert_brand_data', {
      p_user_id: user.id,
      p_company_data: {
        user_id: user.id,
        ...companyValidation.data,
        updated_at: new Date().toISOString(),
      },
      p_commission_data: {
        brand_user_id: user.id,
        ...commissionValidation.data,
        updated_at: new Date().toISOString(),
      }
    })

    if (error) {
      console.error('Brand data upsert error:', error)
      
      // If RPC doesn't exist, fall back to individual upserts
      if (error.code === '42883') {
        // Upsert company data
        const { data: companyData, error: companyError } = await supabase
          .from('brand_company')
          .upsert(
            {
              user_id: user.id,
              ...companyValidation.data,
              updated_at: new Date().toISOString(),
            },
            { 
              onConflict: 'user_id',
              ignoreDuplicates: false 
            }
          )
          .select()
          .single()

        if (companyError) {
          console.error('Company upsert error:', companyError)
          return NextResponse.json(
            { ok: false, error: "Failed to update company information" },
            { status: 500 }
          )
        }

        // Upsert commission defaults
        const { data: commissionData, error: commissionError } = await supabase
          .from('brand_commission_defaults')
          .upsert(
            {
              brand_user_id: user.id,
              ...commissionValidation.data,
              updated_at: new Date().toISOString(),
            },
            { 
              onConflict: 'brand_user_id',
              ignoreDuplicates: false 
            }
          )
          .select()
          .single()

        if (commissionError) {
          console.error('Commission upsert error:', commissionError)
          return NextResponse.json(
            { ok: false, error: "Failed to update commission defaults" },
            { status: 500 }
          )
        }

        return NextResponse.json({
          ok: true,
          data: {
            company: companyData,
            commission: commissionData
          },
          message: "Brand information updated successfully"
        } as OnboardingApiResponse<{ company: BrandCompany; commission: BrandCommissionDefaults }>)
      }
      
      return NextResponse.json(
        { ok: false, error: "Failed to update brand information" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data,
      message: "Brand information updated successfully"
    } as OnboardingApiResponse)
  } catch (error) {
    console.error('Brand update error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
