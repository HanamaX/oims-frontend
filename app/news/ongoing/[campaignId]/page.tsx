"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { ChevronRight, Calendar, Users, DollarSign, ClipboardList, Loader2 } from "lucide-react"
import Link from "next/link"
import ContributionForm from "./contribution-form"
import { useLanguage } from "@/contexts/LanguageContext"

// Define types for campaign data
interface Fundraiser {
  publicId: string;
  eventName?: string;
  purpose?: string;
  imageUrl?: string | null;
  // Some APIs might use 'image' instead of 'imageUrl'
  image?: string | null;
  goal?: number;
  fundraisingReason?: string;
  budgetBreakdown?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  phoneNumber?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  amountPayedPerIndividual?: number;
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
  orphanageAmount?: number;
  eventAmount?: number;
  // Some APIs might include image fields at the campaign level instead of in fundraiser
  imageUrl?: string | null;
  image?: string | null;
  eventName?: string; // Campaign name might be at the top level in some APIs
  purpose?: string; // Purpose might be at the top level in some APIs
  fundraiser?: Fundraiser;
  [key: string]: any; // Allow for additional properties
}

export default function CampaignDetailPage({ params }: { readonly params: { campaignId: string } }) {
  // Get campaignId directly from params
  const campaignId = params.campaignId;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const { t, language } = useLanguage();
  
  // Helper function to extract campaigns array from response data
  const extractCampaignsArray = (data: any): any[] => {
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.campaigns && Array.isArray(data.campaigns)) {
        return data.campaigns;
      }
      
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      
      // Try to find any array in the response
      const arrayProps = Object.entries(data)
        .filter(([_, val]) => Array.isArray(val))
        .map(([key, val]) => ({ key, val: val as any[] }));
      
      if (arrayProps.length > 0) {
        return arrayProps[0].val;
      }
    }
    
    return [];
  };
  
  // Helper function to debug image URLs in the API response
  const debugImageUrls = (data: any) => {
    if (!data || typeof data !== 'object') return;
    
    console.log('Looking for image URLs in response...');
    try {
      // Check for direct image properties
      if (data.imageUrl) console.log('Found direct imageUrl:', data.imageUrl);
      if (data.image) console.log('Found direct image:', data.image);
      if (data.data?.imageUrl) console.log('Found data.imageUrl:', data.data.imageUrl);
      if (data.data?.image) console.log('Found data.image:', data.data.image);
      
      // Check for fundraiser image properties
      if (data.fundraiser?.imageUrl) console.log('Found fundraiser.imageUrl:', data.fundraiser.imageUrl);
      if (data.fundraiser?.image) console.log('Found fundraiser.image:', data.fundraiser.image);
      if (data.data?.fundraiser?.imageUrl) console.log('Found data.fundraiser.imageUrl:', data.data.fundraiser.imageUrl);
      if (data.data?.fundraiser?.image) console.log('Found data.fundraiser.image:', data.data.fundraiser.image);
    } catch (e) {
      console.error('Error while debugging image URLs:', e);
    }
  };
  
  // Helper function to try fetching from a specific endpoint
  const tryFetchEndpoint = async (endpoint: string): Promise<Campaign | null> => {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        console.warn(`Endpoint ${endpoint} returned ${response.status}`);
        return null;
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
        console.log('Response data structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
        debugImageUrls(data);
      } catch (parseError) {
        console.error(`Failed to parse response from ${endpoint}:`, parseError);
        return null;
      }
      
      // If this is a direct campaign endpoint
      if (data && data.data && !Array.isArray(data.data)) {
        return data.data as Campaign;
      }
      
      // If this is a listing endpoint
      const campaignsArray = extractCampaignsArray(data);
      const foundCampaign = campaignsArray.find((c: any) => c.publicId === campaignId);
      return foundCampaign ?? null;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      return null;
    }
  };
  
  // Create a test campaign for development use
  const createTestCampaign = (): Campaign => {
    return {
      publicId: campaignId,
      raisedAmount: 7500000,
      campignStatus: 'ACTIVE',
      amountRemaining: 12500000,
      contributors: 35,
      // Include image at the top level as well in case the API returns it here
      imageUrl: 'https://placehold.co/800x400/blue/white?text=Test+Campaign',
      // Include image property as some APIs might use this instead of imageUrl
      image: 'https://placehold.co/800x400/blue/white?text=Test+Campaign',
      fundraiser: {
        publicId: `test-fundraiser-${campaignId}`,
        eventName: 'Test Campaign Details',
        purpose: 'To support children in need',
        // Use a reliable placeholder image service for testing
        imageUrl: 'https://placehold.co/800x400/blue/white?text=Test+Campaign',
        // Include image property as some APIs might use this instead of imageUrl
        image: 'https://placehold.co/800x400/blue/white?text=Test+Campaign',
        goal: 20000000,
        fundraisingReason: 'This is a test fundraising reason',
        budgetBreakdown: 'This is a test budget breakdown',
        coordinatorName: 'Test Coordinator',
        coordinatorEmail: 'test@example.com',
        phoneNumber: '+255123456789',
        eventStartDate: new Date().toISOString(),
        eventEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amountPayedPerIndividual: 50000,
        status: 'ACTIVE'
      }
    };
  };

  // Fetch campaign details from the API
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const baseUrl = 'https://oims-4510ba404e0e.herokuapp.com';
        
        // Try multiple endpoints if needed
        const endpoints = [
          `${baseUrl}/app/oims/events/campaigns/${campaignId}`, // Direct campaign endpoint
          `${baseUrl}/app/oims/events/campaigns/all`,
          `${baseUrl}/app/oims/events/campaigns`,
          `${baseUrl}/app/oims/campaigns/all`,
          `${baseUrl}/app/oims/campaigns`
        ];
        
        let campaignData: Campaign | null = null;
        
        // Try each endpoint until we find the campaign
        for (const endpoint of endpoints) {
          campaignData = await tryFetchEndpoint(endpoint);
          if (campaignData) {
            console.log(`Found campaign in endpoint ${endpoint}`);
            // Log available image URLs for debugging
            console.log('Campaign image URLs:',
              campaignData.imageUrl ?? 'No campaign.imageUrl',
              campaignData.image ?? 'No campaign.image',
              campaignData.fundraiser?.imageUrl ?? 'No fundraiser.imageUrl', 
              campaignData.fundraiser?.image ?? 'No fundraiser.image'
            );
            break;
          }
        }
        
        // If we still don't have campaign data, try a simulated campaign for testing
        if (!campaignData && process.env.NODE_ENV === 'development') {
          console.log('Using simulated campaign data for testing');
          campaignData = createTestCampaign();
        }
        
        if (campaignData) {
          console.log(`Campaign data details:`, {
            id: campaignData.publicId,
            campaignName: campaignData.eventName,
            fundraiserName: campaignData.fundraiser?.eventName,
            campaignPurpose: campaignData.purpose,
            fundraiserPurpose: campaignData.fundraiser?.purpose,
            campaignStatus: campaignData.campignStatus ?? campaignData.campaignStatus,
            goal: campaignData.fundraiser?.goal,
            raised: campaignData.raisedAmount
          });
          
          // Enhance fundraiser data with campaign data if needed
          const currentFundraiser = campaignData.fundraiser ?? {} as Fundraiser;
          
          // Create an enhanced fundraiser object with data from both sources
          const enhancedFundraiser: Fundraiser = {
            ...currentFundraiser,
            publicId: currentFundraiser.publicId ?? `fundraiser-${campaignData.publicId}`,
            eventName: currentFundraiser.eventName ?? campaignData.eventName,
            purpose: currentFundraiser.purpose ?? campaignData.purpose,
            imageUrl: currentFundraiser.imageUrl ?? currentFundraiser.image ?? campaignData.imageUrl ?? campaignData.image,
            goal: currentFundraiser.goal ?? (typeof campaignData.goal === 'number' ? campaignData.goal : undefined)
          };
          
          // Only update if there are actual differences
          if (JSON.stringify(enhancedFundraiser) !== JSON.stringify(currentFundraiser)) {
            console.log('Enhanced fundraiser data with campaign data:', {
              original: {
                eventName: currentFundraiser.eventName,
                purpose: currentFundraiser.purpose
              },
              enhanced: {
                eventName: enhancedFundraiser.eventName,
                purpose: enhancedFundraiser.purpose
              }
            });
            
            // Set the campaign with enhanced fundraiser data
            campaignData = {
              ...campaignData,
              fundraiser: enhancedFundraiser
            };
          }
          
          setCampaign(campaignData);
        } else {
          setError('Campaign not found');
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        setError('An error occurred while fetching the campaign details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [campaignId]);

  // Format date string from YYYY-MM-DD to more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Default image to use when campaign has no image
  // Using a reliable online placeholder as fallback if local image is not available
  const defaultImage = "/image/placeholder.jpg";
  const onlineDefaultImage = "https://placehold.co/800x400/lightgray/gray?text=No+Image+Available";
  
  // Helper function to handle image URLs
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return defaultImage;
    
    // Trim the URL and handle empty strings
    url = url.trim();
    if (url === '') return defaultImage;
    
    // If the URL contains only a file name without path (e.g., "image.jpg")
    if (!url.includes('/') && !url.includes('\\')) {
      // Assume it's in the public/image folder
      return `/image/${url}`;
    }
    
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
  
  // Function to handle image loading errors and provide a fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Prevent infinite loading loop by checking if we're already using the default image
    const currentSrc = e.currentTarget.src;
    if (currentSrc !== defaultImage && currentSrc !== onlineDefaultImage && 
        !currentSrc.endsWith(defaultImage.replace(/^\//, ''))) {
      console.log('Image failed to load:', campaignImageUrl);
      
      // Try the local default image first
      e.currentTarget.src = defaultImage;
      
      // Add a second error handler for the default image
      e.currentTarget.onerror = () => {
        console.log('Default image failed to load, using online fallback');
        e.currentTarget.src = onlineDefaultImage;
        e.currentTarget.onerror = null; // Remove error handler to prevent loops
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-2" />
        <span className="text-blue-600 text-lg">{t("campaign.details.loading")}</span>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-red-50 p-8 rounded-lg">
            <h2 className="text-2xl text-red-600 font-bold mb-4">{error ?? t("campaign.details.notFound")}</h2>
            <p className="mb-6">{t("campaign.details.notFoundDescription")}</p>
            <Link href="/news/ongoing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t("campaigns.returnToList")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Make sure fundraiser object exists, with a fallback to empty object if it's undefined
  const fundraiser = campaign?.fundraiser ?? {} as Fundraiser;
  
  // Get values with fallbacks
  const goal = fundraiser.goal ?? 0;
  const raisedAmount = campaign?.raisedAmount ?? 0;
  const progressPercentage = goal > 0 ? (raisedAmount / goal) * 100 : 0;
  
  // Get image URL with fallbacks, checking multiple possible locations using nullish coalescing
  const campaignImageUrl = fundraiser.imageUrl ?? fundraiser.image ?? campaign?.imageUrl ?? campaign?.image ?? null;
  console.log('Using campaign image URL:', campaignImageUrl);
  
  // Define different campaign statuses - normalize to uppercase for consistency
  const campaignStatus = (campaign?.campignStatus ?? campaign?.campaignStatus ?? '').toUpperCase();
  const isActive = ['APPROVED', 'ACTIVE', 'ONGOING'].includes(campaignStatus);
  const isCompleted = ['COMPLETED', 'FINISHED', 'SUCCEEDED'].includes(campaignStatus);
  const isPending = ['PENDING', 'REVIEW', 'AWAITING'].includes(campaignStatus);
  const isCancelled = ['REJECTED', 'CANCELLED', 'FAILED', 'DENIED'].includes(campaignStatus);
  
  // Set progress bar color based on status
  const getProgressBarColor = () => {
    if (isCompleted) return "bg-blue-500";
    if (isActive) return "bg-blue-500";
    if (isPending) return "bg-amber-500";
    if (isCancelled) return "bg-gray-500";
    return "bg-blue-500"; // default
  };
  
  // Set status display text and color
  const getStatusDisplay = () => {
    if (isCompleted) return { text: t("campaign.status.completed"), color: "text-blue-600 bg-blue-100" };
    if (isActive) return { text: t("campaign.status.active"), color: "text-blue-600 bg-blue-100" };
    if (isPending) return { text: t("campaign.status.pending"), color: "text-amber-600 bg-amber-100" };
    if (isCancelled) return { text: t("campaign.status.cancelled"), color: "text-red-600 bg-red-100" };
    return { text: t("campaign.status.unknown"), color: "text-gray-600 bg-gray-100" };
  };
  
  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link href="/news/ongoing" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          {t("campaigns.returnToList")}
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img
                src={getImageUrl(campaignImageUrl)}
                alt={fundraiser.eventName ?? campaign.eventName ?? t("campaign.saveAChild")}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                {fundraiser.eventName ?? campaign.eventName ?? t("campaign.saveAChild")}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {fundraiser.purpose ?? campaign.purpose ?? ""}
              </p>                <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-semibold text-lg">Tshs {raisedAmount.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.details.raised")}</span>
                  <div className="flex items-center">
                    <span className="text-gray-600 text-lg mr-3">{t("campaign.details.goal")} Tshs {goal.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                  </div>
                </div><ProgressPrimitive.Root
                  className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100"
                  value={progressPercentage}
                >
                  <ProgressPrimitive.Indicator
                    className={`h-full w-full flex-1 ${getProgressBarColor()} transition-all`}
                    style={{ transform: `translateX(-${100 - (progressPercentage || 0)}%)` }}
                  />
                </ProgressPrimitive.Root>                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">{campaign.contributors ?? 0} {t("campaign.details.contributors.count")}</span>
                  <span className="text-gray-600">Tshs {(campaign.amountRemaining ?? 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.details.remaining")}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-3">{t("campaign.details.title")}</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("campaign.details.eventPeriod")}</p>
                        <p className="text-gray-600">
                          {formatDate(fundraiser.eventStartDate ?? campaign?.eventStartDate ?? new Date().toISOString())} - {formatDate(fundraiser.eventEndDate ?? campaign?.eventEndDate ?? new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("campaign.details.coordinator")}</p>
                        <p className="text-gray-600">{fundraiser.coordinatorName ?? campaign?.coordinatorName ?? t("campaign.details.unavailable")}</p>
                      </div>
                    </div>                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("campaign.details.suggestedContribution")}</p>
                        <p className="text-gray-600">Tshs {(fundraiser.amountPayedPerIndividual ?? campaign?.amountPayedPerIndividual ?? 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-3">{t("campaign.details.fundraisingReason")}</h2>
                  <p className="text-gray-700 mb-4">{fundraiser.fundraisingReason ?? campaign?.fundraisingReason ?? t("campaign.details.unavailable")}</p>
                  
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">{t("campaign.details.budgetBreakdown")}</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <ClipboardList className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-gray-700">{fundraiser.budgetBreakdown ?? campaign?.budgetBreakdown ?? t("campaign.details.unavailable")}</p>
                    </div>
                  </div>
                </div>
              </div>
                <div className="border-t border-gray-200 pt-6 mt-6">
                {isActive && !showContributionForm && (                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-4">{t("campaign.contribute.readyPrompt")}</p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8"
                      onClick={() => setShowContributionForm(true)}
                    >
                      {t("campaign.contribute.button")}
                    </Button>
                    <p className="text-sm text-gray-500 mt-3">
                      {t("campaign.contribute.minimum")}: Tshs {(fundraiser.amountPayedPerIndividual ?? campaign?.amountPayedPerIndividual ?? 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}
                    </p>
                  </div>
                )}
                
                {isActive && showContributionForm && (
                  <ContributionForm 
                    campaignId={campaign.publicId} 
                    suggestedAmount={fundraiser.amountPayedPerIndividual ?? campaign.amountPayedPerIndividual ?? 0}
                    onCancel={() => setShowContributionForm(false)}
                  />
                )}
                
                {isPending && (
                  <div className="text-center bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-amber-700 mb-3">{t("campaign.status.pendingTitle")}</h3>
                    <p className="text-gray-700">
                      {t("campaign.status.pendingDescription")}
                    </p>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="text-center bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-700 mb-3">{t("campaign.status.completedTitle")}</h3>
                    <p className="text-gray-700">
                      {t("campaign.status.completedDescription")}
                    </p>
                  </div>
                )}
                
                {isCancelled && (
                  <div className="text-center bg-red-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-700 mb-3">{t("campaign.status.cancelledTitle")}</h3>
                    <p className="text-gray-700">
                      {t("campaign.status.cancelledDescription")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t("campaign.learn.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
