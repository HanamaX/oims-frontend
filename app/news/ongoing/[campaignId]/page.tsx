"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Calendar, Users, DollarSign, ClipboardList, Loader2 } from "lucide-react"
import Link from "next/link"
import ContributionForm from "./contribution-form"

// Define types for campaign data
interface Fundraiser {
  publicId: string;
  eventName: string;
  purpose: string;
  imageUrl: string | null;
  goal: number;
  fundraisingReason: string;
  budgetBreakdown: string;
  coordinatorName: string;
  coordinatorEmail: string;
  phoneNumber: string;
  eventStartDate: string;
  eventEndDate: string;
  amountPayedPerIndividual: number;
  status: string;
}

interface Campaign {
  publicId: string;
  raisedAmount: number;
  campignStatus: string;
  amountRemaining: number;
  contributors: number;
  orphanageAmount: number;
  eventAmount: number;
  fundraiser: Fundraiser;
}

export default function CampaignDetailPage({ params }: { params: { campaignId: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContributionForm, setShowContributionForm] = useState(false);
  
  // Fetch campaign details from the API
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/app/oims/events/campaigns/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaign details');
        }
        
        const data = await response.json();
        const campaignData = data.data.find((c: Campaign) => c.publicId === params.campaignId);
        
        if (!campaignData) {
          setError('Campaign not found');
        } else {
          setCampaign(campaignData);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        setError('An error occurred while fetching the campaign details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [params.campaignId]);

  // Format date string from YYYY-MM-DD to more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Default image to use when campaign has no image
  const defaultImage = "/image/placeholder.jpg";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-2" />
        <span className="text-blue-600 text-lg">Loading campaign details...</span>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-red-50 p-8 rounded-lg">
            <h2 className="text-2xl text-red-600 font-bold mb-4">{error || 'Campaign not found'}</h2>
            <p className="mb-6">The campaign you're looking for does not exist or may have been removed.</p>
            <Link href="/news/ongoing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Return to Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.raisedAmount / campaign.fundraiser.goal) * 100;
  const isCompleted = campaign.campignStatus !== "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link href="/news/ongoing" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Campaigns
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img
                src={campaign.fundraiser.imageUrl || defaultImage}
                alt={campaign.fundraiser.eventName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">{campaign.fundraiser.eventName}</h1>
              <p className="text-lg text-gray-600 mb-6">{campaign.fundraiser.purpose}</p>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-lg">${campaign.raisedAmount.toLocaleString()} raised</span>
                  <span className="text-gray-600 text-lg">Goal: ${campaign.fundraiser.goal.toLocaleString()}</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={`h-3 ${isCompleted ? 'bg-green-500' : 'bg-blue-100'}`}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">{campaign.contributors} contributors</span>
                  <span className="text-gray-600">${campaign.amountRemaining.toLocaleString()} remaining</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-3">Campaign Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Event Period</p>
                        <p className="text-gray-600">
                          {formatDate(campaign.fundraiser.eventStartDate)} - {formatDate(campaign.fundraiser.eventEndDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Coordinator</p>
                        <p className="text-gray-600">{campaign.fundraiser.coordinatorName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Suggested Contribution</p>
                        <p className="text-gray-600">${campaign.fundraiser.amountPayedPerIndividual.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-3">Fundraising Reason</h2>
                  <p className="text-gray-700 mb-4">{campaign.fundraiser.fundraisingReason}</p>
                  
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Budget Breakdown</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <ClipboardList className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-gray-700">{campaign.fundraiser.budgetBreakdown}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isCompleted && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  {!showContributionForm ? (
                    <div className="text-center">
                      <p className="text-lg text-gray-700 mb-4">Ready to make a difference?</p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8"
                        onClick={() => setShowContributionForm(true)}
                      >
                        Contribute to this Campaign
                      </Button>
                    </div>
                  ) : (
                    <ContributionForm 
                      campaignId={campaign.publicId} 
                      suggestedAmount={campaign.fundraiser.amountPayedPerIndividual}
                      onCancel={() => setShowContributionForm(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
