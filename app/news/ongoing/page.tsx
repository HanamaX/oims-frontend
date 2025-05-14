"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Heart, Gift, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

// Define types for campaign data
interface Fundraiser {
  publicId: string;
  eventName: string;
  purpose: string;
  imageUrl: string | null;
  goal: number;
  fundraisingReason: string;
  status: string;
}

interface Campaign {
  publicId: string;
  raisedAmount: number;
  campignStatus: string;
  amountRemaining: number;
  contributors: number;
  fundraiser: Fundraiser;
}

export default function OngoingNewsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Replace with your actual API base URL
        const baseUrl = 'https://oims-4510ba404e0e.herokuapp.com';
        const response = await fetch(`${baseUrl}/app/oims/events/campaigns/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        
        const data = await response.json();
        setCampaigns(data.data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  const handleDonateClick = (campaignId: string) => {
    router.push(`/news/ongoing/${campaignId}`);
  };

  // Default image to use when campaign has no image
  const defaultImage = "/image/placeholder.jpg";

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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-blue-600 text-lg">Loading campaigns...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No active campaigns at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {campaigns.map((campaign) => {
                const isCompleted = campaign.campignStatus == "completed";
                const progressPercentage = (campaign.raisedAmount / campaign.fundraiser.goal) * 100;
                
                return (
                  <Card key={campaign.publicId} className="border-blue-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden animate-slide-up">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={campaign.fundraiser.imageUrl || defaultImage}
                        alt={campaign.fundraiser.eventName}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                      {isCompleted && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Completed
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-800">{campaign.fundraiser.eventName}</CardTitle>
                      <CardDescription>{campaign.fundraiser.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">${campaign.raisedAmount.toLocaleString()} raised</span>
                          <span className="text-gray-500">Goal: ${campaign.fundraiser.goal.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-blue-100'}`}
                        />
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">{campaign.contributors} contributors</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-blue-100 pt-4">
                      {isCompleted ? (
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 transition-all"
                          disabled
                        >
                          Campaign Completed
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                          onClick={() => handleDonateClick(campaign.publicId)}
                        >
                          <Heart className="mr-2 h-4 w-4" /> Donate Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

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
