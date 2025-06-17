"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, DollarSign, ClipboardList, ChevronLeft, Mail, Phone, ArrowLeft, Loader2 } from "lucide-react"
import FundraiserService from "@/lib/fundraiser-service"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/contexts/LanguageContext"

interface Contributor {
  publicId: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
}

export default function SharedCampaignDetailsPage({ params }: { readonly params: { campaignId: string } }) {
  // Unwrap the params object using React.use() with proper typing
  const unwrappedParams = React.use(params as any) as { campaignId: string };
  const campaignId = unwrappedParams.campaignId;
  
  const [activeTab, setActiveTab] = useState("details")
  const [campaign, setCampaign] = useState<any>(null)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()
  const { t, language } = useLanguage()

  // Helper function to construct image URLs consistently
  const getImageUrl = useCallback((imageUrl?: string) => {
    if (!imageUrl || imageUrl.trim() === "") return null
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    return `https://oims-4510ba404e0e.herokuapp.com${imageUrl}`
  }, [])

  // Memoized image URL to prevent unnecessary recalculations
  const fundraiserImageUrl = useMemo(() => {
    const fundraiser = campaign?.fundraiser || campaign
    if (!fundraiser?.imageUrl || imageError) return null
    return getImageUrl(fundraiser.imageUrl)
  }, [campaign, imageError, getImageUrl])

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch campaign details
        const campaignData = await FundraiserService.getCampaignById(campaignId)
        setCampaign(campaignData)
        
        // Fetch contributors
        if (campaignData) {
          const contributorsResponse = await FundraiserService.getCampaignContributors(campaignData.publicId)
          
          // Extract and flatten contributors from the nested structure
          const flattenedContributors: Contributor[] = []
            // Handle both array response and object with data property
          const contributorsData = Array.isArray(contributorsResponse) 
            ? contributorsResponse 
            : (contributorsResponse as any)?.data || []
          
          if (Array.isArray(contributorsData)) {
            contributorsData.forEach((contributor: any) => {              // Extract contributor info and map it to our expected structure
              // Remove sensitive information like phone numbers for security
              const mappedContributor: Contributor = {
                publicId: contributor.publicId || '',
                name: contributor.name || 'Anonymous',
                email: contributor.email || 'N/A',
                amount: contributor.paidAmount || 0,
                date: contributor.createdDate || '',
                paymentMethod: contributor.paymentMethod || 'N/A',
                status: 'COMPLETED' // Assume completed if in the contributors list
              }
              
              flattenedContributors.push(mappedContributor)
            })
          }
          
          setContributors(flattenedContributors)
        }
        
        setError(null)
      } catch (err: any) {
        console.error("Error fetching campaign data:", err)
        setError(err.message || "Failed to load campaign information")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [campaignId])
  // Format date
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return t("campaign.contributor.notAvailable")
    
    // Using Intl.DateTimeFormat for proper localization
    const date = new Date(dateString);
    
    // Set locale based on current language
    const locale = language === 'sw' ? 'sw-TZ' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, [language, t])

  // Get the appropriate back URL based on user role
  const getBackUrl = () => {
    if (user?.role === "supervisor" || user?.role === "admin") {
      return "/dashboard/supervisor/fundraisers"
    } else if (user?.role === "orphanage_admin" || user?.role === "super_admin") {
      return "/dashboard/orphanage_admin/fundraisers"
    }
    return "/dashboard"
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("campaign.loading")}</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-xl">⚠️ {error || t("campaign.notFound")}</div>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("campaign.goBack")}
          </Button>
        </div>
      </div>
    )
  }

  // Extract fundraiser data from campaign response
  const fundraiser = campaign.fundraiser || campaign
  const raisedAmount = campaign.raisedAmount || 0
  const progressPercentage = (raisedAmount / (fundraiser.goal || 1)) * 100

  return (
    <div className="space-y-6">      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{fundraiser.eventName}</h1>
          <p className="text-muted-foreground mt-1">{t("campaign.details.and.contributors")}</p>
        </div>
        <Link href={getBackUrl()}>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("campaign.backToFundraisers")}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t("campaign.details")}</TabsTrigger>
          <TabsTrigger value="contributors">{t("campaign.contributors")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-6">              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-[4/3] overflow-hidden rounded-md">
                  {fundraiserImageUrl ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={fundraiserImageUrl}
                        alt={fundraiser.eventName}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                        onError={handleImageError}
                        unoptimized
                        priority
                      />
                    </div>
                  ) : (                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm">{t("campaign.image.placeholder")}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">                  <div>
                    <h2 className="text-xl font-semibold mb-2">{t("campaign.progress")}</h2>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t("fundraiser.currency")} {(campaign.raisedAmount || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.raised")}</span>
                        <span className="text-muted-foreground">{t("campaign.goal")}: {t("fundraiser.currency")} {(fundraiser.goal || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 mt-2" />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium">{campaign.contributors || 0} {t("campaign.contributors.count")}</span>
                      {(campaign.amountRemaining || 0) > 0 && (
                        <span className="ml-4">{t("fundraiser.currency")} {(campaign.amountRemaining || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')} {t("campaign.remaining")}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t("campaign.eventPeriod")}</p>
                        <p className="text-muted-foreground">
                          {formatDate(fundraiser.eventStartDate)} - {formatDate(fundraiser.eventEndDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t("campaign.coordinator")}</p>
                        <p className="text-muted-foreground">{fundraiser.coordinatorName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t("campaign.contactEmail")}</p>
                        <p className="text-muted-foreground">{fundraiser.coordinatorEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t("campaign.contactPhone")}</p>
                        <p className="text-muted-foreground">{fundraiser.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t("campaign.suggestedContribution")}</p>
                        <p className="text-muted-foreground">{t("fundraiser.currency")} {fundraiser.amountPayedPerIndividual?.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("campaign.purpose")}</h3>
                  <p className="text-muted-foreground">{fundraiser.purpose}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">{t("campaign.fundraisingReason")}</h3>
                  <p className="text-muted-foreground">{fundraiser.fundraisingReason}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("campaign.budgetBreakdown")}</h3>
                  <div className="flex items-start bg-slate-50 p-4 rounded-md">
                    <ClipboardList className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{fundraiser.budgetBreakdown}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">{t("campaign.distribution")}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-50 p-4 rounded-md text-center">
                        <p className="font-medium text-sm">{t("campaign.orphanageAmount")}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {t("fundraiser.currency")} {(campaign.orphanageAmount || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}
                        </p>
                      </div>                      <div className="bg-slate-50 p-4 rounded-md text-center">
                        <p className="font-medium text-sm">{t("campaign.eventAmount")}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {t("fundraiser.currency")} {(campaign.eventAmount || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  href={`/news/ongoing/${campaign.publicId}`} 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                >
                  {t("campaign.viewPublicPage")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          <TabsContent value="contributors" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("campaign.campaignContributors")}</h2>
              
              {contributors.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{t("campaign.noContributions")}</p>
                </div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">{t("campaign.contributor.name")}</th>
                        <th className="pb-2 font-medium">{t("campaign.contributor.email")}</th>
                        <th className="pb-2 font-medium">{t("campaign.contributor.amount")}</th>
                        <th className="pb-2 font-medium">{t("campaign.contributor.date")}</th>
                        <th className="pb-2 font-medium">{t("campaign.contributor.paymentMethod")}</th>
                        <th className="pb-2 font-medium">{t("campaign.contributor.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributors.map((contributor) => (
                        <tr key={contributor.publicId} className="border-b hover:bg-slate-50">
                          <td className="py-3">{contributor.name || t("campaign.contributor.anonymous")}</td>
                          <td className="py-3">{contributor.email || t("campaign.contributor.notAvailable")}</td>
                          <td className="py-3">{t("fundraiser.currency")} {(contributor.amount || 0).toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</td>
                          <td className="py-3">{formatDate(contributor.date || "")}</td>
                          <td className="py-3">{contributor.paymentMethod || t("campaign.contributor.notAvailable")}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              contributor.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                              contributor.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {contributor.status === "COMPLETED" ? t("campaign.contributor.status.completed") :
                               contributor.status === "PENDING" ? t("campaign.contributor.status.pending") :
                               t("campaign.contributor.status.unknown")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
