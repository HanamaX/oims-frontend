"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, DollarSign, ClipboardList, ChevronLeft, Mail, Phone, ArrowLeft, Loader2 } from "lucide-react"
import FundraiserService from "@/lib/fundraiser-service"
import Link from "next/link"
import React from "react"

interface Contributor {
  publicId: string;
  name: string;
  email: string;
  phoneNumber: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
}

export default function CampaignDetailsPage({ params }: { readonly params: { campaignId: string } }) {
  // Unwrap the params object using React.use() with proper typing
  const unwrappedParams = React.use(params as any) as { campaignId: string };
  const campaignId = unwrappedParams.campaignId;
  
  const [activeTab, setActiveTab] = useState("details")
  const [campaign, setCampaign] = useState<any>(null)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch campaign details
        const campaignData = await FundraiserService.getCampaignById(campaignId)
        setCampaign(campaignData)
        
        // Fetch contributors
        if (campaignData) {
          const contributorsData = await FundraiserService.getCampaignContributors(campaignData.publicId)
          setContributors(contributorsData)
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
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-xl">⚠️ {error || "Campaign not found"}</div>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{fundraiser.eventName}</h1>
          <p className="text-muted-foreground mt-1">Campaign Details and Contributors</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Fundraisers
        </Button>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Campaign Details</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-[4/3] overflow-hidden rounded-md">
                  <img
                    src={fundraiser.imageUrl 
                      ? fundraiser.imageUrl.startsWith('http') 
                        ? fundraiser.imageUrl 
                        : `https://oims-4510ba404e0e.herokuapp.com${fundraiser.imageUrl}`
                      : "/placeholder.svg?height=300&width=400&text=Fundraiser+Image"}
                    alt={fundraiser.eventName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Handle image load error by falling back to placeholder
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Fundraiser+Image"
                    }}
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Campaign Progress</h2>                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${(campaign.raisedAmount || 0).toLocaleString()} raised</span>
                        <span className="text-muted-foreground">Goal: ${(fundraiser.goal || 0).toLocaleString()}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 mt-2" />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium">{campaign.contributors || 0} contributors</span>
                      {(campaign.amountRemaining || 0) > 0 && (
                        <span className="ml-4">${(campaign.amountRemaining || 0).toLocaleString()} remaining</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Event Period</p>
                        <p className="text-muted-foreground">
                          {formatDate(fundraiser.eventStartDate)} - {formatDate(fundraiser.eventEndDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Coordinator</p>
                        <p className="text-muted-foreground">{fundraiser.coordinatorName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Contact Email</p>
                        <p className="text-muted-foreground">{fundraiser.coordinatorEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Contact Phone</p>
                        <p className="text-muted-foreground">{fundraiser.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Suggested Contribution</p>
                        <p className="text-muted-foreground">${fundraiser.amountPayedPerIndividual?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Purpose</h3>
                  <p className="text-muted-foreground">{fundraiser.purpose}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Fundraising Reason</h3>
                  <p className="text-muted-foreground">{fundraiser.fundraisingReason}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Budget Breakdown</h3>
                  <div className="flex items-start bg-slate-50 p-4 rounded-md">
                    <ClipboardList className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{fundraiser.budgetBreakdown}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Distribution</h3>                      <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-50 p-4 rounded-md text-center">
                        <p className="font-medium text-sm">Orphanage Amount</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          ${(campaign.orphanageAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-md text-center">
                        <p className="font-medium text-sm">Event Amount</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          ${(campaign.eventAmount || 0).toLocaleString()}
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
                  View Public Campaign Page
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contributors" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Contributors</h2>
              
              {contributors.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No contributions have been made to this campaign yet.</p>
                </div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Phone</th>
                        <th className="pb-2 font-medium">Amount</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Payment Method</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributors.map((contributor) => (
                        <tr key={contributor.publicId} className="border-b hover:bg-slate-50">                          <td className="py-3">{contributor.name || "Anonymous"}</td>
                          <td className="py-3">{contributor.email || "N/A"}</td>
                          <td className="py-3">{contributor.phoneNumber || "N/A"}</td>
                          <td className="py-3">${(contributor.amount || 0).toLocaleString()}</td>
                          <td className="py-3">{formatDate(contributor.date || "")}</td>
                          <td className="py-3">{contributor.paymentMethod || "N/A"}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              contributor.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                              contributor.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {contributor.status || "UNKNOWN"}</span>
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
