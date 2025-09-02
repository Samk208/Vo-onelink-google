import { createServerSupabaseClient, supabaseAdmin } from './supabase'
import { UserRole, type User, type AuthResponse } from './types'
import { NextRequest } from 'next/server'

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Verify user role
export function hasRole(user: User | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false
  return allowedRoles.includes(user.role)
}

// Create user profile in database
export async function createUserProfile(
  userId: string,
  email: string,
  name: string,
  role: UserRole
): Promise<User | null> {
  try {
    console.log('Creating user profile with:', { userId, email, name, role })
    
    // Use supabaseAdmin to bypass RLS for user creation
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId, // Explicitly set the ID to match the auth user ID
        email,
        name,
        role,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      return null
    }

    console.log('User profile created successfully:', user)
    return user
  } catch (error) {
    console.error('Unexpected error creating user profile:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'avatar' | 'verified'>>
): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

// Generate error response
export function createAuthErrorResponse(
  message: string,
  errors?: Record<string, string>
): AuthResponse {
  return {
    ok: false,
    message,
    errors,
  }
}

// Generate success response
export function createAuthSuccessResponse(
  user: User,
  message?: string
): AuthResponse {
  return {
    ok: true,
    role: user.role,
    user,
    message,
  }
}

// Check if user is verified (for actions requiring verification)
export function requiresVerification(role: UserRole): boolean {
  return ['supplier', 'influencer'].includes(role)
}

// Get user by email
export async function getUserByEmail(email: string): Promise<{ data: User | null; error?: any }> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      return { data: null, error }
    }

    return { data: user, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
