"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronRight, UserPlus, Heart } from "lucide-react"
import Link from "next/link"

export default function VolunteerInfoPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleStartVolunteering = () => {
    router.push("/volunteer/register")
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
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Become a Volunteer</h1>
            <p className="text-xl text-blue-600">Join our community of dedicated individuals making a difference</p>
          </div>

          <Card className="mb-12 border-blue-100 shadow-xl overflow-hidden animate-slide-up">
            <div className="h-64 overflow-hidden">
              <img
                src="/image/image1.jpg"
                alt="Volunteering"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="prose lg:prose-lg">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">How to Volunteer with Us</h2>
                <p className="mb-6">
                  Volunteering is a rewarding way to contribute to the well-being of children in need. 
                  By offering your time, skills, and compassion, you can help create a positive environment 
                  for children and make a lasting impact on their lives.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">1</span>
                      Choose Your Role
                    </h3>
                    <p className="text-gray-700">
                      We have various volunteer positions available, from tutoring and mentoring to organizing events and administrative support.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">2</span>
                      Select Your Schedule
                    </h3>
                    <p className="text-gray-700">
                      Volunteer on a schedule that works for you. We offer flexible time commitments to accommodate your availability.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">3</span>
                      Complete Training
                    </h3>
                    <p className="text-gray-700">
                      All volunteers receive orientation and training to ensure they're prepared to work effectively with children.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">4</span>
                      Make an Impact
                    </h3>
                    <p className="text-gray-700">
                      Your contribution, no matter how small, creates significant positive change in children's lives and our community.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-blue-800 mb-4">Benefits of Volunteering</h3>
                <p>
                  Volunteering doesn't just benefit the children we serve—it's also a rewarding experience for our volunteers:
                </p>
                
                <ul className="my-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Develop new skills and gain valuable experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Build meaningful relationships with staff and children</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Experience the joy of making a direct impact on children's lives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Become part of a supportive and dedicated community</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-100 bg-blue-50/50 p-6">
              <div className="w-full space-y-4">
                <h4 className="text-center text-xl font-medium text-blue-800">Ready to get involved?</h4>
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-6 text-lg"
                  onClick={() => setShowConfirmation(true)}
                >
                  <UserPlus className="mr-2 h-5 w-5" /> Become a Volunteer Today
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <Card className="w-full max-w-md border-blue-100 animate-scale-in bg-white">
                <CardHeader>
                  <CardTitle className="text-center text-blue-800">Volunteer Registration</CardTitle>
                  <CardDescription className="text-center">
                    Do you wish to register as a volunteer?
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
                    onClick={handleStartVolunteering}
                  >
                    Yes, I Want to Help
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