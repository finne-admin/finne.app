// lib/weekly/claimWeekly.ts
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function claimWeeklyChallenge(challengeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('claim_weekly_challengue', {
    p_user: user.id,
    p_challenge_id: challengeId
  });

  if (error) {
    console.error('claim_weekly_challengue', error);
    return false;
  }
  return !!data;
}
