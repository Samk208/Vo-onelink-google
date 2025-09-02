"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, CreditCard, Shield, Truck, RotateCcw, Lock } from "lucide-react"

// Mock checkout data
const mockOrderItems = [
  {
    id: "1",
    title: "Sustainable Cotton Tee",
    price: 45,
    quantity: 2,
    image: "/cotton-tee.png",
    influencer: { handle: "sarah_style", name: "Sarah Chen" },
    supplier: { name: "EcoWear Co.", verified: true },
  },
  {
    id: "2",
    title: "Minimalist Gold Necklace",
    price: 89,
    quantity: 1,
    image: "/gold-necklace.png",
    influencer: { handle: "sarah_style", name: "Sarah Chen" },
    supplier: { name: "Luxe Jewelry", verified: true },
  },
]

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const subtotal = mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const estimatedTax = subtotal * 0.08
  const estimatedShipping = subtotal > 75 ? 0 : 9.99
  const total = subtotal + estimatedTax + estimatedShipping

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Redirect to success page
    window.location.href = "/order/success?order=ORD-2024-001"
  }

  if (isLoading) {
    return <CheckoutSkeleton />
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
              <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <Link href="/cart" className="flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="10001" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600">Secure</span>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <RadioGroupItem value="paypal" id="paypal" disabled />
                    <Label htmlFor="paypal" className="flex-1 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-600">Coming soon</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Soon
                        </Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "stripe" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {mockOrderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-indigo-600 text-white min-w-[20px] h-5 rounded-full text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">by {item.supplier.name}</span>
                          {item.supplier.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
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
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay with Stripe
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-4 bg-gray-200 rounded w-64 mb-6 skeleton" />
        <div className="h-8 bg-gray-200 rounded w-32 mb-8 skeleton" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl skeleton" />
            <div className="h-48 bg-gray-200 rounded-2xl skeleton" />
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl skeleton" />
        </div>
      </div>
    </div>
  )
}
