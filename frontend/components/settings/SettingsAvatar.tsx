'use client'

import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import getCroppedImg from '@/components/utils/cropImage'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { API_BASE_URL } from '@/lib/apiClient'

const avatarOptions = ['/default-avatar.png']

const getAuthHeaders = () => {
  const headers = new Headers()
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

export function AjustesAvatar() {
  const [selected, setSelected] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [openCropper, setOpenCropper] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleSetAvatar = async (url: string) => {
    setSelected(url)
    const headers = getAuthHeaders()
    headers.set('Content-Type', 'application/json')
    await fetch(`${API_BASE_URL}/api/user/avatar`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ avatarUrl: url }),
    })
  }

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels)
    },
    []
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setOpenCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadCropped = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploading(true)

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const formData = new FormData()
    formData.append('file', croppedBlob, 'avatar.png')

    const res = await fetch(`${API_BASE_URL}/api/user/avatar/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
      credentials: 'include',
    })

    if (!res.ok) {
      console.error('Error subiendo imagen:', res.status)
      setUploading(false)
      return
    }

    const data = await res.json().catch(() => null)
    const publicUrl = data?.avatarUrl
    if (typeof publicUrl === 'string') {
      setSelected(publicUrl)
    }
    setUploading(false)
    setOpenCropper(false)
  }

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800">Foto de perfil</h3>

      <div className="flex gap-4 flex-wrap">
        {avatarOptions.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Avatar ${index + 1}`}
            className={`w-16 h-16 rounded-full cursor-pointer border-2 transition ${
              selected === url ? 'border-green-500' : 'border-transparent'
            }`}
            onClick={() => handleSetAvatar(url)}
          />
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          O sube tu propia imagen
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
      </div>

      <Dialog open={openCropper} onOpenChange={setOpenCropper}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selecciona tu imagen</DialogTitle>
            <DialogDescription>Recorta y ajusta tu imagen antes de subirla.</DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-80 bg-black">
            <Cropper
              image={imageSrc!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpenCropper(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUploadCropped} disabled={uploading}>
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
