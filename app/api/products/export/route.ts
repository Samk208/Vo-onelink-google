import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse } from "@/lib/types"
import { stringify } from "csv-stringify/sync"
import { z } from "zod"

// Simple validation schema for export parameters
const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  active: z.boolean().optional(),
  inStock: z.boolean().optional(),
})

// GET /api/products/export - Export products to CSV (suppliers/admins only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || !hasRole(user, [UserRole.SUPPLIER, UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const validation = productQuerySchema.safeParse(Object.fromEntries(searchParams))
    
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid query parameters" },
        { status: 400 }
      )
    }

    const { search, category, region, active, inStock } = validation.data
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('products')
      .select('*')

    // Role-based filtering - suppliers can only export their own products
    if (user.role === UserRole.SUPPLIER) {
      query = query.eq('supplier_id', user.id)
    }

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

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data: products, error } = await query

    if (error) {
      console.error('Products export error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to fetch products for export" },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { ok: false, message: "No products found to export" },
        { status: 404 }
      )
    }

    // Generate CSV content
    const headers = [
      'sku',
      'title', 
      'description',
      'image_urls',
      'base_price',
      'commission_pct',
      'regions',
      'inventory',
      'active',
      'category',
      'created_at'
    ]

    // Helper function to escape CSV values
    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return ''
      
      const stringValue = String(value)
      // If the value contains comma, newline, or quotes, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Create CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...products.map(product => [
        escapeCsvValue(product.sku || ''),
        escapeCsvValue(product.title),
        escapeCsvValue(product.description),
        escapeCsvValue(product.images ? product.images.join('|') : ''),
        escapeCsvValue(product.price),
        escapeCsvValue(product.commission),
        escapeCsvValue(product.region ? product.region.join('|') : ''),
        escapeCsvValue(product.stock_count),
        escapeCsvValue(product.active),
        escapeCsvValue(product.category),
        escapeCsvValue(product.created_at)
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `products-export-${timestamp}.csv`

    // Return CSV as downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong during export" },
      { status: 500 }
    )
  }
}
