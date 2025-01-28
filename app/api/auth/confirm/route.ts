import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=invalid-token', request.url))
    }

    // Exchange the confirmation token for a session
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(token)
    if (error) {
        console.error('Error confirming email:', error)
        return NextResponse.redirect(new URL('/login?error=confirmation-failed', request.url))
    }

    const user = data.user

    // Insert user data into public.users (if it doesn't already exist)
    const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            role: user.user_metadata.role || 'admin'
        })

    if (dbError) {
        console.error('Error inserting user into database:', dbError)
        return NextResponse.redirect(new URL('/login?error=db-insert-failed', request.url))
    }

    // Redirect to Admin Dashboard
    return NextResponse.redirect(new URL('/admin', request.url))
}