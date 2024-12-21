'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallback() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
            // Set the session to confirm the user is authenticated client-side
            supabase.auth.setSession({ access_token, refresh_token }).then(async ({ error }) => {
                if (error) {
                    console.error('Session creation failed:', error)
                    router.push('/login?error=session-failed')
                    return
                }

                // Now fetch the authenticated user
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError || !user) {
                    console.error('No user retrieved:', userError)
                    router.push('/login?error=no-user')
                    return
                }

                // Insert the confirmed user into public.users via a secure API route
                const res = await fetch('/api/users/insert', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata.first_name,
                        last_name: user.user_metadata.last_name,
                        role: user.user_metadata.role
                    })
                })

                if (!res.ok) {
                    console.error('User insertion failed')
                    router.push('/login?error=user-insert-failed')
                    return
                }

                // Successfully inserted, now redirect to admin
                router.push('/admin')
            })
        } else {
            console.error('Missing tokens in callback URL')
            router.push('/login?error=missing-tokens')
        }
    }, [router, supabase])

    return <div className="flex justify-center items-center h-screen">Processing confirmation...</div>
}
