"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home } from "lucide-react"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type") || "submission"

  const title = "Thank You for Your Participation"
  let description = "Thank you for your submission."

  if (type === "volunteer") {
    description =
      "Your volunteer registration has been received. We appreciate your willingness to help and will contact you soon with more details."
  } else if (type === "fundraiser") {
    description = "Your fundraising campaign has been created. We appreciate your support in helping orphaned children."
  }

  return (
    <div className="min-h-screen bg-blue-50/50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full border-blue-100">
        <CardHeader className="text-center bg-blue-50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
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
      </Card>
    </div>
  )
}
