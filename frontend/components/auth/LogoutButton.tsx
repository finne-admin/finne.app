'use client'
import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'

export const LogoutButton = memo(function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('fcm_tokens').delete().eq('user_id', user.id).throwOnError()
      }
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10 px-4 py-3" disabled={isLoading}>
      {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin" /><span className="font-medium">Cerrando sesión...</span></>)
                 : (<><LogOut className="h-5 w-5" /><span className="font-medium">Cerrar sesión</span></>)}
    </Button>
  )
})
