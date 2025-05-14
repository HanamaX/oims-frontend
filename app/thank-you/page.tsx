"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [type, setType] = useState("")
  const [title, setTitle] = useState("Thank You!")
  const [message, setMessage] = useState("Your submission has been received.")

  useEffect(() => {
    const typeParam = searchParams.get("type") || "submission"
    setType(typeParam)
    
    if (typeParam === "volunteer") {
      setTitle("Thank You for Volunteering!")
      setMessage("Your volunteer registration has been successfully submitted. We'll be in touch with you soon about the next steps.")
    } else if (typeParam === "fundraiser" || typeParam === "campaign") {
      setTitle("Thank You for Starting a Campaign!")
      setMessage("Your campaign proposal has been successfully submitted. We'll review it and get back to you shortly.")
    } else if (typeParam === "donation") {
      setTitle("Thank You for Your Donation!")
      setMessage("Your generous contribution will help make a difference in children's lives.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-100 shadow-xl overflow-hidden animate-scale-in">
            <div>
              <div className="bg-blue-600 h-2"></div>
              <CardHeader className="text-center pt-12 pb-6">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4 animate-scale-in">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">{title}</CardTitle>
            <CardDescription className="text-center">{message}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">
              Your contribution makes a real difference in the lives of orphaned children. Thank you for your support.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
        </div>
      </div>
  )
}
