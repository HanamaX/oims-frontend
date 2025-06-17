"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage, T } from "@/contexts/LanguageContext"
import { useOrphanReportData } from "@/hooks/use-orphan-report-data"
import { useInventoryReportData } from "@/hooks/use-inventory-report-data"
import { useAdminReportData } from "@/hooks/use-admin-report-data"
import ReportComponent from "@/components/report-generator-new"
import ReportStats from "@/components/report-stats-new"
import SystemAnalytics from "@/components/system-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileType, Building, AlertCircle, Download, Loader2 } from "lucide-react"
import { ReportType } from "@/lib/report-service"

// Sample data for charts (this would come from your API in a real app)
const sampleData = {
  orphans: {
    demographics: [
      { name: "Male", value: 317 },
      { name: "Female", value: 285 },
    ],
    ageGroups: [
      { name: "0-2 years", value: 108 },
      { name: "3-5 years", value: 147 },
      { name: "6-12 years", value: 210 },
      { name: "13-17 years", value: 137 },
    ],
    statusDistribution: [
      { name: "Active", value: 512 },
      { name: "Adopted", value: 48 },
      { name: "Inactive", value: 42 },
    ],
  },
  inventory: {
    categories: [
      { name: "Food", value: 720 },
      { name: "Clothing", value: 430 },
      { name: "Medicine", value: 315 },
      { name: "School", value: 280 },
      { name: "Other", value: 175 },
    ],
    stockStatus: [
      { name: "In Stock", value: 1350 },
      { name: "Low Stock", value: 420 },
      { name: "Out of Stock", value: 150 },
    ],
    transactions: [
      { date: "Jan", value: 98 },
      { date: "Feb", value: 112 },
      { date: "Mar", value: 134 },
      { date: "Apr", value: 127 },
      { date: "May", value: 145 },
      { date: "Jun", value: 138 },
    ],
  },
  fundraising: {
    amounts: [
      { name: "Education", value: 125000 },
      { name: "Healthcare", value: 97500 },
      { name: "Facilities", value: 86000 },
      { name: "Food", value: 58000 },
      { name: "Activities", value: 42000 },
    ],
    status: [
      { name: "Pending", value: 18 },
      { name: "Approved", value: 32 },
      { name: "Completed", value: 25 },
      { name: "Rejected", value: 7 },
    ],
    timeline: [
      { date: "Jan", value: 35000 },
      { date: "Feb", value: 48500 },
      { date: "Mar", value: 72000 },
      { date: "Apr", value: 64000 },
      { date: "May", value: 95000 },
      { date: "Jun", value: 89000 },
    ],
  },
  volunteers: {
    status: [
      { name: "Active", value: 187 },
      { name: "Inactive", value: 42 },
      { name: "Pending", value: 28 },
    ],
    activities: [
      { name: "Education", value: 85 },
      { name: "Healthcare", value: 37 },
      { name: "Facilities", value: 26 },
      { name: "Events", value: 54 },
      { name: "Administration", value: 27 },
    ],
    hours: [
      { date: "Jan", value: 980 },
      { date: "Feb", value: 1050 },
      { date: "Mar", value: 1230 },
      { date: "Apr", value: 1180 },
      { date: "May", value: 1320 },
      { date: "Jun", value: 1270 },
    ],
  },
  staff: {
    departments: [
      { name: "Management", value: 12 },
      { name: "Education", value: 28 },
      { name: "Healthcare", value: 18 },
      { name: "Facilities", value: 15 },
      { name: "Administration", value: 22 },
    ],
    status: [
      { name: "Active", value: 87 },
      { name: "Inactive", value: 8 },
    ],
    roles: [
      { name: "Admin", value: 25 },
      { name: "Teacher", value: 28 },
      { name: "Caretaker", value: 22 },
      { name: "Doctor/Nurse", value: 12 },
      { name: "Support Staff", value: 8 },
    ],
  },
  branches: {
    distribution: [
      { name: "Branch A", value: 45 },
      { name: "Branch B", value: 38 },
      { name: "Branch C", value: 52 },
      { name: "Branch D", value: 28 },
      { name: "Branch E", value: 35 },
    ],
    orphans: [
      { name: "Branch A", value: 125 },
      { name: "Branch B", value: 98 },
      { name: "Branch C", value: 142 },
      { name: "Branch D", value: 87 },
      { name: "Branch E", value: 150 },
    ],
    resources: [
      { name: "Branch A", value: 75000 },
      { name: "Branch B", value: 62000 },
      { name: "Branch C", value: 88000 },
      { name: "Branch D", value: 48000 },
      { name: "Branch E", value: 82000 },
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
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600">{t("report.loadingData")}</span>
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
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600">{t("report.loadingData")}</span>
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

// Component to display admin/staff stats using real data
function AdminReportStats() {
  const { adminData, loading } = useAdminReportData({})
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600">{t("report.loadingData")}</span>
      </div>
    )
  }
  
  return (
    <ReportStats 
      data={adminData} 
      type="staff"
    />
  )
}

export default function SuperAdminReportsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined)
    if (!user) {
    return <div><T k="common.loading" /></div>
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("report.system")}</h1>
          <p className="text-muted-foreground">
            {t("report.comprehensive")}
          </p>
        </div>        <Badge variant="outline" className="px-3 py-1 text-base bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
          <T k="roles.superAdmin" />
        </Badge>
      </div>

      <div className="grid gap-6">        
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>{t("report.fullAccess")}</AlertTitle>
          <AlertDescription>
            {t("report.fullAccess.description")}
          </AlertDescription>
        </Alert><Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-green-100">            <TabsTrigger 
              value="generator"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
            >
              <FileType className="mr-2 h-4 w-4" />
              {t("report.generator")}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t("report.systemAnalytics")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">
            <ReportComponent 
              userRole="superadmin"
              onBranchChange={setSelectedBranchId}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportType)}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 bg-green-100">                <TabsTrigger 
                  value="orphans"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.orphans")}
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.inventory")}
                </TabsTrigger>
                <TabsTrigger 
                  value="fundraising"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.fundraising")}
                </TabsTrigger>
                <TabsTrigger 
                  value="volunteers"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.volunteers")}
                </TabsTrigger>
                <TabsTrigger 
                  value="staff"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.staff")}
                </TabsTrigger>
                <TabsTrigger 
                  value="branches"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                >
                  {t("report.branches")}
                </TabsTrigger>
              </TabsList>
                <TabsContent value={activeTab}>
                <div className="mb-6">
                  {/* Use SystemAnalytics component for all report types, passing the sample data as fallback */}
                  <SystemAnalytics 
                    reportType={activeTab}
                    branchId={selectedBranchId}
                    sampleData={sampleData[activeTab]}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">                  <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      <CardTitle className="text-base text-green-800">{t("report.systemSummary")}</CardTitle>
                      <CardDescription>{t("report.orgWide")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">                      <div className="flex justify-between">
                        <span className="text-green-700">{t("report.totalBranches")}</span>
                        <span className="font-medium text-green-800">{user.dashboardStats?.totalBranches ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">{t("report.totalOrphans")}</span>
                        <span className="font-medium text-green-800">{user.dashboardStats?.totalOrphans ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">{t("report.totalVolunteers")}</span>
                        <span className="font-medium text-green-800">{user.dashboardStats?.totalVolunteers ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">{t("report.totalFundraisers")}</span>
                        <span className="font-medium text-green-800">{user.dashboardStats?.totalFundraising ?? 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                    <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      <CardTitle className="text-base text-green-800">{t("report.branchComparison")}</CardTitle>
                      <CardDescription>{t("report.performanceMetrics")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-600 group-hover:scale-110 transition-all" />
                            <span className="text-green-700">{t("report.branchPrefix")} A</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 transition-all">{t("report.topPerformer")}</Badge>
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-600 group-hover:scale-110 transition-all" />
                            <span className="text-green-700">{t("report.branchPrefix")} C</span>
                          </div>
                          <Badge variant="outline" className="border-green-300 text-green-700 hover:bg-green-100 transition-all">{t("report.highGrowth")}</Badge>
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-600 group-hover:scale-110 transition-all" />
                            <span className="text-green-700">{t("report.branchPrefix")} E</span>
                          </div>
                          <Badge variant="outline" className="border-green-300 text-green-700 hover:bg-green-100 transition-all">{t("report.mostVolunteers")}</Badge>
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-600 group-hover:scale-110 transition-all" />
                            <span className="text-green-700">{t("report.branchPrefix")} B</span>
                          </div>
                          <Badge variant="outline" className="border-green-300 text-green-700 hover:bg-green-100 transition-all">{t("report.needsAttention")}</Badge>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                    <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      <CardTitle className="text-base text-green-800">{t("report.recentSystemReports")}</CardTitle>
                      <CardDescription>{t("report.previouslyGenerated")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <span className="text-green-700">{t("report.quarterlySystemOverview")}</span>
                          <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <span className="text-green-700">{t("report.branchPerformanceAnalysis")}</span>
                          <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <span className="text-green-700">{t("report.staffEfficiencyReport")}</span>
                          <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                        </li>
                        <li className="flex items-center justify-between text-sm group hover:bg-green-50 p-2 rounded-md transition-all">
                          <span className="text-green-700">{t("report.resourceAllocationSummary")}</span>
                          <Download className="h-4 w-4 text-green-600 cursor-pointer hover:text-green-800 transition-all hover:scale-110" />
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
