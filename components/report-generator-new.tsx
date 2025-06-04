"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { AlertCircle, Calendar, Download, FileText, Filter, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReportService, { ReportType, ReportFilters } from "@/lib/report-service"
import { format } from "date-fns"
import { buttonVariants, ANIMATION_DURATION } from "./report-animations"
import { useLanguage } from "@/contexts/LanguageContext"

interface ReportComponentProps {
  userRole: "admin" | "superadmin"
  branchId?: string
  branchName?: string
  orphanId?: string
  orphanName?: string
}

export default function ReportComponent({ userRole, branchId, branchName, orphanId, orphanName }: ReportComponentProps) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  const [availableBranches, setAvailableBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date()
  })
  
  const [filters, setFilters] = useState<{
    category: string
    status: string
    exportFormat: 'pdf' | 'excel'
    orphanId?: string
  }>({
    category: "all",
    status: "all",
    exportFormat: "pdf",
    orphanId: orphanId
  })

  // Load branches for superadmin
  useEffect(() => {
    if (userRole === "superadmin") {
      loadBranches()
    } else if (branchId) {
      setSelectedBranch(branchId)
    }
  }, [userRole, branchId])
  
  // Set orphanId in filters when passed as prop
  useEffect(() => {
    if (orphanId) {
      setFilters(prev => ({ ...prev, orphanId }))
    }
  }, [orphanId])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const branches = await ReportService.getBranches()
      setAvailableBranches(branches)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load branches", error)
      toast({
        title: "Error",
        description: "Failed to load branches. Please try again.",
        variant: "destructive"
      })
      setLoading(false)
    }
  }
    const handleGenerateReport = async () => {
    try {
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
        orphanId: filters.orphanId
      }
      
      // For superadmin, add branch filter if selected
      if (userRole === "superadmin" && selectedBranch && selectedBranch !== "all") {
        reportFilters.branchId = selectedBranch
      }
      
      // Generate the appropriate report based on role and content type
      let result;
      
      if (filters.orphanId) {
        // Generate report for specific orphan
        result = await ReportService.generateOrphanReport(filters.orphanId, reportFilters)
      } else if (userRole === "admin" || (userRole === "superadmin" && selectedBranch && selectedBranch !== "all")) {
        result = await ReportService.generateBranchReport(activeTab, reportFilters)
      } else if (userRole === "superadmin") {
        result = await ReportService.generateSystemReport(activeTab, reportFilters)
      }
      
      const reportType = filters.orphanId 
        ? `Orphan report for ${orphanName || "selected orphan"}` 
        : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report`;
        // Success toast with appropriate styling
      if (result?.success) {
        toast({
          title: "Report Generated Successfully ✅",
          description: `Your ${reportType} has been downloaded in ${filters.exportFormat.toUpperCase()} format.`,
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

  // Get applicable filters based on the active tab
  const getTabFilters = () => {
    // If orphanId is provided, we're generating a specific orphan report
    if (filters.orphanId) {
      return (
        <div className="flex flex-col space-y-2">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Orphan-specific report</AlertTitle>
            <AlertDescription>
              Generating report for {orphanName || "selected orphan"}
            </AlertDescription>
          </Alert>
        </div>
      )
    }
    
    switch (activeTab) {
      case "orphans":
        return (
          <>            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">{t("report.ageGroup")}</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
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
            </div>            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("report.active")}</SelectItem>
                  <SelectItem value="inactive">{t("report.inactive")}</SelectItem>
                  <SelectItem value="adopted">{t("report.adopted")}</SelectItem>
                </SelectContent>
              </Select>            </div>
          </>
        );
      case "inventory":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">{t("report.category")}</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allCategories")}</SelectItem>
                  <SelectItem value="food">{t("report.food")}</SelectItem>
                  <SelectItem value="clothing">{t("report.clothing")}</SelectItem>
                  <SelectItem value="medicine">{t("report.medicine")}</SelectItem>
                  <SelectItem value="school">{t("report.schoolSupplies")}</SelectItem>
                  <SelectItem value="other">{t("report.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="in_stock">{t("report.inStock")}</SelectItem>
                  <SelectItem value="low_stock">{t("report.lowStock")}</SelectItem>
                  <SelectItem value="out_of_stock">{t("report.outOfStock")}</SelectItem>
                </SelectContent>
              </Select>            </div>
          </>
        );

      case "fundraising":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="PENDING">{t("report.pending")}</SelectItem>
                  <SelectItem value="APPROVED">{t("report.approved")}</SelectItem>
                  <SelectItem value="REJECTED">{t("report.rejected")}</SelectItem>
                  <SelectItem value="COMPLETED">{t("report.completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>        );

      case "volunteers":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="ACTIVE">{t("report.active")}</SelectItem>
                  <SelectItem value="INACTIVE">{t("report.inactive")}</SelectItem>
                  <SelectItem value="PENDING">{t("report.pending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );      case "staff":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("report.active")}</SelectItem>
                  <SelectItem value="inactive">{t("report.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );      case "branches":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">{t("report.status")}</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t("report.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("report.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("report.active")}</SelectItem>
                  <SelectItem value="inactive">{t("report.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full border-green-200 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex justify-between items-center">
            <div>              <CardTitle className="text-2xl text-green-800">{t("report.generator")}</CardTitle>
              <CardDescription className="text-green-700">
                {orphanId 
                  ? `${t("report.generate")} ${orphanName || t("orphan.selected")}`
                  : userRole === "admin"
                    ? `${t("report.generate")} ${branchName || t("branch.your")}`
                    : t("report.comprehensive")
                }
              </CardDescription>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!orphanId && (
            <Tabs defaultValue="orphans" onValueChange={(value) => setActiveTab(value as ReportType)}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6 bg-green-100">                <TabsTrigger 
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
                {userRole === "superadmin" && (
                  <>                    <TabsTrigger 
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
                  </>
                )}
              </TabsList>
              
              <div className="grid gap-4">
                {userRole === "superadmin" && (
                  <div className="flex flex-col space-y-2">                    <Label htmlFor="branch">{t("branch.label")}</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="border-green-200 focus:ring-green-500">
                        <SelectValue placeholder={t("report.selectBranch")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("branch.all")} ({t("report.systemReport")})</SelectItem>
                        {availableBranches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                  <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date-range">{t("report.dateRange")}</Label>
                      <div className="mt-2">
                        <DateRangePicker
                          date={{ from: dateRange.from, to: dateRange.to }}
                          onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>{t("report.format")}</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          variant={filters.exportFormat === "pdf" ? "default" : "outline"}
                          onClick={() => setFilters({ ...filters, exportFormat: "pdf" })}
                          className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          PDF
                        </Button>
                        <Button
                          type="button"
                          variant={filters.exportFormat === "excel" ? "default" : "outline"}
                          onClick={() => setFilters({ ...filters, exportFormat: "excel" })}
                          className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {getTabFilters()}
                  </div>
                </div>
              </div>
            </Tabs>
          )}
          
          {orphanId && (
            <div className="grid gap-6">              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>{t("report.orphanSpecific")}</AlertTitle>
                <AlertDescription>
                  {t("report.generatingDetailed")} {orphanName || t("orphan.selected")} {t("report.personalInfo")}.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-6">              <div>
                  <Label htmlFor="date-range">{t("report.dateRange")}</Label>
                  <div className="mt-2">
                    <DateRangePicker
                      date={{ from: dateRange.from, to: dateRange.to }}
                      onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>{t("report.format")}</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={filters.exportFormat === "pdf" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, exportFormat: "pdf" })}
                      className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      PDF
                    </Button>
                    <Button
                      type="button"
                      variant={filters.exportFormat === "excel" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, exportFormat: "excel" })}
                      className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      Excel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">          <div className="flex justify-between w-full">
            <Alert variant="default" className="w-full mr-4 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />              <AlertTitle>{t("report.includeData")}</AlertTitle>
              <AlertDescription>
                {t("report.selectFilters")}
              </AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button 
                className={`min-w-[150px] ${buttonVariants.idle} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg`} 
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {generating ? "Generating Report..." : "Processing"}
                  </>
                ) : (
                  <>                    <Download className="mr-2 h-4 w-4" /> 
                    {t("report.generateReport")}
                  </>
                )}
              </Button>
            </div>
          </div>
  
        </CardFooter>
      </Card>
    </div>
  )
}
