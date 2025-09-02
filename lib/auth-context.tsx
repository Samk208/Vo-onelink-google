"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole } from "./types"

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
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("onelink-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("onelink-user")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.ok) {
        const newUser: User = {
          id: "mock-user-id",
          email,
          role: data.role,
          name: email.split("@")[0],
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        }
        setUser(newUser)
        localStorage.setItem("onelink-user", JSON.stringify(newUser))
        return { success: true, user: newUser }
      } else {
        return { success: false, error: data.error || "Sign in failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("onelink-user")
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
