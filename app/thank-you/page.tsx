"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home, Loader2 } from "lucide-react"
import Link from "next/link"

function ThankYouContent() {
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

// Add a loading component for the Suspense boundary
function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 flex items-center justify-center">
      <Card className="border-blue-100 shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <CardTitle className="text-center mb-2">Loading...</CardTitle>
          <CardDescription className="text-center">
            Please wait while we prepare your thank you message.
          </CardDescription>
        </div>
      </Card>
    </div>
  );
}

function RegistrationInstructions() {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">How to Register an Orphanage Center</h2>
      <p className="mb-6 text-gray-700">Registering your orphanage center is a simple process. Please follow the steps below to ensure your application is complete and accurate. Your initiative can transform lives and bring hope to children in need.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-blue-700 mr-2">1</span>
            <span className="font-semibold text-blue-700">Fill in Personal Details</span>
          </div>
          <p className="text-gray-600">Provide your full name, email, phone number, and select your gender.</p>
        </div>
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-blue-700 mr-2">2</span>
            <span className="font-semibold text-blue-700">Enter Center Details</span>
          </div>
          <p className="text-gray-600">Specify the name of your center and the region where you wish to be placed.</p>
        </div>
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-blue-700 mr-2">3</span>
            <span className="font-semibold text-blue-700">Upload Certificate</span>
          </div>
          <p className="text-gray-600">Attach a valid certificate (PDF only) required for opening an orphanage center.</p>
        </div>
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-blue-700 mr-2">4</span>
            <span className="font-semibold text-blue-700">Submit Application</span>
          </div>
          <p className="text-gray-600">Review your details and submit the form. We will review your application and contact you soon.</p>
        </div>
      </div>
    </div>
  )
}

function OrphanageRegistrationForm() {
  const fileInputRef = useRef(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    alert("Registration submitted! (Demo only)");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed for the certificate upload.");
      if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mb-12" id="register-form">
      <h3 className="text-xl font-semibold text-blue-700 mb-6">Orphanage Center Registration Form</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Personal Details */}
        <div>
          <h4 className="text-lg font-bold text-blue-600 mb-4">Personal Details</h4>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" required className="w-full border rounded px-3 py-2" placeholder="Enter your full name" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input type="tel" name="phone" required className="w-full border rounded px-3 py-2" placeholder="e.g. +255712345678" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Gender</label>
            <select name="gender" required className="w-full border rounded px-3 py-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        {/* Center Details */}
        <div>
          <h4 className="text-lg font-bold text-blue-600 mb-4">Center Details</h4>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Center Name</label>
            <input type="text" name="centerName" required className="w-full border rounded px-3 py-2" placeholder="Enter center name" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Region of Placement</label>
            <input type="text" name="region" required className="w-full border rounded px-3 py-2" placeholder="Enter region" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Certificate (PDF only)</label>
            <input type="file" name="certificate" accept="application/pdf" required ref={fileInputRef} onChange={handleFileChange} className="w-full" />
          </div>
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Registration</button>
    </form>
  );
}

// Export default component with Suspense boundary
export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <RegistrationInstructions />
        <OrphanageRegistrationForm />
        <Suspense fallback={<ThankYouLoading />}>
          <ThankYouContent />
        </Suspense>
      </div>
    </div>
  );
}
