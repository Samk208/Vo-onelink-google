import { type NextRequest, NextResponse } from "next/server"
import { UserRole, type AuthResponse } from "@/lib/types"

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

export async function POST(request: NextRequest) {
  try {
    await simulateNetworkDelay()

    const body = await request.json()
    const { email, password, role, firstName, lastName } = body

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please fill in all required fields",
          errors: {
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
            role: !role ? "Please select your role" : undefined,
            firstName: !firstName ? "First name is required" : undefined,
            lastName: !lastName ? "Last name is required" : undefined,
          },
        } as AuthResponse,
        { status: 400 },
      )
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please select a valid role",
          errors: { role: "Invalid role selected" },
        } as AuthResponse,
        { status: 400 },
      )
    }

    if (Math.random() < 0.1) {
      return NextResponse.json({ ok: false, message: "Too many requests. Please try again later." } as AuthResponse, {
        status: 429,
      })
    }

    if (email === "taken@example.com") {
      return NextResponse.json(
        {
          ok: false,
          message: "Unable to create account. Please try a different email address.",
          errors: { email: "This email cannot be used" },
        } as AuthResponse,
        { status: 409 },
      )
    }

    return NextResponse.json({
      ok: true,
      role: role as UserRole,
      user: {
        id: "1",
        email,
        name: `${firstName} ${lastName}`,
        role: role as UserRole,
      },
    } as AuthResponse)
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." } as AuthResponse, {
      status: 500,
    })
  }
}
