'use client'

import React, {useEffect, useState} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { AlertCircle, Eye, EyeOff, Mail, Clock, CheckCircle2, RefreshCw} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Utility function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Utility function to retry an operation
async function retry<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoff = 2
): Promise<T> {
    try {
        return await operation()
    } catch (err) {
        if (retries > 0) {
            await wait(delay)
            return retry(operation, retries - 1, delay * backoff)
        }
        throw err
    }
}

export default function SetupPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(50)
    const [isResending, setIsResending] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isEmailSent && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setCanResend(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [isEmailSent, timeRemaining])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Validation checks
            validateForm()

            // Sign up the user with Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        role: 'admin'
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            // Handle potential errors during signup
            if (signUpError) {
                console.error('SignUp Error:', signUpError)
                throw new Error('Unable to sign up. Please try again later.')
            }

            if (!data.user) {
                console.error('Unexpected error: User object missing', data)
                throw new Error('Unexpected error occurred during account creation.')
            }

            // Success: Show confirmation message
            setIsEmailSent(true)

        } catch (err) {
            console.error('Setup error:', err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const validateForm = () => {
        if (!firstName || !lastName) throw new Error('Please enter your first and last name')
        if (!email || !/\S+@\S+\.\S+/.test(email)) throw new Error('Please enter a valid email address')
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters long')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleResendEmail = async () => {
        setIsResending(true)
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin`
                }
            })

            if (resendError) throw resendError

            setTimeRemaining(50)
            setCanResend(false)
        } catch (err) {
            console.error('Resend error:', err)
            setError(err instanceof Error ? err.message : 'Failed to resend email')
        } finally {
            setIsResending(false)
        }
    }

    if (isEmailSent) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-[#8ACC9F]/20 rounded-full flex items-center justify-center mb-6">
                            <Mail className="h-8 w-8 text-[#4F9A8F]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#102E41] mb-2">
                            Check your email
                        </h2>
                        <p className="text-[#102E41]/70 mb-8">
                            We&#39;ve sent a confirmation email to <span className="font-medium text-[#102E41]">{email}</span>
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#8ACC9F]/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#102E41]/70">
                                <CheckCircle2 className="h-5 w-5 text-[#8ACC9F]"/>
                                <span>Click the link in the email to confirm your account</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#102E41]/70">
                                <Clock className="h-5 w-5 text-[#8ACC9F]"/>
                                <span>The link will expire in 24 hours</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#102E41]/70">
                                <AlertCircle className="h-5 w-5 text-[#8ACC9F]"/>
                                <span>If you don&#39;t see the email, check your spam folder</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {!canResend ? (
                                <div className="text-center text-sm text-[#102E41]/60">
                                    You can resend the email in {timeRemaining} seconds
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Button
                                        onClick={handleResendEmail}
                                        disabled={isResending}
                                        variant="outline"
                                        className="gap-2 text-[#4F9A8F] border-[#8ACC9F]/30 hover:bg-[#8ACC9F]/5"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                                        {isResending ? 'Resending...' : 'Resend email'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <Alert
                            variant="destructive"
                            className="mt-4 bg-red-50 border-red-300 text-red-800"
                        >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-white">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Image
                        src="/logoprincipalRecurso 4@4x.png"
                        alt="Finne Logo"
                        width={170}
                        height={170}
                        className="mx-auto"
                        priority
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-[#102E41]">
                        Welcome to Finne
                    </h2>
                    <p className="mt-2 text-sm text-[#102E41]/80">
                        Let&#39;s get your workspace set up
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-[#8ACC9F]/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-[#102E41] mb-1">
                                First Name
                            </label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm text-gray-900"
                                placeholder="John"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-[#102E41] mb-1">
                                Last Name
                            </label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm text-gray-900"
                                placeholder="Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#102E41] mb-1">
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm text-gray-900"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#102E41] mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#8ACC9F] focus:border-[#8ACC9F] sm:text-sm text-gray-900"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <Alert
                                variant="destructive"
                                className="mt-4 bg-red-50 border-red-300 text-red-800 animate-fade-in"
                                role="alert"
                                aria-live="assertive"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <AlertDescription className="font-medium">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-white bg-[#8ACC9F] hover:bg-[#4F9A8F] focus:ring-2 focus:ring-offset-2 focus:ring-[#4F9A8F] disabled:opacity-50 transition transform hover:-translate-y-0.5"
                        >
                            {isLoading ? 'Starting...' : 'Start Setup'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}