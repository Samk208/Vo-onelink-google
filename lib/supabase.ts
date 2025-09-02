import { createClient } from '@supabase/supabase-js'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore })
}

// Service role client (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Middleware helper for auth
export const createMiddlewareSupabaseClient = (req: NextRequest) => {
  let res = NextResponse.next({ request: { headers: req.headers } })

  return {
    supabase: createRouteHandlerClient({
      cookies: () => req.cookies
    }),
    response: res,
  }
}
