import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/shop',
    '/terms',
    '/privacy',
    '/sign-in',
    '/sign-up',
    '/reset',
  ]

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/sign-in',
    '/api/auth/sign-up',
    '/api/auth/reset',
    '/api/products', // Public product listing
  ]

  const { pathname } = req.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return res
  }

  // Allow public API routes
  if (publicApiRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return res
  }

  // Redirect to sign-in if no session
  if (!session) {
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Get user role from database
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user) {
    // User not found in database, redirect to sign-up
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  // Role-based access control
  const userRole = user.role

  // Dashboard route protection
  if (pathname.startsWith('/dashboard/')) {
    const dashboardRole = pathname.split('/')[2] // supplier, influencer, admin
    
    // Check if user can access this dashboard
    if (userRole !== dashboardRole && userRole !== 'admin') {
      // Redirect to appropriate dashboard
      const redirectPath = userRole === 'customer' ? '/' : `/dashboard/${userRole}`
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
  }

  // API route protection
  if (pathname.startsWith('/api/')) {
    // Admin-only API routes
    if (pathname.startsWith('/api/admin/') && userRole !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Supplier-only API routes
    if (pathname.startsWith('/api/products/') && 
        !['supplier', 'admin'].includes(userRole) &&
        !['GET'].includes(req.method || '')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Influencer-only API routes
    if (pathname.startsWith('/api/shops/') && 
        !['influencer', 'admin'].includes(userRole) &&
        !['GET'].includes(req.method || '')) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
