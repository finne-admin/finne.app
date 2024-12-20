import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // Server-side supabase client with service role

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname

    // Check if we have at least one admin user
    const isSetupComplete = await checkIfSetupIsComplete()

    if (currentPath === '/setup') {
        // If the user is trying to access /setup but we already have an admin, setup is done
        if (isSetupComplete) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    } else {
        // For all other routes, if we have no admin user (setup not complete), redirect to /setup
        if (!isSetupComplete) {
            return NextResponse.redirect(new URL('/setup', request.url))
        }
    }

    // If none of the conditions above triggered, continue as normal
    return NextResponse.next()
}

async function checkIfSetupIsComplete(): Promise<boolean> {
    // We consider setup complete if at least one admin exists in public.users
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .limit(1)

    if (error) {
        console.error('Error checking setup status:', error)
        // On error, assume setup is not complete to avoid misconfiguration
        return false
    }

    // If we found at least one admin user, setup is considered complete
    return data && data.length > 0
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
