"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import ReportComponent from "@/components/report-generator-new"
import ReportStats from "@/components/report-stats-new"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileType, AlertCircle, Download } from "lucide-react"
import { ReportType } from "@/lib/report-service"

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

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate detailed reports and view analytics for your branch
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-base">
          {user.branchName || "Branch"}
        </Badge>
      </div>

      <div className="grid gap-6">        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Report access is restricted</AlertTitle>
          <AlertDescription>
            Branch administrators can only generate reports for data within their assigned branch.
          </AlertDescription>
        </Alert><Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-green-100">
            <TabsTrigger 
              value="generator"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
            >
              <FileType className="mr-2 h-4 w-4" />
              Report Generator
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">
            <ReportComponent 
              userRole="admin" 
              branchId={user.publicId || ""} 
              branchName={user.branchName || ""}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportType)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 bg-green-100">
                <TabsTrigger 
                  value="orphans"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  Orphans
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger 
                  value="fundraising"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  Fundraising
                </TabsTrigger>
                <TabsTrigger 
                  value="volunteers"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  Volunteers
                </TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                <ReportStats 
                  data={
                    activeTab === "orphans" 
                      ? sampleData.orphans 
                      : activeTab === "inventory" 
                        ? sampleData.inventory 
                        : activeTab === "fundraising" 
                          ? sampleData.fundraising 
                          : sampleData.volunteers
                  } 
                  type={activeTab}
                />
              </div>
                <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Summary</CardTitle>
                    <CardDescription>Branch overview at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Orphans</span>
                      <span className="font-medium text-green-800">{user.dashboardStats?.totalOrphans || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Active Volunteers</span>
                      <span className="font-medium text-green-800">{user.dashboardStats?.totalVolunteers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Fundraising Campaigns</span>
                      <span className="font-medium text-green-800">{user.dashboardStats?.totalFundraising || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                  <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">                  <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Recent Reports</CardTitle>
                    <CardDescription>Previously generated reports</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Monthly Orphan Report</span>
                        <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Inventory Status</span>
                        <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Volunteer Hours Q2</span>
                        <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Fundraising Summary</span>
                        <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                      </li>
                    </ul>
                  </CardContent>
                </Card>              </div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
