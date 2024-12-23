'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { AlertCircle, Eye, EyeOff, Mail, Clock, CheckCircle2, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from "next/navigation"

// Constants
const RESEND_TIMEOUT = 50
const MIN_PASSWORD_LENGTH = 8
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Types
interface SetupFormData {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface SetupFormErrors {
    [key: string]: string | undefined
}

interface SetupState {
    showPassword: boolean
    isLoading: boolean
    isSubmitting: boolean
    isEmailSent: boolean
    canResend: boolean
    isResending: boolean
    timeRemaining: number
    error: string | null
}

// Initial States
const initialFormData: SetupFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}

const initialState: SetupState = {
    showPassword: false,
    isLoading: true,
    isSubmitting: false,
    isEmailSent: false,
    canResend: false,
    isResending: false,
    timeRemaining: RESEND_TIMEOUT,
    error: null
}

// Utility functions
const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const retry = async <T,>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoff = 2
): Promise<T> => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await operation()
        } catch (error) {
            lastError = error as Error
            if (attempt === retries - 1) break
            await wait(delay * Math.pow(backoff, attempt))
        }
    }

    throw lastError
}

export default function SetupPage() {
    // Form and UI state
    const [formData, setFormData] = useState<SetupFormData>(initialFormData)
    const [formErrors, setFormErrors] = useState<SetupFormErrors>({})
    const [state, setState] = useState<SetupState>(initialState)

    const router = useRouter()
    const supabase = createClient()

    // Validation functions
    const validateField = (name: keyof SetupFormData, value: string): string | undefined => {
        switch (name) {
            case 'firstName':
                return value.trim() ? undefined : 'First name is required'
            case 'lastName':
                return value.trim() ? undefined : 'Last name is required'
            case 'email':
                return EMAIL_REGEX.test(value) ? undefined : 'Please enter a valid email address'
            case 'password':
                return value.length >= MIN_PASSWORD_LENGTH
                    ? undefined
                    : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
            default:
                return undefined
        }
    }

    const validateForm = (): boolean => {
        const errors: SetupFormErrors = {}
        let isValid = true

        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key as keyof SetupFormData, value)
            if (error) {
                errors[key] = error
                isValid = false
            }
        })

        setFormErrors(errors)
        return isValid
    }

    // State update helper
    const updateState = (updates: Partial<SetupState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }

    // Setup status check
    useEffect(() => {
        const checkSetupStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'setup_completed')
                    .single()

                if (error) throw error
                if (data?.value === true) {
                    router.push('/login')
                    return
                }
            } catch (error) {
                updateState({
                    error: 'Failed to check setup status',
                    isLoading: false
                })
            } finally {
                updateState({ isLoading: false })
            }
        }

        checkSetupStatus()
    }, [router, supabase])

    // Resend timer
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined

        if (state.isEmailSent && state.timeRemaining > 0) {
            timer = setInterval(() => {
                updateState({
                    timeRemaining: state.timeRemaining - 1,
                    canResend: state.timeRemaining <= 1
                })
            }, 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [state.isEmailSent, state.timeRemaining])

    // Form handlers
    const handleFieldChange = (field: keyof SetupFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target
        setFormData(prev => ({ ...prev, [field]: value }))
        setFormErrors(prev => ({ ...prev, [field]: undefined }))
        updateState({ error: null })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        updateState({ isSubmitting: true, error: null })

        try {
            const response = await retry(() =>
                fetch('/api/setup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
            )

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Setup failed')

            updateState({ isEmailSent: true, isSubmitting: false })
        } catch (error) {
            updateState({
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
                isSubmitting: false
            })
        }
    }

    const handleResendEmail = async () => {
        updateState({ isResending: true, error: null })

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin`
                }
            })

            if (resendError) throw resendError

            updateState({
                timeRemaining: RESEND_TIMEOUT,
                canResend: false,
                isResending: false
            })
        } catch (error) {
            updateState({
                error: error instanceof Error ? error.message : 'Failed to resend email',
                isResending: false
            })
        }
    }

    const togglePasswordVisibility = () => {
        updateState({ showPassword: !state.showPassword })
    }

    // Loading state
    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8ACC9F]"></div>
            </div>
        )
    }

    // View props
    const viewProps = {
        formData,
        formErrors,
        state,
        handleFieldChange,
        handleSubmit,
        handleResendEmail,
        togglePasswordVisibility
    }

    return state.isEmailSent ? (
        <EmailConfirmationView {...viewProps} />
    ) : (
        <SetupFormView {...viewProps} />
    )
}


function EmailConfirmationView({
                                   formData,
                                   state,
                                   handleResendEmail
                               }: {
    formData: { email: string }
    state: {
        timeRemaining: number
        canResend: boolean
        isResending: boolean
        error: string | null
    }
    handleResendEmail: () => Promise<void>
}) {
    const instructionItems = [
        {
            icon: <CheckCircle2 className="h-5 w-5 text-[#8ACC9F]" />,
            text: "Click the link in the email to confirm your account"
        },
        {
            icon: <Clock className="h-5 w-5 text-[#8ACC9F]" />,
            text: "The link will expire in 24 hours"
        },
        {
            icon: <AlertCircle className="h-5 w-5 text-[#8ACC9F]" />,
            text: "If you don't see the email, check your spam folder"
        }
    ]

    return (
        <main className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-white">
            <div className="w-full max-w-md space-y-8">
                {/* Header Section */}
                <header className="text-center">
                    <div
                        className="mx-auto w-16 h-16 bg-[#8ACC9F]/20 rounded-full flex items-center justify-center mb-6"
                        aria-hidden="true"
                    >
                        <Mail className="h-8 w-8 text-[#4F9A8F]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#102E41] mb-2">
                        Check your email
                    </h1>
                    <p className="text-[#102E41]/70 mb-8">
                        We&#39;ve sent a confirmation email to{' '}
                        <strong className="font-medium text-[#102E41]">
                            {formData.email}
                        </strong>
                    </p>
                </header>

                {/* Instructions Card */}
                <section
                    className="bg-white p-6 rounded-xl shadow-lg border border-[#8ACC9F]/20"
                    aria-labelledby="instructions-heading"
                >
                    <h2 id="instructions-heading" className="sr-only">
                        Email Verification Instructions
                    </h2>
                    <div className="space-y-4">
                        {instructionItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-[#102E41]/70"
                            >
                                <span className="flex-shrink-0" aria-hidden="true">
                                    {item.icon}
                                </span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Resend Section */}
                    <div className="mt-8 space-y-4">
                        {!state.canResend ? (
                            <p
                                className="text-center text-sm text-[#102E41]/60"
                                aria-live="polite"
                                role="status"
                            >
                                You can resend the email in {state.timeRemaining} seconds
                            </p>
                        ) : (
                            <div className="text-center">
                                <Button
                                    onClick={handleResendEmail}
                                    disabled={state.isResending}
                                    variant="outline"
                                    className="gap-2 text-[#4F9A8F] border-[#8ACC9F]/30 hover:bg-[#8ACC9F]/5 transition-colors"
                                    aria-label={state.isResending ? "Resending verification email..." : "Resend verification email"}
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${state.isResending ? 'animate-spin' : ''}`}
                                        aria-hidden="true"
                                    />
                                    {state.isResending ? 'Resending...' : 'Resend email'}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Error Alert */}
                {state.error && (
                    <Alert
                        variant="destructive"
                        className="mt-4 bg-red-50 border-red-300 text-red-800"
                        role="alert"
                        aria-live="assertive"
                    >
                        <AlertCircle
                            className="h-4 w-4 mr-2"
                            aria-hidden="true"
                        />
                        <AlertDescription>
                            {state.error}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </main>
    )
}

interface SetupFormViewProps {
    formData: SetupFormData;
    formErrors: {
        [K in keyof SetupFormData]?: string;
    };
    state: {
        showPassword: boolean;
        isSubmitting: boolean;
        error: string | null;
    };
    handleFieldChange: (field: keyof SetupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    togglePasswordVisibility: () => void;
}

interface FormField {
    id: keyof SetupFormData;  // This ensures id can only be firstName, lastName, email, or password
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
    value: string;
    error?: string;
}

function SetupFormView({
                           formData,
                           formErrors,
                           state,
                           handleFieldChange,
                           handleSubmit,
                           togglePasswordVisibility
                       }: SetupFormViewProps) {
    const formFields: FormField[] = [
        {
            id: 'firstName',  // TypeScript now ensures this must be a key of SetupFormData
            label: 'First Name',
            type: 'text',
            placeholder: 'John',
            autoComplete: 'given-name',
            value: formData.firstName,
            error: formErrors.firstName
        },
        {
            id: 'lastName',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Doe',
            autoComplete: 'family-name',
            value: formData.lastName,
            error: formErrors.lastName
        },
        {
            id: 'email',
            label: 'Email address',
            type: 'email',
            placeholder: 'you@company.com',
            autoComplete: 'email',
            value: formData.email,
            error: formErrors.email
        }
    ]
    return (
        <main className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-white">
            <div className="w-full max-w-md space-y-8">
                {/* Header Section */}
                <header className="text-center">
                    <Image
                        src="/logoprincipalRecurso 4@4x.png"
                        alt="Finne Logo"
                        width={170}
                        height={170}
                        className="mx-auto"
                        priority
                    />
                    <h1 className="mt-6 text-3xl font-extrabold text-[#102E41]">
                        Welcome to Finne
                    </h1>
                    <p className="mt-2 text-sm text-[#102E41]/80">
                        Let&#39;s get your workspace set up
                    </p>
                </header>

                {/* Form Section */}
                <section
                    className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-[#8ACC9F]/20"
                    aria-labelledby="form-heading"
                >
                    <h2 id="form-heading" className="sr-only">Setup Account Form</h2>
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Setup form"
                    >
                        {/* Regular Form Fields */}
                        {formFields.map((field) => (
                            <div key={field.id}>
                                <label
                                    htmlFor={field.id}
                                    className="block text-sm font-medium text-[#102E41] mb-1"
                                >
                                    {field.label}
                                </label>
                                <Input
                                    id={field.id}
                                    name={field.id}
                                    type={field.type}
                                    autoComplete={field.autoComplete}
                                    required
                                    value={field.value}
                                    onChange={handleFieldChange(field.id)}
                                    className={`block w-full focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm transition-colors
                ${field.error ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder={field.placeholder}
                                    aria-required="true"
                                    aria-invalid={field.error ? 'true' : 'false'}
                                    aria-describedby={field.error ? `${field.id}-error` : undefined}
                                />
                                {field.error && (
                                    <p
                                        id={`${field.id}-error`}
                                        className="mt-1 text-sm text-red-600"
                                        role="alert"
                                    >
                                        {field.error}
                                    </p>
                                )}
                            </div>
                        ))}
                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#102E41] mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={state.showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleFieldChange('password')}
                                    className={`block w-full pr-10 focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm transition-colors
                                        ${formErrors.password ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                    aria-required="true"
                                    aria-invalid={formErrors.password ? 'true' : 'false'}
                                    aria-describedby={formErrors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors"
                                    aria-label={state.showPassword ? "Hide password" : "Show password"}
                                >
                                    {state.showPassword ? (
                                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p
                                    id="password-error"
                                    className="mt-1 text-sm text-red-600"
                                    role="alert"
                                >
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        {/* General Error Alert */}
                        {state.error && (
                            <Alert
                                variant="destructive"
                                className="bg-red-50 border-red-300 text-red-800 animate-fade-in"
                                role="alert"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                                <AlertDescription className="font-medium">
                                    {state.error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={state.isSubmitting}
                            className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-white
                                bg-[#8ACC9F] hover:bg-[#4F9A8F] focus:ring-2 focus:ring-offset-2 focus:ring-[#4F9A8F]
                                disabled:opacity-50 transition transform hover:-translate-y-0.5"
                            aria-disabled={state.isSubmitting}
                        >
                            {state.isSubmitting ? (
                                <>
                                    <span className="sr-only">Setting up your account...</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Starting...</span>
                                    </div>
                                </>
                            ) : (
                                'Start Setup'
                            )}
                        </Button>
                    </form>
                </section>
            </div>
        </main>
    )
}