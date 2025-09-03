import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse } from "@/lib/types"
import { z } from "zod"

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

// Validation schema for import request
const importRequestSchema = z.object({
  dryRun: z.boolean().default(false),
  data: z.array(z.string()).min(1)
})

// Product validation schema  
const productImportSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  images: z.array(z.string()),
  price: z.number().min(0),
  regions: z.array(z.string()),
  stock: z.number().min(0)
})

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
    const validation = importRequestSchema.safeParse(body)
    
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

    const { data, dryRun = false } = validation.data
    const supabase = await createServerSupabaseClient()

    // Parse CSV data (expecting header row)
    const records = data.map((row) => row.split(','))

    if (records.length < 1) {
      return NextResponse.json(
        { ok: false, message: "CSV must contain at least one data row" },
        { status: 400 }
      )
    }

    const headers = records[0]
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

    // Helper function to validate image URLs
    const validateImageUrl = (url: string) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }

    // Process each data row
    for (let i = 1; i < records.length; i++) {
      const rowData = records[i]
      const rowNumber = i

      try {
        // Map CSV data to product object
        const productData: any = {
          supplier_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const rowErrors: any = {}

        // Process each field in the row
        for (let j = 0; j < rowData.length; j++) {
          const value = rowData[j]
          const key = headers[j].toLowerCase()
          const stringValue = String(value || '').trim()
          
          switch (key) {
            case 'title':
            case 'name':
              productData.title = stringValue
              break
            case 'description':
              productData.description = stringValue
              break
            case 'image_urls':
              productData.images = stringValue ? stringValue.split('|').filter((url: string) => url.trim() && validateImageUrl(url)) : []
              break
            case 'base_price':
              productData.price = parseFloat(stringValue)
              break
            case 'category':
              productData.category = stringValue
              break
            case 'stock_quantity':
              productData.stock = parseInt(stringValue)
              break
            case 'regions':
              productData.regions = stringValue ? stringValue.split(',').map((r: string) => r.trim()) : []
              break
          }
        }

        // Validate required fields
        const validation = productImportSchema.safeParse(productData)
        if (!validation.success) {
          result.failed++
          validation.error.errors.forEach(err => {
            rowErrors[err.path[0]] = err.message
          })
          result.errors.push({
            row: rowNumber,
            errors: rowErrors,
            data: productData
          })
          continue
        }

        // If not dry run, insert the product
        if (!dryRun) {
          const { data: insertedProduct, error: insertError } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single()

          if (insertError) {
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
          errors: { parsing: "Failed to parse row data" },
          data: {}
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
