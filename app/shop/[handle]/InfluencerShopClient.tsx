"use client"

import { useState, useMemo, useEffect } from "react"
import {
  InfluencerHero,
  TrustStrip,
  ShopToolbar,
  ShopFilters,
  ProductGrid,
  CartDrawer,
} from "@/components/features/shop"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface InfluencerShopClientProps {
  influencer: {
    handle: string
    name: string
    bio: string
    avatar: string
    banner: string
    followers: string
    verified: boolean
    socialLinks: {
      instagram?: string
      twitter?: string
      youtube?: string
      facebook?: string
      tiktok?: string
    }
  }
  products: Array<{
    id: string
    title: string
    price: number
    originalPrice?: number
    image: string
    badges: string[]
    category: string
    region: string
    inStock: boolean
    stockCount: number
    rating: number
    reviews: number
  }>
  handle: string
}

const categories = ["All", "Clothing", "Beauty", "Jewelry", "Home", "Electronics"]
const regions = ["All", "Global", "KR", "JP", "CN"]
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "bestseller", label: "Bestseller" },
]

export function InfluencerShopClient({ influencer, products, handle }: InfluencerShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["All"])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesRegion = selectedRegions.includes("All") || selectedRegions.includes(product.region)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.inStock

      return matchesSearch && matchesCategory && matchesRegion && matchesPrice && matchesStock
    })

    // Sort products
    switch (sortBy) {
      case "newest":
        return filtered.sort((a, b) => b.id.localeCompare(a.id))
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price)
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price)
      case "bestseller":
        return filtered.sort((a, b) => b.reviews - a.reviews)
      default:
        return filtered
    }
  }, [searchQuery, selectedCategory, selectedRegions, priceRange, inStockOnly, sortBy, products])

  const addToCart = (product: (typeof products)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = async () => {
    // Implement checkout logic
    console.log("Proceeding to checkout with cart:", cart)
  }

  const resetFilters = () => {
    setSelectedCategory("All")
    setSelectedRegions(["All"])
    setPriceRange([0, 300])
    setInStockOnly(false)
    setSearchQuery("")
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <InfluencerHero
        influencer={influencer}
        onShare={() => console.log("Share shop")}
        onFollow={() => console.log("Follow influencer")}
      />

      {/* Trust Strip */}
      <TrustStrip influencerHandle={influencer.handle} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl p-6 shadow-sm">
              <ShopFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                regions={regions}
                selectedRegions={selectedRegions}
                onRegionChange={setSelectedRegions}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                onResetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <ShopToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              productCount={filteredProducts.length}
              sortOptions={sortOptions}
              onOpenFilters={() => console.log("Open mobile filters")}
              className="mb-6"
            />

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              influencerHandle={handle}
              isLoading={showSkeleton}
              viewMode={viewMode}
              onAddToCart={addToCart}
            />
          </main>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        cartItemCount={cartItemCount}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={handleCheckout}
        influencerHandle={influencer.handle}
      />
    </div>
  )
}
