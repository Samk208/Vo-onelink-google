import { type NextRequest, NextResponse } from "next/server"
import { UserRole, type AuthResponse } from "@/lib/types"

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

export async function POST(request: NextRequest) {
  try {
    await simulateNetworkDelay()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please fill in all required fields",
          errors: {
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
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

    if (email === "invalid@example.com" || password === "wrongpassword") {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid email or password. Please check your credentials and try again.",
        } as AuthResponse,
        { status: 401 },
      )
    }

    let role: UserRole = UserRole.CUSTOMER
    if (email.includes("supplier")) role = UserRole.SUPPLIER
    else if (email.includes("influencer")) role = UserRole.INFLUENCER

    return NextResponse.json({
      ok: true,
      role,
      user: {
        id: "1",
        email,
        name: email.split("@")[0],
        role,
      },
    } as AuthResponse)
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." } as AuthResponse, {
      status: 500,
    })
  }
}
