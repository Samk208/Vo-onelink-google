// Product-related types
export interface Product {
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
  description?: string
  images?: string[]
  supplier?: {
    name: string
    verified: boolean
    rating: number
  }
  specifications?: Record<string, string>
  shipping?: {
    freeShipping: boolean
    estimatedDays: string
    returns: string
    warranty: string
  }
}

// Cart-related types
export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

// Influencer-related types
export interface SocialLinks {
  instagram?: string
  twitter?: string
  youtube?: string
  facebook?: string
  tiktok?: string
}

export interface Influencer {
  handle: string
  name: string
  bio: string
  avatar: string
  banner: string
  followers: string
  verified: boolean
  socialLinks: SocialLinks
}

// Filter and sort types
export interface SortOption {
  value: string
  label: string
}

export interface FilterState {
  category: string
  regions: string[]
  priceRange: [number, number]
  inStockOnly: boolean
}

// Shop state types
export interface ShopState {
  searchQuery: string
  filters: FilterState
  sortBy: string
  viewMode: "grid" | "list"
  cart: CartItem[]
  wishlistedProducts: string[]
}

// Component prop types
export interface ProductCardProps {
  product: Product
  influencerHandle: string
  onAddToCart: (product: Product) => void
  onAddToWishlist?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}

export interface ProductGridProps {
  products: Product[]
  influencerHandle: string
  isLoading?: boolean
  viewMode?: "grid" | "list"
  onAddToCart: (product: Product) => void
  onAddToWishlist?: (productId: string) => void
  wishlistedProducts?: string[]
  className?: string
}

export interface ShopToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  productCount: number
  sortOptions: SortOption[]
  onOpenFilters: () => void
  className?: string
}

export interface ShopFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  regions: string[]
  selectedRegions: string[]
  onRegionChange: (regions: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  inStockOnly: boolean
  onInStockChange: (checked: boolean) => void
  onResetFilters: () => void
  className?: string
}

export interface CartDrawerProps {
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

export interface InfluencerHeroProps {
  influencer: Influencer
  onShare?: () => void
  onFollow?: () => void
  isFollowing?: boolean
  className?: string
}

export interface TrustStripProps {
  influencerHandle: string
  className?: string
}

export interface ProductSkeletonProps {
  viewMode?: "grid" | "list"
  className?: string
}

export interface ShopSetupProps {
  profile: InfluencerProfile
  onSave: (profile: Partial<InfluencerProfile>) => Promise<void>
  className?: string
}

export interface StripeCheckoutProps {
  cart: CartItem[]
  influencerHandle: string
  onSuccess: (sessionId: string) => void
  onCancel: () => void
  className?: string
}
