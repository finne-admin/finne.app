import { NextResponse } from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    const { email } = await request.json()


    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
}