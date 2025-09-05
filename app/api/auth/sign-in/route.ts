export const runtime = 'nodejs'

import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from "next/headers"
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signInSchema } from '@/lib/validators'
import { createAuthErrorResponse, createAuthSuccessResponse } from '@/lib/auth-helpers'
import { type AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('Sign-in attempt started')
    const cookieStore = cookies()
    const supabase = await createServerSupabaseClient()

    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error('Failed to parse request body:', e)
      return NextResponse.json(
        createAuthErrorResponse('Invalid request body'),
        { status: 400 }
      )
    }

    console.log('Sign-in request for email:', body.email)

    // Validate input
    const validation = signInSchema.safeParse(body)
    if (!validation.success) {
      console.error('Validation failed:', validation.error.flatten())
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message
      })

      return NextResponse.json(
        createAuthErrorResponse('Please check your input and try again.', errors),
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Attempt to sign in with Supabase
    console.log('Attempting Supabase auth sign-in...')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        createAuthErrorResponse('Invalid email or password. Please check your credentials and try again.'),
        { status: 401 }
      )
    }

    console.log('Supabase auth successful, fetching user profile...')
    // Get user profile from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      console.error('User profile lookup error:', userError)
      return NextResponse.json(
        createAuthErrorResponse('User profile not found. Please contact support.'),
        { status: 404 }
      )
    }

    if (!user) {
      console.error('No user profile found for email:', email)
      return NextResponse.json(
        createAuthErrorResponse('User profile not found. Please contact support.'),
        { status: 404 }
      )
    }

    console.log('Sign-in successful for user:', user.id)
    return NextResponse.json(createAuthSuccessResponse(user))
  } catch (error) {
    console.error('Unexpected sign-in error:', error)
    return NextResponse.json(
      createAuthErrorResponse('Something went wrong. Please try again.'),
      { status: 500 }
    )
  }
}
