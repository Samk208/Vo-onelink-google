import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id

    // Simulate document review process
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock review status - randomly assign status for demo
    const statuses = ["submitted", "verified", "rejected"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    const rejectionReasons = [
      "Document image is too blurry or unclear",
      "Document appears to be expired",
      "Document type not accepted",
      "Information does not match profile details",
    ]

    const response = {
      uploadId,
      status: randomStatus,
      reviewedAt: new Date().toISOString(),
      ...(randomStatus === "rejected" && {
        rejectionReason: rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)],
      }),
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get document status" }, { status: 500 })
  }
}
