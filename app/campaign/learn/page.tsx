"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronRight, Gift, Heart } from "lucide-react"
import Link from "next/link"

export default function CampaignLearnPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleStartCampaign = () => {
    router.push("/fundraiser/new")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Start a Campaign</h1>
            <p className="text-xl text-blue-600">Make a meaningful difference in children's lives</p>
          </div>

          <Card className="mb-12 border-blue-100 shadow-xl overflow-hidden animate-slide-up">
            <div className="h-64 overflow-hidden">
              <img
                src="/image/image2.jpg"
                alt="Campaign"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="prose lg:prose-lg">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">How to Start a Campaign</h2>
                <p className="mb-6">
                  Starting a campaign is a powerful way to create positive change for children in need. 
                  Whether you want to raise funds for education, healthcare, or recreational activities, 
                  your initiative can transform lives and bring hope to those who need it most.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">1</span>
                      Choose a Cause
                    </h3>
                    <p className="text-gray-700">
                      Identify the specific need you want to address. Focus on an area where your campaign can make a tangible impact.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">2</span>
                      Set a Goal
                    </h3>
                    <p className="text-gray-700">
                      Determine how much funding you need and what it will accomplish. Clear goals help motivate donors.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">3</span>
                      Tell Your Story
                    </h3>
                    <p className="text-gray-700">
                      Share why this cause matters to you and how donations will make a difference. Authentic stories inspire action.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">4</span>
                      Spread the Word
                    </h3>
                    <p className="text-gray-700">
                      Share your campaign with friends, family, and social networks. The wider your reach, the greater your impact.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Impact of Your Campaign</h3>
                <p>
                  When you start a campaign, you're not just raising funds—you're creating opportunities and building futures.
                  Your efforts can provide:
                </p>
                
                <ul className="my-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Educational materials and tuition for children who otherwise couldn't afford school</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Medical care and health services for vulnerable youth</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Sports equipment and recreational activities that foster physical and mental wellbeing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Basic necessities like food, clothing, and safe shelter</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-100 bg-blue-50/50 p-6">
              <div className="w-full space-y-4">
                <h4 className="text-center text-xl font-medium text-blue-800">Ready to make a difference?</h4>
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-6 text-lg"
                  onClick={() => setShowConfirmation(true)}
                >
                  <Gift className="mr-2 h-5 w-5" /> Start Your Campaign Now
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in 
            ">
              <Card className="w-full max-w-md border-blue-100 animate-scale-in bg-white/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-blue-800">Start a Campaign</CardTitle>
                  <CardDescription className="text-center">
                    Do you wish to start a campaign?
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Heart className="h-16 w-16 text-red-500 animate-pulse" />
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="w-full sm:w-1/2 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700"
                    onClick={handleStartCampaign}
                  >
                    Yes, Let's Begin
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
