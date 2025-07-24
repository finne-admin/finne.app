    import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

    const supabase = createClientComponentClient()

    // Tipos
    type ConditionType =
    | 'pausas_semana'
    | 'dias_consecutivos_con_pausa'
    | 'ejercicios_brazos'
    | 'ejercicios_piernas'
    | 'ejercicios_core'
    | 'ejercicios_movilidad'
    | 'pausas_en_dia'
    | 'dias_completos'
    | 'max_dias_sin_pausa'
    | 'recupera_racha'
    | 'hora_inesperada'
    | 'encuesta_participada'
    | 'ranking_final'
    | 'mejora_semanal'
    | 'ejercicio_favorito'
    | 'dias_laborales_con_pausa'
    | 'circuito_completo'
    // añade más aquí según tus logros

    interface Achievement {
    id: string
    title: string
    condition_type: ConditionType
    condition_value: number | string
    category?: string | null
    }

    // Función principal
    export async function checkAchievements(userId: string, eventType: string, extraData?: any) {
    // Carga todos los logros del catálogo
    const { data: catalog, error } = await supabase
        .from('achievements_catalog')
        .select('*')

    if (error || !catalog) {
        console.error('Error al cargar el catálogo de logros', error)
        return
    }

    for (const logro of catalog) {
        const alreadyEarned = await hasAchievement(userId, logro.id)
        if (alreadyEarned) continue

        const met = await evaluateCondition(userId, logro, extraData)
        if (met) {
        await grantAchievement(userId, logro.id)
        }
    }
    }

    // Comprueba si el usuario ya tiene ese logro
    async function hasAchievement(userId: string, achievementId: string) {
    const { data, error } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .maybeSingle()

    return !!data
    }

    // Otorga el logro al usuario
    async function grantAchievement(userId: string, achievementId: string) {
    const { data: logroData, error: errorFetch } = await supabase
        .from('achievements_catalog')
        .select('title, description')
        .eq('id', achievementId)
        .maybeSingle()

    if (errorFetch || !logroData) {
        console.error(`Error obteniendo datos del logro ${achievementId}`, errorFetch)
        return
    }

    const { error: errorInsert } = await supabase
        .from('user_achievements')
        .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
        completado: true,
        reclamado: false
        })

    if (errorInsert) {
        console.error(`Error al guardar el logro ${achievementId} para ${userId}`, errorInsert)
        return
    }

    // Aviso visual
    showAchievementPopup(logroData.title, logroData.description)
    }


    // Evaluador general
    async function evaluateCondition(userId: string, logro: Achievement, extraData?: any): Promise<boolean> {
    switch (logro.condition_type) {
        case 'pausas_semana':
        return await getWeeklyPauseCount(userId) >= Number(logro.condition_value)

        case 'dias_consecutivos_con_pausa':
        return await getStreak(userId) >= Number(logro.condition_value)

        case 'ejercicios_brazos':
        case 'ejercicios_piernas':
        case 'ejercicios_core':
        case 'ejercicios_movilidad':
        return await getExerciseCount(userId, logro.condition_type) >= Number(logro.condition_value)

        case 'pausas_en_dia':
        return await getTodaysPauseCount(userId) >= Number(logro.condition_value)

        case 'dias_completos':
        return await getFullDaysWithAllPauses(userId) >= Number(logro.condition_value)

        case 'max_dias_sin_pausa':
        return await hasNoLongBreaks(userId, Number(logro.condition_value))

        case 'recupera_racha':
        return await recoveredStreak(userId, Number(logro.condition_value))

        case 'hora_inesperada':
        return await didPauseAtUnexpectedTime(userId, extraData)

        case 'encuesta_participada':
        return await hasParticipatedInSurvey(userId)

        case 'ranking_final':
        return await checkRankingPosition(userId, Number(logro.condition_value))

        case 'mejora_semanal':
        return await improvedComparedToLastWeek(userId)

        case 'ejercicio_favorito':
        return await hasMarkedFavorite(userId)

        case 'dias_laborales_con_pausa':
        return await hasPausedXWorkingDaysInARow(userId, Number(logro.condition_value))

        case 'circuito_completo':
        return await didCompleteFullCircuit(userId)

        default:
        return false
    }
    }


    // 🔽 Funciones dummy por ahora, puedes implementarlas una a una:
    async function getWeeklyPauseCount(userId: string): Promise<number> {
    return 0
    }
    async function getStreak(userId: string): Promise<number> {
    return 0
    }
    async function getExerciseCount(userId: string, category?: string): Promise<number> {
    return 0
    }

    // Obtiene el número de pausas activas del usuario en la semana actual

    async function getTodaysPauseCount(userId: string): Promise<number> {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const { count, error } = await supabase
        .from('active_pauses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())

    if (error) {
        console.error('Error al contar pausas de hoy', error)
        return 0
    }

    return count ?? 0
    }

    async function getFullDaysWithAllPauses(userId: string): Promise<number> {
    return 0
    }
    async function hasNoLongBreaks(userId: string, maxDays: number): Promise<boolean> {
    return false
    }
    async function recoveredStreak(userId: string, minDays: number): Promise<boolean> {
    return false
    }
    async function didPauseAtUnexpectedTime(userId: string, extraData: any): Promise<boolean> {
    return false
    }
    async function hasParticipatedInSurvey(userId: string): Promise<boolean> {
    return false
    }
    async function checkRankingPosition(userId: string, maxPosition: number): Promise<boolean> {
    return false
    }
    async function improvedComparedToLastWeek(userId: string): Promise<boolean> {
    return false
    }

    // Verifica si el usuario ha marcado un ejercicio como favorito

    async function hasMarkedFavorite(userId: string): Promise<boolean> {
    const { count, error } = await supabase
        .from('exercise_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) {
        console.error('Error comprobando favoritos del usuario', error)
        return false
    }

    return (count ?? 0) >= 1
    }

    async function hasPausedXWorkingDaysInARow(userId: string, days: number): Promise<boolean> {
    return false
    }
    async function didCompleteFullCircuit(userId: string): Promise<boolean> {
    return false
    }








function showAchievementPopup(title: string, description?: string) {
  if (typeof window === 'undefined') return

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.bottom = '20px'
  div.style.right = '20px'
  div.style.background = '#111'
  div.style.color = 'white'
  div.style.padding = '16px'
  div.style.borderRadius = '12px'
  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
  div.style.zIndex = '9999'
  div.style.fontFamily = 'sans-serif'
  div.style.fontSize = '14px'
  div.style.maxWidth = '280px'
  div.innerHTML = `<strong>🎉 ¡Logro desbloqueado!</strong><br>${title}${description ? `<br><span style="opacity:0.8">${description}</span>` : ''}`

  document.body.appendChild(div)

  setTimeout(() => {
    div.style.opacity = '0'
    div.style.transition = 'opacity 0.8s ease-out'
    setTimeout(() => div.remove(), 1000)
  }, 3000)
}
