'use client'

import { useState } from 'react'
import { Heart, Play, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  isSelected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
}

export function VideoCard({
                            id,
                            title,
                            description,
                            duration,
                            thumbnail,
                            isSelected,
                            onSelect,
                            disabled = false
                          }: Readonly<VideoCardProps>) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
      <div className={cn(
          "group relative bg-white rounded-xl overflow-hidden transition-all duration-200",
          "border-2",
          isSelected ? "border-[#8BC5B5] shadow-lg" : "border-transparent shadow-sm hover:shadow-md",
          disabled && "opacity-50 cursor-not-allowed"
      )}>
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          <img
              src={thumbnail}
              alt={`${title} thumbnail`}
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

          {/* Play Button */}
          <button
              className="absolute inset-0 flex items-center justify-center"
              disabled={disabled}
              aria-label={`Play video: ${title}`}
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-gray-900 ml-1" />
            </div>
          </button>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 text-white text-sm">
            {duration}
          </div>

          {/* Favorite Button */}
          <button
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) setIsFavorite(!isFavorite)
              }}
              disabled={disabled}
              aria-pressed={isFavorite}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center transition-colors hover:bg-black/40"
          >
            <Heart
                className={cn(
                    "w-4 h-4 transition-colors",
                    isFavorite ? "fill-white text-white" : "text-white"
                )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          {/* Selection Button */}
          <button
              onClick={() => !disabled && onSelect(id)}
              disabled={disabled}
              className={cn(
                  "w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                  "flex items-center justify-center gap-2",
                  isSelected
                      ? "bg-[#8BC5B5] text-white hover:bg-[#7AB4A4]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
          >
            {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  Selected
                </>
            ) : (
                'Select Video'
            )}
          </button>
        </div>
      </div>
  )
}
