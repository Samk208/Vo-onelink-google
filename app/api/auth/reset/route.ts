import { type NextRequest, NextResponse } from "next/server"
import type { AuthResponse } from "@/lib/types"

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

export async function POST(request: NextRequest) {
  try {
    await simulateNetworkDelay()

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please enter your email address",
          errors: {
            email: "Email is required",
          },
        } as AuthResponse,
        { status: 400 },
      )
    }

    if (Math.random() < 0.1) {
      return NextResponse.json({ ok: false, message: "Too many requests. Please try again later." } as AuthResponse, {
        status: 429,
      })
    }

    return NextResponse.json({
      ok: true,
      message: "If an account with this email exists, you will receive a password reset link shortly.",
    } as AuthResponse)
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." } as AuthResponse, {
      status: 500,
    })
  }
}
