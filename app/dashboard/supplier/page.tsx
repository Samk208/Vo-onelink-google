"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Plus,
  BarChart3,
  Settings
} from 'lucide-react'

interface SupplierStats {
  totalProducts: number
  totalRevenue: number
  totalSales: number
  activeOrders: number
  commissionEarned: number
  influencerPartners: number
}

interface TodayStats {
  sales: number
  revenue: number
  orders: number
}

interface ThisMonthStats {
  sales: number
  revenue: number
  orders: number
  newProducts: number
}

interface TopProduct {
  id: string
  title: string
  sales: number
  revenue: number
  commission: number
  stock: number
}

interface RecentOrder {
  id: string
  customerName: string
  productTitle: string
  quantity: number
  total: number
  commission: number
  status: string
  createdAt: string
}

interface SupplierDashboardData {
  stats: SupplierStats
  todayStats: TodayStats
  thisMonthStats: ThisMonthStats
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
}

export default function SupplierDashboard() {
  const [data, setData] = useState<SupplierDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/supplier')
      const result = await response.json()
      
      if (result.ok) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6" data-testid="dashboard-loading">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <Button 
            onClick={fetchDashboardData} 
            className="mt-3 bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-revenue">
              ${data.stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="commission-earned">
              ${data.stats.commissionEarned.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Influencer Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.influencerPartners}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="today-sales">{data.todayStats.sales}</div>
              <div className="text-sm text-muted-foreground">Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="today-revenue">
                ${data.todayStats.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="today-orders">{data.todayStats.orders}</div>
              <div className="text-sm text-muted-foreground">Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="top-products">Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topProducts.map((product: TopProduct) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`product-${product.id}`}>
                <div className="flex-1">
                  <h4 className="font-medium">{product.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{product.sales} sales</span>
                    <span>${product.revenue.toLocaleString()} revenue</span>
                    <Badge variant="secondary" data-testid="commission-badge">
                      {product.commission}% commission
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="recent-orders">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentOrders.map((order: RecentOrder) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`order-${order.id}`}>
                <div className="flex-1">
                  <h4 className="font-medium">{order.customerName}</h4>
                  <div className="text-sm text-muted-foreground">
                    {order.productTitle} × {order.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-green-600">+${order.commission.toFixed(2)} commission</div>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Add Product</div>
                <div className="text-sm text-muted-foreground">Create new product</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-muted-foreground">Detailed reports</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Settings className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Manage Products</div>
                <div className="text-sm text-muted-foreground">Edit inventory</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
