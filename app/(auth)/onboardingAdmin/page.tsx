"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePicker from "react-datepicker"
import { registerLocale } from "react-datepicker"
import { es } from "date-fns/locale/es"
import "react-datepicker/dist/react-datepicker.css"
import Image from "next/image"

import { createClient } from "@/lib/supabase"

// Register Spanish locale for the date picker
registerLocale("es", es)

interface RegistrationData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    dateOfBirth: Date | null
    sex: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    dateOfBirth?: string
    sex?: string
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegistrationData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: null,
        sex: "",
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.firstName.trim()) errors.firstName = "El nombre es obligatorio"
        if (!formData.lastName.trim()) errors.lastName = "El apellido es obligatorio"

        if (!formData.email.trim()) {
            errors.email = "El correo electrónico es obligatorio"
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Por favor, introduce un correo electrónico válido"
        }

        if (!formData.password) errors.password = "La contraseña es obligatoria"
        if (formData.password.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres"
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden"
        }
        if (!formData.dateOfBirth) errors.dateOfBirth = "La fecha de nacimiento es obligatoria"
        if (!formData.sex) errors.sex = "El sexo es obligatorio"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!validateForm()) return
        setIsLoading(true)

        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Verificamos si ya tiene fila en la tabla "users"
                const { data: existingUser, error: fetchError } = await supabase
                    .from("users")
                    .select("id")
                    .eq("id", user.id)
                    .single()

                if (!existingUser) {
                    const { error: insertError } = await supabase.from("users").insert({
                        id: user.id,
                        email: user.email,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        date_of_birth: formData.dateOfBirth?.toISOString(),
                        sex: formData.sex,
                        role: user.user_metadata?.role ?? "admin"
                    })

                    if (insertError) throw new Error("Error guardando datos: " + insertError.message)
                }

                // También actualizamos metadata por si no se hizo en el momento de la invitación
                const { error: updateError } = await supabase.auth.updateUser({
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        date_of_birth: formData.dateOfBirth?.toISOString(),
                        sex: formData.sex,
                        role: "admin"
                    }
                })

                if (updateError) throw new Error("Error actualizando perfil: " + updateError.message)

                setSuccess("Datos guardados correctamente.")
                setTimeout(() => router.push("/login"), 4000)
            } else {
                // Registro manual (sin invitación previa)
                const { error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            sex: formData.sex,
                            date_of_birth: formData.dateOfBirth?.toISOString(),
                            role: "admin"
                        }
                    }
                })

                if (signUpError) throw new Error("Error al registrar: " + signUpError.message)

                setSuccess("Cuenta de administrador creada correctamente. Revisa tu correo para verificar tu cuenta.")
                setTimeout(() => router.push("/login"), 4000)
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error en el registro")
        } finally {
            setIsLoading(false)
        }
    }



    // Custom styles for the date picker to match the application's design
    const datePickerCustomStyles = {
        datePickerContainer: "relative",
        datePickerInput: `w-full px-3 py-2 border rounded-md ${
            formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-[#8ACC9F] focus:border-[#8ACC9F]`,
        datePickerWrapper: "w-full",
    }

    return (
        <div className="min-h-screen bg-gradient-to-b bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="relative w-32 h-12 mx-auto">
                    <Image src="/logoprincipalRecurso 4@4x.png" alt="Logo de Finne" fill className="object-contain" priority />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crear una cuenta de Administrador</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Bienvenido a Finne</CardTitle>
                        <CardDescription className="text-center">Regístrate para comenzar tu experiencia</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="space-y-4">
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                                </Alert>
                                <p className="text-center text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                            className={formErrors.firstName ? "border-red-500" : ""}
                                        />
                                        {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                            className={formErrors.lastName ? "border-red-500" : ""}
                                        />
                                        {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        className={formErrors.email ? "border-red-500" : ""}
                                    />
                                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                                    <div className={datePickerCustomStyles.datePickerContainer}>
                                        <DatePicker
                                            id="dateOfBirth"
                                            selected={formData.dateOfBirth}
                                            onChange={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
                                            locale="es"
                                            dateFormat="dd/MM/yyyy"
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={70}
                                            placeholderText="Selecciona tu fecha de nacimiento"
                                            className={datePickerCustomStyles.datePickerInput}
                                            wrapperClassName={datePickerCustomStyles.datePickerWrapper}
                                            maxDate={new Date()}
                                            minDate={new Date("1940-01-01")}
                                            showMonthDropdown
                                            dropdownMode="select"
                                        />
                                        {formErrors.dateOfBirth && <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sex">Sexo</Label>
                                    <Select
                                        value={formData.sex}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                                    >
                                        <SelectTrigger id="sex" className={formErrors.sex ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Selecciona tu sexo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hombre">Hombre</SelectItem>
                                            <SelectItem value="mujer">Mujer</SelectItem>
                                            <SelectItem value="otros">Otros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formErrors.sex && <p className="text-sm text-red-500">{formErrors.sex}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                        className={formErrors.password ? "border-red-500" : ""}
                                    />
                                    {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        className={formErrors.confirmPassword ? "border-red-500" : ""}
                                    />
                                    {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
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
                                            <span>Creando cuenta...</span>
                                        </div>
                                    ) : (
                                        "Registrarse"
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-600">
                                        ¿Ya tienes una cuenta?{" "}
                                        <a href="/login" className="font-medium text-[#8ACC9F] hover:text-[#7AB4A4]">
                                            Iniciar sesión
                                        </a>
                                    </p>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}