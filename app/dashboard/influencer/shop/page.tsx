"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

// Mock data for supplier catalog
const supplierProducts = [
  {
    id: "1",
    title: "Premium Cotton T-Shirt",
    basePrice: 29.99,
    image: "/cotton-tee.png",
    category: "Fashion",
    region: "Global",
    supplier: "StyleCo",
    inStock: true,
    stockCount: 150,
  },
  {
    id: "2",
    title: "Gold Chain Necklace",
    basePrice: 89.99,
    image: "/gold-necklace.png",
    category: "Jewelry",
    region: "KR",
    supplier: "LuxeJewels",
    inStock: true,
    stockCount: 45,
  },
  {
    id: "3",
    title: "Skincare Essentials Set",
    basePrice: 149.99,
    image: "/skincare-set.png",
    category: "Beauty",
    region: "JP",
    supplier: "BeautyLab",
    inStock: true,
    stockCount: 8,
  },
  {
    id: "4",
    title: "Classic Denim Jacket",
    basePrice: 79.99,
    image: "/classic-denim-jacket.png",
    category: "Fashion",
    region: "Global",
    supplier: "DenimCo",
    inStock: false,
    stockCount: 0,
  },
]

// Mock data for influencer's curated shop
const initialShopProducts = [
  {
    id: "1",
    originalId: "1",
    title: "Premium Cotton T-Shirt",
    customTitle: "My Favorite Everyday Tee",
    customDescription: "This is the softest, most comfortable t-shirt I own. Perfect for casual days!",
    basePrice: 29.99,
    salePrice: 34.99,
    image: "/cotton-tee.png",
    category: "Fashion",
    region: "Global",
    supplier: "StyleCo",
    published: true,
    order: 0,
  },
  {
    id: "2",
    originalId: "2",
    title: "Gold Chain Necklace",
    customTitle: "Statement Gold Chain",
    customDescription: "Elevate any outfit with this gorgeous gold chain. I wear it everywhere!",
    basePrice: 89.99,
    salePrice: 99.99,
    image: "/gold-necklace.png",
    category: "Jewelry",
    region: "KR",
    supplier: "LuxeJewels",
    published: true,
    order: 1,
  },
]

export default function MyShopBuilder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("relevance")
  const [shopProducts, setShopProducts] = useState(initialShopProducts)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter supplier products
  const filteredProducts = supplierProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesRegion = selectedRegion === "all" || product.region === selectedRegion
    const matchesPrice = product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1]

    return matchesSearch && matchesCategory && matchesRegion && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.basePrice - b.basePrice
      case "price-high":
        return b.basePrice - a.basePrice
      case "name":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const handleAddToShop = (product: (typeof supplierProducts)[0]) => {
    const newShopProduct = {
      id: `shop-${Date.now()}`,
      originalId: product.id,
      title: product.title,
      customTitle: product.title,
      customDescription: "",
      basePrice: product.basePrice,
      salePrice: product.basePrice * 1.2, // 20% markup by default
      image: product.image,
      category: product.category,
      region: product.region,
      supplier: product.supplier,
      published: false,
      order: shopProducts.length,
    }

    setShopProducts([...shopProducts, newShopProduct])
    toast.success("Product added to your shop!")
  }

  const handleRemoveFromShop = (id: string) => {
    setShopProducts(shopProducts.filter((p) => p.id !== id))
    toast.success("Product removed from your shop")
  }

  const handleUpdateShopProduct = (id: string, updates: Partial<(typeof shopProducts)[0]>) => {
    setShopProducts(shopProducts.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(shopProducts)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    setShopProducts(updatedItems)
    toast.success("Products reordered")
  }

  const handleBulkPublish = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to publish")
      return
    }

    setShopProducts(shopProducts.map((p) => (selectedProducts.includes(p.id) ? { ...p, published: true } : p)))
    setSelectedProducts([])
    toast.success(`${selectedProducts.length} products published`)
  }

  const handleBulkUnpublish = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to unpublish")
      return
    }

    setShopProducts(shopProducts.map((p) => (selectedProducts.includes(p.id) ? { ...p, published: false } : p)))
    setSelectedProducts([])
    toast.success(`${selectedProducts.length} products unpublished`)
  }

  const handlePreviewShop = () => {
    window.open("/shop/sarah-style", "_blank")
    toast.success("Opening shop preview in new tab")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Shop Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">Curate products and customize your shop</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePreviewShop}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview Shop
            </Button>
            <Button onClick={handleBulkPublish} disabled={selectedProducts.length === 0}>
              Bulk Publish ({selectedProducts.length})
            </Button>
            <Button variant="outline" onClick={handleBulkUnpublish} disabled={selectedProducts.length === 0}>
              Bulk Unpublish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Pane - Supplier Catalog */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supplier Catalog</h2>

            {/* Search */}
            <div className="mb-4">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                  <SelectItem value="KR">Korea</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={10} className="w-full" />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="p-6 overflow-y-auto h-full">
            <div className="grid grid-cols-1 gap-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{product.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.supplier}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge variant="outline">{product.region}</Badge>
                          {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                          {product.inStock && product.stockCount < 10 && <Badge variant="secondary">Low Stock</Badge>}
                        </div>
                        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                          ${product.basePrice}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleAddToShop(product)}
                        disabled={!product.inStock || shopProducts.some((p) => p.originalId === product.id)}
                        size="sm"
                      >
                        {shopProducts.some((p) => p.originalId === product.id) ? "Added" : "Add to Shop"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane - My Shop */}
        <div className="w-1/2 bg-gray-50 dark:bg-gray-900">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Shop ({shopProducts.length} products)
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {shopProducts.filter((p) => p.published).length} published
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto h-full">
            {shopProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your shop is empty</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add products from the supplier catalog to get started
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="shop-products">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {shopProducts.map((product, index) => (
                        <Draggable key={product.id} draggableId={product.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${snapshot.isDragging ? "shadow-lg" : ""} transition-shadow`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {/* Drag Handle */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-2 cursor-grab active:cursor-grabbing"
                                  >
                                    <svg
                                      className="w-5 h-5 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 8h16M4 16h16"
                                      />
                                    </svg>
                                  </div>

                                  {/* Checkbox */}
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedProducts([...selectedProducts, product.id])
                                      } else {
                                        setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                                      }
                                    }}
                                    className="mt-2 rounded border-gray-300"
                                  />

                                  {/* Product Image */}
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />

                                  {/* Product Details */}
                                  <div className="flex-1 space-y-3">
                                    <div>
                                      <Input
                                        value={product.customTitle}
                                        onChange={(e) =>
                                          handleUpdateShopProduct(product.id, { customTitle: e.target.value })
                                        }
                                        placeholder="Custom title"
                                        className="font-medium"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">Original: {product.title}</p>
                                    </div>

                                    <Textarea
                                      value={product.customDescription}
                                      onChange={(e) =>
                                        handleUpdateShopProduct(product.id, { customDescription: e.target.value })
                                      }
                                      placeholder="Add your personal description..."
                                      rows={2}
                                      className="text-sm"
                                    />

                                    <div className="flex items-center gap-4">
                                      <div>
                                        <label className="text-xs text-gray-600 dark:text-gray-400">Sale Price</label>
                                        <Input
                                          type="number"
                                          value={product.salePrice}
                                          onChange={(e) =>
                                            handleUpdateShopProduct(product.id, {
                                              salePrice: Number.parseFloat(e.target.value),
                                            })
                                          }
                                          min={product.basePrice}
                                          step="0.01"
                                          className="w-24"
                                        />
                                        <p className="text-xs text-gray-500">Min: ${product.basePrice}</p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={product.published}
                                          onCheckedChange={(checked) =>
                                            handleUpdateShopProduct(product.id, { published: checked })
                                          }
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {product.published ? "Published" : "Draft"}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{product.category}</Badge>
                                        <Badge variant="outline">{product.region}</Badge>
                                        {product.published && (
                                          <Badge className="bg-green-100 text-green-800">Live</Badge>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFromShop(product.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
