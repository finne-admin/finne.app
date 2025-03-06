"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Skeleton } from "@/components/ui/skeleton"
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ExerciseSatisfaction {
    id: string
    user_id: string
    video_hash_ids: string[]
    video_tags: string[]
    satisfaction_level: number
    created_at: string
}

interface StatisticsData {
    streaks: {
        current: number
        longest: number
    }
    distribution: {
        tag: string
        exercise_count: number
        total_duration: string
    }[]
    totalExercises: number
    avgSatisfaction: number
    message?: string
}

export function StatisticsDashboard() {
    const [data, setData] = useState<StatisticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (!user) {
                setError("Usuario no autenticado")
                setIsLoading(false)
                return
            }
            try {
                console.log("Obteniendo datos de ejercicios...")

                // Get raw data from exercise_satisfaction table
                const { data: rawData, error: rawError } = await supabase
                    .from("exercise_satisfaction")
                    .select("*")
                    .eq("user_id", user.id)

                console.log("Datos brutos de ejercicios:", rawData?.length ?? 0, "registros")

                if (rawError) {
                    throw new Error(`Error al obtener datos de ejercicios: ${rawError.message}`)
                }

                if (!rawData || rawData.length === 0) {
                    console.log("No se encontraron datos de ejercicios para el usuario")
                    setData({
                        streaks: { current: 0, longest: 0 },
                        distribution: [],
                        totalExercises: 0,
                        avgSatisfaction: 0,
                        message: "No se encontraron datos de ejercicios",
                    })
                    setIsLoading(false)
                    return
                }

                const exerciseData = rawData as ExerciseSatisfaction[]

                // Calculate streaks
                const streaks = calculateStreaks(exerciseData)

                // Calculate distribution
                const distribution = calculateDistribution(exerciseData)

                // Calculate total exercises and satisfaction average
                const totalExercises = exerciseData.length
                const avgSatisfaction = exerciseData.reduce((acc, curr) => acc + curr.satisfaction_level, 0) / totalExercises

                const statisticsData = {
                    streaks,
                    distribution,
                    totalExercises,
                    avgSatisfaction: Number(avgSatisfaction.toFixed(1)),
                }

                setData(statisticsData)
                setDebugInfo({
                    rawData: exerciseData,
                    processedData: statisticsData,
                })
            } catch (err) {
                console.error("Error al procesar estadísticas:", err)
                setError(err instanceof Error ? err.message : "Ha ocurrido un error")
                setDebugInfo({ error: err })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [supabase])

    // Calculate streaks from exercise data
    const calculateStreaks = (exerciseData: ExerciseSatisfaction[]) => {
        if (!exerciseData.length) return { current: 0, longest: 0 }

        // Sort by date
        const sortedDates = exerciseData
            .map((ex) => new Date(ex.created_at).toISOString().split("T")[0])
            .sort((a, b) => a.localeCompare(b))
            .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates

        // Calculate streak groups
        const streakGroups: number[][] = []
        let currentStreak: number[] = []

        sortedDates.forEach((dateStr, index) => {
            const currentDate = new Date(dateStr)

            if (index === 0) {
                currentStreak.push(currentDate.getTime())
            } else {
                const prevDate = new Date(sortedDates[index - 1])
                const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

                if (diffDays === 1) {
                    // Consecutive day
                    currentStreak.push(currentDate.getTime())
                } else {
                    // Break in streak
                    if (currentStreak.length > 0) {
                        streakGroups.push([...currentStreak])
                    }
                    currentStreak = [currentDate.getTime()]
                }
            }
        })

        // Add the last streak group
        if (currentStreak.length > 0) {
            streakGroups.push(currentStreak)
        }

        // Find longest streak
        const longestStreak = streakGroups.reduce((max, group) => Math.max(max, group.length), 0)

        // Calculate current streak
        let currentStreakCount = 0
        const today = new Date().toISOString().split("T")[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

        const lastExerciseDate = sortedDates[sortedDates.length - 1]

        if (lastExerciseDate === today || lastExerciseDate === yesterday) {
            // Find the current streak group (the last one if it includes today or yesterday)
            const lastGroup = streakGroups[streakGroups.length - 1]
            currentStreakCount = lastGroup.length
        }

        return {
            current: currentStreakCount,
            longest: longestStreak,
        }
    }

    // Calculate distribution from exercise data
    const calculateDistribution = (exerciseData: ExerciseSatisfaction[]) => {
        const tagCounts: Record<string, number> = {}

        // Count exercises per tag
        exerciseData.forEach((exercise) => {
            if (exercise.video_tags && Array.isArray(exercise.video_tags)) {
                exercise.video_tags.forEach((tag) => {
                    if (tag) {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1
                    }
                })
            }
        })

        // Convert to array format
        return Object.entries(tagCounts).map(([tag, count]) => ({
            tag,
            exercise_count: count,
            total_duration: formatDurationString(count * 30), // Assuming 30 seconds per exercise
        }))
    }

    // Format seconds to HH:MM:SS
    const formatDurationString = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    }

    // Format duration string for display
    const formatDuration = (durationStr: string | undefined): string => {
        if (!durationStr) return "0"

        const parts = durationStr.split(":")
        if (parts.length === 3) {
            const hours = Number.parseInt(parts[0])
            const minutes = Number.parseInt(parts[1])
            const seconds = Number.parseInt(parts[2])

            const totalMinutes = hours * 60 + minutes + seconds / 60
            return totalMinutes.toFixed(1)
        }
        return "0"
    }

    const chartData = {
        labels: data?.distribution.map((d) => d.tag) || [],
        datasets: [
            {
                label: "Número de Ejercicios",
                data: data?.distribution.map((d) => d.exercise_count) || [],
                backgroundColor: "#3b82f6",
                borderRadius: 8,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const index = context.dataIndex
                        const count = data?.distribution[index]?.exercise_count ?? 0
                        const duration = data?.distribution[index]?.total_duration
                        return `${count} ejercicios (${formatDuration(duration)} min)`
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                title: {
                    display: true,
                    text: "Número de Ejercicios",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Categoría de Ejercicio",
                },
            },
        },
    }

    // Render loading state
    if (isLoading) {
        return (
            <div className="space-y-6 p-4">
                <h1 className="text-2xl font-bold">Estadísticas de Ejercicios</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    // Render error state
    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-xl text-red-600">
                <h1 className="text-2xl font-bold mb-4">Error al Cargar Estadísticas</h1>
                <p>{error}</p>
                <details className="mt-4">
                    <summary className="cursor-pointer">Información de Depuración</summary>
                    <pre className="mt-2 p-2 bg-gray-100 overflow-auto max-h-40 text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
                </details>
            </div>
        )
    }

    // No data state
    if (!data || data.totalExercises === 0) {
        return (
            <div className="p-6 bg-blue-50 rounded-xl text-blue-600">
                <h1 className="text-2xl font-bold mb-4">Aún No Hay Datos de Ejercicios</h1>
                <p>¡Completa algunos ejercicios para ver tus estadísticas aquí!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Estadísticas de Ejercicios</h1>

            {/* Streak Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Racha Actual</h2>
                    <div>
                        <p className="text-3xl font-bold text-blue-600">{data.streaks.current} días</p>
                        <p className="text-sm text-gray-500">Días consecutivos de ejercicio</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Racha Más Larga</h2>
                    <div>
                        <p className="text-3xl font-bold text-green-600">{data.streaks.longest} días</p>
                        <p className="text-sm text-gray-500">Récord histórico</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Total de Ejercicios</h2>
                    <div>
                        <p className="text-3xl font-bold text-purple-600">{data.totalExercises}</p>
                        <p className="text-sm text-gray-500">Ejercicios completados</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Satisfacción Media</h2>
                    <div>
                        <p className="text-3xl font-bold text-amber-600">{data.avgSatisfaction}/5</p>
                        <p className="text-sm text-gray-500">Cómo te sentiste después de los ejercicios</p>
                    </div>
                </div>
            </div>

            {/* Exercise Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Distribución de Ejercicios</h2>
                <div className="h-[400px]">
                    {data.distribution.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">No hay datos de distribución disponibles</div>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-4">Desglose de ejercicios por grupo muscular/categoría</p>
            </div>

            {/* Debug information */}
            <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Información de Depuración</h3>
                <div className="text-xs">
                    <p>Total de ejercicios: {data.totalExercises}</p>
                    <p>Elementos de distribución: {data.distribution.length}</p>
                    {data.message && <p>Mensaje: {data.message}</p>}
                    <details>
                        <summary>Datos de respuesta en bruto</summary>
                        <pre className="mt-2 p-2 bg-gray-100 overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
                    </details>
                </div>
            </div>
        </div>
    )
}