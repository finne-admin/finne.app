'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ExerciseCard } from '@/components/ui/exercise-card'
import { cn } from "@/lib/utils"

const exercises = [
    {
        id: 1,
        title: 'Seated Leg Lifts',
        description: 'Strengthen your core with these easy leg lifts while seated.',
        duration: '30s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Core'
    },
    {
        id: 2,
        title: 'Wrist Stretch',
        description: 'Stretch your wrists and forearms to reduce strain from typing.',
        duration: '20s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Stretching'
    },
    {
        id: 3,
        title: 'Desk Squats',
        description: 'Engage your legs and glutes with simple squats using your desk.',
        duration: '40s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Lower Body'
    },
    {
        id: 4,
        title: 'Chair Twists',
        description: 'Loosen up your spine and core with these seated twists.',
        duration: '30s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Core'
    },
    {
        id: 5,
        title: 'Neck Stretches',
        description: 'Gently stretch your neck to alleviate tension from sitting.',
        duration: '40s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Stretching'
    },
    {
        id: 6,
        title: 'Neck Relaxer',
        description: 'Relax your neck muscles and reduce stiffness with these simple rotations.',
        duration: '40s',
        thumbnail: '/placeholder.svg?height=200&width=300',
        category: 'Stretching'
    }
]

const categories = ['Upper Body', 'Lower Body', 'Core', 'Stretching']

export default function ExerciseLibrary() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [showFavorites, setShowFavorites] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Filter exercises by category and search query
    const filteredExercises = exercises.filter(exercise => {
        const matchesCategory = !activeCategory || exercise.category === activeCategory
        const matchesSearch =
            exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage)
    const currentExercises = filteredExercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Browse Exercises</h1>

            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {/* Category Filters: horizontally scrollable on mobile */}
                    <div className="overflow-x-auto whitespace-nowrap flex gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                className={cn(
                                    "h-9 flex-shrink-0",
                                    activeCategory === category && "bg-[#8BC5B5] hover:bg-[#7AB4A4]"
                                )}
                                onClick={() =>
                                    setActiveCategory(activeCategory === category ? null : category)
                                }
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Favorites Toggle */}
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <span className="text-sm text-gray-600">Favorites</span>
                        <Switch
                            checked={showFavorites}
                            onCheckedChange={setShowFavorites}
                        />
                    </div>
                </div>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentExercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        title={exercise.title}
                        description={exercise.description}
                        duration={exercise.duration}
                        thumbnail={exercise.thumbnail}
                    />
                ))}
            </div>

            {/* Pagination / Load More */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    {/* Page info only on larger screens */}
                    <p className="text-sm text-gray-900 hidden sm:block">
                        Page {currentPage} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                        {/* On small screens: a simple "Load More" button */}
                        <Button
                            variant="default"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="sm:hidden"
                        >
                            Load More
                        </Button>

                        {/* On larger screens: previous/next buttons */}
                        <div className="hidden sm:flex gap-2">
                            <Button
                                variant="default"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
