import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, fileName, fileSize, fileType } = body

    // Simulate document metadata creation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate mock upload ID
    const uploadId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      uploadId,
      message: "Document metadata created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create document metadata" }, { status: 500 })
  }
}
