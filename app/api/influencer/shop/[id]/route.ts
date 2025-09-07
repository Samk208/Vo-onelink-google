import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ensureTypedClient } from "@/lib/supabase/types"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse } from "@/lib/types"
import { z } from "zod"
import { QueryData } from '@supabase/supabase-js'

const updateShopProductSchema = z.object({
  customTitle: z.string().optional(),
  customDescription: z.string().optional(),
  salePrice: z.number().min(0).optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().min(0).optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = ensureTypedClient(await createServerSupabaseClient())
    
    const user = await getCurrentUser(supabase)
    if (!user || !hasRole(user, [UserRole.INFLUENCER])) {
      return NextResponse.json(
        { ok: false, error: "Influencer access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updateShopProductSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid data",
          fieldErrors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    // Check if shop product exists and belongs to user
    const query = supabase
      .from('influencer_shop_products')
      .select('id, influencer_id')
      .eq('id', id)
      .maybeSingle()
    
    type ShopProductRow = QueryData<typeof query>
    const { data: existing, error: fetchError } = await query

    if (fetchError || !existing) {
      return NextResponse.json(
        { ok: false, error: "Shop product not found" },
        { status: 404 }
      )
    }

    if (existing.influencer_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only edit your own shop products" },
        { status: 403 }
      )
    }

    // Update shop product
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString()
    }

    const updateQuery = supabase
      .from('influencer_shop_products')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle()
    
    type UpdatedShopProductRow = QueryData<typeof updateQuery>
    const { data: updated, error: updateError } = await updateQuery

    if (updateError || !updated) {
      console.error('Shop product update error:', updateError)
      return NextResponse.json(
        { ok: false, error: "Failed to update shop product" },
        { status: 500 }
      )
    }

    console.log(`🛍️ [AUDIT] Influencer ${user.id} updated shop product ${id}`)

    return NextResponse.json({
      ok: true,
      data: updated,
      message: "Shop product updated successfully"
    })
  } catch (error) {
    console.error('Update shop product error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = ensureTypedClient(await createServerSupabaseClient())
    
    const user = await getCurrentUser(supabase)
    if (!user || !hasRole(user, [UserRole.INFLUENCER])) {
      return NextResponse.json(
        { ok: false, error: "Influencer access required" },
        { status: 403 }
      )
    }

    // Check if shop product exists and belongs to user
    const deleteQuery = supabase
      .from('influencer_shop_products')
      .select('id, influencer_id')
      .eq('id', id)
      .maybeSingle()
    
    type DeleteShopProductRow = QueryData<typeof deleteQuery>
    const { data: existing, error: fetchError } = await deleteQuery

    if (fetchError || !existing) {
      return NextResponse.json(
        { ok: false, error: "Shop product not found" },
        { status: 404 }
      )
    }

    if (existing.influencer_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only delete your own shop products" },
        { status: 403 }
      )
    }

    // Delete shop product
    const { error: deleteError } = await supabase
      .from('influencer_shop_products')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Shop product delete error:', deleteError)
      return NextResponse.json(
        { ok: false, error: "Failed to delete shop product" },
        { status: 500 }
      )
    }

    console.log(`🛍️ [AUDIT] Influencer ${user.id} removed product from shop ${id}`)

    return NextResponse.json({
      ok: true,
      message: "Product removed from shop successfully"
    })
  } catch (error) {
    console.error('Delete shop product error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
