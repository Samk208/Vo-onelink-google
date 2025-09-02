import { z } from 'zod'
import { UserRole } from './types'

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.nativeEnum(UserRole),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Product validation schemas
export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Category is required'),
  region: z.array(z.enum(['KR', 'JP', 'CN', 'GLOBAL'])).min(1, 'At least one region is required'),
  stockCount: z.number().int().min(0, 'Stock count must be non-negative'),
  commission: z.number().min(0).max(95, 'Commission must be between 0-95%'),
  sku: z.string().min(1).trim().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const productQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  active: z.string().transform((val) => val === 'true').optional(),
  inStock: z.string().transform((val) => val === 'true').optional(),
})

// CSV Import validation
export const productCSVSchema = z.object({
  sku: z.string().min(1).trim(),
  title: z.string().min(1).trim(),
  description: z.string().min(1),
  image_urls: z.string().optional(),
  base_price: z.number().min(0),
  commission_pct: z.number().min(0).max(95),
  regions: z.string().min(1),
  inventory: z.number().int().min(0),
  active: z.boolean(),
})

export const importRequestSchema = z.object({
  dryRun: z.boolean().default(true),
})

// Cart and Checkout validation
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  influencerHandle: z.string().min(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(99),
})

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  billingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
})

// Shop validation
export const createShopSchema = z.object({
  handle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .max(30, 'Handle must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, hyphens, and underscores'),
  name: z.string().min(1, 'Shop name is required'),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
})

export const updateShopSchema = createShopSchema.partial()

export const addProductToShopSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1),
})

// Admin validation
export const verifyUserSchema = z.object({
  userId: z.string().uuid(),
  verified: z.boolean(),
  notes: z.string().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional(),
})

// Pagination helpers
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('20'),
})

// Common ID validation
export const uuidSchema = z.string().uuid('Invalid ID format')

// File upload validation
export const uploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
})
