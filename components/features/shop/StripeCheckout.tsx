"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CreditCard, Lock, Truck, Shield, ArrowRight, Loader2 } from "lucide-react"
import type { CartItem, CheckoutData } from "@/lib/types"

interface StripeCheckoutProps {
  cart: CartItem[]
  influencerHandle: string
  onSuccess: (sessionId: string) => void
  onCancel: () => void
  className?: string
}

export function StripeCheckout({ cart, influencerHandle, onSuccess, onCancel, className = "" }: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"customer" | "shipping" | "payment" | "review">("customer")
  const [formData, setFormData] = useState({
    customerInfo: {
      email: "",
      name: "",
      phone: ""
    },
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US"
    }
  })

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = 5.99
  const tax = cartTotal * 0.08 // 8% tax
  const total = cartTotal + shippingCost + tax

  const handleInputChange = (section: "customerInfo" | "shippingAddress", field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const validateStep = (currentStep: string) => {
    switch (currentStep) {
      case "customer":
        return formData.customerInfo.email && formData.customerInfo.name
      case "shipping":
        return formData.shippingAddress.line1 && formData.shippingAddress.city && 
               formData.shippingAddress.state && formData.shippingAddress.postalCode
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!validateStep(step)) {
      toast.error("Please fill in all required fields")
      return
    }

    switch (step) {
      case "customer":
        setStep("shipping")
        break
      case "shipping":
        setStep("review")
        break
      case "review":
        handleCheckout()
        break
    }
  }

  const handleBack = () => {
    switch (step) {
      case "shipping":
        setStep("customer")
        break
      case "review":
        setStep("shipping")
        break
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const checkoutData: CheckoutData = {
        items: cart,
        customerInfo: formData.customerInfo,
        shippingAddress: formData.shippingAddress,
        influencerHandle
      }

      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData)
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()
      onSuccess(data.sessionId)
      toast.success("Redirecting to checkout...")
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to process checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderCustomerStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Email Address *</label>
        <Input
          type="email"
          value={formData.customerInfo.email}
          onChange={(e) => handleInputChange("customerInfo", "email", e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Full Name *</label>
        <Input
          value={formData.customerInfo.name}
          onChange={(e) => handleInputChange("customerInfo", "name", e.target.value)}
          placeholder="Your full name"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <Input
          type="tel"
          value={formData.customerInfo.phone}
          onChange={(e) => handleInputChange("customerInfo", "phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  )

  const renderShippingStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Address Line 1 *</label>
        <Input
          value={formData.shippingAddress.line1}
          onChange={(e) => handleInputChange("shippingAddress", "line1", e.target.value)}
          placeholder="123 Main St"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Address Line 2</label>
        <Input
          value={formData.shippingAddress.line2}
          onChange={(e) => handleInputChange("shippingAddress", "line2", e.target.value)}
          placeholder="Apt, suite, etc. (optional)"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">City *</label>
          <Input
            value={formData.shippingAddress.city}
            onChange={(e) => handleInputChange("shippingAddress", "city", e.target.value)}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">State *</label>
          <Input
            value={formData.shippingAddress.state}
            onChange={(e) => handleInputChange("shippingAddress", "state", e.target.value)}
            placeholder="State"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">ZIP Code *</label>
          <Input
            value={formData.shippingAddress.postalCode}
            onChange={(e) => handleInputChange("shippingAddress", "postalCode", e.target.value)}
            placeholder="12345"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Country</label>
          <Input
            value={formData.shippingAddress.country}
            onChange={(e) => handleInputChange("shippingAddress", "country", e.target.value)}
            placeholder="US"
          />
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Order Summary</h4>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping:</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Secure Checkout</p>
            <p>Your payment information is encrypted and secure. We use Stripe for secure payment processing.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (step) {
      case "customer":
        return renderCustomerStep()
      case "shipping":
        return renderShippingStep()
      case "review":
        return renderReviewStep()
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case "customer":
        return "Customer Information"
      case "shipping":
        return "Shipping Address"
      case "review":
        return "Review & Checkout"
      default:
        return ""
    }
  }

  const steps = ["customer", "shipping", "review"]
  
  const getStepNumber = (stepName: string) => {
    return steps.indexOf(stepName) + 1
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {["customer", "shipping", "review"].map((stepName) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName 
                ? "bg-indigo-600 text-white" 
                : stepName === "review" || steps.indexOf(stepName) < steps.indexOf(step)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}>
              {stepName === "review" || steps.indexOf(stepName) < steps.indexOf(step) ? "✓" : getStepNumber(stepName)}
            </div>
            {stepName !== "review" && (
              <div className={`w-16 h-0.5 mx-2 ${
                steps.indexOf(stepName) < steps.indexOf(step) ? "bg-green-600" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {getStepTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === "customer"}
            >
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={isProcessing || !validateStep(step)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : step === "review" ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Secure Checkout
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Fast Shipping</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>
    </div>
  )
}
