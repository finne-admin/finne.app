// lib/weekly/checkWeeklyChallenges.ts
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

type WeeklyConditionType =
  | 'pausas_semana'
  | 'ejercicios_brazos'
  | 'ejercicios_piernas'
  | 'ejercicios_core'
  | 'ejercicios_movilidad';

type WeeklyEvent = 'active_pause_inserted' | 'video_completed';

interface WeeklyChallengeCatalog {
  id: string;
  title: string;
  description?: string;
  points: number;
  condition_type: WeeklyConditionType;
  goal: number;
}

type EventPayload = {
  created_at?: string;
  video1_id?: string | null;
  video2_id?: string | null;
};

const SUPPORTED: WeeklyConditionType[] = [
  'pausas_semana',
  'ejercicios_brazos',
  'ejercicios_piernas',
  'ejercicios_core',
  'ejercicios_movilidad',
];

export async function checkWeeklyChallenges(
  userId: string,
  event: WeeklyEvent,
  payload: EventPayload = {}
) {
  const { data: catalog } = await supabase
    .from('weekly_challenges_catalog')
    .select('id,title,description,points,condition_type,goal');

  // filtra a sólo los tipos soportados y con goal válido
  const filtered = (catalog ?? [])
    .filter(
      c =>
        SUPPORTED.includes(c.condition_type as WeeklyConditionType) &&
        typeof c.goal === 'number' &&
        c.goal > 0
    )
    .map(c => c as WeeklyChallengeCatalog);

  if (!filtered.length) return;

  const increments = await resolveIncrements(event, payload, filtered);

  for (const { challengeId, inc } of increments) {
    const { error } = await supabase.rpc('inc_weekly_progress', {
      p_user: userId,
      p_challenge_id: challengeId,
      p_inc: inc,
      p_at: payload.created_at ?? new Date().toISOString(),
    });
    if (error) console.error('inc_weekly_progress error:', challengeId, error);
  }
}

async function resolveIncrements(
  event: WeeklyEvent,
  payload: EventPayload,
  catalog: WeeklyChallengeCatalog[]
): Promise<Array<{ challengeId: string; inc: number }>> {
  const out: Array<{ challengeId: string; inc: number }> = [];

  const byType = (t: WeeklyConditionType) =>
    catalog.filter(c => c.condition_type === t).map(c => c.id);

  if (event === 'active_pause_inserted') {
    for (const id of byType('pausas_semana')) out.push({ challengeId: id, inc: 1 });

    const videoIds = [payload.video1_id, payload.video2_id].filter(Boolean) as string[];
    if (videoIds.length) {
      const { data: vids } = await supabase
        .from('videos')
        .select('id,categorias')
        .in('id', videoIds);

      const cats = new Set<string>();
      (vids ?? []).forEach(v => (v.categorias ?? []).forEach((c: string) => cats.add(c)));

      if (cats.has('miembro superior'))
        for (const id of byType('ejercicios_brazos')) out.push({ challengeId: id, inc: 1 });
      if (cats.has('miembro inferior'))
        for (const id of byType('ejercicios_piernas')) out.push({ challengeId: id, inc: 1 });
      if (cats.has('core'))
        for (const id of byType('ejercicios_core')) out.push({ challengeId: id, inc: 1 });
      if (cats.has('movilidad'))
        for (const id of byType('ejercicios_movilidad')) out.push({ challengeId: id, inc: 1 });
    }
  }

  // compacta por id
  const compact = new Map<string, number>();
  for (const it of out) compact.set(it.challengeId, (compact.get(it.challengeId) ?? 0) + it.inc);
  return Array.from(compact, ([challengeId, inc]) => ({ challengeId, inc }));
}
