"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, Check } from "lucide-react"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartDrawerProps {
  cart: CartItem[]
  cartItemCount: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
  influencerHandle: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function CartDrawer({
  cart,
  cartItemCount,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  influencerHandle,
  isOpen,
  onOpenChange,
  trigger,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      await onCheckout()
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find(item => item.id === id)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        onRemoveItem(id)
      } else {
        onUpdateQuantity(id, newQuantity)
      }
    }
  }

  const defaultTrigger = (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 z-50"
      aria-label={`Shopping cart (${cartItemCount} items)`}
    >
      <ShoppingCart className="h-6 w-6" />
      {cartItemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white min-w-[20px] h-5 rounded-full text-xs">
          {cartItemCount}
        </Badge>
      )}
    </Button>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cartItemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500">Start shopping to add items to your cart</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                    <p className="text-sm text-gray-600">${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="h-8 w-8 p-0"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="h-8 w-8 p-0"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label="Remove item from cart"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary and Checkout */}
        {cart.length > 0 && (
          <div className="border-t pt-4 mt-6">
            {/* Subtotal */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItemCount} items):</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Checkout
                </>
              )}
            </Button>

            {/* Support Message */}
            <p className="text-xs text-gray-500 text-center mt-2">
              Purchases support @{influencerHandle}
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600">Fast</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600">Easy</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
