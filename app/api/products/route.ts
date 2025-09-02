import { type NextRequest, NextResponse } from "next/server"

// Mock product data
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
  {
    id: "4",
    title: "Vintage Denim Jacket",
    description: "Classic vintage-style denim jacket with distressed details. Unisex fit suitable for all seasons.",
    price: 95,
    basePrice: 82.6,
    image: "/classic-denim-jacket.png",
    images: ["/classic-denim-jacket.png"],
    category: "Clothing",
    regions: ["Global"],
    stock: 0,
    status: "inactive",
    commission: 15,
    sales: 89,
    revenue: 8455,
    createdAt: "2023-12-20T08:30:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "5",
    title: "Handcrafted Ceramic Mug",
    description: "Beautiful handcrafted ceramic mug with unique glaze patterns. Microwave and dishwasher safe.",
    price: 28,
    basePrice: 23.7,
    image: "/ceramic-mug.png",
    images: ["/ceramic-mug.png"],
    category: "Home",
    regions: ["CN", "KR"],
    stock: 12,
    status: "active",
    commission: 18,
    sales: 45,
    revenue: 1260,
    createdAt: "2024-01-12T15:45:00Z",
    updatedAt: "2024-01-19T10:20:00Z",
  },
  {
    id: "6",
    title: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life.",
    price: 199,
    originalPrice: 249,
    basePrice: 163.1,
    image: "/wireless-earbuds.png",
    images: ["/wireless-earbuds.png"],
    category: "Electronics",
    regions: ["Global", "KR", "JP", "CN"],
    stock: 7,
    status: "active",
    commission: 22,
    sales: 156,
    revenue: 31044,
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-21T09:30:00Z",
  },
]

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "All"
    const status = searchParams.get("status") || "All"
    const regions = searchParams.get("regions")?.split(",") || ["All"]
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "updatedAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Filter products
    const filteredProducts = mockProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "All" || product.category === category
      const matchesStatus =
        status === "All" ||
        (status === "Active" && product.status === "active") ||
        (status === "Inactive" && product.status === "inactive") ||
        (status === "Low Stock" && product.stock <= 10 && product.status === "active")
      const matchesRegion = regions.includes("All") || regions.some((region) => product.regions.includes(region))

      return matchesSearch && matchesCategory && matchesStatus && matchesRegion
    })

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
          hasNext: endIndex < filteredProducts.length,
          hasPrev: page > 1,
        },
        filters: {
          search,
          category,
          status,
          regions,
          sortBy,
          sortOrder,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Create new product
    const newProduct = {
      id: (mockProducts.length + 1).toString(),
      ...body,
      price: body.basePrice * (1 + (body.commissionPct || 20) / 100),
      sales: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data (in real app, save to database)
    mockProducts.push(newProduct)

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
