import { DateTime } from "luxon";
import { getPool } from "../config/dbManager";
import { calculateWorkdayStreak } from "../utils/streak";
import { getUserRankingPosition } from "../db/queries/milestonesQueries";
import { addUserXP } from "../db/queries/xpQueries";

const TIMEZONE = "Europe/Madrid";
const FULL_DAY_REQUIRED_SESSIONS = 3;

type ConditionType =
  | "pausas_semana"
  | "dias_consecutivos_con_pausa"
  | "ejercicios_brazos"
  | "ejercicios_piernas"
  | "ejercicios_core"
  | "ejercicios_movilidad"
  | "pausas_en_dia"
  | "dias_completos"
  | "max_dias_sin_pausa"
  | "recupera_racha"
  | "hora_inesperada"
  | "encuesta_participada"
  | "ranking_final"
  | "mejora_semanal"
  | "ejercicio_favorito"
  | "dias_laborales_con_pausa"
  | "circuito_completo"
  | "pending_mes_constante"
  | "pending_consistencia_semanal"
  | "nivel_usuario"
  | "pending_cardio"
  | "pending_cervicales"
  | "pending_pausas_mes"
  | "pending_reincorporacion"
  | "pending_pausa_mixta"
  | "pending_completista_mes"
  | "pending_pausa_tematica"
  | "pending_usa_favorito"
  | "pending_invite_sent"
  | "pending_invite_received"
  | "pending_compañero_streak"
  | "pending_share_completed";

interface AchievementRow {
  id: string;
  title: string;
  description: string | null;
  condition_type: ConditionType;
  condition_value: string | number;
  category: string | null;
  points: number | null;
  icon: string | null;
  trigger: string | null;
  group_id: string | null;
  level: number | null;
}

export interface UnlockedAchievement {
  id: string;
  title: string;
  description: string | null;
}

export interface AchievementProgress {
  current: number;
  total: number;
}

type MemoStore = Map<string, Promise<any>>;

const memoize = <T>(store: MemoStore, key: string, factory: () => Promise<T>): Promise<T> => {
  if (!store.has(key)) {
    store.set(key, factory());
  }
  return store.get(key)!;
};

const parsePgArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item : String(item)));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => item.replace(/(^"|"$)/g, "").trim())
        .filter(Boolean);
    }
    return trimmed ? [trimmed] : [];
  }
  return [];
};

const toZoneDate = (input: string | Date): DateTime =>
  DateTime.fromJSDate(typeof input === "string" ? new Date(input) : input, {
    zone: "utc",
  }).setZone(TIMEZONE);

type DbPool = Awaited<ReturnType<typeof getPool>>;

export const checkAndGrantAchievements = async (
  userId: string,
  eventType: string,
  payload?: any
): Promise<UnlockedAchievement[]> => {
  const pool = await getPool();
  // Traemos solo los logros que corresponden al trigger (eventType) o aquellos sin trigger definido (compatibilidad hacia atrás)
  const { rows: catalog } = await pool.query<AchievementRow>(
    `
      SELECT
        id,
        title,
        description,
        condition_type,
        condition_value,
        category,
        points,
        icon,
        COALESCE(trigger, '') AS trigger,
        group_id,
        level
      FROM achievements_catalog
      WHERE ($1::text IS NULL OR trigger = $1 OR trigger IS NULL OR trigger = '')
      ORDER BY COALESCE(group_id::text, id::text), COALESCE(level, 1)
    `,
    [eventType ?? null]
  );

  const unlocked: UnlockedAchievement[] = [];
  const memo = new Map<string, Promise<any>>();
  const completedIds = await getCompletedAchievementIds(pool, userId);

  // Construimos la lista de logros a evaluar: para grupos (niveles) solo el siguiente nivel pendiente
  const grouped = new Map<string, AchievementRow[]>();
  const singles: AchievementRow[] = [];

  for (const achievement of catalog) {
    if (achievement.group_id) {
      const list = grouped.get(achievement.group_id) ?? [];
      list.push(achievement);
      grouped.set(achievement.group_id, list);
    } else {
      singles.push(achievement);
    }
  }

  const toEvaluate: AchievementRow[] = [];

  // Añade el siguiente nivel pendiente de cada grupo
  for (const list of grouped.values()) {
    const ordered = list.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    const pending = ordered.find((row) => !completedIds.has(row.id));
    if (pending) {
      toEvaluate.push(pending);
    }
  }

  // Añade logros individuales no completados
  for (const ach of singles) {
    if (!completedIds.has(ach.id)) {
      toEvaluate.push(ach);
    }
  }

  for (const achievement of toEvaluate) {
    const met = await evaluateCondition(pool, userId, achievement, payload, memo);
    if (!met) continue;

    const granted = await grantAchievement(pool, userId, achievement);
    if (granted) {
      unlocked.push({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
      });
    }
  }

  return unlocked;
};

// Calcula progreso (current/total) por logro
export const getAchievementsProgress = async (userId: string): Promise<Map<string, AchievementProgress>> => {
  const pool = await getPool();
  const { rows: catalog } = await pool.query<AchievementRow>(
    `
      SELECT
        id,
        title,
        description,
        condition_type,
        condition_value,
        category,
        COALESCE(trigger, '') AS trigger,
        group_id,
        level
      FROM achievements_catalog
    `
  );

  const memo = new Map<string, Promise<any>>();
  const result = new Map<string, AchievementProgress>();

  for (const achievement of catalog) {
    const progress = await getProgressValue(pool, userId, achievement, memo);
    result.set(achievement.id, progress);
  }

  return result;
};

const getCompletedAchievementIds = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ achievement_id: string }>(
    `SELECT achievement_id FROM user_achievements WHERE user_id = $1 AND completado = true`,
    [userId]
  );
  return new Set(rows.map((r) => r.achievement_id));
};

const grantAchievement = async (pool: DbPool, userId: string, achievement: AchievementRow) => {
  const { rowCount } = await pool.query(
    `
      INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, completado, reclamado, level)
      VALUES ($1, $2, NOW(), true, false, $3)
      ON CONFLICT (user_id, achievement_id) DO NOTHING
      RETURNING achievement_id
    `,
    [userId, achievement.id, achievement.level ?? null]
  );
  if ((rowCount ?? 0) > 0) {
    await autoClaimAchievement(pool, userId, achievement);
    return true;
  }
  return false;
};

const autoClaimAchievement = async (
  pool: DbPool,
  userId: string,
  achievement: AchievementRow
) => {
  await pool.query(
    `UPDATE user_achievements
     SET reclamado = true
     WHERE user_id = $1 AND achievement_id = $2`,
    [userId, achievement.id]
  );

  const points = Number(achievement.points ?? 0);
  if (!points) return;

  try {
    await addUserXP(userId, points, {
      source: "achievement",
      achievementId: achievement.id,
      achievement_title: achievement.title,
      achievement_icon: achievement.icon,
    });
  } catch (error) {
    console.error("Error auto-claiming achievement XP:", error);
  }
};

const getProgressValue = async (
  pool: DbPool,
  userId: string,
  achievement: AchievementRow,
  memo: MemoStore
): Promise<AchievementProgress> => {
  const total = Number(achievement.condition_value ?? 0) || 1;
  let current = 0;

  switch (achievement.condition_type) {
    case "pausas_semana":
      current = await memoize(memo, "weeklyPauseCount", () => getWeeklyPauseCount(pool, userId));
      break;
    case "dias_consecutivos_con_pausa":
      current = await memoize(memo, "workdayStreak", () => getCurrentWorkdayStreak(pool, userId));
      break;
    case "ejercicios_brazos":
    case "ejercicios_piernas":
    case "ejercicios_core":
    case "ejercicios_movilidad":
    case "pending_cardio":
    case "pending_cervicales":
      current = await memoize(memo, `exercise:${achievement.condition_type}`, () =>
        getExerciseCount(pool, userId, achievement.condition_type)
      );
      break;
    case "pausas_en_dia":
      current = await memoize(memo, "todaysPauseCount", () => getTodaysPauseCount(pool, userId));
      break;
    case "dias_completos":
      current = await memoize(memo, "fullDays", () => getFullDaysWithAllPauses(pool, userId));
      break;
    case "max_dias_sin_pausa":
      current = (await memoize(memo, `noLongBreaks:${achievement.condition_value}`, () =>
        hasNoLongBreaks(pool, userId, Number(achievement.condition_value))
      ))
        ? total
        : 0;
      break;
    case "recupera_racha":
      current = (await memoize(memo, `recovered:${achievement.condition_value}`, () =>
        recoveredStreak(pool, userId, Number(achievement.condition_value))
      ))
        ? total
        : 0;
      break;
    case "ranking_final": {
      const rank = await memoize(memo, "rankingPosition", () =>
        checkRankingPositionValue(pool, userId)
      );
      if (rank !== null) {
        current = rank <= 0 ? 0 : Math.max(0, total - rank + 1);
      }
      break;
    }
    case "mejora_semanal":
      current = (await memoize(memo, "improvedWeek", () => improvedComparedToLastWeek(pool, userId)))
        ? total
        : 0;
      break;
    case "ejercicio_favorito":
      current = (await memoize(memo, "favoriteMarked", () => hasMarkedFavorite(pool, userId))) ? total : 0;
      break;
    case "dias_laborales_con_pausa":
      current = await memoize(memo, `workingDays:${achievement.condition_value}`, () =>
        maxWorkingDaysStreak(pool, userId)
      );
      break;
    case "circuito_completo":
      current = (await memoize(memo, "fullCircuit", () => didCompleteFullCircuit(pool, userId))) ? total : 0;
      break;
    case "pending_mes_constante": {
      const counts = await memoize(memo, "weeklyCounts:4", () => getWeeklyPauseCounts(pool, userId, 4));
      current = counts.length ? Math.min(...counts) : 0;
      break;
    }
    case "pending_consistencia_semanal": {
      const requiredWeeks = Math.max(Number(achievement.condition_value) || 0, 2);
      const counts = await memoize(memo, `weeklyCounts:${requiredWeeks}`, () =>
        getWeeklyPauseCounts(pool, userId, requiredWeeks)
      );
      current = Math.min(getLongestNonDecreasingStreak(counts), total);
      break;
    }
    case "nivel_usuario": {
      current = await memoize(memo, "userLevel", () => getUserLevel(pool, userId));
      break;
    }
    case "pending_pausas_mes":
      current = await memoize(memo, "monthlyPauseCount", () => countPausesSince(pool, userId, 30));
      break;
    case "pending_reincorporacion":
      current = (await memoize(memo, "reincorporacionProgress", () =>
        hasReincorporationAfterBreak(pool, userId, 7, Number(achievement.condition_value) || 2)
      ))
        ? total
        : 0;
      break;
    case "pending_pausa_mixta":
      current = await memoize(memo, "mixedPauses", () =>
        countMixedCategoryPausesSince(pool, userId, 7)
      );
      break;
    case "pending_completista_mes": {
      const counts = await memoize(memo, "monthlyCategoryCounts", () =>
        countCategoryOccurrencesSince(pool, userId, 30)
      );
      current = REQUIRED_CATEGORIES.length
        ? Math.min(...REQUIRED_CATEGORIES.map((cat) => counts.get(cat) ?? 0))
        : 0;
      break;
    }
    case "pending_pausa_tematica":
      current = await memoize(memo, "thematicPauses", () =>
        countSameCategoryPausesSince(pool, userId, 30)
      );
      break;
    case "pending_usa_favorito":
      current = await memoize(memo, "favoritePauseCount", () =>
        countFavoritePauses(pool, userId)
      );
      break;
    case "pending_invite_sent":
      current = await memoize(memo, "inviteSent", () =>
        countAcceptedInvites(pool, userId, "sent")
      );
      break;
    case "pending_invite_received":
      current = await memoize(memo, "inviteReceived", () =>
        countAcceptedInvites(pool, userId, "received")
      );
      break;
    case "pending_share_completed":
      current = await memoize(memo, "shareCompleted", () =>
        countShareCompletions(pool, userId)
      );
      break;
    case "pending_compañero_streak":
      current = await memoize(memo, "companionStreak", () =>
        getCompanionStreakFromSessions(pool, userId)
      );
      break;
    default:
      current = 0;
  }

  return { current: Math.min(current, total), total };
};

const evaluateCondition = async (
  pool: DbPool,
  userId: string,
  achievement: AchievementRow,
  extraData: any,
  memo: MemoStore
): Promise<boolean> => {
  switch (achievement.condition_type) {
    case "pausas_semana":
      return (
        (await memoize(memo, "weeklyPauseCount", () => getWeeklyPauseCount(pool, userId))) >=
        Number(achievement.condition_value)
      );
    case "dias_consecutivos_con_pausa":
      return (
        (await memoize(memo, "workdayStreak", () => getCurrentWorkdayStreak(pool, userId))) >=
        Number(achievement.condition_value)
      );
    case "ejercicios_brazos":
    case "ejercicios_piernas":
    case "ejercicios_core":
    case "ejercicios_movilidad":
    case "pending_cardio":
    case "pending_cervicales":
      return (
        (await memoize(memo, `exercise:${achievement.condition_type}`, () =>
          getExerciseCount(pool, userId, achievement.condition_type)
        )) >= Number(achievement.condition_value)
      );
    case "pausas_en_dia":
      return (
        (await memoize(memo, "todaysPauseCount", () => getTodaysPauseCount(pool, userId))) >=
        Number(achievement.condition_value)
      );
    case "dias_completos":
      return (
        (await memoize(memo, "fullDays", () => getFullDaysWithAllPauses(pool, userId))) >=
        Number(achievement.condition_value)
      );
    case "max_dias_sin_pausa":
      return await memoize(memo, `noLongBreaks:${achievement.condition_value}`, () =>
        hasNoLongBreaks(pool, userId, Number(achievement.condition_value))
      );
    case "recupera_racha":
      return await memoize(memo, `recovered:${achievement.condition_value}`, () =>
        recoveredStreak(pool, userId, Number(achievement.condition_value))
      );
    case "hora_inesperada":
      return false;
    case "encuesta_participada":
      return false;
    case "ranking_final":
      return await memoize(memo, "rankingPosition", () =>
        checkRankingPosition(pool, userId, Number(achievement.condition_value))
      );
    case "mejora_semanal":
      return await memoize(memo, "improvedWeek", () => improvedComparedToLastWeek(pool, userId));
    case "ejercicio_favorito":
      return await memoize(memo, "favoriteMarked", () => hasMarkedFavorite(pool, userId));
    case "dias_laborales_con_pausa":
      return await memoize(memo, `workingDays:${achievement.condition_value}`, () =>
        hasPausedXWorkingDaysInARow(pool, userId, Number(achievement.condition_value))
      );
    case "circuito_completo":
      return await memoize(memo, "fullCircuit", () => didCompleteFullCircuit(pool, userId));
    case "pending_mes_constante": {
      const minWeekly = Number(achievement.condition_value) || 0;
      if (!minWeekly) return false;
      const counts = await memoize(memo, "weeklyCounts:4", () => getWeeklyPauseCounts(pool, userId, 4));
      return counts.length === 4 && counts.every((value) => value >= minWeekly);
    }
    case "pending_consistencia_semanal": {
      const requiredWeeks = Math.max(Number(achievement.condition_value) || 0, 2);
      const counts = await memoize(memo, `weeklyCounts:${requiredWeeks}`, () =>
        getWeeklyPauseCounts(pool, userId, requiredWeeks)
      );
      return hasNonDecreasingStreak(counts, requiredWeeks);
    }
    case "nivel_usuario": {
      const targetLevel = Number(achievement.condition_value) || 0;
      if (!targetLevel) return false;
      const level = await memoize(memo, "userLevel", () => getUserLevel(pool, userId));
      return level >= targetLevel;
    }
    case "pending_pausas_mes":
      return (
        (await memoize(memo, "monthlyPauseCount", () => countPausesSince(pool, userId, 30))) >=
        Number(achievement.condition_value)
      );
    case "pending_reincorporacion": {
      const requiredSameDay = Number(achievement.condition_value) || 2;
      return await memoize(memo, `reincorporacion:${requiredSameDay}`, () =>
        hasReincorporationAfterBreak(pool, userId, 7, requiredSameDay)
      );
    }
    case "pending_pausa_mixta":
      return (
        (await memoize(memo, "mixedPauses", () =>
          countMixedCategoryPausesSince(pool, userId, 7)
        )) >= Number(achievement.condition_value)
      );
    case "pending_completista_mes": {
      const minPerCategory = Number(achievement.condition_value) || 1;
      const counts = await memoize(memo, "monthlyCategoryCounts", () =>
        countCategoryOccurrencesSince(pool, userId, 30)
      );
      return REQUIRED_CATEGORIES.every(
        (cat) => (counts.get(cat) ?? 0) >= minPerCategory
      );
    }
    case "pending_pausa_tematica":
      return (
        (await memoize(memo, "thematicPauses", () =>
          countSameCategoryPausesSince(pool, userId, 30)
        )) >= Number(achievement.condition_value)
      );
    case "pending_usa_favorito":
      return (
        (await memoize(memo, "favoritePauseCount", () => countFavoritePauses(pool, userId))) >=
        Number(achievement.condition_value)
      );
    case "pending_invite_sent":
      return (
        (await memoize(memo, "inviteSent", () =>
          countAcceptedInvites(pool, userId, "sent")
        )) >= Number(achievement.condition_value)
      );
    case "pending_invite_received":
      return (
        (await memoize(memo, "inviteReceived", () =>
          countAcceptedInvites(pool, userId, "received")
        )) >= Number(achievement.condition_value)
      );
    case "pending_share_completed":
      return (
        (await memoize(memo, "shareCompleted", () =>
          countShareCompletions(pool, userId)
        )) >= Number(achievement.condition_value)
      );
    case "pending_compañero_streak":
      return (
        (await memoize(memo, "companionStreak", () =>
          getCompanionStreakFromSessions(pool, userId)
        )) >= Number(achievement.condition_value)
      );
    default:
      return false;
  }
};

const getWeeklyPauseCount = async (pool: DbPool, userId: string) => {
  const now = DateTime.now().setZone(TIMEZONE);
  const monday = now.minus({ days: now.weekday - 1 }).startOf("day");
  const friday = monday.plus({ days: 4 }).endOf("day");

  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
        AND created_at <= $3
    `,
    [userId, monday.toUTC().toISO(), friday.toUTC().toISO()]
  );
  return rows[0]?.total ?? 0;
};

const fetchPauseDatesSince = async (
  pool: DbPool,
  userId: string,
  since: DateTime
) => {
  const { rows } = await pool.query<{ created_at: Date }>(
    `
      SELECT created_at
      FROM active_pauses
      WHERE user_id = $1 AND created_at >= $2
      ORDER BY created_at DESC
    `,
    [userId, since.toUTC().toISO()]
  );
  return rows.map((row) => row.created_at);
};

const getCurrentWorkdayStreak = async (pool: DbPool, userId: string) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 30 });
  const dates = await fetchPauseDatesSince(pool, userId, since);
  return calculateWorkdayStreak(
    dates.map((date) => date.toISOString()),
    TIMEZONE
  );
};

const getExerciseCount = async (
  pool: DbPool,
  userId: string,
  conditionType: ConditionType
) => {
  const map: Record<string, string> = {
    ejercicios_brazos: "miembro superior",
    ejercicios_piernas: "miembro inferior",
    ejercicios_core: "core",
    ejercicios_movilidad: "movilidad",
    pending_cardio: "cardio",
    pending_cervicales: "cervicales",
  };
  const target = map[conditionType];
  if (!target) return 0;

  const { rows: pauseRows } = await pool.query<{ video1_id: string | null; video2_id: string | null }>(
    `
      SELECT video1_id, video2_id
      FROM active_pauses
      WHERE user_id = $1
    `,
    [userId]
  );

  const occurrences = pauseRows.flatMap((row) =>
    [row.video1_id, row.video2_id].filter(Boolean) as string[]
  );
  if (occurrences.length === 0) return 0;

  const uniqueIds = Array.from(new Set(occurrences));
  const { rows: videos } = await pool.query<{ id: string; categorias: any }>(
    `
      SELECT id, categorias
      FROM videos
      WHERE id = ANY($1::uuid[])
    `,
    [uniqueIds]
  );

  const categoriesById = new Map<string, string[]>();
  for (const video of videos) {
    categoriesById.set(video.id, parsePgArray(video.categorias));
  }

  let count = 0;
  for (const id of occurrences) {
    const categories = categoriesById.get(id) ?? [];
    if (categories.includes(target)) {
      count += 1;
    }
  }

  return count;
};

const getTodaysPauseCount = async (pool: DbPool, userId: string) => {
  const start = DateTime.now().setZone(TIMEZONE).startOf("day");
  const end = start.endOf("day");

  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
        AND created_at <= $3
    `,
    [userId, start.toUTC().toISO(), end.toUTC().toISO()]
  );

  return rows[0]?.total ?? 0;
};

const getPausesInRange = async (
  pool: DbPool,
  userId: string,
  since: DateTime
) => {
  const { rows } = await pool.query<{ created_at: Date }>(
    `
      SELECT created_at
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
      ORDER BY created_at ASC
    `,
    [userId, since.toUTC().toISO()]
  );
  return rows;
};

const getFullDaysWithAllPauses = async (pool: DbPool, userId: string) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 60 }).startOf("day");
  const rows = await getPausesInRange(pool, userId, since);

  const counts = new Map<string, number>();
  for (const row of rows) {
    const dt = toZoneDate(row.created_at);
    if (dt.weekday > 5) continue;
    const key = dt.toISODate();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.values()).filter((value) => value >= FULL_DAY_REQUIRED_SESSIONS).length;
};

const hasNoLongBreaks = async (pool: DbPool, userId: string, maxDays: number) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 60 }).startOf("day");
  const rows = await getPausesInRange(pool, userId, since);

  const daysWithPause = new Set<string>();
  for (const row of rows) {
    const dt = toZoneDate(row.created_at);
    if (dt.weekday <= 5) {
      const iso = dt.toISODate();
      if (iso) daysWithPause.add(iso);
    }
  }

  let daysWithout = 0;
  let cursor = since;
  const today = DateTime.now().setZone(TIMEZONE).startOf("day");

  while (cursor < today) {
    if (cursor.weekday <= 5) {
      if (!daysWithPause.has(cursor.toISODate()!)) {
        daysWithout += 1;
        if (daysWithout > maxDays) {
          return false;
        }
      } else {
        daysWithout = 0;
      }
    }
    cursor = cursor.plus({ days: 1 });
  }

  return true;
};

const recoveredStreak = async (pool: DbPool, userId: string, minDays: number) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 60 });
  const dates = await fetchPauseDatesSince(pool, userId, since);

  const uniqueDates = Array.from(
    new Set(
      dates
        .map((date) => toZoneDate(date).startOf("day"))
        .filter((dt) => dt.weekday <= 5)
        .map((dt) => dt.toISODate())
        .filter(Boolean) as string[]
    )
  )
    .map((iso) => DateTime.fromISO(iso))
    .sort((a, b) => a.toMillis() - b.toMillis());

  let maxStreak = 0;
  let current = 0;
  let prev: DateTime | null = null;

  for (const date of uniqueDates) {
    if (!prev) {
      current = 1;
    } else {
      const expected = prev.weekday === 5 ? 3 : 1;
      const diff = date.diff(prev, "days").days;
      current = diff === expected ? current + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, current);
    prev = date;
  }

  return maxStreak >= minDays;
};

const checkRankingPosition = async (
  pool: DbPool,
  userId: string,
  maxPosition: number
) => {
  const row = await getUserRankingPosition(userId);
  if (!row) return false;
  return row.rank > 0 && row.rank <= maxPosition;
};

const checkRankingPositionValue = async (pool: DbPool, userId: string) => {
  const row = await getUserRankingPosition(userId);
  if (!row || row.rank <= 0) return null;
  return row.rank;
};

const improvedComparedToLastWeek = async (pool: DbPool, userId: string) => {
  const now = DateTime.now().setZone(TIMEZONE);
  const mondayOfWeek = now.minus({ days: now.weekday - 1 }).startOf("day");
  const fridayOfWeek = mondayOfWeek.plus({ days: 4 }).endOf("day");
  const previousMonday = mondayOfWeek.minus({ days: 7 });
  const previousFriday = fridayOfWeek.minus({ days: 7 });

  const current = await countPausesBetween(pool, userId, mondayOfWeek, fridayOfWeek);
  const previous = await countPausesBetween(pool, userId, previousMonday, previousFriday);

  return current > previous;
};

const countPausesBetween = async (
  pool: DbPool,
  userId: string,
  start: DateTime,
  end: DateTime
) => {
  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
        AND created_at <= $3
    `,
    [userId, start.toUTC().toISO(), end.toUTC().toISO()]
  );
  return rows[0]?.total ?? 0;
};

const hasMarkedFavorite = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM exercise_favorites WHERE user_id = $1`,
    [userId]
  );
  return (rows[0]?.total ?? 0) > 0;
};

const maxWorkingDaysStreak = async (pool: DbPool, userId: string) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 60 });
  const dates = await fetchPauseDatesSince(pool, userId, since);

  const uniqueDates = Array.from(
    new Set(
      dates
        .map((date) => toZoneDate(date).startOf("day"))
        .filter((dt) => dt.weekday <= 5)
        .map((dt) => dt.toISODate())
        .filter(Boolean) as string[]
    )
  )
    .map((iso) => DateTime.fromISO(iso))
    .sort((a, b) => a.toMillis() - b.toMillis());

  let maxStreak = 0;
  let current = 0;
  let prev: DateTime | null = null;

  for (const date of uniqueDates) {
    if (!prev) {
      current = 1;
    } else {
      const expected = prev.weekday === 5 ? 3 : 1;
      const diff = date.diff(prev, "days").days;
      current = diff === expected ? current + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, current);
    prev = date;
  }

  return maxStreak;
};

const hasPausedXWorkingDaysInARow = async (
  pool: DbPool,
  userId: string,
  days: number
) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 60 });
  const dates = await fetchPauseDatesSince(pool, userId, since);

  const uniqueDates = Array.from(
    new Set(
      dates
        .map((date) => toZoneDate(date).startOf("day"))
        .filter((dt) => dt.weekday <= 5)
        .map((dt) => dt.toISODate())
        .filter(Boolean) as string[]
    )
  )
    .map((iso) => DateTime.fromISO(iso))
    .sort((a, b) => a.toMillis() - b.toMillis());

  let maxStreak = 0;
  let current = 0;
  let prev: DateTime | null = null;

  for (const date of uniqueDates) {
    if (!prev) {
      current = 1;
    } else {
      const expected = prev.weekday === 5 ? 3 : 1;
      const diff = date.diff(prev, "days").days;
      current = diff === expected ? current + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, current);
    prev = date;
  }

  return maxStreak >= days;
};

const didCompleteFullCircuit = async (pool: DbPool, userId: string) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days: 7 });
  const { rows } = await pool.query<{ video1_id: string | null; video2_id: string | null }>(
    `
      SELECT video1_id, video2_id
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
    `,
    [userId, since.toUTC().toISO()]
  );

  const videoIds = Array.from(
    new Set(rows.flatMap((row) => [row.video1_id, row.video2_id].filter(Boolean) as string[]))
  );
  if (videoIds.length === 0) return false;

  const { rows: videos } = await pool.query<{ id: string; categorias: any }>(
    `
      SELECT id, categorias
      FROM videos
      WHERE id = ANY($1::uuid[])
    `,
    [videoIds]
  );

  const required = ["miembro superior", "miembro inferior", "core", "movilidad"];
  const achieved = new Set<string>();

  for (const video of videos) {
    const categories = parsePgArray(video.categorias);
    for (const category of categories) {
      if (required.includes(category)) {
        achieved.add(category);
      }
    }
  }

  return required.every((category) => achieved.has(category));
};

const REQUIRED_CATEGORIES = ["miembro superior", "miembro inferior", "core", "movilidad"];

const getWeeklyPauseCounts = async (pool: DbPool, userId: string, weeks: number) => {
  if (weeks <= 0) return [];
  const now = DateTime.now().setZone(TIMEZONE);
  const currentMonday = now.minus({ days: now.weekday - 1 }).startOf("day");
  const earliest = currentMonday.minus({ weeks: weeks - 1 });

  const { rows } = await pool.query<{ created_at: Date }>(
    `
      SELECT created_at
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
      ORDER BY created_at ASC
    `,
    [userId, earliest.toUTC().toISO()]
  );

  const counts = new Array<number>(weeks).fill(0);
  for (const row of rows) {
    const dt = toZoneDate(row.created_at).startOf("day");
    const diffDays = dt.diff(earliest, "days").days;
    const index = Math.floor(diffDays / 7);
    if (index >= 0 && index < weeks) {
      counts[index] += 1;
    }
  }
  return counts;
};

const hasNonDecreasingStreak = (counts: number[], required: number) => {
  if (counts.length < required) return false;
  let streak = 1;
  for (let i = 1; i < counts.length; i++) {
    if (counts[i] >= counts[i - 1]) {
      streak += 1;
      if (streak >= required) return true;
    } else {
      streak = 1;
    }
  }
  return false;
};

const getLongestNonDecreasingStreak = (counts: number[]) => {
  if (counts.length === 0) return 0;
  let streak = 0;
  let maxStreak = 0;
  let previous: number | null = null;

  for (const value of counts) {
    if (value <= 0) {
      streak = 0;
      previous = null;
      continue;
    }

    if (previous === null) {
      streak = 1;
    } else if (value >= previous) {
      streak += 1;
    } else {
      streak = 1;
    }

    previous = value;
    maxStreak = Math.max(maxStreak, streak);
  }

  return maxStreak;
};

const countPausesSince = async (pool: DbPool, userId: string, days: number) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days }).startOf("day");
  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
    `,
    [userId, since.toUTC().toISO()]
  );
  return rows[0]?.total ?? 0;
};

const hasReincorporationAfterBreak = async (
  pool: DbPool,
  userId: string,
  minGapDays: number,
  requiredSameDayPauses: number
) => {
  const { rows } = await pool.query<{ created_at: Date }>(
    `
      SELECT created_at
      FROM active_pauses
      WHERE user_id = $1
      ORDER BY created_at ASC
    `,
    [userId]
  );
  if (rows.length === 0) return false;

  const dates = rows.map((row) => toZoneDate(row.created_at).startOf("day"));
  const dayCounts = new Map<string, number>();
  for (const dt of dates) {
    const iso = dt.toISODate();
    if (!iso) continue;
    dayCounts.set(iso, (dayCounts.get(iso) ?? 0) + 1);
  }

  let prev: DateTime | null = null;
  for (const dt of dates) {
    if (prev) {
      const gap = dt.diff(prev, "days").days;
      if (gap >= minGapDays) {
        const iso = dt.toISODate();
        if (iso && (dayCounts.get(iso) ?? 0) >= requiredSameDayPauses) {
          return true;
        }
      }
    }
    prev = dt;
  }
  return false;
};

const fetchPausesWithVideosSince = async (
  pool: DbPool,
  userId: string,
  days: number
) => {
  const since = DateTime.now().setZone(TIMEZONE).minus({ days }).startOf("day");
  const { rows } = await pool.query<{ video1_id: string | null; video2_id: string | null; created_at: Date }>(
    `
      SELECT video1_id, video2_id, created_at
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
      ORDER BY created_at ASC
    `,
    [userId, since.toUTC().toISO()]
  );
  return rows;
};

const fetchVideoCategories = async (pool: DbPool, videoIds: string[]) => {
  if (videoIds.length === 0) return new Map<string, string[]>();
  const { rows } = await pool.query<{ id: string; categorias: any }>(
    `
      SELECT id, categorias
      FROM videos
      WHERE id = ANY($1::uuid[])
    `,
    [videoIds]
  );
  const map = new Map<string, string[]>();
  for (const row of rows) {
    map.set(row.id, parsePgArray(row.categorias).map((cat) => cat.toLowerCase()));
  }
  return map;
};

const countMixedCategoryPausesSince = async (
  pool: DbPool,
  userId: string,
  days: number
) => {
  const pauses = await fetchPausesWithVideosSince(pool, userId, days);
  if (pauses.length === 0) return 0;
  const videoIds = Array.from(
    new Set<string>(
      pauses.flatMap((row) => [row.video1_id, row.video2_id].filter(Boolean) as string[])
    )
  );
  const categories = await fetchVideoCategories(pool, videoIds);

  let count = 0;
  for (const row of pauses) {
    const set = new Set<string>();
    if (row.video1_id) {
      for (const cat of categories.get(row.video1_id) ?? []) set.add(cat);
    }
    if (row.video2_id) {
      for (const cat of categories.get(row.video2_id) ?? []) set.add(cat);
    }
    if (set.size >= 2) count += 1;
  }
  return count;
};

const countSameCategoryPausesSince = async (
  pool: DbPool,
  userId: string,
  days: number
) => {
  const pauses = await fetchPausesWithVideosSince(pool, userId, days);
  if (pauses.length === 0) return 0;
  const videoIds = Array.from(
    new Set<string>(
      pauses.flatMap((row) => [row.video1_id, row.video2_id].filter(Boolean) as string[])
    )
  );
  const categories = await fetchVideoCategories(pool, videoIds);

  let count = 0;
  for (const row of pauses) {
    if (!row.video1_id || !row.video2_id) continue;
    const set = new Set<string>();
    for (const cat of categories.get(row.video1_id) ?? []) set.add(cat);
    const cat2 = categories.get(row.video2_id) ?? [];
    if (cat2.length === 0) continue;
    let shared = false;
    for (const cat of cat2) {
      if (set.has(cat)) shared = true;
    }
    const union = new Set([...set, ...cat2]);
    if (shared && union.size === 1) {
      count += 1;
    }
  }
  return count;
};

const countCategoryOccurrencesSince = async (
  pool: DbPool,
  userId: string,
  days: number
) => {
  const pauses = await fetchPausesWithVideosSince(pool, userId, days);
  if (pauses.length === 0) return new Map<string, number>();
  const videoIds = Array.from(
    new Set<string>(
      pauses.flatMap((row) => [row.video1_id, row.video2_id].filter(Boolean) as string[])
    )
  );
  const categories = await fetchVideoCategories(pool, videoIds);

  const counts = new Map<string, number>();
  for (const row of pauses) {
    for (const id of [row.video1_id, row.video2_id]) {
      if (!id) continue;
      for (const cat of categories.get(id) ?? []) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
  }
  return counts;
};

const getUserLevelFromXP = (xp: number, base = 100, factor = 1.2) => {
  let level = 1;
  let required = Math.floor(base * level * factor);
  let remaining = xp;

  while (remaining >= required) {
    remaining -= required;
    level += 1;
    required = Math.floor(base * level * factor);
  }
  return level;
};

const getUserLevel = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ exp: number }>(
    `SELECT COALESCE(exp, 0) AS exp FROM users WHERE id = $1`,
    [userId]
  );
  const xp = rows[0]?.exp ?? 0;
  return getUserLevelFromXP(xp);
};

const countFavoritePauses = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM active_pauses
      WHERE user_id = $1 AND (video1_from_favorite = true OR video2_from_favorite = true)
    `,
    [userId]
  );
  return rows[0]?.total ?? 0;
};

const countAcceptedInvites = async (
  pool: DbPool,
  userId: string,
  mode: "sent" | "received"
) => {
  if (mode === "sent") {
    const { rows } = await pool.query<{ total: number }>(
      `
        SELECT COUNT(*)::int AS total
        FROM pause_invites
        WHERE sender_user_id = $1 AND status = 'accepted'
      `,
      [userId]
    );
    return rows[0]?.total ?? 0;
  }
  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM pause_invites
      WHERE status = 'accepted' AND receiver_user_id = $1
    `,
    [userId]
  );
  return rows[0]?.total ?? 0;
};

const countShareCompletions = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM shared_exercise_usage seu
      JOIN shared_exercises se ON se.id = seu.share_id
      WHERE se.owner_user_id = $1
    `,
    [userId]
  );
  return rows[0]?.total ?? 0;
};

const getCompanionStreakFromSessions = async (pool: DbPool, userId: string) => {
  const { rows } = await pool.query<{ day: string }>(
    `
      SELECT DISTINCT DATE(psp.joined_at AT TIME ZONE $2) AS day
      FROM pause_session_participants psp
      WHERE psp.user_id = $1
        AND EXISTS (
          SELECT 1 FROM pause_session_participants other
          WHERE other.session_id = psp.session_id AND other.user_id <> $1
        )
      ORDER BY day ASC
    `,
    [userId, TIMEZONE]
  );

  if (rows.length === 0) return 0;
  const days = rows.map((row) => DateTime.fromISO(row.day).startOf("day"));
  let streak = 1;
  let maxStreak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = days[i].diff(days[i - 1], "days").days;
    if (diff === 1) {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }
  return maxStreak;
};
