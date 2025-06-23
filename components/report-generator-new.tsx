"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { AlertCircle, Calendar, Download, FileText, Filter, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReportService, { ReportType, ReportFilters } from "@/lib/report-service"
import { format } from "date-fns"
import { buttonVariants, ANIMATION_DURATION } from "./report-animations"
import { useLanguage, T } from "@/contexts/LanguageContext"
import { useAnalyticsTranslations } from "@/hooks/use-analytics-translations"

interface ReportComponentProps {
  userRole: "admin" | "superadmin" | "supervisor"
  branchId?: string
  branchName?: string
  orphanId?: string
  orphanName?: string
  onBranchChange?: (branchId: string | undefined) => void
}

export default function ReportComponent({ userRole, branchId, branchName, orphanId, orphanName, onBranchChange }: ReportComponentProps) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const { t: ta } = useAnalyticsTranslations()
  
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportType>("orphans")
  const [availableBranches, setAvailableBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date()
  })
  
  const [useDateRange, setUseDateRange] = useState(true)
  
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
  })  // Load branches for superadmin and orphanage admin only
  useEffect(() => {
    if (userRole === "superadmin") {
      // Super admin can view all branches
      loadAllBranches()
    } else if (userRole === "admin" && branchId) {
      // Orphanage admin can only view branches in their center
      loadBranchesForCentre(branchId)
    }
    // Supervisors don't load branches - they only see their own branch data
  }, [userRole, branchId])
    // Set orphanId in filters when passed as prop
  useEffect(() => {
    if (orphanId) {
      setFilters(prev => ({ ...prev, orphanId }))
    }
  }, [orphanId])
  
  const loadAllBranches = async () => {
    try {
      setLoading(true)
      const response = await ReportService.getBranches(undefined, userRole)
      setAvailableBranches(response.data || [])
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

  const loadBranchesForCentre = async (centreId: string) => {
    try {
      setLoading(true)
      const response = await ReportService.getBranches(centreId, userRole)
      setAvailableBranches(response.data || [])
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
      setGenerating(true)      // Show initial toast
      toast({
        title: t("report.generatingReport"),
        description: t("report.pleaseWait"),
      })// Prepare filters
      const reportFilters: ReportFilters = {
        category: filters.category !== "all" ? filters.category : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        exportFormat: filters.exportFormat,
        orphanId: filters.orphanId
      }
      
      // Only add date range if enabled
      if (useDateRange) {
        reportFilters.startDate = format(dateRange.from, "yyyy-MM-dd")
        reportFilters.endDate = format(dateRange.to, "yyyy-MM-dd")
      }      // For admin role, add centreId (their orphanage centre ID)
      if (userRole === "admin" && branchId) {
        reportFilters.centreId = branchId
      }
      
      // Add branch filter if selected (for superadmin only)
      if (userRole === "superadmin" && selectedBranch && selectedBranch !== "all") {
        reportFilters.branchId = selectedBranch
      }
        // Generate the appropriate report based on role and content type
      let result;
      
      if (filters.orphanId) {
        // Generate report for specific orphan
        result = await ReportService.generateOrphanReport(filters.orphanId, reportFilters)
      } else if (userRole === "supervisor" || userRole === "admin" || (userRole === "superadmin" && selectedBranch && selectedBranch !== "all")) {
        result = await ReportService.generateBranchReport(activeTab, reportFilters)
      } else if (userRole === "superadmin") {
        result = await ReportService.generateSystemReport(activeTab, reportFilters)
      }
      
      const reportType = filters.orphanId 
        ? `Orphan report for ${orphanName || "selected orphan"}` 
        : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report`;      // Success toast with appropriate styling
      if (result?.success) {
        toast({
          title: t("report.generatedSuccessfully"),
          description: `${t("report.yourReport")} ${reportType} ${t("report.hasBeenDownloaded")} ${filters.exportFormat.toUpperCase()} ${t("report.format")}.`,
          variant: "default"
        })
      } else {
        throw new Error(t("report.generationFailed"))
      }
    } catch (error) {
      console.error("Failed to generate report", error)
      toast({
        title: t("report.errorGenerating"),
        description: t("report.failedToGenerate"),
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
        <div className="flex flex-col space-y-2">          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle><T k="report.orphanSpecific" /></AlertTitle>
            <AlertDescription>
              <T k="report.generatingFor" /> {orphanName || <T k="orphan.selected" />}
            </AlertDescription>
          </Alert>
        </div>
      )
    }
    
    switch (activeTab) {
      case "orphans":
        return (
          <>            <div className="flex flex-col space-y-2">
              <Label htmlFor="category"><T k="report.ageGroup" /></Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.ageGroup" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allAgeGroups" /></SelectItem>
                  <SelectItem value="infant"><T k="report.infant" /></SelectItem>
                  <SelectItem value="toddler"><T k="report.toddler" /></SelectItem>
                  <SelectItem value="child"><T k="report.child" /></SelectItem>
                  <SelectItem value="teenager"><T k="report.teenager" /></SelectItem>
                </SelectContent>
              </Select>
            </div>            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="active"><T k="report.active" /></SelectItem>
                  <SelectItem value="inactive"><T k="report.inactive" /></SelectItem>
                  <SelectItem value="adopted"><T k="report.adopted" /></SelectItem>
                </SelectContent>
              </Select>            </div>
          </>
        );
      case "inventory":
        return (          <>
            <div className="flex flex-col space-y-2">
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
                  <SelectItem value="other"><T k="report.other" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="in_stock"><T k="report.inStock" /></SelectItem>
                  <SelectItem value="low_stock"><T k="report.lowStock" /></SelectItem>
                  <SelectItem value="out_of_stock"><T k="report.outOfStock" /></SelectItem>
                </SelectContent>
              </Select>            </div>
          </>
        );      case "fundraising":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="PENDING"><T k="report.pending" /></SelectItem>
                  <SelectItem value="APPROVED"><T k="report.approved" /></SelectItem>
                  <SelectItem value="REJECTED"><T k="report.rejected" /></SelectItem>
                  <SelectItem value="COMPLETED"><T k="report.completed" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>        );      case "volunteers":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="ACTIVE"><T k="report.active" /></SelectItem>
                  <SelectItem value="INACTIVE"><T k="report.inactive" /></SelectItem>
                  <SelectItem value="PENDING"><T k="report.pending" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );      case "staff":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="active"><T k="report.active" /></SelectItem>
                  <SelectItem value="inactive"><T k="report.inactive" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );      case "branches":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status"><T k="report.status" /></Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={<T k="report.status" />} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T k="report.allStatuses" /></SelectItem>
                  <SelectItem value="active"><T k="report.active" /></SelectItem>
                  <SelectItem value="inactive"><T k="report.inactive" /></SelectItem>
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
      <Card className="w-full border-blue-200 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div>              <CardTitle className="text-2xl text-blue-800"><T k="report.generator" /></CardTitle>
              <CardDescription className="text-blue-700">
                {orphanId 
                  ? <><T k="report.generate" /> {orphanName || <T k="orphan.selected" />}</>
                  : userRole === "admin"
                    ? <><T k="report.generate" /> {branchName || <T k="branch.your" />}</>
                    : <T k="report.comprehensive" />
                }
              </CardDescription>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!orphanId && (
            <Tabs defaultValue="orphans" onValueChange={(value) => setActiveTab(value as ReportType)}>              <TabsList className="grid w-full grid-cols-6 bg-blue-100">                <TabsTrigger 
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
                {userRole === "superadmin" && (
                  <>                    <TabsTrigger 
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
                  </>
                )}
              </TabsList>
                <div className="grid gap-4">                {userRole === "superadmin" && (
                  <div className="flex flex-col space-y-2">                      <Label htmlFor="branch"><T k="branch.label" /></Label>
                    <Select value={selectedBranch} onValueChange={(value) => {
                      setSelectedBranch(value);
                      if (onBranchChange) {
                        onBranchChange(value === "all" ? undefined : value);
                      }
                    }}>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-500">                        <SelectValue placeholder={<T k="report.selectBranch" />} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"><T k="branch.all" /> (<T k="report.systemReport" />)</SelectItem>
                        {availableBranches.map((branch) => (
                          <SelectItem key={branch.publicId || branch.id} value={branch.publicId || branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {userRole === "admin" && availableBranches.length > 0 && (
                  <div className="flex flex-col space-y-2">                      <Label htmlFor="branch"><T k="branch.label" /></Label>
                    <Select value={selectedBranch} onValueChange={(value) => {
                      setSelectedBranch(value);
                      if (onBranchChange) {
                        onBranchChange(value === "all" ? undefined : value);
                      }
                    }}>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-500">                        <SelectValue placeholder={<T k="report.selectBranch" />} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"><T k="branch.all" /> (<T k="centre.yourCentre" />)</SelectItem>
                        {availableBranches.map((branch) => (
                          <SelectItem key={branch.publicId || branch.id} value={branch.publicId || branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}                  <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="use-date-range" 
                        checked={useDateRange} 
                        onCheckedChange={(checked) => setUseDateRange(checked as boolean)}
                      />                      <label
                        htmlFor="use-date-range"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-900"
                      >
                        <T k="report.useDateRange" />
                      </label>
                    </div>
                      <div className={useDateRange ? "" : "opacity-50 pointer-events-none"}>                      <Label htmlFor="date-range"><T k="report.dateRange" /></Label>
                      <div className="mt-2">
                        <DateRangePicker
                          date={{ from: dateRange.from, to: dateRange.to }}
                          onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                        />
                      </div>
                    </div>
                      {!useDateRange && (
                      <div className="text-sm text-blue-700 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                        <AlertCircle className="h-4 w-4 inline-block mr-1 text-blue-600" />
                        <T k="report.allTimeData" />
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-blue-900"><T k="report.format" /></Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          variant={filters.exportFormat === "pdf" ? "default" : "outline"}
                          onClick={() => setFilters({ ...filters, exportFormat: "pdf" })}
                          className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          PDF
                        </Button>
                        <Button
                          type="button"
                          variant={filters.exportFormat === "excel" ? "default" : "outline"}
                          onClick={() => setFilters({ ...filters, exportFormat: "excel" })}
                          className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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
            <div className="grid gap-6">              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle><T k="report.orphanSpecific" /></AlertTitle>
                <AlertDescription>
                  <T k="report.generatingDetailed" /> {orphanName || <T k="orphan.selected" />} <T k="report.personalInfo" />.
                </AlertDescription>
              </Alert>
                <div className="grid md:grid-cols-2 gap-6">              <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="use-date-range-orphan" 
                      checked={useDateRange} 
                      onCheckedChange={(checked) => setUseDateRange(checked as boolean)}
                    />                    <label
                      htmlFor="use-date-range-orphan"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >                      <T k="report.useDateRange" />
                    </label>
                  </div>
                  
                  <div className={useDateRange ? "" : "opacity-50 pointer-events-none"}>                    <Label htmlFor="date-range-orphan"><T k="report.dateRange" /></Label>
                    <div className="mt-2">
                      <DateRangePicker
                        date={{ from: dateRange.from, to: dateRange.to }}
                        onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                      />
                    </div>
                  </div>
                    {!useDateRange && (
                    <div className="text-sm text-blue-700 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                      <AlertCircle className="h-4 w-4 inline-block mr-1 text-blue-600" />
                      <T k="report.allTimeData" />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-blue-900"><T k="report.format" /></Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={filters.exportFormat === "pdf" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, exportFormat: "pdf" })}
                      className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      PDF
                    </Button>
                    <Button
                      type="button"
                      variant={filters.exportFormat === "excel" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, exportFormat: "excel" })}
                      className="flex-1 transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      Excel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">          <div className="flex justify-between w-full">            <Alert variant="default" className="w-full mr-4 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle><T k="report.includeData" /></AlertTitle>
              <AlertDescription>
                <T k="report.selectFilters" />
              </AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button 
                className={`min-w-[150px] ${buttonVariants.idle} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg`} 
                onClick={handleGenerateReport}
                disabled={loading}
              >                {loading ? (
                  <>                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {generating ? <T k="report.generatingReportEllipsis" /> : <T k="report.processing" />}
                  </>
                ) : (
                  <>                    <Download className="mr-2 h-4 w-4" /> 
                    <T k="report.generateReport" />
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
