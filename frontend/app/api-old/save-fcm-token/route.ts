import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { user_id, device_id, token } = await request.json();
        if (!user_id || !device_id || !token) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Identify user from session
        const supabase = createRouteHandlerClient({ cookies });
        const {
            data: { user },
            error: sessionError,
        } = await supabase.auth.getUser();
        if (sessionError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // (Optional) verify user_id matches user.id
        if (user.id !== user_id) {
            return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
        }

        // 2. Upsert with "onConflict: 'user_id, device_id'" to match your unique constraint
        const { error: dbError } = await supabase
            .from('fcm_tokens')
            .upsert(
                {
                    user_id,
                    device_id,
                    token,
                },
                {
                    onConflict: 'user_id, device_id',
                    ignoreDuplicates: false, // default is false, does DO UPDATE
                }
            );

        if (dbError) {
            console.error('Error upserting token:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 3. Return success
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error in /api/save-fcm-token:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
