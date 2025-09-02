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
  user?: User
}

export interface ApiError {
  message: string
  errors?: Record<string, string>
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  verified?: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  region: string[]
  inStock: boolean
  stockCount: number
  commission: number
  active: boolean
  supplierId: string
  createdAt: string
  updatedAt: string
  sku?: string
}

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  image: string
  influencerHandle: string
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  stripePaymentIntentId?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Shop {
  id: string
  influencerId: string
  handle: string
  name: string
  description?: string
  logo?: string
  banner?: string
  products: string[] // Product IDs
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Commission {
  id: string
  orderId: string
  influencerId: string
  supplierId: string
  productId: string
  amount: number
  rate: number
  status: 'pending' | 'paid' | 'disputed'
  createdAt: string
  paidAt?: string
}

// API Response types
export interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  message?: string
  errors?: Record<string, string>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// CSV Import/Export types
export interface ImportResult {
  inserted: number
  updated: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  sku?: string
  errors: Array<{
    field: string
    message: string
  }>
}

export interface ProductCSV {
  sku: string
  title: string
  description: string
  image_urls: string
  base_price: number
  commission_pct: number
  regions: string
  inventory: number
  active: boolean
}
