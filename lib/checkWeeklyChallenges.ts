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

type WeeklyEvent =
  | 'active_pause_inserted'     // cuando registras una pausa
  | 'video_completed';          // si emites un evento por vídeo visto, opcional

interface WeeklyChallengeCatalog {
  id: string;               // text
  title: string;
  description?: string;
  points: number;           // recompensa
  condition_type: WeeklyConditionType;
  goal: number;             // objetivo semanal
}

type EventPayload = {
  created_at?: string;      // ISO; si no, new Date()
  video1_id?: string | null;
  video2_id?: string | null;
};

export async function checkWeeklyChallenges(
  userId: string,
  event: WeeklyEvent,
  payload: EventPayload = {}
) {
    // 1) Cargar catálogo semanal
    const { data: catalog, error } = await supabase
    .from('weekly_challenges_catalog')
    .select('id,title,description,points,condition_type,goal');

    if (error || !catalog) return;

    // 2) Resolver incrementos según el evento
    const increments = await resolveIncrements(event, payload, catalog);

    // 3) Aplicar incrementos con RPC (uno por challenge)
    for (const { challengeId, inc } of increments) {
    const { error } = await supabase.rpc('inc_weekly_progress', {
    p_user: userId,
    p_challenge_id: challengeId,
    p_inc: inc,
    p_at: payload.created_at ?? new Date().toISOString(),
    });
    if (error) {
    console.error('inc_weekly_progress error:', challengeId, error);
    }
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
    // +1 a todos los retos de "pausas_semana"
    for (const id of byType('pausas_semana')) out.push({ challengeId: id, inc: 1 });

    // Si quieres sumar por categorías a partir de los vídeos
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

  // (extiende aquí si emites más eventos)

  // compacta por challengeId
  const compact = new Map<string, number>();
  for (const it of out) compact.set(it.challengeId, (compact.get(it.challengeId) ?? 0) + it.inc);
  return Array.from(compact, ([challengeId, inc]) => ({ challengeId, inc }));
}
