"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Heart, Play, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoCardProps {
  id: string
  hashedId?: string
  title: string
  description: string
  duration: string
  assets: Asset[]
  isSelected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
  badge?: string
  tags?: string[]
  isFavorite?: boolean
  onFavoriteToggle?: (hashedId: string) => void
}

interface Asset {
  url: string
  width: number
  height: number
  type: string
}

const getBestThumbnail = (assets: Asset[], targetWidth: number): Asset | null => {
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
  hashedId,
  title,
  description,
  duration,
  assets,
  isSelected,
  onSelect,
  disabled = false,
  badge,
  tags = [],
  isFavorite,
  onFavoriteToggle,
}: Readonly<VideoCardProps>) {
  const [internalFavorite, setInternalFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const thumbnail = useMemo(() => getBestThumbnail(assets, 640), [assets])
  const favoriteState = typeof isFavorite === "boolean" ? isFavorite : internalFavorite

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (disabled) return
    if (hashedId && onFavoriteToggle) {
      onFavoriteToggle(hashedId)
    } else {
      setInternalFavorite((prev) => !prev)
    }
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

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2">
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

          <button
            onClick={handleToggleFavorite}
            disabled={disabled}
            className={cn(
              "p-1.5 rounded-full backdrop-blur-sm transition-all",
              favoriteState
                ? "text-red-500 bg-white/90 hover:bg-white"
                : "text-white bg-black/30 hover:bg-black/40"
            )}
            aria-label={favoriteState ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart className={cn("w-4 h-4 transition-colors", favoriteState && "fill-current")} />
          </button>
        </div>

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

        {tags.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2 pt-6 flex flex-wrap gap-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={`${id}-overlay-${tag}`}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-white/15 text-white border border-white/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-white/15 text-white border border-white/20">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

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
          {isSelected ? "Seleccionado" : "Seleccionar Video"}
        </div>
      </div>
    </div>
  )
}
