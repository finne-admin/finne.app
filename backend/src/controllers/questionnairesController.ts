import { getPool } from '../config/dbManager'
import { Request, Response } from "express"

export const getPendingQuestionnaires = async (req, res) => {
  const { user } = req.query

  if (!user) {
    return res.status(400).json({ error: 'Falta el parámetro user.' })
  }

  try {
    const pool = await getPool()

    // 1️⃣ Formularios activos
    const { rows: forms } = await pool.query(
      'SELECT id FROM questionnaires WHERE active = TRUE'
    )

    // 2️⃣ Formularios que ya respondió este usuario
    const { rows: responses } = await pool.query(
      'SELECT questionnaire_id FROM questionnaire_responses WHERE user_id = $1 AND answered = TRUE',
      [user]
    )

    // 3️⃣ Calcular pendientes
    const answeredIds = new Set(responses.map(r => r.questionnaire_id))
    const pending = forms.filter(f => !answeredIds.has(f.id)).length

    res.json({ pendingCount: pending })
  } catch (err) {
    console.error('Error al obtener cuestionarios pendientes:', err)
    res.status(500).json({ error: 'Error al obtener cuestionarios pendientes.' })
  }
}

/**
 * 🟢 Obtener todos los cuestionarios activos e inactivos
 */
export const listQuestionnaires = async (_req: Request, res: Response) => {
  try {
    const pool = await getPool()
    const { rows } = await pool.query(`
      SELECT id, title, active
      FROM questionnaires
      ORDER BY created_at ASC
    `)
    return res.json(rows)
  } catch (err) {
    console.error("❌ Error listando cuestionarios:", err)
    return res.status(500).json({ error: "Error interno al listar cuestionarios." })
  }
}

/**
 * 🟢 Obtener las respuestas ya completadas por un usuario
 */
export const getUserResponses = async (req: Request, res: Response) => {
  const userId = req.query.user as string
  if (!userId) return res.status(400).json({ error: "Falta parámetro user" })

  try {
    const pool = await getPool()
    const { rows } = await pool.query(
      `SELECT questionnaire_id FROM questionnaire_responses WHERE user_id = $1 AND answered = TRUE`,
      [userId]
    )
    return res.json(rows)
  } catch (err) {
    console.error("❌ Error obteniendo respuestas del usuario:", err)
    return res.status(500).json({ error: "Error interno al obtener respuestas del usuario." })
  }
}

/**
 * 🟢 Registrar que un usuario ha respondido un cuestionario
 */
export const respondQuestionnaire = async (req: Request, res: Response) => {
  const { user_id, questionnaire_id, answered, submission_id } = req.body

  if (!user_id || !questionnaire_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios (user_id, questionnaire_id)" })
  }

  try {
    const pool = await getPool()

    // Insertar o actualizar (evita duplicados)
    const query = `
      INSERT INTO questionnaire_responses (user_id, questionnaire_id, answered, tally_submission_id, submitted_at)
      VALUES ($1, $2, COALESCE($3, TRUE), $4, NOW())
      ON CONFLICT (user_id, questionnaire_id)
      DO UPDATE
      SET answered = TRUE,
          tally_submission_id = EXCLUDED.tally_submission_id,
          submitted_at = NOW()
      RETURNING questionnaire_id
    `
    const { rows } = await pool.query(query, [user_id, questionnaire_id, answered, submission_id])

    return res.json({ success: true, updated: rows[0] })
  } catch (err) {
    console.error("❌ Error registrando respuesta de cuestionario:", err)
    return res.status(500).json({ error: "Error interno al guardar la respuesta." })
  }
}

/**
 * 🟢 Insertar un envío de cuestionario (simple, centrado en "answers")
 */
export const insertQuestionnaireSubmission = async (req, res) => {
  const { tally_submission_id, form_id, user_id, respondent_id, answers } = req.body;

  if (!form_id || !user_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios (form_id, user_id)" });
  }

  try {
    const pool = await getPool();
    const query = `
      INSERT INTO questionnaire_submissions 
        (tally_submission_id, form_id, user_id, respondent_id, created_at, payload, answers, inserted_at)
      VALUES ($1, $2, $3, $4, NOW(), $5::jsonb, $6::jsonb, NOW())
      RETURNING id
    `;

    const payload = req.body.data || { info: "submitted manually from app" };

    // ✅ Forzamos JSON bien formateado
    const answersJson = JSON.stringify([
      { text: answers || "sin respuestas registradas" }
    ]);

    const payloadJson = JSON.stringify(payload);

    const { rows } = await pool.query(query, [
      tally_submission_id || null,
      form_id,
      user_id,
      respondent_id || null,
      payloadJson,
      answersJson,
    ]);

    console.log("🧾 Nueva submission guardada:", rows[0]);
    return res.json({ success: true, submission_id: rows[0].id });
  } catch (err) {
    console.error("❌ Error insertando questionnaire_submissions:", err);
    return res.status(500).json({ error: "Error interno al guardar el envío de cuestionario." });
  }
};

export const updateQuestionnaireActiveController = async (req: Request, res: Response) => {
  const questionnaireId = req.params.id
  const { active } = req.body ?? {}

  if (!questionnaireId) {
    return res.status(400).json({ error: "Falta el id del cuestionario" })
  }

  if (typeof active !== "boolean") {
    return res.status(400).json({ error: "El campo active debe ser booleano" })
  }

  try {
    const pool = await getPool()
    const { rows } = await pool.query(
      `
      UPDATE questionnaires
      SET active = $2
      WHERE id = $1
      RETURNING id, title, active
      `,
      [questionnaireId, active]
    )

    if (!rows[0]) {
      return res.status(404).json({ error: "Cuestionario no encontrado" })
    }

    return res.json(rows[0])
  } catch (err) {
    console.error("❌ Error actualizando estado del cuestionario:", err)
    return res.status(500).json({ error: "Error interno al actualizar el cuestionario." })
  }
}

export const resetQuestionnaireResponsesController = async (req: Request, res: Response) => {
  const questionnaireId = req.params.id

  if (!questionnaireId) {
    return res.status(400).json({ error: "Falta el id del cuestionario" })
  }

  try {
    const pool = await getPool()

    const questionnaireResult = await pool.query(
      `
      SELECT id, title
      FROM questionnaires
      WHERE id = $1
      `,
      [questionnaireId]
    )

    if (!questionnaireResult.rows[0]) {
      return res.status(404).json({ error: "Cuestionario no encontrado" })
    }

    const resetResult = await pool.query(
      `
      UPDATE questionnaire_responses
      SET answered = FALSE,
          tally_submission_id = NULL,
          submitted_at = NULL
      WHERE questionnaire_id = $1
        AND answered = TRUE
      `,
      [questionnaireId]
    )

    return res.json({
      id: questionnaireResult.rows[0].id,
      title: questionnaireResult.rows[0].title,
      resetCount: resetResult.rowCount ?? 0,
    })
  } catch (err) {
    console.error("❌ Error reabriendo el cuestionario:", err)
    return res.status(500).json({ error: "Error interno al reabrir el cuestionario." })
  }
}




// ruta: backend\src\controllers\questionnairesController.ts
