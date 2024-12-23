import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Type for user roles
type UserRole = 'admin' | 'user'

// Paths that require authentication
const PROTECTED_PATHS = ['/admin', '/library', '/milestones', '/notification', '/settings', '/statistics']

// Function to check if path is protected
const isProtectedPath = (pathname: string): boolean => {
    return PROTECTED_PATHS.some(path => pathname.startsWith(path))
}

export async function middleware(req: NextRequest) {
    try {
        const res = NextResponse.next()
        const supabase = createMiddlewareClient({ req, res })
        const pathname = req.nextUrl.pathname

        // Get user session
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
            console.error('Session error:', sessionError)
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Handle setup route
        if (pathname === '/setup') {
            try {
                const { data: setupData, error: setupError } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'setup_completed')
                    .single()

                if (setupError) {
                    throw new Error(`Setup check failed: ${setupError.message}`)
                }

                // Redirect to login if setup is completed
                if (setupData?.value === true) {
                    return NextResponse.redirect(new URL('/notification', req.url))
                }

                return res
            } catch (error) {
                console.error('Setup middleware error:', error)
                return NextResponse.redirect(new URL('/error', req.url))
            }
        }


        // Handle protected routes
        if (isProtectedPath(pathname)) {
            // Redirect to login if no session
            if (!session) {
                const redirectUrl = new URL('/login', req.url)
                redirectUrl.searchParams.set('redirectTo', pathname)
                return NextResponse.redirect(redirectUrl)
            }

            // Handle admin routes
            if (pathname.startsWith('/admin')) {
                const userRole = session.user.user_metadata.role as UserRole

                if (!userRole || userRole !== 'admin') {
                    console.error('Unauthorized admin access attempt:', {
                        userId: session.user.id,
                        role: userRole
                    })
                    return NextResponse.redirect(new URL('/notification', req.url))
                }
            }

            // Add user info to request headers for API routes
            if (pathname.startsWith('/api/')) {
                const requestHeaders = new Headers(req.headers)
                requestHeaders.set('x-user-id', session.user.id)
                requestHeaders.set('x-user-email', session.user.email ?? '')
                requestHeaders.set('x-user-role', session.user.user_metadata.role ?? '')

                return NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                })
            }
        }

        // Handle public routes when user is already authenticated
        const publicRoutes = ['/login', '/register', "/forgot-password", "/reset-password"]
        if (session && publicRoutes.some(route => pathname === route)) {
            return NextResponse.redirect(new URL('/library', req.url))
        }

        return res
    } catch (error) {
        console.error('Middleware error:', error)
        return NextResponse.redirect(new URL('/error', req.url))
    }
}

export const config = {
    matcher: [
        '/setup',
        '/admin/:path*',
        '/library/:path*',
        '/milestones/:path*',
        '/notification/:path*',
        '/settings/:path*',
        '/statistics/:path*',
        '/api/:path*'
    ],
}