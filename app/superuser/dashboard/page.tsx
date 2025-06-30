"use client"

import React, { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, LogOut, Plus, BarChart3, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import SuperuserAuthService from "@/lib/superuser-service-fix" // Using the fixed service
import { useAuth } from "@/components/auth-provider"
import { useLanguage, T } from "@/contexts/LanguageContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SuperuserReportStats from "@/components/superuser-report-stats"
import SuperuserReportGenerator from "@/components/superuser-report-generator"

// Define types for our data
interface OrphanageAdmin {
  publicId?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email: string
  phoneNumber?: string
  centerName?: string
  centerPublicId?: string
  role?: string
  suspended?: boolean
  imageUrl?: string
}

interface SystemStats {
  totalOrphanageCenters: number
  totalBranches: number
  totalOrphans: number
  totalVolunteers: number
  totalFundraising: number
}

// Create a separate component for the dashboard content that uses useSearchParams
function SuperuserDashboardContent() {
  const { t } = useLanguage()
  // Admin state
  const [admins, setAdmins] = useState<OrphanageAdmin[]>([])
  const [newAdmin, setNewAdmin] = useState<OrphanageAdmin>({
    email: "",
    phoneNumber: "",
    fullName: "",
  })
  const [stats, setStats] = useState<SystemStats>({
    totalOrphanageCenters: 0,
    totalBranches: 0,
    totalOrphans: 0,
    totalVolunteers: 0,
    totalFundraising: 0,
  })
  // UI state
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  // Check if user is authenticated as superuser
  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated as a superuser
      if (user?.role !== 'ROLE_SUPERUSER' && !SuperuserAuthService.isSuperuserAuthenticated()) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to access this area",
          variant: "destructive",
        })
        router.push("/")
      }
    }
  }, [user, router, toast, loading])

  // Fetch data on component mount and handle URL parameters
  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get('tab')
      if (tab) {
        setActiveTab(tab)
      }
    }
    fetchData()
  }, [searchParams])
  // Function to fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      try {
        await fetchAdmins()
      } catch (adminErr: any) {
        console.error("Error fetching admins:", adminErr)
        // Don't fail completely if just the admins fetch fails
      }
      
      try {
        loadSystemStats() // Use real data from localStorage instead of API call
      } catch (statsErr: any) {
        console.error("Error loading system stats:", statsErr)
        // Don't fail completely if just the stats loading fails
      }
    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError(`Failed to load dashboard data: ${err.message ?? "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }
  // Handle URL query parameters for tabs
  useEffect(() => {
    const handleTabFromUrl = () => {
      // Get the tab from the URL if available
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      
      if (tabParam && ['dashboard', 'admins', 'reports'].includes(tabParam)) {
        setActiveTab(tabParam)
      } else if (!tabParam) {
        // If no tab parameter, default to 'dashboard'
        setActiveTab('dashboard')
      }
    }
    
    // Call once on mount
    handleTabFromUrl()
    
    // Also set up to listen for URL changes
    window.addEventListener('popstate', handleTabFromUrl)
    
    // Add a hashchange listener as well for better compatibility
    window.addEventListener('hashchange', handleTabFromUrl)
    
    return () => {
      window.removeEventListener('popstate', handleTabFromUrl)
      window.removeEventListener('hashchange', handleTabFromUrl)
    }
  }, [])  // Function to fetch all orphanage admins
  const fetchAdmins = async () => {
    try {
      const adminData = await SuperuserAuthService.getAllOrphanageAdmins()
      setAdmins(adminData ?? [])
    } catch (err: any) {
      console.error("Error fetching admins:", err)
      // Set empty array instead of throwing to keep the UI working
      setAdmins([])
      
      // Only set error if it's a critical failure
      if (err.message?.includes("Network Error")) {
        setError("Network error: Couldn't connect to the server. Please check your internet connection.")
      }    }
  }
  
  // Function to load system statistics from stored user data
  const loadSystemStats = () => {
    try {
      // Get the real data from localStorage that was returned from the login response
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.dashboardStats) {          setStats({
            totalOrphanageCenters: userData.dashboardStats.totalBranches ?? 0, // Use branches as centers
            totalBranches: userData.dashboardStats.totalBranches ?? 0,
            totalOrphans: userData.dashboardStats.totalOrphans ?? 0,
            totalVolunteers: userData.dashboardStats.totalVolunteers ?? 0,
            totalFundraising: userData.dashboardStats.totalFundraising ?? 0,
          })
          return
        }
      }
        // Fallback to zeros if no real data is available
      console.log("No dashboard stats found in stored user data, using default values")
      setStats({
        totalOrphanageCenters: 0,
        totalBranches: 0,
        totalOrphans: 0,
        totalVolunteers: 0,
        totalFundraising: 0,
      })
    } catch (err: any) {
      console.error("Error loading system stats from stored data:", err)
      setStats({
        totalOrphanageCenters: 0,
        totalBranches: 0,
        totalOrphans: 0,
        totalVolunteers: 0,
        totalFundraising: 0,
      })
    }
  }

  // Handle admin form change
  const handleAdminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin(prev => ({ ...prev, [name]: value }))
  }

  // Handle adding a new admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      if (!newAdmin.email || !newAdmin.fullName) {
        throw new Error("Email and Name are required")
      }
      
      await SuperuserAuthService.addOrphanageAdmin({
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        phoneNumber: newAdmin.phoneNumber,
      })
      
      toast({
        title: t("superuser.dashboard.success"),
        description: t("superuser.dashboard.adminAdded"),
      })
      
      // Reset form and refresh data
      setNewAdmin({
        email: "",
        phoneNumber: "",
        fullName: "",
      })
      setAddAdminDialogOpen(false)
      await fetchAdmins()
    } catch (err: any) {
      console.error("Error adding admin:", err)
      setError(err.response?.data?.message ?? err.message ?? "Failed to add admin")
      toast({
        title: "Error",
        description: `Failed to add admin: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    SuperuserAuthService.logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out of the superuser dashboard",
    })
    window.location.href = "/"
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading superuser dashboard...</span>
      </div>
    )
  }  return (
    <div className="w-full px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">{t("superuser.dashboard.title")}</h1>
          <p className="text-muted-foreground flex items-center mt-3">
            {t("superuser.dashboard.description")}
          </p>
          {error && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 text-blue-800 flex items-center">
              <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-blue-100">
                <span className="text-blue-600 font-bold">!</span>
              </div>
              <p>{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                onClick={() => window.location.reload()}
              >
                {t("common.retry")}
              </Button>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("common.logout")}
        </Button>
      </div>        <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        // Update URL without full navigation
        const url = new URL(window.location.href)
        if (value === 'dashboard') {
          url.searchParams.delete('tab')
        } else {
          url.searchParams.set('tab', value)
        }
        window.history.pushState({}, '', url)
      }}>        <TabsList className="grid w-full grid-cols-3 bg-blue-100">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "dashboard") {
                const url = new URL(window.location.href)
                url.searchParams.delete('tab')
                window.history.pushState({}, '', url)
              }
            }}
          ><T k="superuser.dashboard.overview" /></TabsTrigger>
          <TabsTrigger 
            value="admins"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all" 
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "admins") {
                const url = new URL(window.location.href)
                url.searchParams.set('tab', 'admins')
                window.history.pushState({}, '', url)
              }
            }}
          ><T k="superuser.dashboard.orphanageAdmins" /></TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all" 
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "reports") {
                const url = new URL(window.location.href)
                url.searchParams.set('tab', 'reports')
                window.history.pushState({}, '', url)
              }
            }}
          ><T k="superuser.dashboard.systemReports" /></TabsTrigger>
        </TabsList>
          {/* Dashboard Overview Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium"><T k="superuser.dashboard.totalOrphanageCenters" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrphanageCenters}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium"><T k="superuser.dashboard.totalBranches" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBranches}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium"><T k="superuser.dashboard.totalOrphans" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrphans}</div>
              </CardContent>            </Card>            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium"><T k="superuser.dashboard.totalFundraising" /> (TSh)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFundraising.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium"><T k="superuser.dashboard.totalVolunteers" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
              </CardContent>
            </Card>
          </div>            <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                <T k="superuser.dashboard.systemSummary" />
              </CardTitle>
              <CardDescription>
                <T k="superuser.dashboard.overviewDescription" />
              </CardDescription>
            </CardHeader>            <CardContent>              <p>
                {t('superuser.dashboard.systemStatsText')} {stats.totalOrphanageCenters} {t('superuser.dashboard.centersText')}, {stats.totalBranches} {t('superuser.dashboard.branchesText')}, {stats.totalOrphans} {t('superuser.dashboard.orphansText')}, {t('superuser.dashboard.fundraisingText')} {stats.totalFundraising.toLocaleString()} {t('superuser.dashboard.andText')} {stats.totalVolunteers} {t('superuser.dashboard.volunteersText')}.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orphanage Admins Tab */}
        <TabsContent value="admins" className="space-y-4">          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold"><T k="superuser.dashboard.adminsManagement" /></h2>
            <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T k="superuser.dashboard.addNewAdmin" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle><T k="superuser.dashboard.addNewAdminTitle" /></DialogTitle>
                  <DialogDescription>
                    Create a new admin account for an orphanage center
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAdmin}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={newAdmin.fullName ?? ""}
                        onChange={handleAdminFormChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newAdmin.email || ""}
                        onChange={handleAdminFormChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={newAdmin.phoneNumber ?? ""}
                        onChange={handleAdminFormChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setAddAdminDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Admin"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No orphanage admins found
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.publicId}>
                        <TableCell className="font-medium">{admin.fullName}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.centerName ?? "Unassigned"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${admin.suspended ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                            {admin.suspended ? "Suspended" : "Active"}
                          </span>
                        </TableCell>
                      </TableRow>
                    )))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
          {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-700"><T k="superuser.dashboard.systemReports" /></h2>
          </div>
          
          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-blue-100">              <TabsTrigger 
                value="generator"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                <FileText className="mr-2 h-4 w-4" />
                <T k="report.reportGenerator" />
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <T k="report.systemAnalyticsTab" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator" className="space-y-6">
              <SuperuserReportGenerator stats={stats} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <SuperuserReportStats stats={stats} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Create a loading component for the Suspense boundary
function SuperuserDashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-medium">Loading Dashboard...</h2>
        <p className="text-muted-foreground">
          Please wait while we fetch your data.
        </p>
      </div>
    </div>
  )
}

// Main dashboard component with Suspense boundary
export default function SuperuserDashboardPage() {
  return (
    <Suspense fallback={<SuperuserDashboardLoading />}>
      <SuperuserDashboardContent />
    </Suspense>
  )
}
