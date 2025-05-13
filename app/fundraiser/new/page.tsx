"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FundraiserForm from "@/components/fundraiser-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from "lucide-react"
import FundraiserService from "@/lib/fundraiser-service"

export default function NewFundraiserPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError("")

    try {
      // Format dates to YYYY-MM-DD
      const formattedData = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        endDate: data.endDate ? data.endDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      }

      await FundraiserService.createFundraiser(formattedData)
      setSubmitted(true)
    } catch (err) {
      console.error("Error submitting fundraiser:", err)
      setError("Failed to submit fundraiser. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <Card>
          <CardHeader className="bg-green-50 border-b">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Thank You for Your Participation</CardTitle>
            <CardDescription className="text-center">
              Your fundraising campaign has been created. We appreciate your support in helping orphaned children.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex justify-center">
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
      <FundraiserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
