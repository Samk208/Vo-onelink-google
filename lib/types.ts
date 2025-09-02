export enum UserRole {
  SUPPLIER = "supplier",
  INFLUENCER = "influencer",
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export interface AuthResponse {
  ok: boolean
  role?: UserRole
  message?: string
  errors?: Record<string, string>
}

export interface ApiError {
  message: string
  errors?: Record<string, string>
}

// Influencer verification types
export interface InfluencerProfile {
  id: string
  handle: string
  name: string
  email: string
  bio: string
  avatar: string
  banner: string
  followers: string
  verified: boolean
  verificationStatus: "pending" | "approved" | "rejected"
  verificationDate?: string
  socialLinks: {
    instagram?: string
    twitter?: string
    youtube?: string
    facebook?: string
    tiktok?: string
  }
  shopSettings: {
    isPublic: boolean
    customDomain?: string
    theme: "default" | "minimal" | "bold"
    primaryColor: string
    accentColor: string
  }
  createdAt: string
  updatedAt: string
}

// Shop product types
export interface ShopProduct {
  id: string
  originalId: string
  title: string
  customTitle: string
  customDescription: string
  basePrice: number
  salePrice: number
  image: string
  category: string
  region: string
  supplier: string
  published: boolean
  order: number
  featured: boolean
  tags: string[]
}

// Stripe integration types
export interface StripeCheckoutSession {
  id: string
  url: string
  paymentStatus: "pending" | "paid" | "failed"
  amount: number
  currency: string
}

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
  influencerHandle: string
}

export interface CheckoutData {
  items: CartItem[]
  customerInfo: {
    email: string
    name: string
    phone?: string
  }
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  influencerHandle: string
}
