'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'

export const LogoutButton = memo(function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

      // 🔹 Llamar al endpoint del frontend (que hace proxy al backend)
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        },
        credentials: 'include',
      }).catch(() => {})

      // 🔹 Limpiar localStorage y redirigir
      localStorage.removeItem('accessToken')
      Cookies.remove('accessToken', { path: '/' })
      router.push('/login')
    } catch (err) {
      console.error('❌ Error cerrando sesión:', err)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full justify-start gap-3 text-white hover:bg-white/10 px-4 py-3"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Cerrando sesión...</span>
        </>
      ) : (
        <>
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar sesión</span>
        </>
      )}
    </Button>
  )
})
