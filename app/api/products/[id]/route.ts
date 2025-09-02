import { type NextRequest, NextResponse } from "next/server"

// Mock product data (same as in route.ts)
const mockProducts = [
  {
    id: "1",
    title: "Sustainable Cotton Tee",
    description:
      "Made from 100% organic cotton, this comfortable tee is perfect for everyday wear. Features a relaxed fit and comes in multiple colors.",
    price: 45,
    originalPrice: 60,
    basePrice: 37.5,
    image: "/cotton-tee.png",
    images: ["/cotton-tee.png", "/cotton-tee-back.png", "/cotton-tee-detail.png"],
    category: "Clothing",
    regions: ["Global", "KR", "JP"],
    stock: 15,
    status: "active",
    commission: 20,
    sales: 124,
    revenue: 5580,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Minimalist Gold Necklace",
    description: "Elegant 14k gold-plated necklace with a minimalist design. Perfect for layering or wearing alone.",
    price: 89,
    basePrice: 71.2,
    image: "/gold-necklace.png",
    images: ["/gold-necklace.png"],
    category: "Jewelry",
    regions: ["KR"],
    stock: 3,
    status: "active",
    commission: 25,
    sales: 67,
    revenue: 5963,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "3",
    title: "Organic Skincare Set",
    description:
      "Complete skincare routine with organic ingredients. Includes cleanser, toner, serum, and moisturizer.",
    price: 120,
    originalPrice: 150,
    basePrice: 92.3,
    image: "/skincare-set.png",
    images: ["/skincare-set.png"],
    category: "Beauty",
    regions: ["JP", "Global"],
    stock: 8,
    status: "active",
    commission: 30,
    sales: 203,
    revenue: 24360,
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-22T13:10:00Z",
  },
]

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const product = mockProducts.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Find existing product
    const productIndex = mockProducts.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Validate required fields
    const requiredFields = ["title", "description", "category", "basePrice", "inventory", "regions", "images"]
    const missingFields = requiredFields.filter(
      (field) => !body[field] || (Array.isArray(body[field]) && body[field].length === 0),
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: missingFields.reduce(
            (acc, field) => {
              acc[field] = `${field} is required`
              return acc
            },
            {} as Record<string, string>,
          ),
        },
        { status: 400 },
      )
    }

    // Validate data types and ranges
    const errors: Record<string, string> = {}

    if (typeof body.basePrice !== "number" || body.basePrice <= 0) {
      errors.basePrice = "Base price must be a positive number"
    }

    if (typeof body.inventory !== "number" || body.inventory < 0) {
      errors.inventory = "Inventory must be a non-negative number"
    }

    if (typeof body.commissionPct !== "number" || body.commissionPct < 0 || body.commissionPct > 95) {
      errors.commissionPct = "Commission percentage must be between 0 and 95"
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, error: "Validation failed", details: errors }, { status: 400 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Update product
    const existingProduct = mockProducts[productIndex]
    const updatedProduct = {
      ...existingProduct,
      ...body,
      price: body.basePrice * (1 + (body.commissionPct || existingProduct.commission) / 100),
      updatedAt: new Date().toISOString(),
    }

    mockProducts[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Find product
    const productIndex = mockProducts.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Remove product (in real app, soft delete or archive)
    const deletedProduct = mockProducts.splice(productIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
