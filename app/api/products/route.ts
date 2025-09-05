import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

    // Use admin client if needed, otherwise use regular server client
    const supabase = adminAccess ? supabaseAdmin : createServerSupabaseClient(request)

    // Build query
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

    // Apply filters
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

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      products: data || [],
      totalCount: count || 0,
      hasMore: data?.length === limit && (offset + limit) < (count || 0)
    })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
