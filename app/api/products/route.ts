import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getCurrentUser, hasRole } from '@/lib/auth-helpers'
import { UserRole, type ApiResponse } from '@/lib/types'
import { QueryData } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const supplierId = searchParams.get('supplierId')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const adminAccess = searchParams.get('admin') === 'true'

    const offset = (page - 1) * limit

    // Create base query with proper client selection
    const supabase = adminAccess ? supabaseAdmin : await createServerSupabaseClient(request)
    
    // Build query with all base filters
    let query = supabase
      .from('products')
      .select(`
        *,
        users!products_supplier_id_fkey (
          id,
          name,
          email,
          verified
        )
      `, { count: 'exact' })
      .eq('active', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    // Apply optional filters
    if (category) {
      query = query.eq('category', category)
    }
    if (supplierId) {
      query = query.eq('supplier_id', supplierId)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query and get results
    const { data, error, count } = await query

    // Handle errors with early return
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    // Infer product type from query
    type ProductWithSupplier = QueryData<typeof query>[number]

    // Return successful response
    return NextResponse.json({
      products: data || [],
      totalCount: count || 0,
      hasMore: data?.length === limit && (offset + limit) < (count || 0),
      page,
      limit
    })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
