"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  Filter,
  Edit,
  Eye,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Globe,
  Upload,
  Download,
} from "lucide-react"
import { ImportProductsDialog } from "./components/ImportProductsDialog"
import { ExportProductsDrawer } from "./components/ExportProductsDrawer"

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Sustainable Cotton Tee",
    price: 45,
    originalPrice: 60,
    image: "/cotton-tee.png",
    category: "Clothing",
    regions: ["Global", "KR", "JP"],
    stock: 15,
    status: "active",
    commission: 20,
    sales: 124,
    revenue: 5580,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Minimalist Gold Necklace",
    price: 89,
    image: "/gold-necklace.png",
    category: "Jewelry",
    regions: ["KR"],
    stock: 3,
    status: "active",
    commission: 25,
    sales: 67,
    revenue: 5963,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Organic Skincare Set",
    price: 120,
    originalPrice: 150,
    image: "/skincare-set.png",
    category: "Beauty",
    regions: ["JP", "Global"],
    stock: 8,
    status: "active",
    commission: 30,
    sales: 203,
    revenue: 24360,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-22",
  },
  {
    id: "4",
    title: "Vintage Denim Jacket",
    price: 95,
    image: "/classic-denim-jacket.png",
    category: "Clothing",
    regions: ["Global"],
    stock: 0,
    status: "inactive",
    commission: 15,
    sales: 89,
    revenue: 8455,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-15",
  },
  {
    id: "5",
    title: "Handcrafted Ceramic Mug",
    price: 28,
    image: "/ceramic-mug.png",
    category: "Home",
    regions: ["CN", "KR"],
    stock: 12,
    status: "active",
    commission: 18,
    sales: 45,
    revenue: 1260,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
  {
    id: "6",
    title: "Wireless Earbuds Pro",
    price: 199,
    originalPrice: 249,
    image: "/wireless-earbuds.png",
    category: "Electronics",
    regions: ["Global", "KR", "JP", "CN"],
    stock: 7,
    status: "active",
    commission: 22,
    sales: 156,
    revenue: 31044,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-21",
  },
]

const categories = ["All", "Clothing", "Beauty", "Jewelry", "Home", "Electronics"]
const regions = ["All", "Global", "KR", "JP", "CN"]
const statusOptions = ["All", "Active", "Inactive", "Low Stock"]

export default function SupplierProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["All"])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDrawer, setShowExportDrawer] = useState(false)

  const itemsPerPage = 10

  // Filter products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && product.status === "active") ||
        (selectedStatus === "Inactive" && product.status === "inactive") ||
        (selectedStatus === "Low Stock" && product.stock <= 10 && product.status === "active")
      const matchesRegion =
        selectedRegions.includes("All") || selectedRegions.some((region) => product.regions.includes(region))

      return matchesSearch && matchesCategory && matchesStatus && matchesRegion
    })
  }, [searchQuery, selectedCategory, selectedStatus, selectedRegions])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const handleBulkDeactivate = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedProducts([])
    setIsLoading(false)
    // Show toast notification in real app
  }

  const getStatusBadge = (product: (typeof mockProducts)[0]) => {
    if (product.status === "inactive") {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (product.stock <= 10) {
      return <Badge variant="destructive">Low Stock</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  const getRegionChips = (regions: string[]) => (
    <div className="flex flex-wrap gap-1">
      {regions.map((region) => (
        <Badge key={region} variant="outline" className="text-xs">
          {region === "Global" ? <Globe className="h-3 w-3 mr-1" /> : null}
          {region}
        </Badge>
      ))}
    </div>
  )

  const ProductSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="h-4 w-4 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded skeleton" />
          <div className="h-4 w-32 bg-gray-200 rounded skeleton" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-16 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded skeleton" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-8 bg-gray-200 rounded skeleton" />
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowExportDrawer(true)}
            className="border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Link href="/dashboard/supplier/products/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{mockProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockProducts.filter((p) => p.status === "active").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">
                  {mockProducts.filter((p) => p.stock <= 10 && p.status === "active").length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Toggle Filters */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {(showFilters || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Regions</label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={selectedRegions.includes(region)}
                          onCheckedChange={(checked) => {
                            if (region === "All") {
                              setSelectedRegions(checked ? ["All"] : [])
                            } else {
                              setSelectedRegions((prev) => {
                                const filtered = prev.filter((r) => r !== "All")
                                return checked ? [...filtered, region] : filtered.filter((r) => r !== region)
                              })
                            }
                          }}
                        />
                        <label htmlFor={region} className="text-sm text-gray-600 cursor-pointer">
                          {region}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isLoading}>
                    Deactivate Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Products</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate {selectedProducts.length} product
                      {selectedProducts.length > 1 ? "s" : ""}? This will remove them from all influencer shops.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDeactivate} className="bg-red-600 hover:bg-red-700">
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Regions</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock <= 10 ? "text-amber-600 font-medium" : ""}>{product.stock}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product)}</TableCell>
                      <TableCell>{getRegionChips(product.regions)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/shop/sarah_style/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/supplier/products/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Package className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                      <p className="text-gray-600">Try adjusting your filters or search terms</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <ImportProductsDialog open={showImportDialog} onOpenChange={setShowImportDialog} />

      {/* Export Drawer */}
      <ExportProductsDrawer open={showExportDrawer} onOpenChange={setShowExportDrawer} />
    </div>
  )
}
