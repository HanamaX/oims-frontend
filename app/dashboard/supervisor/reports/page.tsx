"use client"

import { useAuth } from "@/components/auth-provider"
import ReportComponent from "@/components/report-generator-new"
import ReportStats from "@/components/report-stats-new"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { T, useLanguage } from "@/contexts/LanguageContext"
import { useFundraiserReportData } from "@/hooks/use-fundraiser-report-data"
import { useInventoryReportData } from "@/hooks/use-inventory-report-data"
import { useOrphanReportData } from "@/hooks/use-orphan-report-data"
import { useVolunteerReportData } from "@/hooks/use-volunteer-report-data"
import { ReportType } from "@/lib/report-service"
import { AlertCircle, BarChart3, Download, FileType, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

// Sample data for charts (this would come from your API in a real app)
const sampleData = {
  orphans: {
    demographics: [
      { name: "Male", value: 123 },
      { name: "Female", value: 104 },
    ],
    ageGroups: [
      { name: "0-2 years", value: 42 },
      { name: "3-5 years", value: 58 },
      { name: "6-12 years", value: 87 },
      { name: "13-17 years", value: 40 },
    ],
    statusDistribution: [
      { name: "Active", value: 188 },
      { name: "Adopted", value: 23 },
      { name: "Inactive", value: 16 },
    ],
  },
  inventory: {
    categories: [
      { name: "Food", value: 280 },
      { name: "Clothing", value: 150 },
      { name: "Medicine", value: 95 },
      { name: "School", value: 120 },
      { name: "Other", value: 75 },
    ],
    stockStatus: [
      { name: "In Stock", value: 550 },
      { name: "Low Stock", value: 120 },
      { name: "Out of Stock", value: 50 },
    ],
    transactions: [
      { date: "Jan", value: 42 },
      { date: "Feb", value: 38 },
      { date: "Mar", value: 55 },
      { date: "Apr", value: 47 },
      { date: "May", value: 63 },
      { date: "Jun", value: 52 },
    ],
  },
  fundraising: {
    amounts: [
      { name: "Education", value: 45000 },
      { name: "Healthcare", value: 32500 },
      { name: "Facilities", value: 28000 },
      { name: "Food", value: 22000 },
      { name: "Activities", value: 15000 },
    ],
    status: [
      { name: "Pending", value: 7 },
      { name: "Approved", value: 12 },
      { name: "Completed", value: 8 },
      { name: "Rejected", value: 3 },
    ],
    timeline: [
      { date: "Jan", value: 12000 },
      { date: "Feb", value: 18500 },
      { date: "Mar", value: 25000 },
      { date: "Apr", value: 22000 },
      { date: "May", value: 35000 },
      { date: "Jun", value: 30000 },
    ],
  },
  volunteers: {
    status: [
      { name: "Active", value: 45 },
      { name: "Inactive", value: 12 },
      { name: "Pending", value: 8 },
    ],
    activities: [
      { name: "Education", value: 25 },
      { name: "Healthcare", value: 12 },
      { name: "Facilities", value: 8 },
      { name: "Events", value: 15 },
      { name: "Administration", value: 5 },
    ],
    hours: [
      { date: "Jan", value: 320 },
      { date: "Feb", value: 285 },
      { date: "Mar", value: 375 },
      { date: "Apr", value: 410 },
      { date: "May", value: 390 },
      { date: "Jun", value: 425 },
    ],
  },
}

// Component to display orphan stats using real data
function OrphanReportStats() {
  const { orphanData, loading } = useOrphanReportData({})
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600"><T k="report.loadingData" /></span>
      </div>
    )
  }
  
  return (
    <ReportStats 
      data={orphanData} 
      type="orphans"
    />
  )
}

// Component to display inventory stats using real data
function InventoryReportStats() {
  const { inventoryData, loading } = useInventoryReportData({})
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600"><T k="report.loadingData" /></span>
      </div>
    )
  }
  
  return (
    <ReportStats 
      data={inventoryData} 
      type="inventory"
    />
  )
}

// Component to display fundraiser stats using real data
function FundraiserReportStats() {
  const { fundraiserData, loading } = useFundraiserReportData({})
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600"><T k="report.loadingData" /></span>
      </div>
    )
  }
  
  return (
    <ReportStats 
      data={fundraiserData} 
      type="fundraising"
    />
  )
}

// Component to display volunteer stats using real data
function VolunteerReportStats() {
  const { chartData, loading, error } = useVolunteerReportData({})
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600"><T k="report.loadingData" /></span>
      </div>
    )
  }
  
  if (error || !chartData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <h3 className="text-lg font-medium"><T k="report.errorLoading" /></h3>
        <p className="text-sm text-muted-foreground">{error ?? <T k="report.noDataAvailable" />}</p>
      </div>
    )  }
  
  return (
    <ReportStats 
      data={chartData} 
      type="volunteers"
    />
  )
}

export default function SupervisorReportsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  
  if (!user) {
    return <div><T k="common.loading" /></div>
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>          <h1 className="text-3xl font-bold"><T k="supervisor.reports.title" /></h1>
          <p className="text-muted-foreground">
            <T k="supervisor.reports.description" />
          </p>
        </div>        <Badge variant="outline" className="px-3 py-1 text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
          {user.branchName ?? <T k="branch.label" />}
        </Badge>
      </div>

      <div className="grid gap-6">          
        <Alert className="bg-blue-50 border-blue-200">          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle><T k="report.restricted" /></AlertTitle>
          <AlertDescription>
            <T k="report.restriction.description" />
          </AlertDescription>
        </Alert>        <Tabs defaultValue="generator" className="space-y-6">          
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">            
            <TabsTrigger 
              value="generator"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
            >
              <div className="flex items-center space-x-2">
                <FileType className="mr-2 h-4 w-4" />                <span><T k="report.generator" /></span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <T k="report.analytics" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">            <ReportComponent 
              userRole="supervisor" 
              branchId={user.publicId ?? ""} 
              branchName={user.branchName ?? ""}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportType)}>              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 bg-blue-100">                  <TabsTrigger 
                  value="orphans"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.orphans" />
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.inventory" />
                </TabsTrigger>
                <TabsTrigger 
                  value="fundraising"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.fundraising" />
                </TabsTrigger>
                <TabsTrigger 
                  value="volunteers"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.volunteers" />
                </TabsTrigger>
              </TabsList>
                <div className="mb-6">
                {activeTab === "orphans" && (
                  <OrphanReportStats />
                )}
                {activeTab === "inventory" && (
                  <InventoryReportStats />
                )}
                {activeTab === "fundraising" && (
                  <FundraiserReportStats />
                )}
                {activeTab === "volunteers" && (
                  <VolunteerReportStats />
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">                  
                <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">                    <CardTitle className="text-base text-blue-800"><T k="report.summary" /></CardTitle>
                    <CardDescription><T k="report.branchOverview" /></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">                    <div className="flex justify-between">                      <span className="text-blue-700"><T k="report.totalOrphans" /></span>
                      <span className="font-medium text-blue-800">{user.dashboardStats?.totalOrphans ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700"><T k="report.activeVolunteers" /></span>
                      <span className="font-medium text-blue-800">{user.dashboardStats?.totalVolunteers ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700"><T k="report.fundraisingCampaigns" /></span>
                      <span className="font-medium text-blue-800">{user.dashboardStats?.totalFundraising ?? 0}</span>
                    </div>
                  </CardContent>
                </Card>                  
                  <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">                  
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">                    <CardTitle className="text-base text-blue-800"><T k="report.recentReports" /></CardTitle>
                    <CardDescription><T k="report.previouslyGenerated" /></CardDescription>
                  </CardHeader>                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">                        <span className="text-blue-700"><T k="report.monthlyOrphan" /></span>
                        <Download className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                        <span className="text-blue-700"><T k="report.inventoryStatus" /></span>
                        <Download className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                        <span className="text-blue-700"><T k="report.volunteerHours" /></span>
                        <Download className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                        <span className="text-blue-700"><T k="report.fundraisingSummary" /></span>
                        <Download className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110" />
                      </li>
                    </ul>
                  </CardContent>                </Card>              
              </div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

