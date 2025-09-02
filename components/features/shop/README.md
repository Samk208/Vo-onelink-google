# Shop Components

This directory contains reusable UI components for the influencer shop functionality, built with the Indigo/Amber design system and following mobile-first, accessible design principles.

## Components

### ProductCard
A responsive product card component that displays product information, images, badges, and actions.

**Features:**
- Responsive image with loading states
- Dynamic badge colors based on badge type
- Wishlist functionality (optional)
- Stock warnings and out-of-stock states
- Accessible button labels and focus states

**Props:**
```typescript
interface ProductCardProps {
  product: Product
  influencerHandle: string
  onAddToCart: (product: Product) => void
  onAddToWishlist?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}
```

### ProductGrid
A responsive grid layout for displaying multiple products with loading states and empty states.

**Features:**
- Responsive grid (1→2→3 columns)
- Loading skeleton states
- Empty state handling
- Support for grid and list view modes

**Props:**
```typescript
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
```

### ProductSkeleton
Loading skeleton component for products with support for both grid and list view modes.

**Features:**
- Animated skeleton loading effect
- Responsive layout support
- Customizable styling

### ShopToolbar
Toolbar component with search, sorting, filtering, and view mode controls.

**Features:**
- Search input with icon
- Sort dropdown
- View mode toggle (grid/list)
- Mobile filter button
- Product count display

**Props:**
```typescript
interface ShopToolbarProps {
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
```

### ShopFilters
Sidebar filter component with categories, price range, regions, and stock filters.

**Features:**
- Category selection
- Price range slider
- Region checkboxes
- Stock status filter
- Active filters summary
- Reset filters functionality

**Props:**
```typescript
interface ShopFiltersProps {
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
```

### CartDrawer
Shopping cart drawer component with product management and checkout functionality.

**Features:**
- Product list with images and details
- Quantity controls
- Remove item functionality
- Cart summary and total
- Checkout button with loading state
- Trust indicators

**Props:**
```typescript
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
```

### InfluencerHero
Hero section component displaying influencer information, banner, and social links.

**Features:**
- Banner image with overlay
- Avatar with verification badge
- Bio and follower count
- Social media links
- Action buttons (share, follow)

**Props:**
```typescript
interface InfluencerHeroProps {
  influencer: Influencer
  onShare?: () => void
  onFollow?: () => void
  isFollowing?: boolean
  className?: string
}
```

### TrustStrip
Trust indicators strip displaying benefits and guarantees.

**Features:**
- Multiple trust indicators
- Icon-based design
- Responsive layout
- Customizable content

## Design System

All components follow the One-Link design system:

- **Colors**: Primary indigo (#4F46E5), accent amber (#F59E0B)
- **Typography**: Inter font family with consistent hierarchy
- **Spacing**: Generous spacing using Tailwind's spacing scale
- **Shadows**: Soft, elevated shadows for depth
- **Border Radius**: Rounded corners (rounded-lg, rounded-2xl)
- **Transitions**: Smooth hover and focus transitions

## Accessibility

Components are built with accessibility in mind:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- WCAG AA compliance
- Color-independent information

## Usage

```typescript
import { ProductCard, ProductGrid, ShopToolbar } from "@/components/features/shop"

// Basic usage
<ProductCard
  product={product}
  influencerHandle="sarah_style"
  onAddToCart={handleAddToCart}
/>

// With all features
<ProductGrid
  products={products}
  influencerHandle="sarah_style"
  isLoading={false}
  viewMode="grid"
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleWishlist}
  wishlistedProducts={wishlistedIds}
/>
```

## Responsive Behavior

- **Mobile-first**: Components start with mobile layouts
- **Breakpoints**: Responsive at sm, md, lg breakpoints
- **Touch-friendly**: Minimum 44px touch targets
- **Flexible layouts**: Adapt to different screen sizes

## Performance

- Lazy loading for images
- Optimized re-renders
- Efficient state management
- Minimal bundle impact
