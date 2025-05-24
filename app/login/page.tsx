"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, Loader2, LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { T, useLanguage } from "@/contexts/LanguageContext"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!username.trim()) {
      setError("login.usernameRequired")
      return
    }

    if (!password.trim()) {
      setError("login.passwordRequired")
      return
    }

    setIsLoggingIn(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError("login.invalidCredentials")
      }
    } catch (err: any) {
      console.error("Login error details:", err)
      if (err.message === "Network Error") {
        setError("login.networkError")
      } else {
        setError(err.message || "login.generalError")
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
        
        <div className="relative z-20">          <Link href="/" className="inline-flex items-center text-white hover:text-blue-200 transition-colors">
            <Home className="h-5 w-5 mr-2" />
            <span><T k="login.backToHome" /></span>
          </Link>
        </div>
          <div className="relative z-20 space-y-5">
          <h1 className="text-4xl font-bold"><T k="login.orphanageSystem" /></h1>
          <p className="text-xl max-w-md">
            <T k="login.empoweringCaregivers" />
          </p>
          <div className="flex gap-3 pt-5">
            <div className="h-2 w-12 bg-white/60 rounded-full"></div>
            <div className="h-2 w-6 bg-white/30 rounded-full"></div>
            <div className="h-2 w-4 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative z-20 text-sm text-blue-100">
          <T k="login.copyright" />
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8">
        {/* Mobile-only back to home link */}
        <div className="md:hidden w-full max-w-md mb-6">          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Home className="h-4 w-4 mr-2" />
            <span><T k="login.backToHome" /></span>
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
              </div>              <CardTitle className="text-2xl font-bold text-center"><T k="login.welcomeBack" /></CardTitle>
              <CardDescription className="text-center text-base">
                <T k="login.signInAccess" />
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">              <AlertCircle className="h-4 w-4" />
                  <AlertDescription><T k={error} /></AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div className="space-y-2">                    <Label htmlFor="username" className="text-base"><T k="login.username" /></Label>                    <Input
                      id="username"
                      placeholder={t("login.enterUsername")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">                      <Label htmlFor="password" className="text-base"><T k="login.password" /></Label>
                      <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <T k="login.forgotPassword" />
                      </Link>
                    </div>
                    <div className="relative">                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("login.enterPassword")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>                  <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> <T k="login.loggingIn" />
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" /> <T k="login.signIn" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-5">              <div className="text-center text-sm text-gray-500">
                <p>
                  <T k="login.termsAgreement" />{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    <T k="login.termsOfService" />
                  </Link>{" "}
                  <T k="login.and" />{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    <T k="login.privacyPolicy" />
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
