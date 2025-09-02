"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Plus, Star, AlertTriangle } from "lucide-react"

interface ProductCardProps {
  product: {
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
  influencerHandle: string
  onAddToCart: (product: any) => void
  onAddToWishlist?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCard({
  product,
  influencerHandle,
  onAddToCart,
  onAddToWishlist,
  isWishlisted = false,
  className = "",
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "hot":
        return "destructive"
      case "new":
        return "default"
      case "limited":
        return "secondary"
      case "bestseller":
        return "secondary"
      case "eco-friendly":
        return "outline"
      case "tech":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "hot":
        return "bg-red-500 text-white"
      case "new":
        return "bg-indigo-600 text-white"
      case "limited":
        return "bg-amber-500 text-white"
      case "bestseller":
        return "bg-green-500 text-white"
      case "eco-friendly":
        return "bg-green-100 text-green-800 border-green-200"
      case "tech":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Image */}
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className={`object-cover transition-all duration-300 ${
            isImageLoading ? "scale-95 opacity-70" : "group-hover:scale-105"
          }`}
          onLoad={handleImageLoad}
          priority={false}
        />

        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.badges.map((badge) => (
            <Badge
              key={badge}
              className={`text-xs font-medium ${getBadgeColor(badge)}`}
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Wishlist Button */}
        {onAddToWishlist && (
          <button
            onClick={() => onAddToWishlist(product.id)}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isWishlisted
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Stock Warning */}
        {product.stockCount <= 10 && product.stockCount > 0 && (
          <Badge className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs font-medium">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {product.stockCount} left
          </Badge>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title and Add to Cart */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 leading-tight">
            <Link 
              href={`/shop/${influencerHandle}/product/${product.id}`} 
              className="hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            >
              {product.title}
            </Link>
          </h3>
          
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="ml-2 h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
            aria-label={`Add ${product.title} to cart`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? "text-amber-400 fill-current" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price and Region */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.region}
          </Badge>
        </div>

        {/* Category */}
        <div className="mt-2">
          <span className="text-xs text-gray-500 capitalize">{product.category}</span>
        </div>
      </CardContent>
    </Card>
  )
}
