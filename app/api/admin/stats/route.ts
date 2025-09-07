import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient(request)
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Verify admin role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (!userData || userData.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get platform statistics
    const [
      { count: totalUsers },
      { count: totalProducts },
      { count: totalOrders },
      { count: totalShops },
      { count: activeUsers },
      { count: activeProducts }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('shops').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true)
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      { count: recentUsers },
      { count: recentOrders },
      { count: recentProducts }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('products').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString())
    ])

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalShops: totalShops || 0,
        activeUsers: activeUsers || 0,
        activeProducts: activeProducts || 0,
        recentUsers: recentUsers || 0,
        recentOrders: recentOrders || 0,
        recentProducts: recentProducts || 0
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
