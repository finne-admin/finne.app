'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ExerciseCard } from '@/components/ui/exercise-card'
import {WistiaModal} from "@/components/wistia-modal/wistia-modal";

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

export default function ExerciseLibrary() {
    // State: Data, loading, favorites, search, pagination
    const [exercises, setExercises] = useState<WistiaMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [showFavorites, setShowFavorites] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [showModal, setShowModal] = useState(false)
    const [selectedHashedId, setSelectedHashedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchWistiaVideos = async () => {
            try {
                setLoading(true) // Start loading
                const response = await fetch(`/api/wistia`)
                const data: WistiaMedia[] = await response.json()

                setExercises(data)
            } catch (err) {
                console.error('Error fetching Wistia medias', err)
            } finally {
                setLoading(false) // Stop loading
            }
        }

        fetchWistiaVideos()
    }, [])

    // Basic filtering by search (title or description)
    const filteredExercises = exercises.filter((media) => {
        const lowerQuery = searchQuery.toLowerCase()
        const nameMatch = media.name.toLowerCase().includes(lowerQuery)
        const descMatch = (media.description || '').toLowerCase().includes(lowerQuery)

        return nameMatch || descMatch
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage)
    const currentExercises = filteredExercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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

    // Render numbered page buttons (improved pagination)
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

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Browse Exercises</h1>

            {/* Search and Favorites */}
            <div className="space-y-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Favorites</span>
                    <Switch
                        checked={showFavorites}
                        onCheckedChange={setShowFavorites}
                    />
                </div>
            </div>

            {/* If loading, show skeletons. Otherwise, show actual data */}
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
                        {currentExercises.map((media) => {
                            return (
                                <ExerciseCard
                                    key={media.id}
                                    title={media.name}
                                    description={media.description.replace(/(<([^>]+)>)/gi, "")}
                                    duration={`${Math.round(media.duration)}s`}
                                    assets={media.assets}
                                    hashedId={media.hashed_id}
                                    onPlay={handlePlay}
                                />
                            )
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-sm text-gray-900 hidden sm:block">
                                Page {currentPage} of {totalPages}
                            </p>

                            <div className="flex gap-2 items-center">
                                {/* First */}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    First
                                </Button>

                                {/* Previous */}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </Button>

                                {/* Numbered Pages */}
                                {renderPageNumbers()}

                                {/* Next */}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>

                                {/* Last */}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal for Wistia Video Playback */}
            {
                showModal && selectedHashedId && <WistiaModal hashedId={selectedHashedId} onClose={closeModal} />
            }
        </div>
    )
}
