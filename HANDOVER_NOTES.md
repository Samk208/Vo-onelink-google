# One-Link Platform - Comprehensive Handover Notes
**Last Updated:** September 2, 2025

## Project Overview
One-Link is a modern influencer commerce platform built with Next.js 15, Tailwind CSS, and shadcn/ui. The platform connects suppliers, influencers, and customers in a three-sided marketplace with a comprehensive commission system.

## Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase with Row Level Security (RLS)
- **Authentication**: Supabase Auth with role-based access control
- **Payment Processing**: Stripe integration with webhook handling
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Typography**: Inter font family
- **State Management**: React Context + Local State
- **Form Handling**: react-hook-form + zod validation
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: lucide-react
- **Testing**: Playwright for end-to-end testing
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
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}
```

### Auth Flow
- **Routes**: `/sign-in`, `/sign-up`, `/reset`
- **Context**: `lib/auth-context.tsx` - manages auth state
- **API Routes**: `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/reset`
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

## 💰 **COMMISSION SYSTEM** (Implemented September 2, 2025)

### **Commission Architecture**
The platform features a comprehensive dual-commission system that tracks earnings for both suppliers and influencers on every order placement.

#### **Commission Flow**
1. **Customer Places Order** → Stripe checkout session created
2. **Stripe Webhook Processes Payment** → Order created in database
3. **System Checks Product Source** → Determines if purchased through influencer shop
4. **Dual Commission Logging**:
   - **Supplier Commission**: `(sale price × commission %) → supplier earnings`
   - **Influencer Commission**: `(sale price - base price) × quantity → influencer earnings`
5. **Dashboard Updates** → Real-time earnings reflected in dashboards
6. **Admin Management** → Payout processing and dispute handling

#### **Commission Calculation Logic**
```typescript
// Supplier Commission (from product commission percentage)
const supplierCommission = salePrice * (product.commission / 100);
const supplierNetRevenue = salePrice - supplierCommission;

// Influencer Commission (markup between sale price and base price)
const influencerCommission = (salePrice - product.basePrice) * quantity;
```

### **API Endpoints**

#### **Commission Management APIs**
```
GET    /api/commissions           - List commissions with role-based filtering
POST   /api/commissions           - Create commission record (admin only)
GET    /api/commissions/[id]      - Get specific commission details
PUT    /api/commissions/[id]      - Update commission status/payout (admin only)
PATCH  /api/commissions/[id]      - Partial commission updates (admin only)
```

#### **Admin Dashboard API**
```
GET    /api/dashboard/admin       - Comprehensive commission analytics
```

**Returns:**
- Total influencer rewards paid, pending commissions, disputed commissions
- Total orders, revenue, active users, product counts
- Recent commission transactions with user/product details
- Top earning influencers and suppliers with earnings breakdown
- Commission trends for last 30 days with daily breakdown
- Disputed commissions with reasons and resolution status

#### **Enhanced Stripe Webhook**
```
POST   /api/webhooks/stripe       - Enhanced with dual commission logging
```

**Features:**
- Processes `checkout.session.completed` events
- Creates order records with line items
- Updates product stock counts
- Logs supplier commissions automatically
- Detects influencer shop purchases
- Logs influencer commissions for markup earnings
- Comprehensive error handling and logging

### **Database Schema**

#### **Commissions Table**
```sql
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  influencer_id UUID REFERENCES auth.users(id),
  supplier_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  amount DECIMAL(10,2) NOT NULL,
  rate DECIMAL(5,2),
  status TEXT DEFAULT 'pending',
  dispute_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Role-Based Access Control**

#### **Commission API Access**
- **Admins**: Full access to all commissions, can create/update/manage payouts
- **Influencers**: Can view only their own commission earnings
- **Suppliers**: Can view only their own commission earnings
- **Customers**: No access to commission data

#### **Dashboard Analytics**
- **Admin Dashboard**: Complete platform analytics, top earners, dispute management
- **Influencer Dashboard**: Personal earnings, commission history, payout status
- **Supplier Dashboard**: Product commissions, net revenue, performance metrics

### **Testing Coverage**

#### **Playwright Test Suite** (`tests/commission-system.spec.ts`)
**519 lines of comprehensive testing covering:**

- **Full Commission Flow**: Order placement → commission logging → dashboard updates
- **Admin Commission Management**: Payout status updates, dispute handling
- **API Endpoint Testing**: All CRUD operations with proper validation
- **Role-Based Access**: Ensures proper security restrictions
- **Edge Cases**: 0% and 95% commission rates, maximum values
- **Dashboard Integration**: Verifies real-time updates across all dashboards
- **Error Handling**: Invalid requests, unauthorized access attempts

#### **Test Scenarios**
1. Complete order-to-commission flow verification
2. Influencer shop purchase commission calculation
3. Supplier commission rate validation
4. Admin dashboard data accuracy
5. Commission payout status management
6. Dispute creation and resolution
7. API security and validation testing

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
- **Commission Tracking**: Real-time earnings, net revenue calculations
- **Features**: Search, pagination, status management, inventory tracking

### 4. Influencer Dashboard  
- **Shop Builder**: Split-pane interface
- **Left Pane**: Supplier catalog browser with filters
- **Right Pane**: Draggable shop curation with custom pricing
- **Commission Earnings**: Real-time tracking of markup earnings
- **Features**: Bulk publish/unpublish, preview functionality

### 5. Admin Console
- **Verifications**: User approval queue with document preview
- **Products**: Platform-wide product oversight
- **Orders**: Order management with refund capabilities
- **Commissions**: Comprehensive financial ledger with analytics
- **Disputes**: Commission dispute resolution with status tracking

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

## API Structure

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
POST /api/checkout/session  - Create Stripe checkout session
POST /api/webhooks/stripe   - Process payment webhooks with commission logging
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

### Commission Interface
```typescript
interface Commission {
  id: string
  orderId: string
  influencerId?: string
  supplierId?: string
  productId: string
  amount: number
  rate?: number
  status: 'pending' | 'paid' | 'disputed'
  disputeReason?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
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

## Security Features
- **Role-Based Access Control**: Suppliers, Influencers, Customers, Admins
- **Row Level Security**: Database-level access control with Supabase RLS
- **Input Validation**: Comprehensive Zod schema validation
- **Audit Logging**: Complete tracking of all commission transactions
- **Secure API Routes**: Proper authentication and authorization checks

## Development Status

### ✅ **Production Ready Features**
- Complete authentication system with Supabase
- Full product CRUD with role-based access
- Stripe checkout integration with webhook processing
- Comprehensive commission system with dual logging
- Admin dashboard with complete analytics
- End-to-end testing with Playwright
- Database schema with proper migrations
- Security implementation with RLS policies

### **Environment Configuration**
```env
# Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## File Structure Summary
```
app/
├── (auth)/                 - Authentication pages
├── api/                    - Complete API implementation
│   ├── auth/              - Authentication endpoints
│   ├── products/          - Product management
│   ├── commissions/       - Commission CRUD operations
│   ├── dashboard/         - Dashboard analytics
│   └── webhooks/          - Stripe webhook processing
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
├── dashboard/              - Dashboard-specific components
└── ui/                     - shadcn/ui components

lib/
├── auth-context.tsx        - Authentication state
├── supabase.ts            - Supabase client configuration
├── types.ts               - TypeScript interfaces
└── utils.ts               - Utility functions

tests/
├── commission-system.spec.ts - Comprehensive commission testing
└── supplier-commission.spec.ts - Supplier-specific tests

supabase/
├── migrations/            - Database schema migrations
└── config.toml           - Supabase configuration
```

## Recent Updates (September 2, 2025)

### **Commission System Implementation**
- ✅ Enhanced Stripe webhook with dual commission logging
- ✅ Complete `/api/commissions` CRUD endpoints
- ✅ Admin dashboard analytics with comprehensive metrics
- ✅ Role-based commission access control
- ✅ Comprehensive Playwright test suite (519 lines)
- ✅ Real-time commission tracking across all dashboards

### **Files Created/Modified Today**
- `app/api/commissions/route.ts` - Commission CRUD endpoints (276 lines)
- `app/api/commissions/[id]/route.ts` - Individual commission management (208 lines)
- `app/api/webhooks/stripe/route.ts` - Enhanced webhook processing (173 lines)
- `app/api/dashboard/admin/route.ts` - Admin analytics dashboard (315 lines)
- `tests/commission-system.spec.ts` - Complete test coverage (519 lines)

### **Commission Analytics Available**
- Total influencer rewards paid and pending
- Commission dispute tracking and resolution
- Top earning influencers and suppliers
- 30-day commission trends with daily breakdown
- Real-time commission status updates
- Comprehensive audit logging

This comprehensive platform now provides a complete production-ready influencer commerce application with full commission tracking, payment processing, and administrative oversight capabilities.
