import type { Pool, PoolClient } from "pg"
import { getPool } from "../../config/dbManager"

type Queryable = Pool | PoolClient

const resolveClient = async (client?: Queryable) => client ?? (await getPool())

export const insertPauseInvite = async (
  senderUserId: string,
  receiverEmail: string,
  client?: Queryable
) => {
  const db = await resolveClient(client)
  const { rows } = await db.query(
    `
      INSERT INTO pause_invites (sender_user_id, receiver_email, status, created_at)
      VALUES ($1, $2, 'pending', NOW())
      RETURNING *
    `,
    [senderUserId, receiverEmail.trim().toLowerCase()]
  )
  return rows[0]
}

export const listPendingInvitesForUser = async (
  userId: string,
  userEmail: string,
  client?: Queryable
) => {
  const db = await resolveClient(client)
  const { rows } = await db.query(
    `
    SELECT *
    FROM pause_invites
    WHERE status = 'pending'
      AND (
        receiver_user_id = $1 OR
        (receiver_user_id IS NULL AND LOWER(receiver_email) = LOWER($2))
      )
    ORDER BY created_at DESC
    LIMIT 50
    `,
    [userId, userEmail]
  )
  return rows
}

export const createPauseSession = async (client?: Queryable) => {
  const db = await resolveClient(client)
  const { rows } = await db.query(
    `INSERT INTO pause_sessions (created_at) VALUES (NOW()) RETURNING id`
  )
  return rows[0]?.id
}

export const addParticipantToSession = async (
  sessionId: string,
  userId: string,
  activePauseId?: string | null,
  client?: Queryable
) => {
  const db = await resolveClient(client)
  await db.query(
    `
    INSERT INTO pause_session_participants (session_id, user_id, active_pause_id, joined_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (session_id, user_id) DO NOTHING
    `,
    [sessionId, userId, activePauseId ?? null]
  )
}

export const insertSharedExercise = async (
  ownerUserId: string,
  videoId: string,
  shareToken: string,
  client?: Queryable
) => {
  const db = await resolveClient(client)
  const { rows } = await db.query(
    `
    INSERT INTO shared_exercises (owner_user_id, video_id, share_token, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
    `,
    [ownerUserId, videoId, shareToken]
  )
  return rows[0]
}

export const insertSharedExerciseUsage = async (
  shareId: string,
  userId: string,
  client?: Queryable
) => {
  const db = await resolveClient(client)
  await db.query(
    `
    INSERT INTO shared_exercise_usage (share_id, user_id, created_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT DO NOTHING
    `,
    [shareId, userId]
  )
}
