import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { updateOrderStatusSchema, uuidSchema } from "@/lib/validators"
import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { UserRole, type ApiResponse, type Order } from "@/lib/types"

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const validation = uuidSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid order ID" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    let query = supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)

    // Role-based filtering
    if (user.role === UserRole.CUSTOMER) {
      query = query.eq('customer_id', user.id)
    } else if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const { data: order, error } = await query.single()

    if (error || !order) {
      return NextResponse.json(
        { ok: false, message: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: order,
    } as ApiResponse<Order>)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (admins only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || !hasRole(user, [UserRole.ADMIN])) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      )
    }

    const validation = uuidSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid order ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updateValidation = updateOrderStatusSchema.safeParse(body)
    
    if (!updateValidation.success) {
      const errors: Record<string, string> = {}
      updateValidation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        { ok: false, message: "Invalid order data", errors },
        { status: 400 }
      )
    }

    const { status, notes } = updateValidation.data
    const supabase = await createServerSupabaseClient()

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Order update error:', error)
      return NextResponse.json(
        { ok: false, message: "Failed to update order" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: order,
      message: "Order updated successfully",
    } as ApiResponse<Order>)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
