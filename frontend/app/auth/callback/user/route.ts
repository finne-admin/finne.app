// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        // Get URL parameters
        const requestUrl = new URL(request.url)
        const code = requestUrl.searchParams.get('code')
        const accessToken = requestUrl.hash?.replace('#access_token=', '')

        const supabase = createRouteHandlerClient({ cookies })

        if (code) {
            // Exchange code for session
            await supabase.auth.exchangeCodeForSession(code)
        } else if (accessToken) {
            // Set session from access token
            const tokenParams = new URLSearchParams(requestUrl.hash.slice(1))
            await supabase.auth.setSession({
                access_token: tokenParams.get('access_token') ?? '',
                refresh_token: tokenParams.get('refresh_token') ?? ''
            })
        }

        // Redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(new URL('/error', request.url))
    }
}