import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // a supabase client with service role key

export async function POST(request: Request) {
    const { id, email, first_name, last_name, role } = await request.json()

    // (Optional) Validate that the caller is authenticated and confirmed
    const supabase = createServerComponentClient({ cookies })
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user || user.id !== id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert user into public.users using supabaseAdmin (service role)
    const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({ id, email, first_name, last_name, role: role || 'admin' })

    if (dbError) {
        console.error('DB Insert Error:', dbError)
        return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
