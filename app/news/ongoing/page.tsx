"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Heart, Gift } from "lucide-react"
import Link from "next/link"

export default function OngoingNewsPage() {
  // Campaign data based on the image you provided
  const campaigns = [
    {
      id: 1,
      title: "Education for All Children",
      description: "Help provide school supplies and tuition",
      image: "/image/card1.jpg",
      raised: 3500,
      goal: 8000,
      isCompleted: false
    },
    {
      id: 2,
      title: "Healthcare Initiative",
      description: "Provide medical checkups and treatments",
      image: "/image/card2.jpg",
      raised: 5000,
      goal: 9000,
      isCompleted: false
    },
    {
      id: 3,
      title: "Sports Equipment Drive",
      description: "Purchase sports equipment for recreational activities",
      image: "/image/image1.jpg",
      raised: 3000,
      goal: 3000,
      isCompleted: true
    },
    {
      id: 4,
      title: "Nutrition Program",
      description: "Provide healthy meals to undernourished children",
      image: "/image/image2.jpg",
      raised: 4200,
      goal: 6000,
      isCompleted: false
    },
    {
      id: 5,
      title: "Digital Learning Resources",
      description: "Supply tablets and educational software for students",
      image: "/image/backgroundwallpaper.jpg",
      raised: 7500,
      goal: 10000,
      isCompleted: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Ongoing Campaigns</h1>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Join our mission to support children in need through these active initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-blue-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden animate-slide-up">
                <div className="h-48 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  {campaign.isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">${campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-500">Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(campaign.raised / campaign.goal) * 100} 
                      className={`h-2 ${campaign.isCompleted ? 'bg-green-500' : 'bg-blue-100'}`}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-blue-100 pt-4">
                  {campaign.isCompleted ? (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 transition-all"
                      disabled
                    >
                      Campaign Completed
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                      onClick={() => {}}
                    >
                      <Heart className="mr-2 h-4 w-4" /> Donate Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Card className="border-blue-100 bg-blue-50 w-full max-w-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-center text-blue-800">Want to Start Your Own Campaign?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Have an idea for a campaign? You can create your own fundraiser and make a difference.
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Link href="/campaign/learn">
                  <Button className="bg-blue-600 hover:bg-blue-700 transition-all">
                    <Gift className="mr-2 h-4 w-4" /> Learn How to Start
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

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
