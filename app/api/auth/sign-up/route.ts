import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, supabaseAdmin } from "@/lib/supabase"
import { signUpSchema } from "@/lib/validators"
import { createAuthErrorResponse, createAuthSuccessResponse, createUserProfile } from "@/lib/auth-helpers"
import { type AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signUpSchema.safeParse(body)
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

    const { email, password, name, role } = validation.data
    const supabase = createServerSupabaseClient()

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        createAuthErrorResponse(
          "Unable to create account. Please try a different email address.",
          { email: "This email cannot be used" }
        ),
        { status: 409 }
      )
    }

    // Create auth user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          createAuthErrorResponse(
            "Unable to create account. Please try a different email address.",
            { email: "This email cannot be used" }
          ),
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        createAuthErrorResponse("Unable to create account. Please try again."),
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        createAuthErrorResponse("Account creation failed. Please try again."),
        { status: 400 }
      )
    }

    // Create user profile in database
    const user = await createUserProfile(authData.user.id, email, name, role)
    if (!user) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        createAuthErrorResponse("Account creation failed. Please try again."),
        { status: 500 }
      )
    }

    return NextResponse.json(
      createAuthSuccessResponse(user, "Account created successfully! Please check your email to verify your account.")
    )
  } catch (error) {
    console.error('Sign-up error:', error)
    return NextResponse.json(
      createAuthErrorResponse("Something went wrong. Please try again."),
      { status: 500 }
    )
  }
}
