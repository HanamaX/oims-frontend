"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    setIsLoggingIn(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError("Invalid username or password")
      }
    } catch (err: any) {
      console.error("Login error details:", err)
      if (err.message === "Network Error") {
        setError("Unable to connect to the server. Please check your internet connection or try again later.")
      } else {
        setError(err.message || "An error occurred during login")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side - Hero section with image */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="/images/adoption-family-2.png" 
            alt="Children at orphanage" 
            fill 
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-20">
          <Link href="/" className="inline-flex items-center text-white hover:text-blue-200 transition-colors">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="relative z-20 space-y-5">
          <h1 className="text-4xl font-bold">Orphanage Management System</h1>
          <p className="text-xl max-w-md">
            Empowering caregivers and administrators to provide the best support for children in need.
          </p>
          <div className="flex gap-3 pt-5">
            <div className="h-2 w-12 bg-white/60 rounded-full"></div>
            <div className="h-2 w-6 bg-white/30 rounded-full"></div>
            <div className="h-2 w-4 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative z-20 text-sm text-blue-100">
          © 2025 Orphanage Management System. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8">
        {/* Mobile-only back to home link */}
        <div className="md:hidden w-full max-w-md mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Home className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-4 pb-2">
              <div className="flex justify-center mb-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-base">Password</Label>
                      <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" /> Sign In
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-5">
              <div className="text-center text-sm text-gray-500">
                <p>
                  By logging in, you agree to our{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
