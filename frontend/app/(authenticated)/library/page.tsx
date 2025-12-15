"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ExerciseCard } from '@/components/ui/exercise-card'
import { WistiaModal } from "@/components/wistia-modal/wistia-modal"
import { checkAchievements } from '@/lib/achievements';
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient"

function SkeletonCard() {
    return (
        <div className="rounded-lg shadow-sm bg-white p-4 animate-pulse">
            <div className="relative w-full aspect-video bg-gray-200 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
    )
}

interface Asset {
    url: string
    width: number
    height: number
    type: string
}

interface WistiaMedia {
    id: number
    name: string
    description: string
    duration: number
    hashed_id: string
    assets: Asset[]
}

const TAGS = [
    "fuerza",
    "miembro superior",
    "miembro inferior",
    "movilidad",
    "core",
    "cervicales",
    "cardio",
]

export default function ExerciseLibrary() {
    const router = useRouter()
    const [exercises, setExercises] = useState<WistiaMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [showFavorites, setShowFavorites] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [showModal, setShowModal] = useState(false)
    const [selectedHashedId, setSelectedHashedId] = useState<string | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [showTagList, setShowTagList] = useState(false)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [error, setError] = useState<string | null>(null)

    // Fetch exercises and favorites
    useEffect(() => {
        const initializeData = async () => {
            try {
                await fetchWistiaVideos()
                await fetchUserFavorites()
            } catch (err) {
                setError('Error al cargar los datos iniciales')
            }
        }
        initializeData()
    }, [])

    // Fetch user favorites from API
    const fetchUserFavorites = useCallback(async () => {
        try {
            const res = await apiGet("/api/exercises/favorites")
            if (res.status === 401) {
                setFavorites(new Set())
                return
            }
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Error al cargar favoritos")
            }
            const list = Array.isArray(data.favorites) ? data.favorites : []
            setFavorites(new Set(list.map((fav: any) => fav.video_hashed_id || fav)))
        } catch (err) {
            console.error("Error al cargar favoritos:", err)
            setError("Error al cargar favoritos")
        }
    }, [])

    // Toggle favorite handler
    const handleFavoriteToggle = async (hashedId: string) => {
        try {
            const isFavorite = favorites.has(hashedId)
            setFavorites((prev) => {
                const updated = new Set(prev)
                if (isFavorite) {
                    updated.delete(hashedId)
                } else {
                    updated.add(hashedId)
                }
                return updated
            })

            const response = isFavorite
                ? await apiDelete("/api/exercises/favorites", { video_hashed_id: hashedId })
                : await apiPost("/api/exercises/favorites", { video_hashed_id: hashedId })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || "Error al actualizar favorito")
            }

            if (!isFavorite) {
                await checkAchievements('favorito_marcado')
            }
        } catch (err) {
            console.error("Error al actualizar favorito:", err)
            setError('Error al actualizar favorito')
            await fetchUserFavorites() // Revert to actual state
        }
    }

    // Fetch Wistia videos
    async function fetchWistiaVideos(tag?: string | null) {
        try {
            setLoading(true)
            let url = '/api/wistia/videos'
            if (tag) {
                const params = new URLSearchParams()
                params.set('tags', tag)
                url += `?${params.toString()}`
            }

            const response = await apiGet(url)
            const data: WistiaMedia[] = await response.json()
            setExercises(data)
        } catch (err) {
            console.error('Error al obtener vídeos de Wistia', err)
        } finally {
            setLoading(false)
        }
    }

    // Handle tag selection
    const handleTagSelection = (tag: string) => {
        setCurrentPage(1)
        setSelectedTag((prev) => {
            if (prev === tag) {
                fetchWistiaVideos(null)
                return null
            } else {
                fetchWistiaVideos(tag)
                return tag
            }
        })
    }

    // Filter exercises
    const filteredExercises = exercises.filter((media) => {
        const lowerQuery = searchQuery.toLowerCase()
        const nameMatch = media.name.toLowerCase().includes(lowerQuery)
        const descMatch = (media.description || '').toLowerCase().includes(lowerQuery)
        const favoriteMatch = showFavorites ? favorites.has(media.hashed_id) : true

        return nameMatch && descMatch && favoriteMatch
    })

    // Pagination
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage)
    const currentExercises = filteredExercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Render page numbers
    function renderPageNumbers() {
        const pageLinksToShow = 5
        let startPage = Math.max(currentPage - 2, 1)
        let endPage = startPage + (pageLinksToShow - 1)

        if (endPage > totalPages) {
            endPage = totalPages
            startPage = Math.max(endPage - (pageLinksToShow - 1), 1)
        }

        const pages = []
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <>
                {pages.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Button>
                ))}
            </>
        )
    }

    // Modal handlers
    const handlePlay = (hashedId?: string) => {
        if (!hashedId) return
        setSelectedHashedId(hashedId)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedHashedId(null)
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <h1 className="text-3xl font-semibold text-gray-900">Explorar Ejercicios</h1>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                    <p className="text-red-700">{error}</p>
                    <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setError(null)}
                    >
                        Descartar
                    </Button>
                </div>
            )}

            {/* Search + Favorites + Tags */}
            <div className="space-y-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Favoritos</span>
                    <Switch
                        checked={showFavorites}
                        onCheckedChange={(checked) => {
                            setShowFavorites(checked)
                            setCurrentPage(1)
                        }}
                    />

                    {!showTagList && (
                        <Button
                            variant="outline"
                            onClick={() => setShowTagList(true)}
                        >
                            Etiqueta
                        </Button>
                    )}
                </div>

                {showTagList && (
                    <div className="bg-gray-50 rounded-md p-3">
                        <h2 className="text-sm font-medium text-gray-700 mb-2">
                            Seleccionar una Etiqueta
                        </h2>
                        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300">
                            {TAGS.map((tag) => {
                                const isActive = selectedTag === tag
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagSelection(tag)}
                                        className={`
                                            inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                                            transition-colors border
                                            ${isActive
                                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }
                                        `}
                                    >
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Loading Skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Exercise Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {currentExercises.map((media) => (
                            <ExerciseCard
                                key={media.id}
                                title={media.name}
                                description={media.description.replace(/(<([^>]+)>)/gi, "")}
                                duration={`${Math.round(media.duration)}s`}
                                assets={media.assets}
                                hashedId={media.hashed_id}
                                onPlay={handlePlay}
                                isFavorite={favorites.has(media.hashed_id)}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-sm text-gray-900 hidden sm:block">
                                Página {currentPage} de {totalPages}
                            </p>
                            <div className="flex gap-2 items-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    Primera
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                {renderPageNumbers()}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Última
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Wistia Modal */}
            {showModal && selectedHashedId && (
                <WistiaModal hashedId={selectedHashedId} onClose={closeModal} />
            )}
        </div>
    )
}
