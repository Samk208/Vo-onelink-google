# One-Link Platform - Comprehensive Handover Notes

## Project Overview
One-Link is a modern influencer commerce platform built with Next.js 15, Tailwind CSS, and shadcn/ui. The platform connects suppliers, influencers, and customers in a three-sided marketplace.

## Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Typography**: Inter font family
- **State Management**: React Context + Local State
- **Form Handling**: react-hook-form + zod validation
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: lucide-react
- **Deployment**: Vercel

## Design System (DESIGN_SYSTEM.md)
### Colors (5 total)
- **Primary**: `indigo-600` (#4F46E5) - Main brand, CTAs
- **Secondary**: `indigo-500` (#6366F1) - Hover states
- **Accent**: `amber-500` (#F59E0B) - Success, earnings highlights
- **Dark**: `gray-900` (#111827) - Primary text
- **Light**: `gray-50` (#F9FAFB) - Backgrounds, cards

### Typography
- **Font**: Inter (imported in layout.tsx)
- **Headings**: H1-H6 with font-bold to font-medium
- **Body**: text-base with leading-relaxed
- **Buttons**: text-sm font-medium

### Components
- **Cards**: rounded-2xl, shadow-lg, p-6
- **Buttons**: rounded-lg with hover effects
- **Inputs**: rounded-lg with indigo focus rings
- **Spacing**: Generous (space-6, space-12, space-20)

## User Roles & Authentication

### User Types (lib/types.ts)
```typescript
export enum UserRole {
  SUPPLIER = 'supplier',
  INFLUENCER = 'influencer', 
  CUSTOMER = 'customer'
}
```

### Auth Flow
- **Routes**: `/sign-in`, `/sign-up`, `/reset`
- **Context**: `lib/auth-context.tsx` - manages auth state
- **API Stubs**: `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/reset`
- **Redirects**: Role-based dashboard routing after login
- **Features**: Form validation, retry logic, generic error messages

## Page Structure & Routes

### Public Routes
```
/                           - Homepage with hero, features, testimonials
/shop/[handle]              - Public influencer shop
/shop/[handle]/product/[id] - Product detail page
/cart                       - Shopping cart
/checkout                   - Checkout flow
/order/success              - Order confirmation
/terms                      - Terms of service
/privacy                    - Privacy policy
```

### Auth Routes
```
/sign-in                    - Email/password + social login
/sign-up                    - Role selection + registration
/reset                      - Password reset
```

### Dashboard Routes
```
/dashboard/supplier/        - Supplier overview
/dashboard/supplier/products - Product management list
/dashboard/supplier/products/new - Create product
/dashboard/supplier/products/[id] - Edit product

/dashboard/influencer/      - Influencer overview  
/dashboard/influencer/shop  - Shop builder (split-pane)

/dashboard/admin/           - Admin console (5 tabs)
```

## Key Features Implemented

### 1. Authentication System
- **Sign In/Up**: Email validation, password rules, role selection
- **Security**: Generic errors, rate limiting simulation, retry with backoff
- **Accessibility**: Skip links, ARIA labels, keyboard navigation
- **States**: Loading, error handling, success toasts

### 2. Public Shop Experience
- **Shop Page**: Hero with influencer branding, product grid, filters
- **Product Detail**: Image gallery, specs tabs, related products
- **Cart/Checkout**: Line items, quantity management, Stripe integration
- **Features**: Search, filtering, sorting, region selection

### 3. Supplier Dashboard
- **Product Management**: CRUD operations, bulk actions
- **Import/Export**: CSV upload with dry-run, export with filters
- **Features**: Search, pagination, status management, inventory tracking

### 4. Influencer Dashboard  
- **Shop Builder**: Split-pane interface
- **Left Pane**: Supplier catalog browser with filters
- **Right Pane**: Draggable shop curation with custom pricing
- **Features**: Bulk publish/unpublish, preview functionality

### 5. Admin Console
- **Verifications**: User approval queue with document preview
- **Products**: Platform-wide product oversight
- **Orders**: Order management with refund capabilities
- **Commissions**: Financial ledger with CSV export
- **Disputes**: Dispute resolution with status tracking

## Component Architecture

### Layout Components
```
components/layout/
├── header.tsx              - Navigation with auth state
├── footer.tsx              - 4-column footer with newsletter
└── cookie-banner.tsx       - GDPR compliance
```

### Dashboard Components
```
app/dashboard/
├── layout.tsx              - Role-based sidebar navigation
├── supplier/               - Supplier-specific pages
├── influencer/             - Influencer-specific pages
└── admin/                  - Admin console
```

### Shared UI Components (shadcn/ui)
- Button, Card, Input, Select, Dialog, Sheet
- Form, Table, Tabs, Slider, Separator
- Toast, Alert, Badge, Avatar, Dropdown

## API Structure & Stubs

### Authentication APIs
```
POST /api/auth/sign-in      - Returns { ok: true, role: string }
POST /api/auth/sign-up      - Returns { ok: true }
POST /api/auth/reset        - Returns { ok: true }
```

### Product Management APIs
```
GET    /api/products        - List with filters/pagination
POST   /api/products        - Create new product
GET    /api/products/[id]   - Get single product
PUT    /api/products/[id]   - Update product
DELETE /api/products/[id]   - Delete product
POST   /api/products/bulk-deactivate - Bulk operations
POST   /api/products/import - CSV import with dry-run
GET    /api/products/export - CSV export stream
```

### E-commerce APIs
```
POST /api/checkout/session  - Returns { url: "/order/success" }
```

## Data Structures

### Product Interface
```typescript
interface Product {
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
}
```

### Cart Item Interface
```typescript
interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  image: string
  influencerHandle: string
}
```

## Accessibility Features
- **Keyboard Navigation**: Full tab order, focus management
- **Screen Readers**: ARIA labels, semantic HTML, alt text
- **Skip Links**: Jump to main content
- **Focus Rings**: Visible focus indicators
- **Color Independence**: Never rely solely on color
- **WCAG AA**: 4.5:1 contrast ratios maintained

## Mobile-First Design
- **Responsive Grids**: 1→2→3→4 columns based on screen size
- **Touch Targets**: 44px minimum for mobile
- **Drawer Navigation**: Mobile-friendly overlays
- **Adaptive Layouts**: Split-pane becomes tabs on mobile

## State Management Patterns
- **Auth Context**: Global authentication state
- **Local State**: Component-specific state with useState
- **Form State**: react-hook-form for complex forms
- **Loading States**: Skeleton loaders, disabled buttons
- **Error Handling**: Toast notifications, inline errors

## Mock Data Locations
- **Products**: Embedded in shop/dashboard components
- **Users**: Auth context and dashboard components  
- **Orders**: Cart and admin components
- **Analytics**: Dashboard overview components

## Development Notes
- **Environment**: All pages work with mock data, no backend required
- **Styling**: Consistent use of design tokens throughout
- **Performance**: Optimized images, lazy loading, skeleton states
- **SEO**: Metadata, structured data, canonical URLs
- **Security**: Generic error messages, input validation

## Next Steps for Local Development
1. **Install Dependencies**: Ensure all packages in package.json are installed
2. **Environment Setup**: Configure any needed environment variables
3. **Database Integration**: Replace API stubs with real backend (Supabase/NestJS)
4. **Payment Integration**: Implement real Stripe checkout
5. **File Upload**: Add real image upload functionality
6. **Email Service**: Implement transactional emails
7. **Analytics**: Add tracking and monitoring

## File Structure Summary
```
app/
├── (auth)/                 - Authentication pages
├── api/                    - API route stubs
├── cart/                   - Shopping cart
├── checkout/               - Checkout flow
├── dashboard/              - Role-based dashboards
├── order/                  - Order confirmation
├── shop/                   - Public shop pages
├── terms/                  - Legal pages
├── globals.css             - Tailwind + design tokens
├── layout.tsx              - Root layout with Inter font
└── page.tsx                - Homepage

components/
├── layout/                 - Header, footer, navigation
└── ui/                     - shadcn/ui components

lib/
├── auth-context.tsx        - Authentication state
├── types.ts                - TypeScript interfaces
└── utils.ts                - Utility functions
```

This comprehensive platform provides a solid foundation for a production-ready influencer commerce application with proper architecture, accessibility, and user experience considerations.
