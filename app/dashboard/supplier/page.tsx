import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, TrendingUp, Users, AlertCircle, Plus, Eye, Edit } from "lucide-react"

export default function SupplierDashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+2 this month",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+15% from last month",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Orders",
      value: "8",
      change: "3 pending fulfillment",
      icon: TrendingUp,
      color: "text-indigo-600",
    },
    {
      title: "Partner Influencers",
      value: "12",
      change: "+3 this month",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const recentProducts = [
    {
      id: "1",
      title: "Sustainable Cotton Tee",
      status: "active",
      stock: 15,
      price: 45,
      commission: 20,
    },
    {
      id: "2",
      title: "Minimalist Gold Necklace",
      status: "low_stock",
      stock: 3,
      price: 89,
      commission: 25,
    },
    {
      id: "3",
      title: "Organic Skincare Set",
      status: "active",
      stock: 8,
      price: 120,
      commission: 30,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your products and track performance</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Products</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>Stock: {product.stock}</span>
                    <span>Price: ${product.price}</span>
                    <span>Commission: {product.commission}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={product.status === "active" ? "default" : "destructive"}>
                    {product.status === "active" ? "Active" : "Low Stock"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Low Stock Alert</p>
                <p className="text-sm text-amber-700">Minimalist Gold Necklace has only 3 items left in stock</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">New Partnership</p>
                <p className="text-sm text-blue-700">@fashion_forward wants to feature your products in their shop</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
