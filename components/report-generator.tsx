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
import React from "react"

interface ReportComponentProps {
  userRole: "admin" | "superadmin"
  branchId?: string
  branchName?: string
}

export default function ReportComponent({ userRole, branchId, branchName }: ReportComponentProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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
    exportFormat: "pdf"
  })
  // Load branches for superadmin
  useEffect(() => {
    if (userRole === "superadmin") {
      loadBranches()
    } else if (branchId) {
      setSelectedBranch(branchId)
    }
  }, [])

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
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      
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
      if (filters.orphanId) {
        // Generate report for specific orphan
        await ReportService.generateOrphanReport(filters.orphanId, reportFilters)
      } else if (userRole === "admin" || (userRole === "superadmin" && selectedBranch && selectedBranch !== "all")) {
        await ReportService.generateBranchReport(activeTab, reportFilters)
      } else if (userRole === "superadmin") {
        await ReportService.generateSystemReport(activeTab, reportFilters)
      }
      
      toast({
        title: "Success",
        description: "Report generated and downloaded successfully.",
      })
    } catch (error) {
      console.error("Failed to generate report", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Get applicable filters based on the active tab
  const getTabFilters = () => {
    switch (activeTab) {
      case "orphans":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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

  // Add a new component for animated stat cards
  function AnimatedStatCard({ title, value, icon, color }: { title: string; value: string | number; icon?: React.ReactNode; color: string }) {
    return (
      <div className={`relative overflow-hidden rounded-xl shadow-lg p-6 bg-white flex flex-col items-center justify-center min-w-[220px] min-h-[120px] group`}>      <div className="absolute inset-0 z-0 animate-ripple bg-gradient-to-br from-white via-[${color}] to-white opacity-30 group-hover:opacity-50 transition-all" />
      <div className="absolute -bottom-8 left-0 w-full h-12 z-0 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full">
          <path fill={color} fillOpacity="0.2" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,197.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
            <div className="relative z-10 flex flex-col items-center">
              {icon && <div className="mb-2 text-3xl">{icon}</div>}
              <div className="text-4xl font-bold text-gray-800">{value}</div>
              <div className="text-base font-medium text-gray-600 mt-1">{title}</div>
            </div>
          </div>
        );
      }
      
              return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Generate Reports</CardTitle>
              <CardDescription>
                {userRole === "admin"
                  ? `Generate reports for ${branchName || "your branch"}`
                  : "Generate system-wide or branch-specific reports"}
              </CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="orphans" onValueChange={(value) => setActiveTab(value as ReportType)}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6">
              <TabsTrigger value="orphans">Orphans</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              {userRole === "superadmin" && (
                <>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                  <TabsTrigger value="branches">Branches</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <div className="grid gap-4">
              {userRole === "superadmin" && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
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
                    <div className="mt-2">                      <DateRangePicker
                        date={{ from: dateRange.from, to: dateRange.to }}
                        onDateChange={(range: DateRange) => setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                      />
                    </div>
                  </div>
                  
                  <div>                    <Label>Report Format</Label>
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
        </CardContent>        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Alert variant="default" className="w-full mr-4 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Reports will include data from the selected date range.</AlertTitle>
              <AlertDescription>
                Make sure to select the appropriate filters for the most relevant results.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button 
                className="min-w-[150px] transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> 
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
              <Button 
                className="min-w-[150px] transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processing
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
              <Card className="w-full border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Visualized data for the selected report type and filters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {/* ReportStats component will be used here */}
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
                        // Additional data for other report types would be included here
                      }
                    } />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* In your superuser report render, add the animated stat cards */}
      {userRole === "superadmin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          <AnimatedStatCard title="Orphanage Centers" value={5} color="#2563eb" icon={<span>🏠</span>} />
          <AnimatedStatCard title="Branches" value={12} color="#f59e42" icon={<span>🌿</span>} />
          <AnimatedStatCard title="Orphans" value={143} color="#10b981" icon={<span>🧒</span>} />
          <AnimatedStatCard title="Admins" value={24} color="#a21caf" icon={<span>🧑‍💼</span>} />
          <AnimatedStatCard title="Donations (Tsh)" value={0} color="#f43f5e" icon={<span>💰</span>} />
          <AnimatedStatCard title="Active Fundraisers" value={0} color="#fbbf24" icon={<span>🎯</span>} />
          <AnimatedStatCard title="Inventory Items" value={0} color="#0ea5e9" icon={<span>📦</span>} />
          <AnimatedStatCard title="Volunteers" value={58} color="#22d3ee" icon={<span>🤝</span>} />
        </div>
      )}
      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0.2; }
        }
        .animate-ripple {
          animation: ripple 2.5s infinite alternate;
        }
      `}</style>
    </div>
  )
}
