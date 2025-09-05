import { createServerClient } from '@supabase/ssr'
import { Database } from './types'
import type { NextRequest } from 'next/server'

// For Pages Router - create server client with request context
export function createServerSupabaseClient(request?: NextRequest) {
  // If we have a request, use its cookies
  if (request) {
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(cookie => ({
              name: cookie.name,
              value: cookie.value
            }))
          },
          setAll() {
            // No-op for server-side operations in Pages Router
          },
        },
      }
    )
  }

  // Fallback for when no request context is available
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Return empty array when no request context
          return []
        },
        setAll() {
          // No-op for server-side operations
        },
      },
    }
  )
}

// Re-export for consistency
export { createServerSupabaseClient as default }