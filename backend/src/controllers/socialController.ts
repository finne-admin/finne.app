import { Request, Response } from "express"
import { getPool } from "../config/dbManager"
import { checkAndGrantAchievements } from "../services/achievementService"
import { uuidv7 } from "uuidv7"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"
import { getVideoIdsByHashes } from "../db/queries/activePauseQueries"

const SOCIAL_TRIGGER = "active_pause"

export const getDepartmentUsersController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const membership = await getMembershipForUser(userId)
    if (!membership?.department_id) {
      return res.status(400).json({ error: "Tu cuenta no tiene departamento asignado" })
    }

    const pool = await getPool()
    const { rows } = await pool.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM user_membership um
      JOIN users u ON u.id = um.user_id
      WHERE um.department_id = $1 AND u.id <> $2
      ORDER BY u.first_name ASC, u.last_name ASC
      `,
      [membership.department_id, userId]
    )

    return res.json({ users: rows })
  } catch (error) {
    console.error("Error en getDepartmentUsersController:", error)
    return res.status(500).json({ error: "Error al cargar usuarios del departamento" })
  }
}

export const createPauseInviteController = async (req: Request, res: Response) => {
  const senderId = (req as any).user?.id
  const { receiverUserId, videoHashes } = req.body || {}
  if (!senderId) return res.status(401).json({ error: "No autenticado" })
  if (!receiverUserId) return res.status(400).json({ error: "Falta receiverUserId" })
  if (!Array.isArray(videoHashes) || videoHashes.length !== 2) {
    return res.status(400).json({ error: "Se requieren exactamente dos vídeos" })
  }

  try {
    const senderMembership = await getMembershipForUser(senderId)
    const receiverMembership = await getMembershipForUser(receiverUserId)
    if (!senderMembership?.department_id || senderMembership.department_id !== receiverMembership?.department_id) {
      return res.status(400).json({ error: "El usuario debe pertenecer al mismo departamento" })
    }

    const pool = await getPool()
    const client = await pool.connect()
    try {
      const videoRows = await getVideoIdsByHashes(client, videoHashes)
      const ordered = videoHashes.map((hash) => videoRows.find((row) => row.wistia_id === hash))
      if (ordered.some((row) => !row)) {
        return res.status(400).json({ error: "No se encontraron los vídeos seleccionados" })
      }

      const [video1, video2] = ordered as { id: string; wistia_id: string }[]

      const { rows } = await client.query(
        `
        INSERT INTO pause_invites (sender_user_id, receiver_user_id, status, created_at, video1_id, video2_id)
        VALUES ($1, $2, 'pending', NOW(), $3, $4)
        RETURNING id, created_at
        `,
        [senderId, receiverUserId, video1.id, video2.id]
      )

      return res.json({
        invite: {
          ...rows[0],
          video1_hash: video1.wistia_id,
          video2_hash: video2.wistia_id,
        },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error en createPauseInviteController:", error)
    return res.status(500).json({ error: "Error al crear invitación" })
  }
}

export const getPendingInvitesController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const pool = await getPool()
    const { rows } = await pool.query(
      `
      SELECT
        pi.id,
        pi.sender_user_id,
        u.first_name,
        u.last_name,
        pi.created_at,
        v1.wistia_id AS video1_hash,
        v2.wistia_id AS video2_hash
      FROM pause_invites pi
      JOIN users u ON u.id = pi.sender_user_id
      LEFT JOIN videos v1 ON v1.id = pi.video1_id
      LEFT JOIN videos v2 ON v2.id = pi.video2_id
      WHERE pi.receiver_user_id = $1 AND pi.status = 'pending'
      ORDER BY pi.created_at DESC
      `,
      [userId]
    )

  return res.json({
    invites: rows.map((row) => ({
      id: row.id,
      sender_user_id: row.sender_user_id,
      sender_name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || "Compañero",
      created_at: row.created_at,
      video1_hash: row.video1_hash,
      video2_hash: row.video2_hash,
      accepted_at: row.accepted_at,
    })),
  })
  } catch (error) {
    console.error("Error en getPendingInvitesController:", error)
    return res.status(500).json({ error: "Error al consultar invitaciones" })
  }
}

export const getSentInvitesController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const pool = await getPool()
    const { rows } = await pool.query(
      `
      SELECT
        pi.id,
        pi.status,
        pi.created_at,
        pi.accepted_at,
        pi.pause_session_id,
        pi.receiver_user_id,
        ru.first_name AS receiver_first_name,
        ru.last_name AS receiver_last_name,
        v1.wistia_id AS video1_hash,
        v2.wistia_id AS video2_hash
      FROM pause_invites pi
      LEFT JOIN users ru ON ru.id = pi.receiver_user_id
      LEFT JOIN videos v1 ON v1.id = pi.video1_id
      LEFT JOIN videos v2 ON v2.id = pi.video2_id
      WHERE pi.sender_user_id = $1
      ORDER BY pi.created_at DESC
      LIMIT 50
      `,
      [userId]
    )

    return res.json({
      invites: rows.map((row) => ({
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        accepted_at: row.accepted_at,
        pause_session_id: row.pause_session_id,
        receiver_user_id: row.receiver_user_id,
        receiver_name: `${row.receiver_first_name ?? ""} ${row.receiver_last_name ?? ""}`.trim(),
        video1_hash: row.video1_hash,
        video2_hash: row.video2_hash,
      })),
    })
  } catch (error) {
    console.error("Error en getSentInvitesController:", error)
    return res.status(500).json({ error: "Error al consultar invitaciones enviadas" })
  }
}

export const acceptPauseInviteController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const inviteId = req.params.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!inviteId) return res.status(400).json({ error: "Falta inviteId" })

  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `
      SELECT pi.*, v1.wistia_id AS video1_hash, v2.wistia_id AS video2_hash
      FROM pause_invites pi
      LEFT JOIN videos v1 ON v1.id = pi.video1_id
      LEFT JOIN videos v2 ON v2.id = pi.video2_id
      WHERE pi.id = $1
      FOR UPDATE OF pi
      `,
      [inviteId]
    )
    if (rows.length === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Invitación no encontrada" })
    }

    const invite = rows[0]
    if (invite.receiver_user_id !== userId) {
      await client.query("ROLLBACK")
      return res.status(403).json({ error: "No puedes aceptar esta invitación" })
    }
    if (invite.status === "accepted") {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "La invitación ya fue aceptada" })
    }

    let sessionId = invite.pause_session_id
    if (!sessionId) {
      const session = await client.query(
        `INSERT INTO pause_sessions (id, created_at) VALUES ($1, NOW()) RETURNING id`,
        [uuidv7()]
      )
      sessionId = session.rows[0].id
      await client.query(
        `UPDATE pause_invites SET pause_session_id = $1 WHERE id = $2`,
        [sessionId, inviteId]
      )
    }

    await client.query(
      `
      UPDATE pause_invites
      SET status = 'accepted', accepted_at = NOW()
      WHERE id = $1
      `,
      [inviteId]
    )

    await client.query(
      `
      INSERT INTO pause_session_participants (session_id, user_id, joined_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (session_id, user_id) DO NOTHING
      `,
      [sessionId, invite.sender_user_id]
    )

    await client.query(
      `
      INSERT INTO pause_session_participants (session_id, user_id, joined_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (session_id, user_id) DO NOTHING
      `,
      [sessionId, userId]
    )

    await client.query("COMMIT")

    try {
      await checkAndGrantAchievements(invite.sender_user_id, SOCIAL_TRIGGER)
      await checkAndGrantAchievements(userId, SOCIAL_TRIGGER)
    } catch (err) {
      console.error("Error comprobando logros tras aceptar invitación:", err)
    }

    return res.json({
      success: true,
      sessionId,
      video1_hash: invite.video1_hash,
      video2_hash: invite.video2_hash,
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en acceptPauseInviteController:", error)
    return res.status(500).json({ error: "Error al aceptar invitación" })
  } finally {
    client.release()
  }
}

export const declinePauseInviteController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const inviteId = req.params.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!inviteId) return res.status(400).json({ error: "Falta inviteId" })

  try {
    const pool = await getPool()
    const { rowCount } = await pool.query(
      `
      UPDATE pause_invites
      SET status = 'cancelled', cancelled_at = NOW()
      WHERE id = $1 AND receiver_user_id = $2
      `,
      [inviteId, userId]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: "Invitación no encontrada" })
    }
    return res.json({ success: true })
  } catch (error) {
    console.error("Error en declinePauseInviteController:", error)
    return res.status(500).json({ error: "Error al rechazar invitación" })
  }
}

export const cancelSentInviteController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const inviteId = req.params.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!inviteId) return res.status(400).json({ error: "Falta inviteId" })

  try {
    const pool = await getPool()
    const { rowCount } = await pool.query(
      `
      UPDATE pause_invites
      SET status = 'cancelled', cancelled_at = NOW()
      WHERE id = $1 AND sender_user_id = $2 AND status = 'pending'
      `,
      [inviteId, userId]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: "Invitación no encontrada o ya no es pendiente" })
    }
    return res.json({ success: true })
  } catch (error) {
    console.error("Error en cancelSentInviteController:", error)
    return res.status(500).json({ error: "Error al cancelar la invitación" })
  }
}

export const createShareLinkController = async (req: Request, res: Response) => {
  const ownerId = (req as any).user?.id
  const { videoId } = req.body || {}
  if (!ownerId) return res.status(401).json({ error: "No autenticado" })
  if (!videoId) return res.status(400).json({ error: "Falta videoId" })

  try {
    const pool = await getPool()
    const token = uuidv7()
    const { rows } = await pool.query(
      `
      INSERT INTO shared_exercises (owner_user_id, video_id, share_token, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, share_token
      `,
      [ownerId, videoId, token]
    )
    return res.json({ share: rows[0] })
  } catch (error) {
    console.error("Error en createShareLinkController:", error)
    return res.status(500).json({ error: "Error al crear enlace compartido" })
  }
}

export const useShareLinkController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const { token } = req.params
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!token) return res.status(400).json({ error: "Falta token" })

  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `SELECT id, owner_user_id FROM shared_exercises WHERE share_token = $1`,
      [token]
    )
    if (rows.length === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Enlace no encontrado" })
    }
    const share = rows[0]
    if (share.owner_user_id === userId) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "No puedes usar tu propio enlace" })
    }

    const { rowCount } = await client.query(
      `SELECT 1 FROM shared_exercise_usage WHERE share_id = $1 AND user_id = $2`,
      [share.id, userId]
    )
    if (rowCount === 0) {
      await client.query(
        `
        INSERT INTO shared_exercise_usage (share_id, user_id, created_at)
        VALUES ($1, $2, NOW())
        `,
        [share.id, userId]
      )
    }

    await client.query("COMMIT")

    try {
      await checkAndGrantAchievements(share.owner_user_id, SOCIAL_TRIGGER)
    } catch (err) {
      console.error("Error comprobando logros tras uso de share:", err)
    }

    return res.json({ success: true })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en useShareLinkController:", error)
    return res.status(500).json({ error: "Error al registrar uso de enlace" })
  } finally {
    client.release()
  }
}
