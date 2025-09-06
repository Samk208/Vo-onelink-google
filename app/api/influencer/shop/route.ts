import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole } from "@/lib/types"
import { type Inserts } from "@/lib/supabase/server"
import { z } from "zod"

const addProductSchema = z.object({
  productId: z.string().uuid(),
  customTitle: z.string().optional(),
  customDescription: z.string().optional(),
  salePrice: z.number().min(0).optional()
})

export interface InfluencerShopData {
  shopProducts: Array<{
    id: string
    productId: string
    title: string
    customTitle?: string
    customDescription?: string
    basePrice: number
    salePrice: number
    commission: number
    expectedCommission: number
    image: string
    category: string
    region: string[]
    supplier: string
    inStock: boolean
    stockCount: number
    published: boolean
    order: number
  }>
  availableProducts: Array<{
    id: string
    title: string
    basePrice: number
    commission: number
    image: string
    category: string
    region: string[]
    supplier: string
    inStock: boolean
    stockCount: number
  }>
}

export async function GET(request: NextRequest) {
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

    if (!hasRole(user, [UserRole.INFLUENCER])) {
      return NextResponse.json(
        { ok: false, error: "Influencer access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const supplier = searchParams.get('supplier')
    const search = searchParams.get('search')

    // Get influencer's shop products
    const { data: shopProducts, error: shopError } = await supabase
      .from('influencer_shop_products')
      .select(`
        id,
        product_id,
        custom_title,
        custom_description,
        sale_price,
        published,
        display_order,
        products (
          id,
          title,
          price,
          commission,
          images,
          category,
          region,
          stock_count,
          in_stock,
          profiles!products_supplier_id_fkey (
            name
          )
        )
      `)
      .eq('influencer_id', user.id)
      .order('display_order', { ascending: true })

    if (shopError) {
      console.error('Shop products fetch error:', shopError)
      return NextResponse.json(
        { ok: false, error: "Failed to fetch shop products" },
        { status: 500 }
      )
    }

    // Get available products for adding to shop
    let availableQuery = supabase
      .from('products')
      .select(`
        id,
        title,
        price,
        commission,
        images,
        category,
        region,
        stock_count,
        in_stock,
        profiles!products_supplier_id_fkey (
          name
        )
      `)
      .eq('active', true)
      .eq('in_stock', true)

    // Apply filters
    if (category && category !== 'all') {
      availableQuery = availableQuery.eq('category', category)
    }
    if (region && region !== 'all') {
      availableQuery = availableQuery.contains('region', [region])
    }
    if (search) {
      availableQuery = availableQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: availableProducts, error: availableError } = await availableQuery
      .limit(50)

    if (availableError) {
      console.error('Available products fetch error:', availableError)
      return NextResponse.json(
        { ok: false, error: "Failed to fetch available products" },
        { status: 500 }
      )
    }

    // Format shop products
    const formattedShopProducts = shopProducts?.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      title: item.products.title,
      customTitle: item.custom_title,
      customDescription: item.custom_description,
      basePrice: item.products.price,
      salePrice: item.sale_price,
      commission: item.products.commission,
      expectedCommission: (item.sale_price * item.products.commission) / 100,
      image: item.products.images?.[0] || '/placeholder-product.png',
      category: item.products.category,
      region: item.products.region,
      supplier: item.products.profiles?.name || 'Unknown Supplier',
      inStock: item.products.in_stock,
      stockCount: item.products.stock_count,
      published: item.published,
      order: item.display_order
    })) || []

    // Format available products (exclude already added ones)
    const addedProductIds = new Set(formattedShopProducts.map(p => p.productId))
    const formattedAvailableProducts = availableProducts
      ?.filter((product: any) => !addedProductIds.has(product.id))
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        basePrice: product.price,
        commission: product.commission,
        image: product.images?.[0] || '/placeholder-product.png',
        category: product.category,
        region: product.region,
        supplier: product.profiles?.name || 'Unknown Supplier',
        inStock: product.in_stock,
        stockCount: product.stock_count
      })) || []

    return NextResponse.json({
      ok: true,
      data: {
        shopProducts: formattedShopProducts,
        availableProducts: formattedAvailableProducts
      }
    })
  } catch (error) {
    console.error('Influencer shop error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const user = await getCurrentUser(supabase)
    if (!user || !hasRole(user, [UserRole.INFLUENCER])) {
      return NextResponse.json(
        { ok: false, error: "Influencer access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, customTitle, customDescription, salePrice } = addProductSchema.parse(body)

    // Validate product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, title, price, commission')
      .eq('id', productId)
      .eq('active', true)
      .maybeSingle()

    if (productError || !product) {
      return NextResponse.json(
        { ok: false, error: "Product not found or inactive" },
        { status: 404 }
      )
    }

    // Check if already in shop
    const { data: existing } = await supabase
      .from('influencer_shop_products')
      .select('id')
      .eq('influencer_id', user.id)
      .eq('product_id', productId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Product already in your shop" },
        { status: 409 }
      )
    }

    // Get next display order
    // Note: display_order field doesn't exist in current schema
    // const { data: lastOrder } = await supabase
    //   .from('influencer_shop_products')
    //   .select('display_order')
    //   .eq('influencer_id', user.id)
    //   .order('display_order', { ascending: false })
    //   .limit(1)
    //   .maybeSingle()

    // Note: display_order field doesn't exist in current schema

    // Add to shop
    type ShopProductInsert = Inserts<'influencer_shop_products'>
    const insertData: ShopProductInsert = {
      influencer_id: user.id,
      product_id: productId,
      custom_title: customTitle,
      sale_price: salePrice || product.price,
      published: true
    }
    
    const { data: shopProduct, error: insertError } = await supabase
      .from('influencer_shop_products')
      .insert(insertData)
      .select()
      .maybeSingle()

    if (insertError) {
      console.error('Shop product insert error:', insertError)
      return NextResponse.json(
        { ok: false, error: "Failed to add product to shop" },
        { status: 500 }
      )
    }

    console.log(`🛍️ [AUDIT] Influencer ${user.id} added product ${productId} to shop`)

    return NextResponse.json({
      ok: true,
      data: shopProduct,
      message: "Product added to your shop successfully"
    })
  } catch (error) {
    console.error('Add to shop error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
