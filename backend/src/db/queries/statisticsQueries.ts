import { getPool } from "../../config/dbManager"

const AVERAGE_PAUSE_MINUTES = Number(process.env.AVERAGE_PAUSE_MINUTES || "8")

export const getUserStatistics = async (userId: string) => {
  const pool = await getPool()

  try {
    const { rows: summaryRows } = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM active_pauses WHERE user_id = $1) AS total_exercises,
        (SELECT COUNT(DISTINCT DATE(created_at)) FROM active_pauses WHERE user_id = $1) AS distinct_days,
        (SELECT COUNT(*) FROM active_pauses WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days') AS weekly_sessions,
        (SELECT COUNT(*) FROM active_pauses WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '15 days') AS last_15_days,
        (
          SELECT COALESCE(ROUND(AVG(satisfaction_level), 1), 0)
          FROM exercise_satisfaction
          WHERE user_id = $1
        ) AS avg_satisfaction
      `,
      [userId]
    )

    const summary = summaryRows[0] || {
      total_exercises: 0,
      distinct_days: 0,
      weekly_sessions: 0,
      last_15_days: 0,
      avg_satisfaction: 0,
    }

    const { rows: categoryRows } = await pool.query(
      `
      SELECT
          COALESCE(ARRAY_TO_STRING(v.categorias, ', '), 'Sin categoría') AS category,
          COUNT(ap.id) AS total_sessions
      FROM active_pauses ap
      LEFT JOIN videos v
          ON v.id = ap.video1_id OR v.id = ap.video2_id
      WHERE ap.user_id = $1
      GROUP BY category
      ORDER BY total_sessions DESC
      `,
      [userId]
    )

    const { rows: timelineRows } = await pool.query(
      `
      SELECT
        TO_CHAR(DATE(ap.created_at), 'YYYY-MM-DD') AS day,
        COUNT(*) AS sessions
      FROM active_pauses ap
      WHERE ap.user_id = $1
      GROUP BY day
      ORDER BY day ASC
      `,
      [userId]
    )

    const { rows: weeklyRows } = await pool.query(
      `
      SELECT
        TRIM(TO_CHAR(ap.created_at, 'Day')) AS day_of_week,
        COUNT(*) AS sessions
      FROM active_pauses ap
      WHERE ap.user_id = $1
      GROUP BY day_of_week
      ORDER BY MIN(ap.created_at)
      `,
      [userId]
    )

    const { rows: hourlyRows } = await pool.query(
      `
      SELECT
        CASE
          WHEN EXTRACT(HOUR FROM ap.created_at) BETWEEN 6 AND 11 THEN 'Mañana'
          WHEN EXTRACT(HOUR FROM ap.created_at) BETWEEN 12 AND 15 THEN 'Mediodía'
          WHEN EXTRACT(HOUR FROM ap.created_at) BETWEEN 16 AND 20 THEN 'Tarde'
          ELSE 'Noche'
        END AS time_slot,
        COUNT(*) AS sessions
      FROM active_pauses ap
      WHERE ap.user_id = $1
      GROUP BY time_slot
      ORDER BY time_slot
      `,
      [userId]
    )

    const { rows: favoriteRows } = await pool.query(
      `
      SELECT
        COALESCE(v.titulo, 'Ejercicio') AS title,
        v.wistia_id,
        COUNT(*)::int AS total_sessions
      FROM active_pauses ap
      LEFT JOIN videos v ON v.id = ap.video1_id OR v.id = ap.video2_id
      WHERE ap.user_id = $1
      GROUP BY v.titulo, v.wistia_id
      ORDER BY total_sessions DESC
      LIMIT 3
      `,
      [userId]
    )

    const { rows: weeklyComparisonRows } = await pool.query(
      `
      SELECT
        TO_CHAR(DATE_TRUNC('week', ap.created_at), 'YYYY-MM-DD') AS week_start,
        COUNT(*)::int AS sessions
      FROM active_pauses ap
      WHERE ap.user_id = $1
        AND ap.created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY week_start
      ORDER BY week_start
      `,
      [userId]
    )

    const { rows: timeRows } = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS week_pauses,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS month_pauses
      FROM active_pauses
      WHERE user_id = $1
      `,
      [userId]
    )
    const timeRow = timeRows[0] || { week_pauses: 0, month_pauses: 0 }

    const insights: string[] = []
    if (Number(summary.total_exercises) === 0) {
      insights.push("Aún no has completado ninguna sesión. ¡Comienza hoy!")
    } else {
      if (Number(summary.weekly_sessions) > 5) insights.push("¡Gran semana! Has mantenido una buena constancia.")
      if (Number(summary.avg_satisfaction) > 4) insights.push("Parece que tus ejercicios te están gustando mucho.")
      if (categoryRows.length > 0) {
        const topCat = categoryRows[0].category
        insights.push(`Tu categoría más frecuente es ${topCat}.`)
      }
    }

    return {
      summary,
      category_distribution: categoryRows,
      activity_timeline: timelineRows,
      weekly_pattern: weeklyRows,
      hourly_pattern: hourlyRows,
      insights,
      favorite_videos: favoriteRows,
      weekly_comparison: weeklyComparisonRows,
      time_summary: {
        week_minutes: Number(timeRow.week_pauses || 0) * AVERAGE_PAUSE_MINUTES,
        month_minutes: Number(timeRow.month_pauses || 0) * AVERAGE_PAUSE_MINUTES,
      },
    }
  } catch (err) {
    console.error("Error al obtener estadísticas:", err)
    throw err
  }
}

export interface GlobalStatisticsFilters {
  organizationId?: string | null
  departmentId?: string | null
}

const buildScopeFilter = (filters?: GlobalStatisticsFilters) => {
  const params: any[] = []
  const conditions: string[] = []

  if (filters?.organizationId) {
    params.push(filters.organizationId)
    conditions.push(`um.organization_id::text = $${params.length}`)
  }
  if (filters?.departmentId) {
    params.push(filters.departmentId)
    conditions.push(`um.department_id::text = $${params.length}`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
  return { whereClause, params }
}

export const getGlobalStatistics = async (filters?: GlobalStatisticsFilters) => {
  const pool = await getPool()
  const { whereClause, params } = buildScopeFilter(filters)
  const scopedUsersCTE = `
    WITH scoped_users AS (
      SELECT u.id, um.organization_id, um.department_id
      FROM users u
      LEFT JOIN user_membership um ON um.user_id = u.id
      ${whereClause}
    )
  `

  const summaryQuery = `
    ${scopedUsersCTE}
    SELECT
      COALESCE((SELECT COUNT(*) FROM scoped_users), 0)::int AS total_users,
      COALESCE(
        (
          SELECT COUNT(DISTINCT ap.user_id)
          FROM active_pauses ap
          JOIN scoped_users su ON su.id = ap.user_id
          WHERE ap.created_at >= NOW() - INTERVAL '7 days'
        ),
        0
      )::int AS active_users_week,
      COALESCE(
        (
          SELECT COUNT(*)
          FROM active_pauses ap
          JOIN scoped_users su ON su.id = ap.user_id
          WHERE ap.created_at >= NOW() - INTERVAL '7 days'
        ),
        0
      )::int AS total_pauses_week,
      COALESCE(
        (
          SELECT COUNT(*)
          FROM active_pauses ap
          JOIN scoped_users su ON su.id = ap.user_id
          WHERE ap.created_at >= NOW() - INTERVAL '30 days'
        ),
        0
      )::int AS total_pauses_month,
      COALESCE(
        (
          SELECT COUNT(*)
          FROM active_pauses ap
          JOIN scoped_users su ON su.id = ap.user_id
        ),
        0
      )::int AS total_pauses_all,
      COALESCE(
        (
          SELECT ROUND(AVG(es.satisfaction_level), 1)
          FROM exercise_satisfaction es
          JOIN scoped_users su ON su.id = es.user_id
        ),
        0
      )::numeric AS avg_satisfaction
  `
  const { rows: summaryRows } = await pool.query(summaryQuery, params)
  const rawSummary =
    summaryRows[0] || {
      total_users: 0,
      active_users_week: 0,
      total_pauses_week: 0,
      total_pauses_month: 0,
      total_pauses_all: 0,
      avg_satisfaction: 0,
    }
  const summary = {
    total_users: Number(rawSummary.total_users || 0),
    active_users_week: Number(rawSummary.active_users_week || 0),
    total_pauses_week: Number(rawSummary.total_pauses_week || 0),
    total_pauses_month: Number(rawSummary.total_pauses_month || 0),
    total_pauses_all: Number(rawSummary.total_pauses_all || 0),
    avg_satisfaction: Number(rawSummary.avg_satisfaction || 0),
    week_minutes: Number(rawSummary.total_pauses_week || 0) * AVERAGE_PAUSE_MINUTES,
    month_minutes: Number(rawSummary.total_pauses_month || 0) * AVERAGE_PAUSE_MINUTES,
  }

  const categoryQuery = `
    ${scopedUsersCTE},
    scoped_pauses AS (
      SELECT ap.video1_id, ap.video2_id
      FROM active_pauses ap
      JOIN scoped_users su ON su.id = ap.user_id
      WHERE ap.created_at >= NOW() - INTERVAL '30 days'
    )
    SELECT
      COALESCE(category, 'Sin categoría') AS category,
      COUNT(*)::int AS total_sessions
    FROM (
      SELECT UNNEST(v.categorias)::text AS category
      FROM scoped_pauses sp
      JOIN videos v ON v.id = sp.video1_id
      UNION ALL
      SELECT UNNEST(v.categorias)::text AS category
      FROM scoped_pauses sp
      JOIN videos v ON v.id = sp.video2_id
    ) AS cats
    GROUP BY category
    ORDER BY total_sessions DESC
    LIMIT 10
  `
  const { rows: categoryRows } = await pool.query(categoryQuery, params)

  const weeklyTrendQuery = `
    ${scopedUsersCTE},
    weekly_pauses AS (
      SELECT
        TO_CHAR(DATE_TRUNC('week', ap.created_at), 'YYYY-MM-DD') AS week_start,
        COUNT(*)::int AS sessions
      FROM active_pauses ap
      JOIN scoped_users su ON su.id = ap.user_id
      WHERE ap.created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY week_start
    ),
    weekly_satisfaction AS (
      SELECT
        TO_CHAR(DATE_TRUNC('week', es.created_at), 'YYYY-MM-DD') AS week_start,
        ROUND(AVG(es.satisfaction_level), 2)::numeric AS avg_satisfaction
      FROM exercise_satisfaction es
      JOIN scoped_users su ON su.id = es.user_id
      WHERE es.created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY week_start
    )
    SELECT
      wp.week_start,
      wp.sessions,
      COALESCE(ws.avg_satisfaction, 0) AS avg_satisfaction
    FROM weekly_pauses wp
    LEFT JOIN weekly_satisfaction ws ON ws.week_start = wp.week_start
    ORDER BY wp.week_start
  `
  const { rows: weeklyRows } = await pool.query(weeklyTrendQuery, params)
  const dailyTrendQuery = `
    ${scopedUsersCTE}
    SELECT
      TO_CHAR(DATE(ap.created_at), 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS sessions
    FROM active_pauses ap
    JOIN scoped_users su ON su.id = ap.user_id
    WHERE ap.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY day
    ORDER BY day
  `
  const { rows: dailyRows } = await pool.query(dailyTrendQuery, params)

  const monthlyTrendQuery = `
    ${scopedUsersCTE}
    SELECT
      TO_CHAR(DATE_TRUNC('month', ap.created_at), 'YYYY-MM') AS month,
      COUNT(*)::int AS sessions
    FROM active_pauses ap
    JOIN scoped_users su ON su.id = ap.user_id
    WHERE ap.created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months'
    GROUP BY month
    ORDER BY month
  `
  const { rows: monthlyRows } = await pool.query(monthlyTrendQuery, params)

  const departmentQuery = `
    ${scopedUsersCTE},
    week_pauses AS (
      SELECT ap.user_id, COUNT(*) AS pause_count
      FROM active_pauses ap
      JOIN scoped_users su ON su.id = ap.user_id
      WHERE ap.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY ap.user_id
    ),
    month_pauses AS (
      SELECT ap.user_id, COUNT(*) AS pause_count
      FROM active_pauses ap
      JOIN scoped_users su ON su.id = ap.user_id
      WHERE ap.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY ap.user_id
    ),
    user_satisfaction AS (
      SELECT es.user_id, AVG(es.satisfaction_level) AS avg_sat
      FROM exercise_satisfaction es
      JOIN scoped_users su ON su.id = es.user_id
      GROUP BY es.user_id
    )
    SELECT
      su.department_id,
      COALESCE(d.name, 'Sin departamento') AS department_name,
      COUNT(*)::int AS total_users,
      COUNT(CASE WHEN wp.pause_count > 0 THEN 1 END)::int AS active_users_week,
      COALESCE(SUM(wp.pause_count), 0)::int AS total_pauses_week,
      COALESCE(SUM(mp.pause_count), 0)::int AS total_pauses_month,
      COALESCE(ROUND(AVG(us.avg_sat), 1), 0) AS avg_satisfaction
    FROM scoped_users su
    LEFT JOIN departments d ON d.id = su.department_id
    LEFT JOIN week_pauses wp ON wp.user_id = su.id
    LEFT JOIN month_pauses mp ON mp.user_id = su.id
    LEFT JOIN user_satisfaction us ON us.user_id = su.id
    GROUP BY su.department_id, d.name
    ORDER BY total_pauses_week DESC, department_name ASC
  `
  const { rows: departmentRows } = await pool.query(departmentQuery, params)

  const topRatedQuery = `
    ${scopedUsersCTE},
    rated AS (
      SELECT
        es.video_hash_ids[1] AS wistia_id,
        es.satisfaction_level
      FROM exercise_satisfaction es
      JOIN scoped_users su ON su.id = es.user_id
      WHERE array_length(es.video_hash_ids, 1) > 0
    )
    SELECT
      COALESCE(v.titulo, 'Ejercicio') AS title,
      v.wistia_id,
      COUNT(*)::int AS ratings,
      COALESCE(ROUND(AVG(rated.satisfaction_level), 2), 0)::numeric AS avg_satisfaction
    FROM rated
    LEFT JOIN videos v ON v.wistia_id = rated.wistia_id
    GROUP BY v.titulo, v.wistia_id
    HAVING COUNT(*) >= 3
    ORDER BY avg_satisfaction DESC, ratings DESC
    LIMIT 5
  `
  const { rows: topRatedRows } = await pool.query(topRatedQuery, params)
  const topRatedExercises = topRatedRows.map((row) => ({
    title: row.title || "Ejercicio",
    wistia_id: row.wistia_id,
    ratings: Number(row.ratings || 0),
    avg_satisfaction: Number(row.avg_satisfaction || 0),
  }))

  return {
    summary,
    categories: categoryRows,
    weeklyTrend: weeklyRows,
    dailyTrend: dailyRows,
    monthlyTrend: monthlyRows,
    departments: departmentRows,
    topRatedExercises,
  }
}
