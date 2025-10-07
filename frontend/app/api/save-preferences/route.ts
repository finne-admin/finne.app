// app/api/save-preferences/route.ts
import { NextResponse } from 'next/server';
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

export async function POST(request: Request) {
    try {
        const { user_id, active, times, timezone } = await request.json();
        const supabase = createClientComponentClient()
        const { error } = await supabase
            .from('notification_preferences')
            .upsert({
                user_id,
                active,
                times,
                timezone
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}