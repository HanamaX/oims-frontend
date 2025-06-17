"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FundraiserForm from "@/components/fundraiser-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from "lucide-react"
import FundraiserService from "@/lib/fundraiser-service"

export default function NewFundraiserPage() {  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
    const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")
    
    // Capture the file reference early to prevent it from being garbage collected
    const posterFile = data.posterFile;
    
    console.log("Form submission started with data:", {
      event: data.eventName,
      purpose: data.purpose,
      goal: data.goal,
      fileProvided: !!posterFile,
      fileDetails: posterFile ? {
        name: posterFile.name,
        type: posterFile.type,
        size: posterFile.size,
        lastModified: new Date(posterFile.lastModified).toISOString()
      } : 'No file provided'
    });
    
    try {
      // Remove the poster file from the data object to prepare for API call
      // Use rest operator to get everything except posterFile
      const { posterFile: _, ...fundraiserData } = data;
      
      // Create fundraiser first
      console.log("Creating fundraiser with data:", fundraiserData);
      const createdFundraiser = await FundraiserService.createFundraiser(fundraiserData);
      console.log("Created fundraiser:", createdFundraiser);
      
      // Verify that we have a fundraiser ID and a valid file
      const fundraiserId = createdFundraiser?.publicId;
      
      if (!fundraiserId) {
        console.error("Created fundraiser is missing publicId");
        setError("Created fundraiser is missing an ID. Please try again.");
        return;
      }
      
      // Explicitly check if posterFile is a valid File object
      if (posterFile && posterFile instanceof File && posterFile.size > 0) {
        try {
          console.log(`Preparing to upload image for fundraiser ID: ${fundraiserId}`);
          console.log(`Poster file details:`, {
            name: posterFile.name,
            type: posterFile.type,
            size: `${posterFile.size} bytes (${(posterFile.size / 1024).toFixed(2)} KB)`,
            lastModified: new Date(posterFile.lastModified).toISOString()
          });
          
          // Add a small delay to ensure the fundraiser is fully created on backend
          console.log("Waiting for fundraiser creation to complete...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Create a fresh File object to avoid any potential issues with the original reference
          const fileBlob = await posterFile.slice(0, posterFile.size, posterFile.type);
          const freshFile = new File([fileBlob], posterFile.name, { 
            type: posterFile.type,
            lastModified: posterFile.lastModified
          });
          
          console.log("Uploading fresh file copy to avoid reference issues");
          
          // Wait for image upload with enhanced retry capability
          await FundraiserService.uploadFundraiserImage(fundraiserId, freshFile);
          setSuccessMessage("Fundraiser created successfully with image.");
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          setSuccessMessage("Fundraiser created, but there was an issue uploading the image.");
        }
      } else {
        console.log("No valid poster file to upload", { 
          posterFileExists: !!posterFile,
          isFileInstance: posterFile instanceof File,
          fileSize: posterFile ? posterFile.size : 0,
          fundraiserId: fundraiserId
        });
        setSuccessMessage("Fundraiser created successfully without image.");
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
