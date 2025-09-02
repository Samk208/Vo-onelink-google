"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { UserRole, type UserProfile } from "./types"

// Helper to create a Supabase client
const createSupabaseClient = () => createClientComponentClient()

const supabase = createSupabaseClient()

interface AuthUser extends User {
  role?: UserRole
  profile?: UserProfile
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true)
      if (event === "SIGNED_IN" && session) {
        await fetchUserProfile(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsLoading(false)
      }
    })

    // Initial session check
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        await fetchUserProfile(data.session.user)
      }
      setIsLoading(false)
    }

    checkSession()

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setUser({ ...authUser, role: UserRole.CUSTOMER })
      } else {
        setUser({
          ...authUser,
          role: profile.role as UserRole,
          profile
        })
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setUser({ ...authUser, role: UserRole.CUSTOMER })
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      await fetchUserProfile(data.user)
      return { success: true, user: user || undefined }
    }

    return { success: false, error: "An unknown error occurred." }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
