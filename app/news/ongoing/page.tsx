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
  eventName?: string;
  purpose?: string;
  imageUrl?: string | null;
  goal?: number;
  fundraisingReason?: string;
  status?: string;
  [key: string]: any; // Allow for additional properties
}

interface Campaign {
  publicId: string;
  raisedAmount?: number;
  campignStatus?: string; // Note: this might be a typo in the API (campaign vs campign)
  campaignStatus?: string; // Alternative spelling that might be used
  amountRemaining?: number;
  contributors?: number;
  fundraiser?: Fundraiser;
  // These fields might be at the top level instead of nested in fundraiser
  eventName?: string;
  purpose?: string;
  imageUrl?: string | null;
  goal?: number;
  [key: string]: any; // Allow for additional properties
}

export default function OngoingNewsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Helper function to extract campaigns from response data
  const extractCampaignsFromResponse = (data: any): Campaign[] => {
    if (Array.isArray(data)) {
      // Direct array of campaigns
      console.log('API returned direct array of campaigns');
      return data;
    } 
    
    if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        // Standard {data: [...]} structure
        console.log('API returned {data: [...]} structure');
        return data.data;
      }
      
      if (data.campaigns && Array.isArray(data.campaigns)) {
        // Alternative {campaigns: [...]} structure
        console.log('API returned {campaigns: [...]} structure');
        return data.campaigns;
      }
      
      if (data.results && Array.isArray(data.results)) {
        // Alternative {results: [...]} structure
        console.log('API returned {results: [...]} structure');
        return data.results;
      }
      
      // Try to find any array in the response
      const possibleArrays = Object.entries(data)
        .filter(([_, value]) => Array.isArray(value))
        .map(([key, value]) => ({ key, value: value as any[] }));
      
      if (possibleArrays.length > 0) {
        console.log(`Found possible campaign arrays:`, 
          possibleArrays.map(({ key }) => key));
        
        // Use the first array found
        console.log(`Using array from "${possibleArrays[0].key}" property`);
        return possibleArrays[0].value as Campaign[];
      }
    }
    
    console.warn('Could not find campaign data in API response');
    return [];
  };

  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Replace with your actual API base URL
        const baseUrl = 'https://oims-4510ba404e0e.herokuapp.com';
        
        // Try multiple endpoints if needed
        const endpoints = [
          `${baseUrl}/app/oims/events/campaigns/all`,
          `${baseUrl}/app/oims/events/campaigns`,
          `${baseUrl}/app/oims/campaigns/all`,
          `${baseUrl}/app/oims/campaigns`
        ];
        
        let responseData = null;
        let campaignsData: Campaign[] = [];
        
        // Try each endpoint until we get valid data
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await fetch(endpoint);
            
            if (!response.ok) {
              console.warn(`Endpoint ${endpoint} returned ${response.status} ${response.statusText}`);
              continue;
            }
            
            // Get the raw response text
            const responseText = await response.text();
            console.log(`Raw response from ${endpoint}:`, responseText.substring(0, 200) + '...');
            
            // Parse the response text to JSON
            try {
              responseData = JSON.parse(responseText);
              console.log(`Parsed data from ${endpoint}:`, responseData);
              
              // Extract campaigns from the response
              const extractedCampaigns = extractCampaignsFromResponse(responseData);
              
              if (extractedCampaigns.length > 0) {
                console.log(`Found ${extractedCampaigns.length} campaigns in endpoint ${endpoint}`);
                campaignsData = extractedCampaigns;
                break; // Exit the loop if we found campaigns
              }
            } catch (parseError) {
              console.error(`Failed to parse response from ${endpoint} as JSON:`, parseError);
            }
          } catch (error) {
            console.error(`Error fetching from ${endpoint}:`, error);
          }
        }
        
        // If we couldn't get data from any endpoint, try a simulated response for testing
        if (campaignsData.length === 0) {
          console.log('No campaigns found from API endpoints, using simulated data for testing');
          campaignsData = [
            {
              publicId: 'test-campaign-1',
              raisedAmount: 5000000,
              campignStatus: 'active',
              amountRemaining: 15000000,
              contributors: 25,
              fundraiser: {
                publicId: 'test-fundraiser-1',
                eventName: 'Test Fundraiser 1',
                purpose: 'Education Support',
                // Use a reliable placeholder image service for testing
                imageUrl: 'https://placehold.co/800x400/blue/white?text=Test+Fundraiser+1',
                goal: 20000000,
                fundraisingReason: 'To support education',
                status: 'active'
              }
            },
            {
              publicId: 'test-campaign-2',
              raisedAmount: 10000000,
              campignStatus: 'completed',
              amountRemaining: 0,
              contributors: 50,
              fundraiser: {
                publicId: 'test-fundraiser-2',
                eventName: 'Test Fundraiser 2',
                purpose: 'Medical Support',
                // Use a reliable placeholder image service for testing
                imageUrl: 'https://placehold.co/800x400/green/white?text=Test+Fundraiser+2',
                goal: 10000000,
                fundraisingReason: 'To provide medical assistance',
                status: 'completed'
              }
            }
          ];
        }
        
        // Log the campaigns data for debugging
        console.log(`Using ${campaignsData.length} campaigns:`, campaignsData);
        setCampaigns(campaignsData);
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
  
  // Helper function to handle image URLs
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return defaultImage;
    
    // Trim the URL and handle empty strings
    url = url.trim();
    if (url === '') return defaultImage;
    
    // If the URL is already a full URL (starts with http:// or https://), use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If the URL is a relative path, ensure it starts with a slash
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
    
    // Otherwise, it's a relative path starting with a slash
    return url;
  };

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
          ) : (
            <>
              {campaigns.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600">No active campaigns at the moment. Please check back later.</p>
                  <div className="mt-4 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-60 text-xs">
                    <h4 className="font-bold mb-2">Debug Info:</h4>
                    <p>Loading state: {loading ? 'Still loading' : 'Finished loading'}</p>
                    <p>Campaigns array length: {campaigns.length}</p>
                    <details>
                      <summary className="cursor-pointer font-medium text-blue-600">View data structure</summary>
                      <pre>{JSON.stringify({campaigns}, null, 2)}</pre>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {campaigns.map((campaign) => {
                    // Extract information, supporting both nested and direct structures
                    const fundraiser = campaign.fundraiser ?? {} as Partial<Fundraiser>;
                    
                    // Get values with fallbacks, supporting both nested and direct property access
                    const eventName = fundraiser.eventName ?? campaign.eventName ?? "Untitled Campaign";
                    const purpose = fundraiser.purpose ?? campaign.purpose ?? "Support our cause";
                    const imageUrl = fundraiser.imageUrl ?? campaign.imageUrl ?? null;
                    const goal = fundraiser.goal ?? campaign.goal ?? 0;
                    const raisedAmount = campaign.raisedAmount ?? 0;
                    const contributors = campaign.contributors ?? 0;
                    
                    // Support both spelling variants of campaign status
                    const campaignStatus = campaign.campignStatus ?? campaign.campaignStatus ?? "";
                    const isCompleted = campaignStatus.toLowerCase() === "completed";
                    
                    // Calculate progress percentage safely
                    const progressPercentage = goal > 0 ? (raisedAmount / goal) * 100 : 0;
                    
                    return (
                      <Card key={campaign.publicId} className="border-blue-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden animate-slide-up">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={getImageUrl(imageUrl)}
                            alt={eventName}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                            onError={(e) => {
                              // Prevent infinite loading loop by checking if we're already using the default image
                              const currentSrc = e.currentTarget.src;
                              if (currentSrc !== defaultImage && !currentSrc.endsWith(defaultImage.replace(/^\//, ''))) {
                                console.log('Image failed to load:', imageUrl);
                                e.currentTarget.src = defaultImage;
                              }
                            }}
                          />
                          {isCompleted && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Completed
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-blue-800">{eventName}</CardTitle>
                          <CardDescription>{purpose}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">Tshs {raisedAmount.toLocaleString()} raised</span>
                              <span className="text-gray-500">Goal: Tshs {goal.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={progressPercentage} 
                              className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-blue-100'}`}
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">{contributors} contributors</span>
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
            </>
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
  );
}
