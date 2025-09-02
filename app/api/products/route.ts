import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { productQuerySchema, createProductSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse, type PaginatedResponse, type Product } from "@/lib/types"

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validation = productQuerySchema.safeParse(Object.fromEntries(searchParams))
    
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid query parameters" },
        { status: 400 }
      )
    }

    const { page = 1, limit = 20, search, category, region, active, inStock } = validation.data
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (region) {
      query = query.contains('region', [region])
    }
    if (active !== undefined) {
      query = query.eq('active', active)
    }
    if (inStock !== undefined) {
      query = query.eq('in_stock', inStock)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data: products, error, count } = await query

    if (error) {
      console.error('Products fetch error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to fetch products" },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      ok: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    } as PaginatedResponse<Product>)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (suppliers only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || !hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = createProductSchema.safeParse(body)
    
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        { ok: false, message: "Invalid product data", errors },
        { status: 400 }
      )
    }

    const productData = validation.data
    const supabase = await createServerSupabaseClient()

    // Check for duplicate SKU if provided
    if (productData.sku) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('supplier_id', user.id)
        .eq('sku', productData.sku)
        .single()

      if (existingProduct) {
        return NextResponse.json(
          { ok: false, message: "Product with this SKU already exists", errors: { sku: "SKU must be unique" } },
          { status: 409 }
        )
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        supplier_id: user.id,
        in_stock: productData.stockCount > 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Product creation error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to create product" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: product,
      message: "Product created successfully",
    } as ApiResponse<Product>)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
