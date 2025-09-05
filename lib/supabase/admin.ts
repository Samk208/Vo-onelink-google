import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Admin client with service role key - bypasses RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use the simple client for admin operations - no cookies needed
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Re-export for consistency
export { supabaseAdmin as default }