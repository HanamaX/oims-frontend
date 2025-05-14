"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthService from "@/lib/auth-service"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      // Call the actual forgot password API endpoint
      await AuthService.forgotPassword(email)
      setMessage("Password reset link has been sent to your email.")
    } catch (error: any) {
      console.error("Forgot password error:", error)
      setMessage(error.response?.data?.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="reset-password-container">
      <Card className="reset-password-card">
        <CardHeader className="reset-password-header">
          <CardTitle className="reset-password-title">Reset Password</CardTitle>
          <CardDescription className="reset-password-description">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="reset-password-content">
            {message && <div className="reset-password-message">{message}</div>}
            <div className="reset-password-input-group">
              <Label htmlFor="email" className="reset-password-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="reset-password-input"
                placeholder="Enter your email address"
              />
            </div>
          </CardContent>
          <CardFooter className="reset-password-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/admin")}
              className="reset-password-button-secondary"
            >
              Skip for now
            </Button>
            <Button type="submit" disabled={isSubmitting} className="reset-password-button-primary">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <style jsx>{`
        .reset-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f7ff;
          padding: 1rem;
        }
        
        .reset-password-card {
          width: 100%;
          max-width: 450px;
          border: 1px solid #dbeafe;
        }
        
        .reset-password-header {
          background-color: #eff6ff;
          border-bottom: 1px solid #dbeafe;
        }
        
        .reset-password-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
        }
        
        .reset-password-description {
          text-align: center;
          color: #3b82f6;
        }
        
        .reset-password-content {
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .reset-password-message {
          padding: 0.75rem;
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .reset-password-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .reset-password-label {
          font-weight: 500;
        }
        
        .reset-password-input {
          padding: 0.5rem;
          border: 1px solid #dbeafe;
          border-radius: 0.375rem;
        }
        
        .reset-password-footer {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #dbeafe;
          background-color: #eff6ff;
          margin-top: 1.5rem;
        }
        
        .reset-password-button-primary {
          background-color: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }
        
        .reset-password-button-primary:hover {
          background-color: #2563eb;
        }
        
        .reset-password-button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .reset-password-button-secondary {
          background-color: transparent;
          color: #3b82f6;
          border: 1px solid #dbeafe;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }
        
        .reset-password-button-secondary:hover {
          background-color: #eff6ff;
        }
      `}</style>
    </div>
  )
}
