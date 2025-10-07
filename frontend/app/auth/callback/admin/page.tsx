'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export default function AuthCallback() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hash = window.location.hash.substring(1)
                const params = new URLSearchParams(hash)
                const access_token = params.get('access_token')
                const refresh_token = params.get('refresh_token')

                if (!access_token || !refresh_token) {
                    throw new Error('Missing authentication tokens')
                }

                // Set the session
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token,
                    refresh_token
                })

                if (sessionError) throw sessionError

                // Redirect to admin
                router.push('/admin')
            } catch (error) {
                console.error('Authentication error:', error)
                router.push(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
            }
        }

        handleCallback()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8ACC9F] mx-auto mb-4"></div>
                <p className="text-gray-600">Confirming your account...</p>
            </div>
        </div>
    )
}