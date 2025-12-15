'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import DatePicker, { registerLocale } from 'react-datepicker'
import { es } from 'date-fns/locale/es'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

import 'react-datepicker/dist/react-datepicker.css'

registerLocale('es', es)

type RegistrationData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: Date | null
  sex: string
  joinCode: string
}

type FormErrors = Partial<Record<keyof RegistrationData, string>>

const initialForm: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: null,
  sex: '',
  joinCode: '',
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistrationData>(initialForm)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const errors: FormErrors = {}

    if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio'
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es obligatorio'

    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) errors.email = 'Correo electrónico inválido'
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.dateOfBirth) errors.dateOfBirth = 'La fecha de nacimiento es obligatoria'
    if (!formData.sex) errors.sex = 'El sexo es obligatorio'
    if (!formData.joinCode.trim()) {
      errors.joinCode = 'El código de registro es obligatorio'
    } else {
      const codeRegex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/
      if (!codeRegex.test(formData.joinCode.trim().toUpperCase())) {
        errors.joinCode = 'El código debe tener formato XXX-YYY'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    const field = id as keyof RegistrationData
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }))
    if (formErrors.dateOfBirth) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next.dateOfBirth
        return next
      })
    }
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSexChange = (value: string) => {
    setFormData(prev => ({ ...prev, sex: value }))
    if (formErrors.sex) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next.sex
        return next
      })
    }
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading) return

    setErrorMessage('')
    setSuccessMessage('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        sex: formData.sex,
        joinCode: formData.joinCode.trim().toUpperCase(),
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo completar el registro')
      }

      const status = data?.accountStatus || data?.user?.account_status
      const autoApproved = status === 'active'

      setSuccessMessage(
        autoApproved
          ? 'Cuenta creada y activada. Ya puedes iniciar sesión con tus credenciales.'
          : 'Solicitud enviada. Un administrador revisará tu cuenta y te avisaremos cuando puedas iniciar sesión.'
      )
      setFormData(initialForm)

      setTimeout(() => {
        router.push('/login')
      }, 2500)
    } catch (error) {
      console.error('Error durante el registro:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error inesperado al registrar')
    } finally {
      setIsLoading(false)
    }
  }

  const datePickerStyles = {
    container: 'relative',
    input: `w-full px-3 py-2 border rounded-md ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#8BC5B5] focus:border-[#8BC5B5] bg-white text-gray-900`,
    wrapper: 'w-full',
  }

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
              Únete a la comunidad Finne
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              Regístrate para acceder a programas de bienestar, seguimiento y soporte personalizado.
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

        {/* Right Section */}
        <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-100 flex items-center justify-center p-4 sm:p-8 flex-1">
          <div className="w-full max-w-2xl">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
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
                Crear cuenta
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Completa el formulario para registrarte y comenzar tu experiencia con Finne.
              </p>
              <Alert className="mb-6 bg-blue-50 border border-blue-200 text-blue-900">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Necesitas un código de tu organización y departamento (ejemplo: <strong>STN-VEN</strong>).
                  Algunas invitaciones pueden activar la cuenta automáticamente; en caso contrario, quedará pendiente
                  hasta que un administrador la apruebe.
                </AlertDescription>
              </Alert>

              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mb-4 bg-green-50 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={formErrors.firstName ? 'border-red-500' : ''}
                    />
                    {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={formErrors.lastName ? 'border-red-500' : ''}
                    />
                    {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinCode">Código de registro</Label>
                  <Input
                      id="joinCode"
                      value={formData.joinCode}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Ej: STN-VEN"
                      className={formErrors.joinCode ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500">
                    Solicita este código a tu organización. Formato requerido: tres caracteres, guion y tres caracteres.
                  </p>
                  {formErrors.joinCode && <p className="text-sm text-red-500">{formErrors.joinCode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                  <div className={datePickerStyles.container}>
                    <DatePicker
                        id="dateOfBirth"
                        selected={formData.dateOfBirth}
                        onChange={handleDateChange}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={70}
                        placeholderText="Selecciona tu fecha de nacimiento"
                        className={datePickerStyles.input}
                        wrapperClassName={datePickerStyles.wrapper}
                        disabled={isLoading}
                    />
                  </div>
                  {formErrors.dateOfBirth && <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <Select
                      value={formData.sex}
                      onValueChange={handleSexChange}
                      disabled={isLoading}
                  >
                    <SelectTrigger id="sex" className={formErrors.sex ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="mujer">Mujer</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.sex && <p className="text-sm text-red-500">{formErrors.sex}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={formErrors.password ? 'border-red-500' : ''}
                    />
                    {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={formErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white py-2 sm:py-3 rounded-md transition-colors"
                    disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Registrando...
                    </div>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <Link
                    href="/login"
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}
