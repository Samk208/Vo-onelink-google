"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/use-products"
import { useCartStore } from "@/lib/store/cart"
import { ProductCard } from "@/components/shop/product-card"
import { ProductFilters, type ProductFilters as ProductFiltersType } from "@/components/shop/product-filters"
import { CartSidebar } from "@/components/shop/cart-sidebar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  ShoppingCart, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Star,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function EnhancedShopPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: "",
    category: "",
    priceRange: [0, 1000],
    inStock: true,
    onSale: false,
    rating: 0,
    sortBy: "newest",
    brands: []
  })
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  
  const { products, loading, error, hasMore, totalCount, refetch, fetchMore } = useProducts({
    category: filters.category,
    search: filters.search,
    limit: 12,
    page: currentPage
  })
  
  const { getTotalItems } = useCartStore()

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset pagination when filters change
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMore()
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Products</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Shop from verified creators
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing
              <span className="text-indigo-600"> Products</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse thousands of handpicked products from creators and suppliers you trust. 
              Find exactly what you're looking for with our advanced filters.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{totalCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">500+</div>
                <div className="text-sm text-gray-600">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <ProductFilters
                onFiltersChange={handleFiltersChange}
                totalProducts={totalCount}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters & Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-96">
                  <ProductFilters
                    onFiltersChange={handleFiltersChange}
                    totalProducts={totalCount}
                    className="h-full overflow-y-auto"
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Products Grid/List */}
            {loading && products.length === 0 ? (
              <ProductGridSkeleton />
            ) : (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                )}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      size={viewMode === "list" ? "lg" : "md"}
                      className={viewMode === "list" ? "flex-row" : ""}
                    />
                  ))}
                </div>

                {/* Load More / Pagination */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      size="lg"
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Load More Products
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {!loading && products.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                    <Button onClick={() => handleFiltersChange({
                      search: "",
                      category: "",
                      priceRange: [0, 1000],
                      inStock: true,
                      onSale: false,
                      rating: 0,
                      sortBy: "newest",
                      brands: []
                    })}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Floating Cart Button - Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "fixed bottom-6 right-6 z-50 shadow-lg rounded-full h-14 w-14 p-0",
                "bg-indigo-600 hover:bg-indigo-700",
                getTotalItems() > 0 && "animate-pulse"
              )}
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <CartSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Cart Sidebar */}
      <div className="hidden lg:block">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="fixed top-1/2 right-0 -translate-y-1/2 z-50 rounded-l-lg rounded-r-none shadow-lg bg-white border-r-0 pr-3 pl-4"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="font-semibold">{getTotalItems()}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-96 p-0">
            <CartSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of creators and suppliers earning with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50" asChild>
                <Link href="/sign-up?type=creator">
                  Become a Creator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
                asChild
              >
                <Link href="/sign-up?type=supplier">List Your Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
