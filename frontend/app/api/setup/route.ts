import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Request body validation schema
const setupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required')
})

export async function POST(request: Request) {
    try {
        // Parse and validate request body
        const body = await request.json()
        const validatedData = setupSchema.parse(body)

        const supabaseAdmin = createRouteHandlerClient({ cookies })

        // Check if setup is already completed
        const { data: setupData, error: setupError } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', 'setup_completed')
            .single()

        if (setupError && setupError.code !== 'PGRST116') {
            throw new Error('Failed to check setup status')
        }

        if (setupData?.value === true) {
            return NextResponse.json(
                { error: 'Setup already completed' },
                { status: 400 }
            )
        }

        // Start a transaction
        // const { error: txError } = await supabaseAdmin.rpc('begin_transaction')
        // if (txError) throw new Error('Failed to start transaction')

        try {
            // Create admin user
            const { data: userData, error: userError } = await supabaseAdmin.auth.signUp({
                email: validatedData.email,
                password: validatedData.password,
                options: {
                    data: {
                        first_name: validatedData.firstName,
                        last_name: validatedData.lastName,
                        role: 'admin',
                        onboard: true
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/admin`
                }
            })

            if (userError) throw userError

            // Mark setup as completed
            const { error: completionError } = await supabaseAdmin
                .from('app_settings')
                .upsert({
                    key: 'setup_completed',
                    value: true
                })

            if (completionError) throw completionError

            // Commit transaction
            await supabaseAdmin.rpc('commit_transaction')

            return NextResponse.json({
                message: 'Setup completed successfully',
                user: userData.user
            }, { status: 200 })

        } catch (error) {
            // Rollback on error
            await supabaseAdmin.rpc('rollback_transaction')
            throw error
        }

    } catch (error) {
        console.error('Setup error:', error)


        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.errors
            }, { status: 400 })
        }

        return NextResponse.json({
            error: 'An error occurred during setup',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}