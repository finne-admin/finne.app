"use client"

import { useState, useMemo } from "react"
import { Heart, Play, Check } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoCardProps {
  id: string
  title: string
  description: string
  duration: string
  assets: Asset[]
  isSelected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
  /** NUEVO: texto del badge, p. ej. "(+10 PA)". Si no se pasa, no se muestra */
  badge?: string
}

interface Asset {
  url: string
  width: number
  height: number
  type: string
}

function getBestThumbnail(assets: Asset[], targetWidth: number): Asset | null {
  const stillImages = assets.filter((asset) => asset.type === "StillImageFile")
  if (stillImages.length === 0) return null
  return stillImages.reduce((best, current) => {
    const currentDiff = Math.abs(current.width - targetWidth)
    const bestDiff = Math.abs(best.width - targetWidth)
    return currentDiff < bestDiff ? current : best
  }, stillImages[0])
}

export function VideoCard({
  id,
  title,
  description,
  duration,
  assets,
  isSelected,
  onSelect,
  disabled = false,
  badge, // NUEVO
}: Readonly<VideoCardProps>) {
  const [favorite, setFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const thumbnail = useMemo(() => getBestThumbnail(assets, 640), [assets])

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!disabled) setFavorite((prev) => !prev)
  }

  const handleSelect = () => !disabled && onSelect(id)

  return (
    <div
      role="button"
      aria-disabled={disabled}
      onClick={handleSelect}
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all",
        "border-2 border-transparent",
        isSelected && "border-green-500 scale-[98%]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <>
            <Image
              src={thumbnail.url || "/placeholder.svg"}
              alt={`Miniatura de ${title}`}
              fill
              className={cn(
                "object-cover w-full h-full transform transition-transform duration-300",
                !imageLoaded ? "scale-90 blur-sm" : "scale-100 blur-0"
              )}
              onLoadingComplete={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 bg-gray-200/50 animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2">
          {/* Izquierda: duración + badge (si hay) */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
              {duration}
            </div>
            {badge && (
              <div className="px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold tracking-wide">
                {badge}
              </div>
            )}
          </div>

          {/* Derecha: favorito */}
          <button
            onClick={handleToggleFavorite}
            disabled={disabled}
            className={cn(
              "p-1.5 rounded-full backdrop-blur-sm transition-all",
              favorite
                ? "text-red-500 bg-white/90 hover:bg-white"
                : "text-white bg-black/30 hover:bg-black/40"
            )}
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart className={cn("w-4 h-4 transition-colors", favorite && "fill-current")} />
          </button>
        </div>

        {/* Selection Indicator */}
        <div className="absolute bottom-2 left-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all",
              "bg-white/90 shadow-sm border",
              isSelected ? "bg-green-500 border-green-600" : "bg-white border-gray-200"
            )}
          >
            <Check
              className={cn(
                "w-4 h-4 transition-all",
                isSelected ? "text-white scale-100" : "text-transparent scale-50"
              )}
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{description}</p>

        <div
          className={cn(
            "w-full py-2 text-sm font-medium rounded-md text-center transition-colors",
            isSelected
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
          )}
        >
          {isSelected ? "Seleccionado" : "Seleccionar Vídeo"}
        </div>
      </div>
    </div>
  )
}
