import { NextResponse } from 'next/server'
import {supabaseAdmin} from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    const { email, role } = await request.json()

    const redirectTo = role === 'admin'
    ? 'https://stn.finne.app/onboardingAdmin/'
    : 'https://stn.finne.app/onboarding/'


    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
        role: role || 'user'
    },
    redirectTo
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
}