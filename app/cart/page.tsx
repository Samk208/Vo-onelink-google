"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ShoppingCart, Plus, Minus, X, ArrowLeft, Shield, Truck, RotateCcw, AlertCircle } from "lucide-react"

// Mock cart data
const mockCartItems = [
  {
    id: "1",
    title: "Sustainable Cotton Tee",
    price: 45,
    originalPrice: 60,
    image: "/cotton-tee.png",
    quantity: 2,
    inStock: true,
    stockCount: 15,
    influencer: { handle: "sarah_style", name: "Sarah Chen" },
    supplier: { name: "EcoWear Co.", verified: true },
  },
  {
    id: "2",
    title: "Minimalist Gold Necklace",
    price: 89,
    image: "/gold-necklace.png",
    quantity: 1,
    inStock: true,
    stockCount: 3,
    influencer: { handle: "sarah_style", name: "Sarah Chen" },
    supplier: { name: "Luxe Jewelry", verified: true },
  },
  {
    id: "3",
    title: "Organic Skincare Set",
    price: 120,
    originalPrice: 150,
    image: "/skincare-set.png",
    quantity: 1,
    inStock: false,
    stockCount: 0,
    influencer: { handle: "sarah_style", name: "Sarah Chen" },
    supplier: { name: "Pure Beauty Co.", verified: true },
  },
]

interface CartItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  inStock: boolean
  stockCount: number
  influencer: { handle: string; name: string }
  supplier: { name: string; verified: boolean }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [orderNote, setOrderNote] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (newQuantity > item.stockCount) {
            setErrors((prev) => ({ ...prev, [id]: `Only ${item.stockCount} available` }))
            return item
          }
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[id]
            return newErrors
          })
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const estimatedTax = subtotal * 0.08 // 8% tax
  const estimatedShipping = subtotal > 75 ? 0 : 9.99
  const total = subtotal + estimatedTax + estimatedShipping

  const inStockItems = cartItems.filter((item) => item.inStock)
  const outOfStockItems = cartItems.filter((item) => !item.inStock)

  if (isLoading) {
    return <CartSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Items in Cart ({inStockItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="space-y-4">
                      {inStockItems.map((item, index) => (
                        <div key={item.id}>
                          <CartItemRow
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                            error={errors[item.id]}
                          />
                          {index < inStockItems.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card className="p-6 border-amber-200 bg-amber-50">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-5 w-5" />
                      Out of Stock Items ({outOfStockItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="space-y-4">
                      {outOfStockItems.map((item, index) => (
                        <div key={item.id}>
                          <CartItemRow item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} disabled />
                          {index < outOfStockItems.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Note */}
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Order Note (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Textarea
                    placeholder="Add any special instructions for your order..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">{orderNote.length}/500 characters</p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                estimatedTax={estimatedTax}
                estimatedShipping={estimatedShipping}
                total={total}
                hasOutOfStockItems={outOfStockItems.length > 0}
                itemCount={inStockItems.reduce((sum, item) => sum + item.quantity, 0)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  error,
  disabled = false,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <div className={`flex gap-4 ${disabled ? "opacity-60" : ""}`}>
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover rounded-lg" />
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">by {item.supplier.name}</span>
          {item.supplier.verified && (
            <Badge variant="outline" className="text-xs">
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">Curated by @{item.influencer.handle}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-gray-900">${item.price}</span>
          {item.originalPrice && <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1 mt-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
          aria-label="Remove item"
        >
          <X className="h-4 w-4" />
        </Button>

        {!disabled && (
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stockCount}
              className="h-8 w-8 p-0"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Subtotal */}
        <div className="text-right">
          <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  subtotal,
  estimatedTax,
  estimatedShipping,
  total,
  hasOutOfStockItems,
  itemCount,
}: {
  subtotal: number
  estimatedTax: number
  estimatedShipping: number
  total: number
  hasOutOfStockItems: boolean
  itemCount: number
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <Card className="sticky top-8 p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated Tax</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{estimatedShipping === 0 ? "FREE" : `$${estimatedShipping.toFixed(2)}`}</span>
          </div>
          {estimatedShipping === 0 && <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {hasOutOfStockItems && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Some items are out of stock</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">Remove out-of-stock items to proceed with checkout</p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Link href="/checkout" className="block">
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={hasOutOfStockItems || itemCount === 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" size="lg" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t text-center">
          <div className="flex flex-col items-center gap-1">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-600">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-600">Fast Ship</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-600">Returns</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-8">Discover amazing products curated by your favorite influencers</p>
      <Link href="/">
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          Start Shopping
        </Button>
      </Link>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-4 bg-gray-200 rounded w-64 mb-6 skeleton" />
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 skeleton" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl skeleton" />
            <div className="h-32 bg-gray-200 rounded-2xl skeleton" />
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl skeleton" />
        </div>
      </div>
    </div>
  )
}
