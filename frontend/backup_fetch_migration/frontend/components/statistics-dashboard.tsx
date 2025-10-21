"use client"

import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Skeleton } from "@/components/ui/skeleton"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {cn} from "@/lib/utils";
import {ActivityIcon, ArrowDown01Icon, DumbbellIcon, FlameIcon, InfoIcon, SmileIcon, TrophyIcon} from "lucide-react";
import {useRouter} from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ExerciseSatisfaction {
    id: string
    user_id: string
    video_hash_ids: string[]
    tags: string[] // Updated field name to match actual data structure
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
    const router = useRouter();
    const [data, setData] = useState<StatisticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                if (!user) {
                    setError("Usuario no autenticado")
                    setIsLoading(false)
                    return
                }

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
                console.log("Ejercicios:", exerciseData)

                // Calculate streaks
                const streaks = calculateStreaks(exerciseData)

                // Calculate distribution
                const distribution = calculateDistribution(exerciseData)
                console.log("Distribución:", distribution)

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
                    sampleExercise: exerciseData[0],
                    distributionData: distribution,
                    distributionLength: distribution.length,
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

    // Calculate distribution from exercise data - UPDATED to use the correct field name
    const calculateDistribution = (exerciseData: ExerciseSatisfaction[]) => {
        const tagCounts: Record<string, number> = {}
        let totalTagsProcessed = 0

        // Count exercises per tag
        exerciseData.forEach((exercise) => {
            // Use the correct field name: 'tags' instead of 'video_tags'
            if (exercise.tags && Array.isArray(exercise.tags)) {
                exercise.tags.forEach((tag) => {
                    if (tag && tag.trim() !== "") {
                        const normalizedTag = tag.trim()
                        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1
                        totalTagsProcessed++
                    }
                })
            }
        })

        console.log(`Processed ${totalTagsProcessed} tags from ${exerciseData.length} exercises`)
        console.log("Tag counts:", tagCounts)

        // If no tags were found, create a default "Sin categoría" tag
        if (Object.keys(tagCounts).length === 0) {
            tagCounts["Sin categoría"] = exerciseData.length
        }

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
            <div className="space-y-6 p-4 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 animate-pulse">
                    <Skeleton className="h-8 w-48" />
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        )
    }

    // No data state
    if (!data || data.totalExercises === 0) {

        return (
            <div className="p-8 bg-teal-50 rounded-2xl text-center max-w-2xl mx-auto border border-teal-100 shadow-sm">
                <ActivityIcon className="h-16 w-16 mx-auto text-[#8AC5B5] mb-4" />
                <h1 className="text-2xl font-bold mb-3 text-teal-800">
                    ¡Comienza tu viaje de ejercicios!
                </h1>
                <p className="text-teal-600 mb-5 max-w-md mx-auto">
                    Completa tu primera sesión para desbloquear estadísticas detalladas
                </p>
                <div className="space-y-4">
                    <div className="animate-bounce">
                        <ArrowDown01Icon className="h-8 w-8 mx-auto text-[#8AC5B5]" />
                    </div>
                    <button
                        className="px-6 py-3 bg-[#8AC5B5] hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center mx-auto space-x-2 justify-center"
                        onClick={() => router.push("/notification")}
                    >
                        <span>Iniciar Ejercicio</span>
                    </button>
                </div>
            </div>
        )
    }
    // Function to generate visually distinct colors
    const generateChartColors = (count: number): string[] => {
        const baseColors = [
            '#3b82f6', // blue
            '#8AC5B5', // teal (your brand color)
            '#f59e0b', // amber
            '#10b981', // emerald
            '#8b5cf6', // violet
            '#ef4444', // red
            '#ec4899', // pink
            '#f97316', // orange
            '#14b8a6', // teal
            '#6366f1', // indigo
        ];

        // If we have more categories than base colors, we'll generate some
        if (count <= baseColors.length) {
            return baseColors.slice(0, count);
        }

        // Generate additional colors if needed
        const colors = [...baseColors];
        for (let i = baseColors.length; i < count; i++) {
            const hue = (i * 137.5) % 360; // Use golden angle for even distribution
            colors.push(`hsl(${hue}, 75%, 50%)`);
        }

        return colors;
    };

    return (
        <div className="space-y-8 p-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">
                Estadísticas de Ejercicios
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Racha Actual"
                    value={data.streaks.current}
                    unit="días"
                    color="text-blue-600"
                    icon={<FlameIcon className="h-6 w-6" />}
                    description="Días consecutivos de ejercicio"
                />

                <StatCard
                    title="Récord Personal"
                    value={data.streaks.longest}
                    unit="días"
                    color="text-green-600"
                    icon={<TrophyIcon className="h-6 w-6" />}
                    description="Mejor racha histórica"
                />

                <StatCard
                    title="Total Ejercicios"
                    value={data.totalExercises}
                    unit="sesiones"
                    color="text-purple-600"
                    icon={<DumbbellIcon className="h-6 w-6" />}
                    description="Sesiones completadas"
                />

                <StatCard
                    title="Satisfacción"
                    value={data.avgSatisfaction}
                    unit="/5"
                    color="text-amber-600"
                    icon={<SmileIcon className="h-6 w-6" />}
                    description="Media de satisfacción"
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Distribución de Ejercicios
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <InfoIcon className="h-4 w-4" />
                        <span>Haz hover sobre las barras para más detalles</span>
                    </div>
                </div>

                <div className="h-[400px] md:h-[500px] lg:h-[600px] relative">
                    <Bar
                        data={{
                            labels: chartData.labels,
                            datasets: [{
                                label: "Número de Ejercicios",
                                data: chartData.datasets[0].data,
                                backgroundColor: generateChartColors(data.distribution.length),
                                borderRadius: 8,
                            }]
                        }}
                        options={{
                            ...chartOptions,
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                ...chartOptions.scales,
                                x: {
                                    ...chartOptions.scales?.x,
                                    ticks: {
                                        autoSkip: true,
                                        maxRotation: 45,
                                        minRotation: 45,
                                        font: {
                                            size: window.innerWidth < 768 ? 10 : 12
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>

                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    {data.distribution.map((category, index) => {
                        const colors = generateChartColors(data.distribution.length);
                        return (
                            <div
                                key={category.tag}
                                className="px-4 py-2 bg-gray-50 rounded-full flex items-center gap-2"
                            >
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                    />
                                <span className="text-sm font-medium text-gray-700">
                        {category.tag}
                    </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

// New StatCard component
function StatCard({
                      title,
                      value,
                      unit,
                      color,
                      icon,
                      description
                  }: Readonly<{
    title: string
    value: number
    unit: string
    color: string
    icon: React.ReactNode
    description: string
}>) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <div className={cn("p-2 rounded-lg bg-opacity-20", color)}>
                    {icon}
                </div>
            </div>
            <div className="space-y-2">
                <p className={cn("text-3xl font-bold", color)}>
                    {value}
                    <span className="text-lg font-medium text-gray-500 ml-1">
                        {unit}
                    </span>
                </p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    )
}