// app/api/shop/[handle]/route.ts
// FIXED VERSION - Read from profiles instead of users

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  const supabase = createClient()
  const { handle } = params

  try {
    // Get shop information
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('handle', handle)
      .single()

    if (shopError || !shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // FIXED: Get influencer profile from profiles table (not users)
    const { data: influencer, error: influencerError } = await supabase
      .from('profiles')  // Changed from 'users' to 'profiles'
      .select('id, name, avatar, verified')  // These fields exist in profiles
      .eq('id', shop.influencer_id)
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      )
    }

    // Get shop products (only published ones)
    const { data: shopProducts, error: productsError } = await supabase
      .from('influencer_shop_products')
      .select(`
        *,
        products (
          id,
          title,
          description,
          price,
          original_price,
          images,
          category,
          region,
          in_stock,
          stock_count,
          commission,
          active,
          sku,
          created_at,
          updated_at
        )
      `)
      .eq('influencer_id', shop.influencer_id)
      .eq('published', true)  // Only get published products

    if (productsError) {
      console.error('Error fetching shop products:', productsError)
      return NextResponse.json(
        { error: 'Error fetching shop products' },
        { status: 500 }
      )
    }

    // Filter out products that are not active or out of stock
    const activeProducts = shopProducts?.filter(item => 
      item.products && 
      item.products.active && 
      item.products.in_stock && 
      item.products.stock_count > 0
    ) || []

    return NextResponse.json({
      shop,
      influencer,
      products: activeProducts.map(item => item.products)
    })

  } catch (error) {
    console.error('Shop API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}