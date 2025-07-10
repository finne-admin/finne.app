// AjustesAvatar.tsx
'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Elige tu avatar</h3>
      <div className="flex gap-4">
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
    </div>
  )
}
