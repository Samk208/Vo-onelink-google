import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { updateProductSchema, uuidSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse, type Product } from "@/lib/types"

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validation = uuidSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID" },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { ok: false, message: "Product not found" },
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
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (suppliers only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || !hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const validation = uuidSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID" },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Check if product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { ok: false, message: "Product not found" },
        { status: 404 }
      )
    }

    // Check ownership (suppliers can only edit their own products)
    if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateValidation = updateProductSchema.safeParse(body)
    
    if (!updateValidation.success) {
      const errors: Record<string, string> = {}
      updateValidation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        { ok: false, message: "Invalid product data", errors },
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
        .neq('id', params.id)
        .single()

      if (duplicateProduct) {
        return NextResponse.json(
          { ok: false, message: "Product with this SKU already exists", errors: { sku: "SKU must be unique" } },
          { status: 409 }
        )
      }
    }

    // Update in_stock based on stockCount if provided
    const finalUpdateData = {
      ...updateData,
      ...(updateData.stockCount !== undefined && { in_stock: updateData.stockCount > 0 }),
      updated_at: new Date().toISOString(),
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(finalUpdateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Product update error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to update product" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: product,
      message: "Product updated successfully",
    } as ApiResponse<Product>)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (suppliers only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || !hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const validation = uuidSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID" },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Check if product exists and user has permission
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('supplier_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { ok: false, message: "Product not found" },
        { status: 404 }
      )
    }

    // Check ownership (suppliers can only delete their own products)
    if (user.role === UserRole.SUPPLIER && existingProduct.supplier_id !== user.id) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Product deletion error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to delete product" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "Product deleted successfully",
    } as ApiResponse)
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
