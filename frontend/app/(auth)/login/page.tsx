'use client'

import React, { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Cookies from "js-cookie"

export default function LoginPage() {
  return (
    // ✅ Envolvemos todo el contenido en Suspense
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
      <LoginPageContent />
    </Suspense>
  )


function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('El correo electrónico es obligatorio')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor, introduce una dirección de correo electrónico válida')
      return false
    }

    if (!formData.password) {
      setErrorMessage('La contraseña es obligatoria')
      return false
    }

    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validateForm()) return
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (data?.code === "ACCOUNT_PENDING") {
          throw new Error("Tu cuenta está pendiente de aprobación por un administrador. Te avisaremos cuando esté lista.")
        }
        if (data?.code === "ACCOUNT_REJECTED") {
          throw new Error("Tu solicitud fue rechazada por un administrador. Si crees que es un error, contacta con soporte.")
        }
        throw new Error(data?.error || "Credenciales inválidas")
      }

      // 🔐 Guardar token en Cookie y en localStorage
      const token = data?.token || data?.accessToken
      if (token) {
        // Guardar cookie accesible para el middleware
        Cookies.set("accessToken", token, {
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
          expires: 30, // persistir sesión ~1 mes
        })

        // Opcional: también guardarlo en localStorage si lo necesitas para peticiones cliente
        localStorage.setItem("accessToken", token)
      }

      // 🔁 Redirección segura con soporte para ?next=
      const nextParam = searchParams.get('next')
      const role = data?.user?.role
      const fallbackPath = role === 'admin' ? '/admin' : '/notifications'

      // Decodificar correctamente el parámetro "next"
      const redirectPath = nextParam ? decodeURIComponent(nextParam) : fallbackPath

      console.log('🔁 Redirigiendo a:', redirectPath)

      // Esperar un breve instante para asegurar que el token se propague
      setTimeout(() => router.push(redirectPath), 150)
    } catch (error) {
      console.error('Error de inicio de sesión:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] p-8 items-center justify-center relative overflow-hidden">
        <div className="max-w-md text-center z-10">
          <Image
            src="/logonegativoRecurso.png"
            alt="Finne Logo"
            width={140}
            height={60}
            className="mx-auto mb-8 max-w-full h-auto"
            priority
          />
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Bienvenido a Tu Centro de Salud y Bienestar
          </h1>
          <p className="text-white/90 text-base md:text-lg leading-relaxed">
            Comienza tu camino hacia un lugar de trabajo más saludable...
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,266.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="white"
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden bg-gradient-to-r from-[#8BC5B5] to-[#5B9B8B] py-4 justify-center">
        <Image
          src="/logonegativoRecurso.png"
          alt="Finne Logo"
          width={120}
          height={50}
          className="mx-auto"
          priority
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#8BC5B5] mb-4 text-center">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Introduce tus credenciales para acceder a tu cuenta.
            </p>

            {errorMessage && (
              <div className="mb-4 mt-4 bg-red-50 border border-red-300 text-red-800 text-center py-2 px-4 rounded animate-fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Introduce tu correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-900"
                  disabled={isLoading}
                  aria-invalid={!!errorMessage}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Introduce tu contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full text-gray-900 pr-10"
                    disabled={isLoading}
                    aria-invalid={!!errorMessage}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Recordarme
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white py-2 sm:py-3 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes cuenta?
              <Link href="/register" className="ml-2 text-blue-600 hover:text-blue-800 transition-colors">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
}
