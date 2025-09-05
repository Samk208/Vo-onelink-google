import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type ApiResponse } from "@/lib/types"

export interface PublicShopData {
  influencer: {
    handle: string
    name: string
    bio?: string
    avatar?: string
    banner?: string
    followers?: string
    verified: boolean
    socialLinks?: {
      instagram?: string
      twitter?: string
      youtube?: string
    }
  }
  products: Array<{
    id: string
    title: string
    customTitle?: string
    customDescription?: string
    price: number
    originalPrice?: number
    image: string
    category: string
    region: string[]
    inStock: boolean
    stockCount: number
    rating?: number
    reviews?: number
    badges: string[]
  }>
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get influencer by handle
    const { data: influencer, error: influencerError } = await supabase
      .from('profiles')
      .select(`
        id,
        handle,
        first_name,
        last_name,
        bio,
        avatar_url,
        banner_url,
        verified,
        social_links
      `)
      .eq('handle', handle)
      .eq('role', 'influencer')
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json(
        { ok: false, error: "Influencer shop not found" },
        { status: 404 }
      )
    }

    // Get influencer's published shop products
    const { data: shopProducts, error: shopError } = await supabase
      .from('influencer_shop_products')
      .select(`
        id,
        custom_title,
        custom_description,
        sale_price,
        display_order,
        products (
          id,
          title,
          description,
          price,
          images,
          category,
          region,
          stock_count,
          in_stock
        )
      `)
      .eq('influencer_id', influencer.id)
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (shopError) {
      console.error('Shop products fetch error:', shopError)
      return NextResponse.json(
        { ok: false, error: "Failed to fetch shop products" },
        { status: 500 }
      )
    }

    // Format influencer data
    const formattedInfluencer = {
      handle: influencer.handle,
      name: `${influencer.first_name || ''} ${influencer.last_name || ''}`.trim() || 'Unknown Creator',
      bio: influencer.bio,
      avatar: influencer.avatar_url,
      banner: influencer.banner_url,
      followers: '0', // TODO: Calculate from followers table
      verified: influencer.verified || false,
      socialLinks: influencer.social_links || {}
    }

    // Format products (hide out-of-stock, show low-stock badges)
    const formattedProducts = shopProducts
      ?.filter((item: any) => item.products.in_stock && item.products.stock_count > 0)
      .map((item: any) => {
        const product = item.products
        const badges = []
        
        // Add stock-based badges
        if (product.stock_count <= 5) {
          badges.push('Low Stock')
        }
        if (item.sale_price < product.price) {
          badges.push('Sale')
        }
        
        return {
          id: item.id,
          title: product.title,
          customTitle: item.custom_title,
          customDescription: item.custom_description,
          price: item.sale_price,
          originalPrice: item.sale_price < product.price ? product.price : undefined,
          image: product.images?.[0] || '/placeholder-product.png',
          category: product.category,
          region: product.region,
          inStock: product.in_stock,
          stockCount: product.stock_count,
          rating: 4.5, // TODO: Calculate from reviews
          reviews: 0, // TODO: Calculate from reviews
          badges
        }
      }) || []

    return NextResponse.json({
      ok: true,
      data: {
        influencer: formattedInfluencer,
        products: formattedProducts
      }
    } as ApiResponse<PublicShopData>)
  } catch (error) {
    console.error('Public shop error:', error)
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
