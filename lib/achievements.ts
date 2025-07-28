    import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
    import { DateTime } from 'luxon'
    import { getActiveStreak } from '@/components/utils/getActiveStreak'

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
    const now = new Date()

    // Calcular lunes de esta semana (lunes = 1, domingo = 0)
    const dayOfWeek = now.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const monday = new Date(now)
    monday.setDate(now.getDate() - daysSinceMonday)
    monday.setHours(0, 0, 0, 0)

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4) // viernes
    friday.setHours(23, 59, 59, 999)

    const { count, error } = await supabase
        .from('active_pauses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', monday.toISOString())
        .lte('created_at', friday.toISOString())

    if (error) {
        console.error('Error al contar pausas de lunes a viernes', error)
        return 0
    }

    return count ?? 0
    }

    async function getStreak(userId: string): Promise<number> {
    const desde = DateTime.now().minus({ days: 30 }).toISO()

    const { data, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', desde)

    if (error || !data) {
        console.error('Error obteniendo pausas para racha:', error)
        return 0
    }

    const fechas = data
        .map(p =>
        DateTime.fromISO(p.created_at, { zone: 'utc' })
            .setZone('Europe/Madrid')
            .toISODate()
        )
        .filter((d): d is string => typeof d === 'string')

    return getActiveStreak(fechas)
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
    const desde = DateTime.now().minus({ days: 60 }).startOf('day')

    const { data, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', desde.toISO())

    if (error || !data) {
        console.error('Error obteniendo pausas por día completo:', error)
        return 0
    }

    const conteoPorDia: Record<string, number> = {}

    for (const row of data) {
        const fechaObj = DateTime.fromISO(row.created_at, { zone: 'utc' }).setZone('Europe/Madrid')
        const fecha = fechaObj.toISODate()

        if (!fecha) continue // ignora si la fecha es null 
        if (fechaObj.weekday > 5) continue // saltar fin de semana

        conteoPorDia[fecha] = (conteoPorDia[fecha] || 0) + 1
    }

    const DIAS_COMPLETOS_REQUIEREN = 3 // por ejemplo: 3 pausas diarias

    const diasCompletos = Object.values(conteoPorDia)
        .filter(pausas => pausas >= DIAS_COMPLETOS_REQUIEREN).length

    return diasCompletos
    }


    async function hasNoLongBreaks(userId: string, maxDays: number): Promise<boolean> {
    const desde = DateTime.now().minus({ days: 60 }).startOf('day') // 2 meses de historial

    const { data, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', desde.toISO())

    if (error || !data) {
        console.error('Error obteniendo pausas para detectar descansos largos:', error)
        return false
    }

    const fechasConPausa = new Set(
        data
        .map(p =>
            DateTime.fromISO(p.created_at, { zone: 'utc' })
            .setZone('Europe/Madrid')
            .toISODate()
        )
    )

    let diasSinPausa = 0
    let diaActual = desde

    while (diaActual < DateTime.now().startOf('day')) {
        const iso = diaActual.toISODate()

        if (diaActual.weekday <= 5) { // solo lunes a viernes
        if (!fechasConPausa.has(iso)) {
            diasSinPausa++
            if (diasSinPausa > maxDays) {
            return false // tuvo un hueco demasiado largo
            }
        } else {
            diasSinPausa = 0 // reiniciamos racha sin pausa
        }
        }

        diaActual = diaActual.plus({ days: 1 })
    }

    return true
    }

    async function recoveredStreak(userId: string, minDays: number): Promise<boolean> {
    const desde = DateTime.now().minus({ days: 60 }).toISO() // 2 meses de margen

    const { data, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', desde)

    if (error || !data) {
        console.error('Error recuperando historial de pausas para racha:', error)
        return false
    }

    const fechas = data
        .map(p =>
        DateTime.fromISO(p.created_at, { zone: 'utc' })
            .setZone('Europe/Madrid')
            .toISODate()
        )
        .filter((d): d is string => typeof d === 'string')

    const uniqueDates = Array.from(new Set(fechas))
    const parsedDates = uniqueDates
        .map((d) => DateTime.fromISO(d).startOf('day'))
        .filter((d) => d.weekday <= 5) // solo L-V
        .sort((a, b) => a.toMillis() - b.toMillis()) // orden ascendente

    let maxRecovered = 0
    let currentStreak = 0
    let previousDate: DateTime | null = null

    for (const date of parsedDates) {
        if (!previousDate) {
        currentStreak = 1
        } else {
        const diff = previousDate.diff(date, 'days').days
        const expected = isFriday(previousDate) ? 3 : 1 // salta fin de semana

        if (date.diff(previousDate, 'days').days === expected) {
            currentStreak++
        } else {
            if (currentStreak >= minDays) {
            maxRecovered = currentStreak
            }
            currentStreak = 1
        }
        }
        previousDate = date
    }

    // Final
    return currentStreak >= minDays
    }

    function isFriday(date: DateTime): boolean {
    return date.weekday === 5
    }

    async function didPauseAtUnexpectedTime(userId: string, extraData: any): Promise<boolean> {
    return false
    }
    async function hasParticipatedInSurvey(userId: string): Promise<boolean> {
    return false
    }

    // Verifica si el usuario está en el ranking y en la posición correcta

    async function checkRankingPosition(userId: string, maxPosition: number): Promise<boolean> {
    const { data: allUsers, error } = await supabase
        .from('users')
        .select('id, periodical_exp')

    if (error || !allUsers) {
        console.error('Error obteniendo ranking desde users', error)
        return false
    }

    const ordenados = allUsers
        .sort((a, b) => (b.periodical_exp || 0) - (a.periodical_exp || 0))
        .map((u) => u.id)

    const posicion = ordenados.indexOf(userId) + 1 // posiciones empiezan en 1

    return posicion > 0 && posicion <= maxPosition
    }

    async function improvedComparedToLastWeek(userId: string): Promise<boolean> {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    // Semana actual (lunes a viernes)
    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - daysSinceMonday)
    thisMonday.setHours(0, 0, 0, 0)

    const thisFriday = new Date(thisMonday)
    thisFriday.setDate(thisMonday.getDate() + 4)
    thisFriday.setHours(23, 59, 59, 999)

    // Semana anterior (lunes a viernes)
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(thisMonday.getDate() - 7)

    const lastFriday = new Date(thisFriday)
    lastFriday.setDate(thisFriday.getDate() - 7)

    // Contar pausas de esta semana
    const { count: thisWeekCount, error: thisError } = await supabase
        .from('active_pauses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', thisMonday.toISOString())
        .lte('created_at', thisFriday.toISOString())

    // Contar pausas de la semana anterior
    const { count: lastWeekCount, error: lastError } = await supabase
        .from('active_pauses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', lastMonday.toISOString())
        .lte('created_at', lastFriday.toISOString())

    if (thisError || lastError) {
        console.error('Error al comparar pausas semanales', thisError || lastError)
        return false
    }

    return (thisWeekCount ?? 0) > (lastWeekCount ?? 0)
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
    const desde = DateTime.now().minus({ days: 60 }).startOf('day')

    const { data, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', desde.toISO())

    if (error || !data) {
        console.error('Error recuperando historial de pausas para racha larga:', error)
        return false
    }

    const fechas = data
        .map(p =>
        DateTime.fromISO(p.created_at, { zone: 'utc' })
            .setZone('Europe/Madrid')
            .toISODate()
        )
        .filter((d): d is string => typeof d === 'string')

    const unicas = Array.from(new Set(fechas))
        .map(d => DateTime.fromISO(d))
        .filter(d => d.weekday <= 5)
        .sort((a, b) => a.toMillis() - b.toMillis())

    let streak = 0
    let maxStreak = 0
    let prev: DateTime | null = null

    for (const date of unicas) {
        if (!prev) {
        streak = 1
        } else {
        const diff = date.diff(prev, 'days').days
        const expected = isFriday(prev) ? 3 : 1 // saltar finde

        if (diff === expected) {
            streak++
        } else {
            streak = 1
        }
        }

        maxStreak = Math.max(maxStreak, streak)
        prev = date
    }

    return maxStreak >= days
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
