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
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      // Extract the file for separate upload
      const { posterFile, ...fundraiserData } = data;
      
      // Create fundraiser first
      const createdFundraiser = await FundraiserService.createFundraiser(fundraiserData);
      
      // If we have a poster file, upload it
      if (posterFile && createdFundraiser.publicId) {
        try {
          await FundraiserService.uploadFundraiserImage(createdFundraiser.publicId, posterFile);
          setSuccessMessage("Fundraiser created successfully with image.");
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          setSuccessMessage("Fundraiser created, but there was an issue uploading the image.");
        }
      } else {
        setSuccessMessage("Fundraiser created successfully.");
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting fundraiser:", err)
      setError("Failed to submit fundraiser. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="relative min-h-screen w-full py-10">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0" 
          style={{
            backgroundImage: 'url(/image/image3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.85)',
          }}
        ></div>
        
        {/* Overlay to improve readability */}
        <div className="fixed inset-0 z-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="container max-w-4xl mx-auto relative z-10">
          <Card className="shadow-2xl backdrop-blur-sm bg-white/95">
            <CardHeader className="bg-green-50/90 border-b">
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
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full py-10">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: 'url(/image/image3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) blur(2px)',
        }}
      ></div>
      
      {/* Overlay to improve readability */}
      <div className="fixed inset-0 z-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="container max-w-4xl mx-auto relative z-10">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md shadow-lg">{error}</div>}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-1">
          <FundraiserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}
