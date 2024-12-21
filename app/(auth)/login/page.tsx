'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs"; // Ensure this is your Supabase client instance

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)
    const supabase = createClientComponentClient()


    // Perform login with Supabase
    // By default, supabase.auth.signInWithPassword sets a persistent session.
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Display the error message to the user
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    // If rememberMe is false and you want non-persistent sessions:
    // Supabase does not provide a built-in "non-persistent" session option easily.
    // One workaround is to immediately sign out after a certain time, or store a
    // short-expiry cookie. For simplicity, we’ll skip custom logic here.
    // If you must handle this, you could implement a timed sign-out or handle sessions manually.

    // On successful login, redirect the user
    setIsLoading(false)
    router.push('/admin') // or another protected route
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
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Welcome to Your Health & Wellness Hub
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              Start your journey to a healthier workplace...
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
              {/* Logo - Only shown when left section is hidden */}
              <div className="lg:hidden mb-8 text-center">
                <Image
                    src="/logoprincipalRecurso 4@4x.png"
                    alt="Finne Logo"
                    width={140}
                    height={60}
                    className="mx-auto max-w-full h-auto"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-[#8BC5B5] mb-4 text-center">
                Login
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter your credentials to login your account.
              </p>

              {errorMessage && (
                  <div className="mb-4 mt-4 bg-red-50 border-red-300 text-red-800 text-center py-2 px-4 rounded">
                    {errorMessage}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-700">
                    Email
                  </label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-gray-700">
                    Password
                  </label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full text-gray-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                        htmlFor="remember"
                        className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forget password?
                  </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white py-2 sm:py-3 rounded-md"
                    disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-600">Don&#39;t have an account? </span>
                <Link
                    href="/sign-up"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
