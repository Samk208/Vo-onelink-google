import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { updateProductSchema, uuidSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse, type Product } from "@/lib/types"

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params
    const productId = resolvedParams.id

    const validation = uuidSchema.safeParse(productId)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        users!products_supplier_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', productId)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: product,
    } as ApiResponse<Product>)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (suppliers only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params
    const productId = resolvedParams.id

    const supabase = await createServerSupabaseClient()
    
    // Get current user and check permissions
    const user = await getCurrentUser(supabase)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const validation = uuidSchema.safeParse(productId)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      )
    }

    // Check if product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Check ownership (suppliers can only edit their own products)
    if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only edit your own products" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateValidation = updateProductSchema.safeParse(body)
    
    if (!updateValidation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid product data",
          fieldErrors: updateValidation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const updateData = updateValidation.data

    // Check for duplicate SKU if SKU is being updated
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const { data: duplicateProduct } = await supabase
        .from('products')
        .select('id')
        .eq('supplier_id', existingProduct.supplier_id)
        .eq('sku', updateData.sku)
        .neq('id', productId)
        .single()

      if (duplicateProduct) {
        return NextResponse.json(
          { 
            ok: false, 
            error: "Product with this SKU already exists",
            fieldErrors: { sku: ["SKU must be unique per supplier"] }
          },
          { status: 409 }
        )
      }
    }

    // Calculate final price if commission is updated
    const finalUpdateData: any = {
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    // Map validation schema fields to database fields
    if (updateData.stockCount !== undefined) {
      finalUpdateData.stock_count = updateData.stockCount
      finalUpdateData.in_stock = updateData.stockCount > 0
    }
    
    if (updateData.region !== undefined) {
      finalUpdateData.region = updateData.region
    }
    
    if (updateData.images !== undefined) {
      finalUpdateData.images = updateData.images
    }
    
    if (updateData.originalPrice !== undefined) {
      finalUpdateData.original_price = updateData.originalPrice
    }
    
    if (updateData.sku !== undefined) {
      finalUpdateData.sku = updateData.sku
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(finalUpdateData)
      .eq('id', productId)
      .select(`
        *,
        users!products_supplier_id_fkey (
          id,
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Product update error:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to update product" },
        { status: 500 }
      )
    }

    console.log(`📦 [AUDIT] User ${user.id} updated product ${productId}`)

    return NextResponse.json({
      ok: true,
      data: product,
      message: "Product updated successfully",
    } as ApiResponse<Product>)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (suppliers only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params
    const productId = resolvedParams.id

    const supabase = await createServerSupabaseClient()
    
    // Get current user and check permissions
    const user = await getCurrentUser(supabase)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const validation = uuidSchema.safeParse(productId)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      )
    }

    // Check if product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('supplier_id')
      .eq('id', productId)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Check ownership (suppliers can only delete their own products)
    if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only delete your own products" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('Product deletion error:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to delete product" },
        { status: 500 }
      )
    }

    console.log(`🗑️ [AUDIT] User ${user.id} deleted product ${productId}`)

    return NextResponse.json({
      ok: true,
      message: "Product deleted successfully",
    } as ApiResponse)
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
