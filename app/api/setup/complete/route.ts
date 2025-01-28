import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST() {
    try {
        const { error } = await supabaseAdmin
            .from('app_settings')
            .update({ value: true })
            .eq('key', 'setup_completed')

        if (error) throw error

        return NextResponse.json({ message: 'Setup completed' })
    } catch (error) {
        console.error('Setup completion error:', error)
        return NextResponse.json(
            { error: 'Failed to complete setup' },
            { status: 500 }
        )
    }
}