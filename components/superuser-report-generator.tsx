"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage, T } from "@/contexts/LanguageContext"
import { useToast } from "@/hooks/use-toast"
import ReportService, { ReportFilters, ReportType } from "@/lib/report-service"
import { format } from "date-fns"
import { AlertCircle, FileText, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

interface SuperuserReportGeneratorProps {
  stats?: any
}

export default function SuperuserReportGenerator({ stats }: Readonly<SuperuserReportGeneratorProps>) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  const [availableBranches, setAvailableBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  
  const [filters, setFilters] = useState<{
    category: string
    status: string
    exportFormat: 'pdf' | 'excel'
  }>({
    category: "all",
    status: "all",
    exportFormat: "pdf"
  })

  // Load branches
  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const branches = await ReportService.getBranches()
      
      // Check if branches is an array, if not, initialize an empty array
      if (Array.isArray(branches)) {
        setAvailableBranches(branches)
      } else if (branches?.data && Array.isArray(branches.data)) {
        // Handle the case when the API returns { data: [] }
        setAvailableBranches(branches.data)
      } else {
        console.warn("Branches data is not in expected format", branches)
        setAvailableBranches([])
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Failed to load branches", error)
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again.",
        variant: "destructive"
      })
      // Initialize with empty array on error
      setAvailableBranches([])
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      if (!dateRange.from || !dateRange.to) {
        toast({
          title: "Error",
          description: "Please select a valid date range",
          variant: "destructive"
        })
        return
      }

      setLoading(true)
      setGenerating(true)
      
      // Show initial toast
      toast({
        title: "Generating Report",
        description: "Please wait while your report is being generated...",
      })
      
      // Prepare filters
      const reportFilters: ReportFilters = {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
        category: filters.category !== "all" ? filters.category : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        exportFormat: filters.exportFormat,
      }
      
      // Add branch filter if selected
      if (selectedBranch && selectedBranch !== "all") {
        reportFilters.branchId = selectedBranch
      }
      
      // Generate the appropriate report
      let result;
      
      if (selectedBranch && selectedBranch !== "all") {
        result = await ReportService.generateBranchReport(activeTab, reportFilters)
      } else {
        result = await ReportService.generateSystemReport(activeTab, reportFilters)
      }
      
      // Success toast with appropriate styling
      if (result?.success) {
        toast({
          title: "Report Generated Successfully ✅",
          description: `Your ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report has been downloaded in ${filters.exportFormat.toUpperCase()} format.`,
          variant: "default"
        })
      } else {
        throw new Error("Report generation failed")
      }
    } catch (error) {
      console.error("Failed to generate report", error)
      toast({
        title: "Error Generating Report",
        description: "Failed to generate report. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setTimeout(() => setGenerating(false), 500) // Add slight delay for animation effect
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range)
    }
  }

  // Get applicable filters based on the active tab
  const getTabFilters = () => {
    switch (activeTab) {
      case "orphans":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">{t("report.ageGroup")}</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={t("report.ageGroup")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allAgeGroups")}</SelectItem>
                  <SelectItem value="infant">{t("report.infant")}</SelectItem>
                  <SelectItem value="toddler">{t("report.toddler")}</SelectItem>
                  <SelectItem value="child">{t("report.child")}</SelectItem>
                  <SelectItem value="teenager">{t("report.teenager")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("report.active")}</SelectItem>
                  <SelectItem value="inactive">{t("report.inactive")}</SelectItem>
                  <SelectItem value="adopted">{t("report.adopted")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "inventory":
        return (
          <>            <div className="flex flex-col space-y-2">
              <Label htmlFor="category"><T k="report.category" /></Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.category" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allCategories" /></SelectItem>
                  <SelectItem value="food"><T k="report.food" /></SelectItem>
                  <SelectItem value="clothing"><T k="report.clothing" /></SelectItem>
                  <SelectItem value="medicine"><T k="report.medicine" /></SelectItem>
                  <SelectItem value="school"><T k="report.schoolSupplies" /></SelectItem>
                  <SelectItem value="furniture"><T k="report.furniture" /></SelectItem>
                  <SelectItem value="other"><T k="report.other" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.stockStatus" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.stockStatus" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStockStatuses" /></SelectItem>
                  <SelectItem value="in_stock"><T k="report.inStock" /></SelectItem>
                  <SelectItem value="low_stock"><T k="report.lowStock" /></SelectItem>
                  <SelectItem value="out_of_stock"><T k="report.outOfStock" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "fundraising":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">{t("report.campaign")}</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={t("report.campaign")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allCampaigns")}</SelectItem>
                  <SelectItem value="education">{t("report.education")}</SelectItem>
                  <SelectItem value="healthcare">{t("report.healthcare")}</SelectItem>
                  <SelectItem value="facilities">{t("report.facilities")}</SelectItem>
                  <SelectItem value="events">{t("report.events")}</SelectItem>
                  <SelectItem value="other">{t("report.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.campaignStatus")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={t("report.campaignStatus")} />
                </SelectTrigger>                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="pending"><T k="report.pending" /></SelectItem>
                  <SelectItem value="approved"><T k="report.approved" /></SelectItem>
                  <SelectItem value="completed"><T k="report.completed" /></SelectItem>
                  <SelectItem value="rejected"><T k="report.rejected" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "volunteers":
      case "staff":
      case "branches":
        return (
          <div className="flex flex-col space-y-2">
            <Label htmlFor="status">{t("report.status")}</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder={t("report.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                <SelectItem value="active">{t("report.active")}</SelectItem>
                <SelectItem value="inactive">{t("report.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  }

  return (    <div className="space-y-6">
      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800"><T k="report.generator" /></CardTitle>
              <CardDescription className="text-blue-600"><T k="report.createSystemReports" /></CardDescription>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
              Superuser
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={(value) => setActiveTab(value as ReportType)} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 bg-blue-100">                <TabsTrigger 
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
                <TabsTrigger 
                  value="staff"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.staff" />
                </TabsTrigger>
                <TabsTrigger 
                  value="branches"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
                >
                  <T k="report.branches" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">                <div className="space-y-2">
                  <Label htmlFor="dateRange"><T k="report.dateRange" /></Label>
                  <DateRangePicker
                    date={{ from: dateRange.from, to: dateRange.to }}
                    onDateChange={handleDateRangeChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch"><T k="report.selectBranch" /></Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder={t("report.selectBranch")} />
                    </SelectTrigger>                    <SelectContent>
                      <SelectItem value="all"><T k="report.allBranches" /></SelectItem>
                      {Array.isArray(availableBranches) && availableBranches.length > 0 ? (
                        availableBranches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>
                          {loading ? "Loading branches..." : "No branches available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {getTabFilters()}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">{t("report.exportFormat")}</Label>
                  <Select value={filters.exportFormat} onValueChange={(value) => setFilters({ ...filters, exportFormat: value as 'pdf' | 'excel' })}>
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder={t("report.exportFormat")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF {t("report.document")}</SelectItem>
                      <SelectItem value="excel">Excel {t("report.spreadsheet")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <div className="flex items-center pt-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle><T k="report.reportNote" /></AlertTitle>
                    <AlertDescription className="text-blue-700">
                      <T k="report.reportDescription" />
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t border-blue-100 justify-end flex">          <Button
            onClick={handleGenerateReport}
            disabled={loading || generating}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading || generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <T k="report.generating" />
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                <T k="report.generateReport" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-base text-blue-800"><T k="report.systemSummary" /></CardTitle>
          <CardDescription><T k="report.orgWide" /></CardDescription>
        </CardHeader><CardContent className="space-y-4 pt-4">
          <div className="flex justify-between">
            <span className="text-blue-700"><T k="report.totalOrphanageCenters" /></span>
            <span className="font-medium text-blue-800">{stats?.totalOrphanageCenters ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700"><T k="report.totalBranches" /></span>
            <span className="font-medium text-blue-800">{stats?.totalBranches ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700"><T k="report.totalOrphans" /></span>
            <span className="font-medium text-blue-800">{stats?.totalOrphans ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700"><T k="report.totalAdmins" /></span>
            <span className="font-medium text-blue-800">{stats?.totalAdmins ?? 0}</span>
          </div>          <div className="flex justify-between">
            <span className="text-blue-700"><T k="report.totalVolunteers" /></span>
            <span className="font-medium text-blue-800">{stats?.totalVolunteers ?? 0}</span>
          </div>
        </CardContent>
      </Card>

      {/* Branch Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="text-base text-blue-800"><T k="report.branchComparison" /></CardTitle>
            <CardDescription><T k="report.performanceMetrics" /></CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-all">🏢</span>
                  <span className="text-blue-700"><T k="report.branchPrefix" /> A</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 transition-all"><T k="report.topPerformer" /></Badge>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-all">🏢</span>
                  <span className="text-blue-700"><T k="report.branchPrefix" /> C</span>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 transition-all"><T k="report.highGrowth" /></Badge>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-all">🏢</span>
                  <span className="text-blue-700"><T k="report.branchPrefix" /> E</span>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 transition-all"><T k="report.mostVolunteers" /></Badge>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-all">🏢</span>
                  <span className="text-blue-700"><T k="report.branchPrefix" /> B</span>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 transition-all"><T k="report.needsAttention" /></Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Recent System Reports Card */}
        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="text-base text-blue-800"><T k="report.recentSystemReports" /></CardTitle>
            <CardDescription><T k="report.previouslyGenerated" /></CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <span className="text-blue-700"><T k="report.quarterlySystemOverview" /></span>
                <span className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110">⬇️</span>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <span className="text-blue-700"><T k="report.branchPerformanceAnalysis" /></span>
                <span className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110">⬇️</span>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <span className="text-blue-700"><T k="report.staffEfficiencyReport" /></span>
                <span className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110">⬇️</span>
              </li>
              <li className="flex items-center justify-between text-sm group hover:bg-blue-50 p-2 rounded-md transition-all">
                <span className="text-blue-700"><T k="report.resourceAllocationSummary" /></span>
                <span className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-all hover:scale-110">⬇️</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
