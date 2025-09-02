import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { productQuerySchema, createProductSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse, type PaginatedResponse, type Product } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryData = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      supplierId: searchParams.get('supplierId') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const validation = productQuerySchema.safeParse(queryData)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid query parameters" },
        { status: 400 }
      )
    }

    const { page, limit, category, status, supplierId, search } = validation.data
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        users!products_supplier_id_fkey (
          id,
          name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (supplierId) {
      query = query.eq('supplier_id', supplierId)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Products fetch error:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to fetch products" },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      ok: true,
      data: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    } as PaginatedResponse<Product>)
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    
    // Validate input
    const validation = createProductSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid product data",
          fieldErrors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const productData = {
      ...validation.data,
      supplier_id: user.id,
      status: 'pending', // New products start as pending
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
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
      console.error('Product creation error:', error)
      return NextResponse.json(
        { ok: false, error: "Failed to create product" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: product,
      message: "Product created successfully"
    } as ApiResponse<Product>)
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
