'use client'

import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

interface OnboardingData {
    firstName: string
    lastName: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    password?: string
    confirmPassword?: string
}

export default function OnboardingPage() {
    const [formData, setFormData] = useState<OnboardingData>({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio'
        if (!formData.lastName.trim()) errors.lastName = 'El apellido es obligatorio'
        if (!formData.password) errors.password = 'La contraseña es obligatoria'
        if (formData.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres'
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    useEffect(() => {
        async function checkOnboard() {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('onboard')
                .eq('id', user.id)
                .single();

            if (!error && data && data.onboard === true) {
                router.push('/notification');
            }
        }

        checkOnboard();
    }, [supabase, router]);

    useEffect(() => {
        // Attempt to parse the hash if present:
        const url = new URL(window.location.href);
        const hash = url.hash; // e.g. "#access_token=..."

        if (hash.includes("access_token")) {
            // This snippet is just an example; parse the actual token keys:
            const params = new URLSearchParams(hash.slice(1));
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");
            // Then set the session:
            if (access_token && refresh_token) {
                supabase.auth.setSession({
                    access_token,
                    refresh_token,
                }).then(({ data, error }) => {
                    if (error) {
                        console.error("Error al establecer la sesión:", error);
                    } else {
                        console.log("¡Sesión establecida!", data);
                    }
                });
            }
        }
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsLoading(true)

        try {
            // (a) Get the current user
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError) throw userError

            if (!user) {
                // If user is null, we can't continue
                throw new Error('No se encontró ningún usuario. Por favor, inicia sesión de nuevo.')
            }

            // (b) Update Auth user (password + metadata)
            const { error: updateAuthError } = await supabase.auth.updateUser({
                password: formData.password,
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                }
            })
            if (updateAuthError) throw updateAuthError

            // (c) Update separate 'users' table
            // Assuming your 'users' table has columns: id (PK), first_name, last_name
            const { error: dbError } = await supabase
                .from('users')
                .update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    onboard: true,
                })
                .eq('id', user.id)

            if (dbError) throw dbError

            // (d) Navigate to the next page
            router.push('/notification')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-b bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="relative w-32 h-12 mx-auto">
                    <Image
                        src="/logoprincipalRecurso 4@4x.png"
                        alt="Logo de Finne"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Completa Tu Perfil
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Bienvenido a Finne</CardTitle>
                        <CardDescription className="text-center">
                            Configura tu cuenta para empezar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Nombre</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                                        className={formErrors.firstName ? 'border-red-500' : ''}
                                    />
                                    {formErrors.firstName && (
                                        <p className="text-sm text-red-500">{formErrors.firstName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                                        className={formErrors.lastName ? 'border-red-500' : ''}
                                    />
                                    {formErrors.lastName && (
                                        <p className="text-sm text-red-500">{formErrors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                    className={formErrors.password ? 'border-red-500' : ''}
                                />
                                {formErrors.password && (
                                    <p className="text-sm text-red-500">{formErrors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                                    className={formErrors.confirmPassword ? 'border-red-500' : ''}
                                />
                                {formErrors.confirmPassword && (
                                    <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                                )}
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-[#8ACC9F] hover:bg-[#7AB4A4] text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Configurando cuenta...</span>
                                    </div>
                                ) : (
                                    'Completar Configuración'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}