import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole } from "@/lib/types"
import { encryptSensitiveData } from '@/lib/encryption';
import { z } from "zod"

const influencerPayoutSchema = z.object({
  bank_name: z.string().min(1, 'Bank name is required'),
  account_holder_name: z.string().min(1, 'Account holder name is required'),
  account_number: z.string().min(1, 'Account number is required'),
  routing_number: z.string().optional(),
  swift_code: z.string().optional(),
  tax_id: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
  })
})

export async function POST(request: NextRequest) {
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

    // Check if user is an influencer
    if (!hasRole(user, [UserRole.INFLUENCER])) {
      return NextResponse.json(
        { ok: false, error: "Influencer access required" },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = influencerPayoutSchema.parse(body)

    // Encrypt sensitive financial data
    const encryptedAccountNumber = encryptSensitiveData(validatedData.account_number)
    const encryptedRoutingNumber = validatedData.routing_number ? encryptSensitiveData(validatedData.routing_number) : null
    const encryptedSwiftCode = validatedData.swift_code ? encryptSensitiveData(validatedData.swift_code) : null
    const encryptedTaxId = validatedData.tax_id ? encryptSensitiveData(validatedData.tax_id) : null

    // Upsert influencer payout details with encrypted sensitive fields
    const { error } = await supabase
      .from('influencer_payouts')
      .upsert({
        user_id: user.id,
        bank_name: validatedData.bank_name,
        account_holder_name: validatedData.account_holder_name,
        account_number_encrypted: encryptedAccountNumber,
        routing_number_encrypted: encryptedRoutingNumber,
        swift_code_encrypted: encryptedSwiftCode,
        tax_id_encrypted: encryptedTaxId,
        address: validatedData.address,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Failed to save influencer payout details:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to save payout details" },
        { status: 500 }
      )
    }

    // Log the action for audit trail
    console.log(`💳 [AUDIT] User ${user.id} updated encrypted payout details`)

    return NextResponse.json({
      ok: true,
      message: 'Influencer payout details saved successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid input data", details: error.issues },
        { status: 400 }
      )
    }

    console.error('Influencer payout error:', error)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
