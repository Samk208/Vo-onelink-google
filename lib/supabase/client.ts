import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

// Client-side Supabase client - ONLY use this in client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Regular client for browser operations (Row Level Security enabled)
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

// Re-export the client creation function for consistency
export function createClientSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Re-export for consistency
export { supabase as default }