import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName } = await request.json()

        // Sign up the user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) throw signUpError

        // If sign up successful, insert user data into the users table
        if (authData.user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        email: authData.user.email,
                        role: 'admin',  // First user is set as admin
                        first_name: firstName,
                        last_name: lastName
                    }
                ])

            if (insertError) throw insertError
        }

        return NextResponse.json({ message: 'Setup started successfully' }, { status: 200 })
    } catch (error) {
        console.error('Setup error:', error)
        return NextResponse.json(
            { error: 'Failed to start setup process' },
            { status: 500 }
        )
    }
}