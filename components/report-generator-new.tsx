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
import { AlertCircle, BarChart3, Calendar, Download, FileText, Filter, Loader2 } from "lucide-react"
import ReportStats from "@/components/report-stats"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReportService, { ReportType, ReportFilters } from "@/lib/report-service"
import { format } from "date-fns"
import { buttonVariants, ANIMATION_DURATION } from "./report-animations"

interface ReportComponentProps {
  userRole: "admin" | "superadmin"
  branchId?: string
  branchName?: string
  orphanId?: string
  orphanName?: string
}

export default function ReportComponent({ userRole, branchId, branchName, orphanId, orphanName }: ReportComponentProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
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
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">Age Group</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Age Groups</SelectItem>
                  <SelectItem value="infant">Infant (0-2 years)</SelectItem>
                  <SelectItem value="toddler">Toddler (3-5 years)</SelectItem>
                  <SelectItem value="child">Child (6-12 years)</SelectItem>
                  <SelectItem value="teenager">Teenager (13-17 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "inventory":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="school">School Supplies</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "fundraising":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "volunteers":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "staff":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "branches":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full border-green-200 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-green-800">Generate Reports</CardTitle>
              <CardDescription className="text-green-700">
                {orphanId 
                  ? `Generate report for ${orphanName || "selected orphan"}`
                  : userRole === "admin"
                    ? `Generate reports for ${branchName || "your branch"}`
                    : "Generate system-wide or branch-specific reports"
                }
              </CardDescription>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!orphanId && (
            <Tabs defaultValue="orphans" onValueChange={(value) => setActiveTab(value as ReportType)}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6 bg-green-100">
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
                {userRole === "superadmin" && (
                  <>
                    <TabsTrigger 
                      value="staff"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                    >
                      Staff
                    </TabsTrigger>
                    <TabsTrigger 
                      value="branches"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
                    >
                      Branches
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <div className="grid gap-4">
                {userRole === "superadmin" && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="border-green-200 focus:ring-green-500">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches (System Report)</SelectItem>
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
                      <Label htmlFor="date-range">Date Range</Label>
                      <div className="mt-2">
                        <DateRangePicker
                          date={{ from: dateRange.from, to: dateRange.to }}
                          onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Report Format</Label>
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
            <div className="grid gap-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Orphan-specific report</AlertTitle>
                <AlertDescription>
                  Generating detailed report for {orphanName || "the selected orphan"} including personal information, medical records, and academic history.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <div className="mt-2">
                    <DateRangePicker
                      date={{ from: dateRange.from, to: dateRange.to }}
                      onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Report Format</Label>
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
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Alert variant="default" className="w-full mr-4 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Reports will include data from the selected date range.</AlertTitle>
              <AlertDescription>
                Make sure to select the appropriate filters for the most relevant results.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button 
                className="min-w-[150px] transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> 
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>              <Button 
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
                  <>
                    <Download className="mr-2 h-4 w-4" /> 
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {showAnalytics && (
            <div className="w-full mt-4 transition-all animate-in fade-in duration-300">
              <Card className="w-full border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-xl text-green-800">Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Visualized data for the selected report type and filters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ReportStats type={activeTab} data={
                      // This would be replaced with real data from an API
                      {
                        demographics: [
                          { name: "Male", value: 132 },
                          { name: "Female", value: 108 },
                        ],
                        ageGroups: [
                          { name: "0-2 years", value: 45 },
                          { name: "3-5 years", value: 62 },
                          { name: "6-12 years", value: 83 },
                          { name: "13-17 years", value: 50 },
                        ],
                        statusDistribution: [
                          { name: "Active", value: 198 },
                          { name: "Adopted", value: 27 },
                          { name: "Inactive", value: 15 },
                        ],
                        // Additional data for other report types would be included here based on the activeTab
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
                      }
                    } />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
