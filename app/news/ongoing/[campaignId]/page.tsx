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

export default function CampaignDetailPage({ params }: { readonly params: { campaignId: string } }) {
  // Get campaignId directly from params
  const campaignId = params.campaignId;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const { t, language } = useLanguage();
  
  // Fetch campaign details from the API
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {        
        const baseUrl = 'https://oims-4510ba404e0e.herokuapp.com';
        const response = await fetch(`${baseUrl}/app/oims/events/campaigns/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaign details');
        }
        
        const data = await response.json();
        const campaignData = data.data.find((c: Campaign) => c.publicId === campaignId);
        
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
  }, [campaignId]);

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
  const progressPercentage = (campaign.raisedAmount / campaign.fundraiser.goal) * 100;
  
  // Define different campaign statuses
  const campaignStatus =  campaign.campignStatus;
  const isActive = campaignStatus === "APPROVED" || campaignStatus === "ACTIVE";
  const isCompleted = campaignStatus === "COMPLETED";
  const isPending = campaignStatus === "PENDING";
  const isCancelled = campaignStatus === "REJECTED" || campaignStatus === "CANCELLED";
  
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
                src={campaign.fundraiser.imageUrl ?? defaultImage}
                alt={campaign.fundraiser.eventName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">{campaign.fundraiser.eventName || t("campaign.saveAChild")}</h1>
              <p className="text-lg text-gray-600 mb-6">{campaign.fundraiser.purpose}</p>                <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-semibold text-lg">Tshs {campaign.raisedAmount.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.details.raised")}</span>
                  <div className="flex items-center">
                    <span className="text-gray-600 text-lg mr-3">{t("campaign.details.goal")} Tshs {campaign.fundraiser.goal.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</span>
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
                  <span className="text-gray-600">{campaign.contributors} {t("campaign.details.contributors.count")}</span>
                  <span className="text-gray-600">Tshs {campaign.amountRemaining.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.details.remaining")}</span>
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
                          {formatDate(campaign.fundraiser.eventStartDate)} - {formatDate(campaign.fundraiser.eventEndDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("campaign.details.coordinator")}</p>
                        <p className="text-gray-600">{campaign.fundraiser.coordinatorName}</p>
                      </div>
                    </div>                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{t("campaign.details.suggestedContribution")}</p>
                        <p className="text-gray-600">Tshs {campaign.fundraiser.amountPayedPerIndividual.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-3">{t("campaign.details.fundraisingReason")}</h2>
                  <p className="text-gray-700 mb-4">{campaign.fundraiser.fundraisingReason}</p>
                  
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">{t("campaign.details.budgetBreakdown")}</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <ClipboardList className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-gray-700">{campaign.fundraiser.budgetBreakdown}</p>
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
                      {t("campaign.contribute.minimum")}: Tshs {campaign.fundraiser.amountPayedPerIndividual.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}
                    </p>
                  </div>
                )}
                
                {isActive && showContributionForm && (
                  <ContributionForm 
                    campaignId={campaign.publicId} 
                    suggestedAmount={campaign.fundraiser.amountPayedPerIndividual}
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
