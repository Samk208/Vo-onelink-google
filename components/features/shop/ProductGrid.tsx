"use client"

import { ProductCard } from "./ProductCard"
import { ProductSkeleton } from "./ProductSkeleton"
import { Search, Package } from "lucide-react"

interface Product {
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
}

interface ProductGridProps {
  products: Product[]
  influencerHandle: string
  isLoading?: boolean
  viewMode?: "grid" | "list"
  onAddToCart: (product: Product) => void
  onAddToWishlist?: (productId: string) => void
  wishlistedProducts?: string[]
  className?: string
}

export function ProductGrid({
  products,
  influencerHandle,
  isLoading = false,
  viewMode = "grid",
  onAddToCart,
  onAddToWishlist,
  wishlistedProducts = [],
  className = "",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      } ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === "grid" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
    } ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          influencerHandle={influencerHandle}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          isWishlisted={wishlistedProducts.includes(product.id)}
          className={viewMode === "list" ? "flex flex-row" : ""}
        />
      ))}
    </div>
  )
}
