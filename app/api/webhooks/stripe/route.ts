import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, type Inserts, type Tables } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"
import type { ApiResponse } from "@/lib/types"

// Force Node.js runtime to avoid Edge runtime issues with Supabase
export const runtime = 'nodejs'

// POST /api/webhooks/stripe - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { ok: false, message: "Missing signature" },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json(
        { ok: false, message: "Webhook configuration error" },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: any
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message)
      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break
      
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Webhook processed successfully" 
    } as ApiResponse)
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { ok: false, message: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('Processing checkout session:', session.id)

    // Extract order data from session metadata
    const { userId, orderData } = session.metadata
    if (!userId || !orderData) {
      console.error('Missing required metadata in session:', session.id)
      return
    }

    const parsedOrderData = JSON.parse(orderData)
    const { items, total, shippingAddress, billingAddress } = parsedOrderData

    // Create order insert data with proper typing
    const orderInsert: Inserts<'orders'> = {
      customer_id: userId,
      items: items,
      total: total,
      status: 'confirmed',
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      payment_method: 'stripe',
      stripe_payment_intent_id: session.payment_intent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderInsert)
      .select()
      .maybeSingle()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return
    }

    if (!order) {
      console.error('No order data returned after creation')
      return
    }

    console.log('Order created successfully:', order.id)

    // Extract influencer metadata if present
    const metadataInfluencerId: string | undefined = (session as any).metadata?.influencer_id || undefined
    const metadataCustomPrices: Record<string, number> | undefined = (() => {
      try {
        const raw = (session as any).metadata?.custom_prices
        return raw ? JSON.parse(raw) : undefined
      } catch {
        return undefined
      }
    })()

    // Process each item for stock updates and commission logging
    for (const item of items) {
      // Update stock count directly on products table
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('stock_count')
        .eq('id', item.productId)
        .maybeSingle()

      if (product) {
        const currentStock = product.stock_count ?? 0
        const newStock = Math.max(0, currentStock - (item.quantity ?? 0))
        const { error: stockUpdateError } = await supabaseAdmin
          .from('products')
          .update({ 
            stock_count: newStock,
            in_stock: newStock > 0,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', item.productId)

        if (stockUpdateError) {
          console.error(`Failed to update stock for product ${item.productId}:`, stockUpdateError)
        }
      }

      // Determine influencer attribution and effective sale price from metadata
      const influencerId: string | null = metadataInfluencerId ?? null
      const effectiveSalePrice = metadataCustomPrices?.[item.productId] ?? item.price

      // Calculate commissions
      const itemRevenue = effectiveSalePrice * item.quantity
      const supplierCommissionAmount = (itemRevenue * item.commission) / 100
      const supplierNetRevenue = itemRevenue - supplierCommissionAmount

      // Create supplier commission record with proper typing
      const supplierCommission: Inserts<'commissions'> = {
        order_id: order.id,
        influencer_id: influencerId ?? order.customer_id,
        supplier_id: item.supplierId,
        product_id: item.productId,
        amount: supplierCommissionAmount,
        rate: item.commission,
        status: 'pending',
        created_at: new Date().toISOString(),
      }

      const { error: supplierCommissionError } = await supabaseAdmin
        .from('commissions')
        .insert(supplierCommission as any)

      if (supplierCommissionError) {
        console.error(`Failed to create supplier commission for product ${item.productId}:`, supplierCommissionError)
      } else {
        console.log(`💰 Supplier commission logged: $${supplierCommissionAmount} (${item.commission}%) for product ${item.productId}`)
      }

      // Create influencer commission record if purchased through influencer shop
      if (influencerId) {
        // Influencer gets the difference between sale price and base price
        const influencerCommissionAmount = (effectiveSalePrice - item.price) * item.quantity
        
        if (influencerCommissionAmount > 0) {
          const influencerCommission: Inserts<'commissions'> = {
            order_id: order.id,
            influencer_id: influencerId,
            supplier_id: item.supplierId,
            product_id: item.productId,
            amount: influencerCommissionAmount,
            rate: ((effectiveSalePrice - item.price) / item.price) * 100, // Calculate effective rate
            status: 'pending',
            created_at: new Date().toISOString(),
          }

          const { error: influencerCommissionError } = await supabaseAdmin
            .from('commissions')
            .insert(influencerCommission as any)

          if (influencerCommissionError) {
            console.error(`Failed to create influencer commission for product ${item.productId}:`, influencerCommissionError)
          } else {
            console.log(`🌟 Influencer commission logged: $${influencerCommissionAmount} for influencer ${influencerId}`)
          }
        }
      }

      console.log(`📊 Commission breakdown for product ${item.productId}:
        - Item Revenue: $${itemRevenue}
        - Supplier Net: $${supplierNetRevenue}
        - Supplier Commission: $${supplierCommissionAmount} (${item.commission}%) for product ${item.productId}
        ${influencerId ? `- Influencer Commission: $${(effectiveSalePrice - item.price) * item.quantity}` : '- No influencer involved'}`)
    }

    console.log('Checkout session processing completed for order:', order.id)
  } catch (error) {
    console.error('Error processing checkout session:', error)
  }
}
