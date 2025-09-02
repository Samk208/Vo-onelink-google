"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { UserRole } from "./types"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to create a Supabase client
const createSupabaseClient = () => createClientComponentClient()

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase: SupabaseClient = createSupabaseClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(true)
      if (event === "SIGNED_IN" && session) {
        const currentUser = session.user
        const role = (currentUser.user_metadata?.role as UserRole) || UserRole.CUSTOMER
        const profile: User = {
          id: currentUser.id,
          email: currentUser.email!,
          role,
          name: currentUser.user_metadata?.name || currentUser.email!.split("@")[0],
          avatar: currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`,
        }
        setUser(profile)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setIsLoading(false)
    })

    // Initial session check
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        const currentUser = data.session.user
        const role = (currentUser.user_metadata?.role as UserRole) || UserRole.CUSTOMER
        const profile: User = {
          id: currentUser.id,
          email: currentUser.email!,
          role,
          name: currentUser.user_metadata?.name || currentUser.email!.split("@")[0],
          avatar: currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`,
        }
        setUser(profile)
      }
      setIsLoading(false)
    }

    checkSession()

    return () => {
      authListener?.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      const role = (data.user.user_metadata?.role as UserRole) || UserRole.CUSTOMER
      const profile: User = {
        id: data.user.id,
        email: data.user.email!,
        role,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
      }
      return { success: true, user: profile }
    }

    return { success: false, error: "An unknown error occurred." }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
