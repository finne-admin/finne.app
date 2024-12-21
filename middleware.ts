import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = req.nextUrl

    // Allow public routes
    if (pathname === '/login' || pathname === '/setup' || pathname.startsWith('/auth')) {
        return res
    }

    // If no user, redirect to login
    if (!user) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // If accessing /admin, check user role
    if (pathname.startsWith('/admin')) {
        const { data: roleData, error } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (error || roleData?.role !== 'admin') {
            return NextResponse.redirect(new URL('/403', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*']
}
