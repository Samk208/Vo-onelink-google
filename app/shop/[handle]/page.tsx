"use client"

import { useState, useMemo } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Star,
  Shield,
  RotateCcw,
  Instagram,
  Twitter,
  Youtube,
  Grid3X3,
  List,
  Heart,
  Share2,
} from "lucide-react"

// Mock data
const mockInfluencer = {
  handle: "sarah_style",
  name: "Sarah Chen",
  bio: "Fashion & lifestyle creator sharing my favorite finds ✨ Sustainable fashion advocate 🌱",
  avatar: "/fashion-influencer-avatar.png",
  banner: "/fashion-banner.png",
  followers: "125K",
  verified: true,
  socialLinks: {
    instagram: "https://instagram.com/sarah_style",
    twitter: "https://twitter.com/sarah_style",
    youtube: "https://youtube.com/@sarahstyle",
  },
}

const mockProducts = [
  {
    id: "1",
    title: "Sustainable Cotton Tee",
    price: 45,
    originalPrice: 60,
    image: "/cotton-tee.png",
    badges: ["New", "Eco-Friendly"],
    category: "Clothing",
    region: "Global",
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    title: "Minimalist Gold Necklace",
    price: 89,
    image: "/gold-necklace.png",
    badges: ["Hot"],
    category: "Jewelry",
    region: "KR",
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "3",
    title: "Organic Skincare Set",
    price: 120,
    originalPrice: 150,
    image: "/skincare-set.png",
    badges: ["Bestseller"],
    category: "Beauty",
    region: "JP",
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: "4",
    title: "Vintage Denim Jacket",
    price: 95,
    image: "/classic-denim-jacket.png",
    badges: ["Limited"],
    category: "Clothing",
    region: "Global",
    inStock: true,
    stockCount: 25,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "5",
    title: "Handcrafted Ceramic Mug",
    price: 28,
    image: "/ceramic-mug.png",
    badges: ["New"],
    category: "Home",
    region: "CN",
    inStock: true,
    stockCount: 12,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: "6",
    title: "Wireless Earbuds Pro",
    price: 199,
    originalPrice: 249,
    image: "/wireless-earbuds.png",
    badges: ["Hot", "Tech"],
    category: "Electronics",
    region: "Global",
    inStock: true,
    stockCount: 7,
    rating: 4.8,
    reviews: 156,
  },
]

const categories = ["All", "Clothing", "Beauty", "Jewelry", "Home", "Electronics"]
const regions = ["All", "Global", "KR", "JP", "CN"]
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "bestseller", label: "Bestseller" },
]

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export default function InfluencerShopPage({ params }: { params: { handle: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["All"])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading state
  const [showSkeleton, setShowSkeleton] = useState(true)
  useState(() => {
    setTimeout(() => setShowSkeleton(false), 1000)
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
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
  }, [searchQuery, selectedCategory, selectedRegions, priceRange, inStockOnly, sortBy])

  const addToCart = (product: (typeof mockProducts)[0]) => {
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="px-3">
          <Slider value={priceRange} onValueChange={setPriceRange} max={300} step={10} className="mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Regions</h3>
        <div className="space-y-2">
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

      <Separator />

      <div className="flex items-center space-x-2">
        <Checkbox id="inStock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
        <label htmlFor="inStock" className="text-sm text-gray-600 cursor-pointer">
          In stock only
        </label>
      </div>
    </div>
  )

  const ProductCard = ({ product }: { product: (typeof mockProducts)[0] }) => (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.badges.map((badge) => (
            <Badge
              key={badge}
              variant={badge === "Hot" ? "destructive" : badge === "New" ? "default" : "secondary"}
              className="text-xs"
            >
              {badge}
            </Badge>
          ))}
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {product.stockCount <= 10 && (
          <Badge className="absolute bottom-2 left-2 bg-amber-500 text-white">{product.stockCount} left</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
            <Link href={`/shop/${params.handle}/product/${product.id}`} className="hover:text-indigo-600">
              {product.title}
            </Link>
          </h3>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="ml-2 h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 text-amber-400 fill-current" />
          <span className="text-xs text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.region}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const ProductSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div className="aspect-square bg-gray-200 skeleton" />
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 skeleton rounded mb-2" />
        <div className="h-3 bg-gray-200 skeleton rounded w-2/3 mb-2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 skeleton rounded w-16" />
          <div className="h-4 bg-gray-200 skeleton rounded w-12" />
        </div>
      </CardContent>
    </Card>
  )

  if (!mockInfluencer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
          <Image
            src={mockInfluencer.banner || "/placeholder.svg"}
            alt="Shop banner"
            fill
            className="object-cover opacity-80"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                <Image
                  src={mockInfluencer.avatar || "/placeholder.svg"}
                  alt={mockInfluencer.name}
                  width={120}
                  height={120}
                  className="rounded-2xl border-4 border-white shadow-lg"
                />
                {mockInfluencer.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">@{mockInfluencer.handle}</h1>
                    <p className="text-lg text-gray-600 mb-2">{mockInfluencer.name}</p>
                    <p className="text-gray-700 mb-3">{mockInfluencer.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{mockInfluencer.followers} followers</span>
                      <div className="flex gap-2">
                        <Link href={mockInfluencer.socialLinks.instagram} className="hover:text-indigo-600">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href={mockInfluencer.socialLinks.twitter} className="hover:text-indigo-600">
                          <Twitter className="h-4 w-4" />
                        </Link>
                        <Link href={mockInfluencer.socialLinks.youtube} className="hover:text-indigo-600">
                          <Youtube className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-green-600" />
              <span>Easy returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Curated by @{mockInfluencer.handle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl p-6 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
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

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar isMobile />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">{filteredProducts.length} products found</div>
            </div>

            {/* Products Grid */}
            {showSkeleton ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart FAB */}
      {cartItemCount > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 z-50"
            >
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white min-w-[20px] h-5 rounded-full text-xs">
                {cartItemCount}
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Shopping Cart ({cartItemCount})</SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCartQuantity(item.id, 0)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
                  Checkout
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">Purchases support @{mockInfluencer.handle}</p>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
