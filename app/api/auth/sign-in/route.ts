import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { signInSchema } from "@/lib/validators"
import { createAuthErrorResponse, createAuthSuccessResponse, getUserByEmail } from "@/lib/auth-helpers"
import { type AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signInSchema.safeParse(body)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })
      
      return NextResponse.json(
        createAuthErrorResponse("Please check your input and try again.", errors),
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const supabase = createServerSupabaseClient()

    // Attempt to sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Generic error message for security
      return NextResponse.json(
        createAuthErrorResponse("Invalid email or password. Please check your credentials and try again."),
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        createAuthErrorResponse("Authentication failed. Please try again."),
        { status: 401 }
      )
    }

    // Get user profile from database
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        createAuthErrorResponse("User profile not found. Please contact support."),
        { status: 404 }
      )
    }

    return NextResponse.json(createAuthSuccessResponse(user))
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json(
      createAuthErrorResponse("Something went wrong. Please try again."),
      { status: 500 }
    )
  }
}
