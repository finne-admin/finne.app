"use client"

import { useEffect, useState, useMemo } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Download,
    Filter,
    RefreshCw,
    Users,
    Tag,
    Calendar,
    TrendingUp,
    Award,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import { Bar, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

interface EmployeeAnalyticsProps {
    className?: string
}

interface ExerciseSatisfaction {
    id: string
    user_id: string
    video_hash_ids: string[]
    tags: string[]
    satisfaction_level: number
    created_at: string
}

interface UserProfile {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
    is_active: boolean
}

interface AnalyticsData {
    participationRate: number
    averageSatisfaction: number
    tagParticipation: Record<string, number>
    satisfactionByTag: Record<string, number>
    participationTrend: Record<string, number>
    satisfactionTrend: Record<string, number>
    employeeLeaderboard: Array<{
        id: string
        name: string
        exercises: number
        avgSatisfaction: number
        topTags: string[]
    }>
}

export function EmployeeAnalytics({ className }: EmployeeAnalyticsProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days" | "all">("30days")
    const [tagFilter, setTagFilter] = useState<string>("all")
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [exerciseData, setExerciseData] = useState<ExerciseSatisfaction[]>([])
    const [userData, setUserData] = useState<UserProfile[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isFilterExpanded, setIsFilterExpanded] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)

    const supabase = createClientComponentClient()

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const { data: satisfactionData, error: satisfactionError } = await supabase
                    .from("exercise_satisfaction")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (satisfactionError) throw satisfactionError

                // Fetch users
                const { data: usersData, error: usersError } = await supabase.from("users").select("*")

                if (usersError) throw usersError

                // Process data
                setExerciseData(satisfactionData || [])
                setUserData(usersData || [])

                // Extract available tags
                const tags = new Set<string>()
                satisfactionData?.forEach((item) => {
                    if (item.tags && Array.isArray(item.tags)) {
                        item.tags.forEach((tag: string) => tags.add(tag))
                    }
                })
                setAvailableTags(Array.from(tags))
            } catch (err) {
                console.error("Error al obtener datos de análisis:", err)
                setError(err instanceof Error ? err.message : "Ha ocurrido un error al obtener los datos")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [supabase, isRefreshing])

    // Set window width on client side only
    useEffect(() => {
        setWindowWidth(window.innerWidth)

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Filter data based on selected filters
    const filteredExerciseData = useMemo(() => {
        let filtered = [...exerciseData]

        // Filter by time range
        if (timeRange !== "all") {
            const now = new Date()
            let cutoffDate: Date

            switch (timeRange) {
                case "7days":
                    cutoffDate = new Date(now.setDate(now.getDate() - 7))
                    break
                case "30days":
                    cutoffDate = new Date(now.setDate(now.getDate() - 30))
                    break
                case "90days":
                    cutoffDate = new Date(now.setDate(now.getDate() - 90))
                    break
                default:
                    cutoffDate = new Date(0) // Beginning of time
            }

            filtered = filtered.filter((item) => new Date(item.created_at) >= cutoffDate)
        }

        // Filter by tag
        if (tagFilter !== "all") {
            filtered = filtered.filter((item) => item.tags && Array.isArray(item.tags) && item.tags.includes(tagFilter))
        }

        return filtered
    }, [exerciseData, timeRange, tagFilter])

    // Calculate analytics data
    const analyticsData: AnalyticsData = useMemo(() => {
        // Default empty data
        const defaultData: AnalyticsData = {
            participationRate: 0,
            averageSatisfaction: 0,
            tagParticipation: {},
            satisfactionByTag: {},
            participationTrend: {},
            satisfactionTrend: {},
            employeeLeaderboard: [],
        }

        if (!userData.length || !filteredExerciseData.length) return defaultData

        // Calculate participation rate
        const activeUsers = userData.filter((user) => user.is_active).length
        const participatingUsers = new Set(filteredExerciseData.map((item) => item.user_id)).size
        const participationRate = activeUsers > 0 ? (participatingUsers / activeUsers) * 100 : 0

        // Calculate average satisfaction
        const totalSatisfaction = filteredExerciseData.reduce((sum, item) => sum + item.satisfaction_level, 0)
        const averageSatisfaction = filteredExerciseData.length > 0 ? totalSatisfaction / filteredExerciseData.length : 0

        // Calculate tag participation and satisfaction
        const tagParticipation: Record<string, number> = {}
        const tagSatisfaction: Record<string, { sum: number; count: number }> = {}

        // Initialize with all tags
        availableTags.forEach((tag) => {
            tagParticipation[tag] = 0
            tagSatisfaction[tag] = { sum: 0, count: 0 }
        })

        // Count exercises and satisfaction by tag
        filteredExerciseData.forEach((item) => {
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach((tag) => {
                    tagParticipation[tag] = (tagParticipation[tag] || 0) + 1

                    if (!tagSatisfaction[tag]) {
                        tagSatisfaction[tag] = { sum: 0, count: 0 }
                    }

                    tagSatisfaction[tag].sum += item.satisfaction_level
                    tagSatisfaction[tag].count += 1
                })
            }
        })

        // Calculate average satisfaction by tag
        const satisfactionByTag: Record<string, number> = {}
        Object.entries(tagSatisfaction).forEach(([tag, data]) => {
            satisfactionByTag[tag] = data.count > 0 ? data.sum / data.count : 0
        })

        // Calculate participation and satisfaction trends
        const participationTrend: Record<string, number> = {}
        const satisfactionTrend: Record<string, number> = {}
        const satisfactionByDate: Record<string, { sum: number; count: number }> = {}

        // Group by date
        filteredExerciseData.forEach((item) => {
            const date = item.created_at.split("T")[0]

            // Count participation
            participationTrend[date] = (participationTrend[date] || 0) + 1

            // Sum satisfaction
            if (!satisfactionByDate[date]) {
                satisfactionByDate[date] = { sum: 0, count: 0 }
            }
            satisfactionByDate[date].sum += item.satisfaction_level
            satisfactionByDate[date].count += 1
        })

        // Calculate average satisfaction by date
        Object.entries(satisfactionByDate).forEach(([date, data]) => {
            satisfactionTrend[date] = data.count > 0 ? data.sum / data.count : 0
        })

        // Calculate employee leaderboard with top tags
        const employeeExerciseCounts: Record<
            string,
            {
                count: number
                satisfaction: number
                tags: Record<string, number>
            }
        > = {}

        filteredExerciseData.forEach((item) => {
            if (!employeeExerciseCounts[item.user_id]) {
                employeeExerciseCounts[item.user_id] = {
                    count: 0,
                    satisfaction: 0,
                    tags: {},
                }
            }

            employeeExerciseCounts[item.user_id].count += 1
            employeeExerciseCounts[item.user_id].satisfaction += item.satisfaction_level

            // Track tags used by this employee
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach((tag) => {
                    employeeExerciseCounts[item.user_id].tags[tag] = (employeeExerciseCounts[item.user_id].tags[tag] || 0) + 1
                })
            }
        })

        const employeeLeaderboard = Object.entries(employeeExerciseCounts)
            .map(([userId, data]) => {
                const user = userData.find((u) => u.id === userId)

                // Get top 3 tags for this employee
                const topTags = Object.entries(data.tags)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([tag]) => tag)

                return {
                    id: userId,
                    name: user ? `${user.first_name} ${user.last_name}` : "Usuario Desconocido",
                    exercises: data.count,
                    avgSatisfaction: data.count > 0 ? data.satisfaction / data.count : 0,
                    topTags,
                }
            })
            .sort((a, b) => b.exercises - a.exercises)
            .slice(0, 5)

        return {
            participationRate,
            averageSatisfaction,
            tagParticipation,
            satisfactionByTag,
            participationTrend,
            satisfactionTrend,
            employeeLeaderboard,
        }
    }, [filteredExerciseData, userData, availableTags])

    // Prepare chart data
    const tagParticipationChartData = {
        labels: Object.keys(analyticsData.tagParticipation),
        datasets: [
            {
                label: "Número de Ejercicios",
                data: Object.values(analyticsData.tagParticipation),
                backgroundColor: [
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(255, 206, 86, 0.7)",
                    "rgba(75, 192, 192, 0.7)",
                    "rgba(153, 102, 255, 0.7)",
                    "rgba(255, 159, 64, 0.7)",
                ],
                borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    }

    const satisfactionByTagChartData = {
        labels: Object.keys(analyticsData.satisfactionByTag),
        datasets: [
            {
                label: "Satisfacción Media (1-5)",
                data: Object.values(analyticsData.satisfactionByTag),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    }

    // Sort dates for trend charts
    const sortedDates = Object.keys(analyticsData.participationTrend).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )

    const trendChartData = {
        labels: sortedDates.map((date) => {
            const dateObj = new Date(date)
            return dateObj.toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
                year: timeRange === "all" ? "numeric" : undefined,
            })
        }),
        datasets: [
            {
                label: "Ejercicios Completados",
                data: sortedDates.map((date) => analyticsData.participationTrend[date]),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
            },
            {
                label: "Satisfacción Media",
                data: sortedDates.map((date) => analyticsData.satisfactionTrend[date]),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                yAxisID: "y1",
            },
        ],
    }

    // Chart options
    const tagOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                display: windowWidth > 640, // Hide legend on small screens
            },
            title: {
                display: true,
                text: "Participación en Ejercicios por Etiqueta",
                font: {
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Número de Ejercicios",
                },
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    const satisfactionOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                display: windowWidth > 640,
            },
            title: {
                display: true,
                text: "Satisfacción Media por Etiqueta",
                font: {
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 5,
                title: {
                    display: true,
                    text: "Satisfacción Media (1-5)",
                },
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    const trendOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                display: windowWidth > 640,
            },
            title: {
                display: true,
                text: "Tendencias de Ejercicios a lo Largo del Tiempo",
                font: {
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Número de Ejercicios",
                },
            },
            y1: {
                position: "right",
                beginAtZero: true,
                min: 0,
                max: 5,
                title: {
                    display: true,
                    text: "Satisfacción Media (1-5)",
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 500)
    }

    const handleExportData = () => {
        // Create CSV content
        const headers = ["Etiqueta", "Ejercicios Completados", "Satisfacción Media"]
        const rows = Object.entries(analyticsData.tagParticipation).map(([tag, count]) => [
            tag,
            count,
            analyticsData.satisfactionByTag[tag]?.toFixed(2) || "0",
        ])

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `analisis-ejercicios-${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const toggleFilters = () => {
        setIsFilterExpanded(!isFilterExpanded)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Análisis de Ejercicios de Empleados</h2>
                    <Skeleton className="h-10 w-32" />
                </div>

                {/* Skeleton for filters */}
                <Skeleton className="h-16 w-full rounded-lg" />

                {/* Skeleton for summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                </div>

                {/* Skeleton for tabs */}
                <Skeleton className="h-10 w-full rounded-lg" />

                {/* Skeleton for chart area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Skeleton className="h-[300px] rounded-lg" />
                    <Skeleton className="h-[300px] rounded-lg" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-xl text-red-600 border border-red-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Error al Cargar Análisis</h2>
                </div>
                <p>{error}</p>
                <Button variant="outline" className="mt-4 text-red-600 border-red-200 hover:bg-red-50" onClick={handleRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Intentar de Nuevo
                </Button>
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header with title and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold">Análisis de Ejercicios de Empleados</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Información sobre la participación y satisfacción de los empleados en los ejercicios
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Actualizando..." : "Actualizar"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={toggleFilters}>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Filtros</span>
                        <Badge variant="outline" className="ml-2">
                            {timeRange === "7days"
                                ? "Últimos 7 Días"
                                : timeRange === "30days"
                                    ? "Últimos 30 Días"
                                    : timeRange === "90days"
                                        ? "Últimos 90 Días"
                                        : "Todo el Tiempo"}
                        </Badge>
                        {tagFilter !== "all" && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {tagFilter}
                            </Badge>
                        )}
                    </div>
                    {isFilterExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </div>

                {isFilterExpanded && (
                    <div className="p-4 pt-0 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="time-range" className="text-xs font-medium text-gray-500">
                                    Rango de Tiempo
                                </label>
                                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                                    <SelectTrigger id="time-range" className="h-9">
                                        <SelectValue placeholder="Seleccionar rango de tiempo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7days">Últimos 7 Días</SelectItem>
                                        <SelectItem value="30days">Últimos 30 Días</SelectItem>
                                        <SelectItem value="90days">Últimos 90 Días</SelectItem>
                                        <SelectItem value="all">Todo el Tiempo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="tag-filter" className="text-xs font-medium text-gray-500">
                                    Etiqueta de Ejercicio
                                </label>
                                <Select value={tagFilter} onValueChange={setTagFilter}>
                                    <SelectTrigger id="tag-filter" className="h-9">
                                        <SelectValue placeholder="Seleccionar etiqueta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las Etiquetas</SelectItem>
                                        {availableTags.map((tag) => (
                                            <SelectItem key={tag} value={tag}>
                                                {tag}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium">Tasa de Participación</CardTitle>
                                <CardDescription>Empleados activos participando</CardDescription>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600">{analyticsData.participationRate.toFixed(1)}%</div>
                            <div className="ml-auto flex items-center text-sm bg-blue-50 px-2 py-1 rounded-full">
                                <span>{new Set(filteredExerciseData.map((item) => item.user_id)).size} empleados</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium">Satisfacción Media</CardTitle>
                                <CardDescription>Puntuación general de satisfacción</CardDescription>
                            </div>
                            <div className="bg-green-100 p-2 rounded-full">
                                {analyticsData.averageSatisfaction >= 4 ? (
                                    <Award className="h-5 w-5 text-green-600" />
                                ) : (
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-green-600">
                                {analyticsData.averageSatisfaction.toFixed(1)}
                                <span className="text-sm font-normal text-gray-500 ml-1">/ 5</span>
                            </div>
                            <div className="ml-auto flex items-center text-sm">
                                {analyticsData.averageSatisfaction >= 4 ? (
                                    <span className="text-green-500 font-medium px-2 py-0.5 bg-green-50 rounded-full">Excelente</span>
                                ) : analyticsData.averageSatisfaction >= 3 ? (
                                    <span className="text-blue-500 font-medium px-2 py-0.5 bg-blue-50 rounded-full">Bueno</span>
                                ) : analyticsData.averageSatisfaction >= 2 ? (
                                    <span className="text-amber-500 font-medium px-2 py-0.5 bg-amber-50 rounded-full">Regular</span>
                                ) : (
                                    <span className="text-red-500 font-medium px-2 py-0.5 bg-red-50 rounded-full">Pobre</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="tags" className="w-full">
                <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full bg-white shadow-sm rounded-lg overflow-hidden">
                    <TabsTrigger value="tags" className="data-[state=active]:bg-blue-50">
                        <Tag className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Análisis de Etiquetas</span>
                        <span className="sm:hidden">Etiquetas</span>
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="data-[state=active]:bg-green-50">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Tendencias en el Tiempo</span>
                        <span className="sm:hidden">Tendencias</span>
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="data-[state=active]:bg-amber-50">
                        <Award className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Clasificación de Empleados</span>
                        <span className="sm:hidden">Clasificación</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tags" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border-none shadow-sm hover:shadow transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">Participación en Ejercicios por Etiqueta</CardTitle>
                                <CardDescription>Número de ejercicios completados para cada etiqueta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] sm:h-[350px] w-full">
                                    {Object.keys(analyticsData.tagParticipation).length > 0 ? (
                                        <Bar data={tagParticipationChartData} options={tagOptions} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <Tag className="h-8 w-8 mb-2 text-gray-400" />
                                            <p>No hay datos de etiquetas disponibles para los filtros seleccionados</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => {
                                                    setTagFilter("all")
                                                    setTimeRange("all")
                                                }}
                                            >
                                                Restablecer Filtros
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm hover:shadow transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">Satisfacción por Etiqueta</CardTitle>
                                <CardDescription>Puntuaciones medias de satisfacción para cada etiqueta de ejercicio</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] sm:h-[350px] w-full">
                                    {Object.keys(analyticsData.satisfactionByTag).length > 0 ? (
                                        <Bar data={satisfactionByTagChartData} options={satisfactionOptions} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <Tag className="h-8 w-8 mb-2 text-gray-400" />
                                            <p>No hay datos de satisfacción disponibles para los filtros seleccionados</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => {
                                                    setTagFilter("all")
                                                    setTimeRange("all")
                                                }}
                                            >
                                                Restablecer Filtros
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="mt-4">
                    <Card className="border-none shadow-sm hover:shadow transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">Tendencias de Ejercicios y Satisfacción</CardTitle>
                            <CardDescription>Participación en ejercicios y satisfacción a lo largo del tiempo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] sm:h-[400px] w-full">
                                {sortedDates.length > 1 ? (
                                    <Line data={trendChartData} options={trendOptions} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <Calendar className="h-8 w-8 mb-2 text-gray-400" />
                                        <p>No hay suficientes datos para el análisis de tendencias</p>
                                        <p className="text-sm mt-1">Intenta seleccionar un rango de tiempo más amplio</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-4">
                    <Card className="border-none shadow-sm hover:shadow transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">Clasificación de Ejercicios de Empleados</CardTitle>
                            <CardDescription>Empleados destacados por participación en ejercicios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Empleado</th>
                                        <th className="text-left py-3 px-4 font-medium">Etiquetas Principales</th>
                                        <th className="text-center py-3 px-4 font-medium">Ejercicios</th>
                                        <th className="text-center py-3 px-4 font-medium">Satisfacción</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {analyticsData.employeeLeaderboard.map((employee, index) => (
                                        <tr key={employee.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <div className="w-6 text-center font-medium text-gray-500 mr-2">{index + 1}</div>
                                                    <div>{employee.name}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {employee.topTags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            <Tag className="mr-1 h-3 w-3" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {employee.topTags.length === 0 && "Sin etiquetas"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">{employee.exercises}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                                                        employee.avgSatisfaction >= 4
                                                            ? "bg-green-100 text-green-800"
                                                            : employee.avgSatisfaction >= 3
                                                                ? "bg-blue-100 text-blue-800"
                                                                : employee.avgSatisfaction >= 2
                                                                    ? "bg-amber-100 text-amber-800"
                                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {employee.avgSatisfaction.toFixed(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {analyticsData.employeeLeaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <Users className="h-8 w-8 mb-2 text-gray-400" />
                                                    <p>No hay datos de empleados disponibles para los filtros seleccionados</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setTagFilter("all")
                                                            setTimeRange("all")
                                                        }}
                                                    >
                                                        Restablecer Filtros
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 py-3 px-4 text-xs text-gray-500">
                            Mostrando los {analyticsData.employeeLeaderboard.length} mejores empleados por participación en ejercicios
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}