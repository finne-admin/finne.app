'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormState {
    email: string
    isLoading: boolean
    errorMessage: string
    successMessage: string
    redirectCountdown: number
}

export default function ForgotPasswordPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [formState, setFormState] = useState<FormState>({
        email: '',
        isLoading: false,
        errorMessage: '',
        successMessage: '',
        redirectCountdown: 5
    })

    const validateEmail = useCallback((email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email.trim())
    }, [])

    const updateFormState = useCallback((updates: Partial<FormState>) => {
        setFormState(prev => ({ ...prev, ...updates }))
    }, [])

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormState({
            email: e.target.value,
            errorMessage: '',
            successMessage: ''
        })
    }, [updateFormState])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { email } = formState

        if (!email.trim()) {
            updateFormState({ errorMessage: 'El email es obligatorio' })
            return
        }

        if (!validateEmail(email)) {
            updateFormState({ errorMessage: 'Por favor, introduce una dirección de email válida' })
            return
        }

        updateFormState({ isLoading: true, errorMessage: '', successMessage: '' })

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password?token=true`,
            })

            if (error) throw error

            updateFormState({
                successMessage: 'Email de restablecimiento enviado. Redirigiendo al inicio de sesión en 5 segundos...',
                email: '' // Clear email after success
            })
            startRedirectCountdown()
        } catch (error: any) {
            console.error('Error de restablecimiento de contraseña:', error)
            const errorMessage = error.status === 429
                ? 'Demasiadas solicitudes. Por favor, inténtalo más tarde.'
                : error.message || 'Error al enviar el email de restablecimiento'
            updateFormState({ errorMessage })
        } finally {
            updateFormState({ isLoading: false })
        }
    }

    const { email, isLoading, errorMessage, successMessage, redirectCountdown } = formState

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] p-8 items-center justify-center relative overflow-hidden">
                <div className="max-w-md text-center z-10">
                    <Image
                        src="/logonegativoRecurso.png"
                        alt="Logo de Finne"
                        width={140}
                        height={60}
                        className="mx-auto mb-8 max-w-full h-auto"
                        priority
                    />
                    <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        ¿Has olvidado tu contraseña?
                    </h1>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed">
                        ¡No te preocupes! Te ayudaremos a restablecerla en un momento.
                    </p>
                </div>
                {/* Waves background */}
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
                                alt="Logo de Finne"
                                width={140}
                                height={60}
                                className="mx-auto max-w-full h-auto"
                                priority
                            />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#8BC5B5] mb-4 text-center">
                            Contraseña Olvidada
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Introduce tu dirección de email para restablecer tu contraseña.
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
                                <label htmlFor="email" className="text-sm text-gray-700">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Introduce tu dirección de email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    className="w-full text-gray-900"
                                    disabled={isLoading || !!successMessage}
                                    aria-invalid={!!errorMessage}
                                    aria-describedby={errorMessage ? "email-error" : undefined}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white py-2 sm:py-3 rounded-md transition-all"
                                disabled={isLoading || !!successMessage}
                                aria-busy={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Enviando Email...
                                    </div>
                                ) : (
                                    'Enviar Enlace de Restablecimiento'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <span className="text-gray-600">¿Recuerdas tu contraseña? </span>
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}