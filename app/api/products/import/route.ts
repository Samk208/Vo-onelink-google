import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { csvImportSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse } from "@/lib/types"

interface ImportResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    errors: Record<string, string>
    data?: any
  }>
  dryRun: boolean
}

// POST /api/products/import - Import products from CSV (suppliers/admins only)
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
    const validation = csvImportSchema.safeParse(body)
    
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        { ok: false, message: "Invalid import data", errors },
        { status: 400 }
      )
    }

    const { csvData, dryRun = false } = validation.data
    const supabase = createServerSupabaseClient()

    // Parse CSV data (expecting header row)
    const lines = csvData.trim().split('\n')
    if (lines.length < 2) {
      return NextResponse.json(
        { ok: false, message: "CSV must contain at least a header row and one data row" },
        { status: 400 }
      )
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const expectedHeaders = ['sku', 'title', 'description', 'image_urls', 'base_price', 'commission_pct', 'regions', 'inventory', 'active']
    
    // Validate headers
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h))
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { ok: false, message: `Missing required headers: ${missingHeaders.join(', ')}` },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      dryRun
    }

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const rowData = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''))
      const rowNumber = i + 1

      try {
        // Map CSV data to product object
        const productData: any = {}
        headers.forEach((header, index) => {
          const value = rowData[index] || ''
          
          switch (header) {
            case 'sku':
              productData.sku = value || undefined
              break
            case 'title':
              productData.title = value
              break
            case 'description':
              productData.description = value
              break
            case 'image_urls':
              productData.images = value ? value.split('|').filter(url => url.trim()) : []
              break
            case 'base_price':
              productData.price = parseFloat(value)
              break
            case 'commission_pct':
              productData.commission = parseFloat(value)
              break
            case 'regions':
              productData.region = value ? value.split('|').filter(r => r.trim()) : []
              break
            case 'inventory':
              productData.stockCount = parseInt(value)
              break
            case 'active':
              productData.active = value.toLowerCase() === 'true'
              break
          }
        })

        // Validate product data
        const rowErrors: Record<string, string> = {}

        if (!productData.title) rowErrors.title = "Title is required"
        if (!productData.description) rowErrors.description = "Description is required"
        if (!productData.images || productData.images.length === 0) rowErrors.images = "At least one image URL is required"
        if (isNaN(productData.price) || productData.price < 0) rowErrors.price = "Valid price is required"
        if (isNaN(productData.commission) || productData.commission < 0 || productData.commission > 95) rowErrors.commission = "Commission must be between 0-95%"
        if (!productData.region || productData.region.length === 0) rowErrors.region = "At least one region is required"
        if (isNaN(productData.stockCount) || productData.stockCount < 0) rowErrors.stockCount = "Valid stock count is required"

        // Check for duplicate SKU if provided
        if (productData.sku) {
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('supplier_id', user.id)
            .eq('sku', productData.sku)
            .single()

          if (existingProduct) {
            rowErrors.sku = "SKU already exists"
          }
        }

        if (Object.keys(rowErrors).length > 0) {
          result.failed++
          result.errors.push({
            row: rowNumber,
            errors: rowErrors,
            data: productData
          })
          continue
        }

        // If not dry run, insert the product
        if (!dryRun) {
          const { error } = await supabase
            .from('products')
            .insert({
              ...productData,
              supplier_id: user.id,
              in_stock: productData.stockCount > 0,
              category: productData.category || 'General', // Default category
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

          if (error) {
            result.failed++
            result.errors.push({
              row: rowNumber,
              errors: { database: "Failed to insert product" },
              data: productData
            })
            continue
          }
        }

        result.success++
      } catch (error) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          errors: { parsing: "Failed to parse row data" }
        })
      }
    }

    return NextResponse.json({
      ok: true,
      data: result,
      message: dryRun 
        ? `Dry run completed: ${result.success} valid, ${result.failed} invalid rows`
        : `Import completed: ${result.success} products imported, ${result.failed} failed`
    } as ApiResponse<ImportResult>)
  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong during import" },
      { status: 500 }
    )
  }
}
