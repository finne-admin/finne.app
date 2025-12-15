'use client'

import { apiPost } from '@/lib/apiClient'

type WeeklyEvent = 'active_pause_inserted' | 'video_completed'

type EventPayload = {
  created_at?: string
  video1_id?: string | null
  video2_id?: string | null
}

export async function checkWeeklyChallenges(
  _userId: string,
  event: WeeklyEvent,
  payload: EventPayload = {}
) {
  try {
    await apiPost('/api/milestones/weekly-challenges/progress', {
      event,
      payload: {
        created_at: payload.created_at ?? new Date().toISOString(),
        video1_id: payload.video1_id ?? null,
        video2_id: payload.video2_id ?? null,
      },
    })
  } catch (error) {
    console.error('Error al actualizar retos semanales:', error)
  }
}
