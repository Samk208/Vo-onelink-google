import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import { stripe } from "@/lib/stripe"
import type { ApiResponse } from "@/lib/types"

// POST /api/webhooks/stripe - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

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

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
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
      })
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return
    }

    console.log('Order created successfully:', order.id)

    // Update product stock counts and create commissions
    for (const item of items) {
      // Update stock count
      const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity
      })

      if (stockError) {
        console.error(`Failed to update stock for product ${item.productId}:`, stockError)
        // Continue processing other items even if one fails
      }

      // Create commission record
      const commissionAmount = (item.price * item.quantity * item.commission) / 100

      const { error: commissionError } = await supabaseAdmin
        .from('commissions')
        .insert({
          order_id: order.id,
          supplier_id: item.supplierId,
          product_id: item.productId,
          amount: commissionAmount,
          rate: item.commission,
          status: 'pending',
          created_at: new Date().toISOString(),
        })

      if (commissionError) {
        console.error(`Failed to create commission for product ${item.productId}:`, commissionError)
      }
    }

    // Update products in_stock status based on new stock counts
    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('stock_count')
        .eq('id', item.productId)
        .single()

      if (product && product.stock_count <= 0) {
        await supabaseAdmin
          .from('products')
          .update({ 
            in_stock: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.productId)
      }
    }

    console.log('Checkout session processing completed for order:', order.id)
  } catch (error) {
    console.error('Error processing checkout session:', error)
  }
}
