'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
// Supabase removed
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface FormState {
    password: string
    confirmPassword: string
    showPassword: boolean
    showConfirmPassword: boolean
    isLoading: boolean
    errorMessage: string
    successMessage: string
    redirectCountdown: number
}

export default function ResetPasswordPage() {
    // Supabase removed
    const router = useRouter()

    const [formState, setFormState] = useState<FormState>({
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        isLoading: false,
        errorMessage: '',
        successMessage: '',
        redirectCountdown: 5
    })

    const updateFormState = useCallback((updates: Partial<FormState>) => {
        setFormState(prev => ({ ...prev, ...updates }))
    }, [])

    const startRedirectCountdown = useCallback(() => {
        let count = 5
        const timer = setInterval(() => {
            count--
            updateFormState({ redirectCountdown: count })

            if (count === 0) {
                clearInterval(timer)
                router.push('/login')
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [router, updateFormState])

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { password, confirmPassword } = formState

        const passwordError = validatePassword(password)
        if (passwordError) {
            updateFormState({ errorMessage: passwordError })
            return
        }

        if (password !== confirmPassword) {
            updateFormState({ errorMessage: 'Las contraseñas no coinciden' })
            return
        }
        updateFormState({ isLoading: true, errorMessage: '', successMessage: '' })

        try {
            const params = new URLSearchParams(window.location.search)
            const token = params.get('token')
            if (!token) {
                updateFormState({ errorMessage: 'Token de restablecimiento faltante o inválido' })
                updateFormState({ isLoading: false })
                return
            }
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || 'Error al restablecer contraseña')
            }
            updateFormState({
                successMessage: 'Contraseña restablecida. Redirigiendo al inicio de sesión en 5 segundos...',
                password: '',
                confirmPassword: ''
            })
            startRedirectCountdown()
        } catch (error: any) {
            updateFormState({ errorMessage: error.message || 'Error al restablecer contraseña' })
        } finally {
            updateFormState({ isLoading: false })
        }
    }

    const {
        password, confirmPassword, showPassword, showConfirmPassword,
        isLoading, errorMessage, successMessage, redirectCountdown
    } = formState

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] p-8 items-center justify-center relative overflow-hidden">
                <div className="max-w-md text-center z-10">
                    <Image
                        src="/logoprincipalRecurso 4@4x.png"
                        alt="Finne Logo"
                        width={140}
                        height={60}
                        className="mx-auto mb-8 max-w-full h-auto"
                        priority
                    />
                    <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        Restablece Tu Contraseña
                    </h1>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed">
                        Crea una nueva contraseña segura para tu cuenta.
                    </p>
                </div>
                {/* Waves */}
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

            {/* Right Section */}
            <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-100 flex items-center justify-center p-4 sm:p-8 flex-1">
                <div className="w-full max-w-md">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Image
                                src="/logoprincipalRecurso 4@4x.png"
                                alt="Finne Logo"
                                width={140}
                                height={60}
                                className="mx-auto max-w-full h-auto"
                                priority
                            />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#8BC5B5] mb-4 text-center">
                            Restablecer Contraseña
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Por favor, introduce tu nueva contraseña.
                        </p>

                        {errorMessage && (
                            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-300 text-red-800 text-center py-2 px-4 rounded animate-fade-in" role="alert">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-300 text-green-800 text-center py-2 px-4 rounded animate-fade-in" role="alert">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{successMessage.replace('5', redirectCountdown.toString())}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm text-gray-700">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => updateFormState({ password: e.target.value, errorMessage: '' })}
                                        placeholder="Introduce tu nueva contraseña"
                                        required
                                        className="w-full pr-10"
                                        disabled={isLoading || !!successMessage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateFormState({ showPassword: !showPassword })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm text-gray-700">
                                    Confirmar Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={e => updateFormState({ confirmPassword: e.target.value, errorMessage: '' })}
                                        placeholder="Confirma tu nueva contraseña"
                                        required
                                        className="w-full pr-10"
                                        disabled={isLoading || !!successMessage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateFormState({ showConfirmPassword: !showConfirmPassword })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white py-2 sm:py-3 rounded-md transition-all"
                                disabled={isLoading || !!successMessage}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Restableciendo Contraseña...
                                    </div>
                                ) : (
                                    'Restablecer Contraseña'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



