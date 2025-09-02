import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock CSV data based on the product structure
    const csvData = `id,title,description,price,original_price,category,regions,stock,status,commission_pct,sales,revenue,created_at,updated_at
1,"Sustainable Cotton Tee","Eco-friendly cotton t-shirt made from organic materials",45,60,"Clothing","Global;KR;JP",15,"active",20,124,5580,"2024-01-15","2024-01-20"
2,"Minimalist Gold Necklace","Elegant 14k gold plated necklace with minimalist design",89,,"Jewelry","KR",3,"active",25,67,5963,"2024-01-10","2024-01-18"
3,"Organic Skincare Set","Complete skincare routine with natural ingredients",120,150,"Beauty","JP;Global",8,"active",30,203,24360,"2024-01-05","2024-01-22"
4,"Vintage Denim Jacket","Classic denim jacket with vintage wash",95,,"Clothing","Global",0,"inactive",15,89,8455,"2023-12-20","2024-01-15"
5,"Handcrafted Ceramic Mug","Artisan-made ceramic mug with unique glaze",28,,"Home","CN;KR",12,"active",18,45,1260,"2024-01-12","2024-01-19"
6,"Wireless Earbuds Pro","Premium wireless earbuds with noise cancellation",199,249,"Electronics","Global;KR;JP;CN",7,"active",22,156,31044,"2024-01-08","2024-01-21"`

    // Set headers for CSV download
    const headers = new Headers()
    headers.set("Content-Type", "text/csv")
    headers.set(
      "Content-Disposition",
      `attachment; filename="products-export-${new Date().toISOString().split("T")[0]}.csv"`,
    )
    headers.set("Cache-Control", "no-cache")

    return new NextResponse(csvData, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export products" }, { status: 500 })
  }
}
