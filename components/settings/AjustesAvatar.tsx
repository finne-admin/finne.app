'use client'

import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import getCroppedImg from '@/components/utils/cropImage'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Area } from 'react-easy-crop'


const avatarOptions = [
  'https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/avatar1.png',
  'https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/avatar2.png',
  'https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/avatar3.png',
  'https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/avatar4.png',
  'https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/avatar5.png',
]

export function AjustesAvatar() {
  const supabase = createClientComponentClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [openCropper, setOpenCropper] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)


  const handleSetAvatar = async (url: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setSelected(url)
    await supabase.from('users').update({ avatar_url: url }).eq('id', user.id)
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const fileName = `${user.email}_${user.id}.png`

    // Borrar el anterior personalizado si existe
    await supabase.storage.from('avatars').remove([`${user.email}_${user.id}.png`])

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, croppedBlob, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Error subiendo imagen:', uploadError)
      setUploading(false)
      return
    }

    const publicUrl = `https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/${fileName}`
    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)

    setSelected(publicUrl)
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
