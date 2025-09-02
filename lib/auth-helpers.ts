import { createServerSupabaseClient, supabaseAdmin } from './supabase'
import { UserRole, type User, type AuthResponse } from './types'
import { NextRequest } from 'next/server'

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    const supabase = createServerSupabaseClient()
    
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

// Create user in database after Supabase auth
export async function createUserProfile(
  userId: string,
  email: string,
  name: string,
  role: UserRole
): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
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

    return user
  } catch (error) {
    console.error('Error creating user profile:', error)
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
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    return user
  } catch (error) {
    return null
  }
}
