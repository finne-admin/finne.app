"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePicker, { registerLocale } from "react-datepicker"
import { es } from "date-fns/locale/es"
import "react-datepicker/dist/react-datepicker.css"
import Image from "next/image"
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient"

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
  [key: string]: string | undefined
}

export default function RegisterAdminPage() {
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

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    if (!formData.firstName.trim()) errors.firstName = "El nombre es obligatorio"
    if (!formData.lastName.trim()) errors.lastName = "El apellido es obligatorio"
    if (!formData.email.trim()) errors.email = "El correo electrónico es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Correo inválido"
    if (!formData.password || formData.password.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres"
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden"
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

    try {
      const res = await apiFetch(`/api/auth/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error durante el registro")

      setSuccess("Cuenta de administrador creada correctamente.")
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative w-32 h-12 mx-auto">
          <Image src="/logoprincipalRecurso 4@4x.png" alt="Logo de Finne" fill className="object-contain" priority />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear cuenta de Administrador
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Bienvenido a Finne</CardTitle>
            <CardDescription className="text-center">
              Rellena tus datos para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Fecha de nacimiento</Label>
                  <DatePicker
                    selected={formData.dateOfBirth}
                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    minDate={new Date("1940-01-01")}
                    placeholderText="Selecciona tu fecha"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8ACC9F] focus:border-[#8ACC9F]"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                  {formErrors.dateOfBirth && <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                    <SelectTrigger>
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
                  <Label>Contraseña</Label>
                  <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Confirmar Contraseña</Label>
                  <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
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
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
