'use client'

import { useState, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Loader2, Upload } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSetAvatar = async (url: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSelected(url)

    const { error } = await supabase
      .from('users')
      .update({ avatar_url: url })
      .eq('id', user.id)

    if (error) {
      console.error('Error actualizando avatar:', error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploading(false)
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `custom_${user.id}.${fileExt}`
    const filePath = fileName

    // Borra imagen anterior personalizada si había una
    const previousFile = selected?.includes(`custom_${user.id}`)
    ? selected.split('/').pop()
    : null

    if (previousFile) {
    await supabase.storage.from('avatars').remove([previousFile])
    }


    // Sube nueva imagen
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Error subiendo imagen:', uploadError)
      setUploading(false)
      return
    }

    const publicUrl = `https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars/${fileName}`

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error actualizando URL:', updateError)
    } else {
      setSelected(publicUrl)
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
          />
          <Button variant="secondary" disabled={uploading}>
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Subir
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
