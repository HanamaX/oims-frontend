"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, LogOut, Plus, Trash2, UserCheck, UserX, BarChart3, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import SuperuserAuthService from "@/lib/superuser-auth-service"
import { useAuth } from "@/components/auth-provider"
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
  CardFooter,
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
  totalAdmins: number
  totalDonations: number
  activeFundraisers: number
  totalInventoryItems: number
  totalVolunteers: number
}

// Create a separate component for the dashboard content that uses useSearchParams
function SuperuserDashboardContent() {
  // Admin state
  const [admins, setAdmins] = useState<OrphanageAdmin[]>([])
  const [newAdmin, setNewAdmin] = useState<OrphanageAdmin>({
    email: "",
    phoneNumber: "",
    fullName: "",
  })
  
  // System stats state
  const [stats, setStats] = useState<SystemStats>({
    totalOrphanageCenters: 0,
    totalBranches: 0,
    totalOrphans: 0,
    totalAdmins: 0,
    totalDonations: 0,
    activeFundraisers: 0,
    totalInventoryItems: 0,
    totalVolunteers: 0,  })  // UI state
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false)
  const [deleteAdminDialogOpen, setDeleteAdminDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<OrphanageAdmin | null>(null)
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
        await fetchSystemStats()
      } catch (statsErr: any) {
        console.error("Error fetching system stats:", statsErr)
        // Don't fail completely if just the stats fetch fails
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
  }, [])
  // Function to fetch all orphanage admins
  const fetchAdmins = async () => {
    try {
      const adminData = await SuperuserAuthService.getAllOrphanageAdmins()
      setAdmins(adminData || [])
    } catch (err: any) {
      console.error("Error fetching admins:", err)
      // Set empty array instead of throwing to keep the UI working
      setAdmins([])
      
      // Only set error if it's a critical failure
      if (err.message?.includes("Network Error")) {
        setError("Network error: Couldn't connect to the server. Please check your internet connection.")
      }
    }
  }
  // Function to fetch system statistics
  const fetchSystemStats = async () => {
    try {
      const statsData = await SuperuserAuthService.getSystemStats()
      setStats(statsData || {
        totalOrphanageCenters: 0,
        totalBranches: 0,
        totalOrphans: 0,
        totalAdmins: 0,
        totalDonations: 0,
        activeFundraisers: 0,
        totalInventoryItems: 0,
        totalVolunteers: 0,
      })
    } catch (err: any) {
      console.error("Error fetching system stats:", err)
      // Use default values instead of throwing to keep the UI working
      setStats({
        totalOrphanageCenters: 0,
        totalBranches: 0,
        totalOrphans: 0,
        totalAdmins: 0,
        totalDonations: 0,
        activeFundraisers: 0,
        totalInventoryItems: 0,
        totalVolunteers: 0,
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
        title: "Success",
        description: `Admin ${newAdmin.fullName} has been added successfully`,
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

  // Handle deleting an admin
  const handleDeleteClick = (admin: OrphanageAdmin) => {
    setSelectedAdmin(admin)
    setDeleteAdminDialogOpen(true)
  }

  // Confirm admin delete
  const confirmDeleteAdmin = async () => {
    if (!selectedAdmin?.publicId) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      await SuperuserAuthService.deleteOrphanageAdmin(selectedAdmin.publicId)
      
      toast({
        title: "Success",
        description: `Admin ${selectedAdmin.fullName} has been deleted successfully`,
      })
      
      setDeleteAdminDialogOpen(false)
      setSelectedAdmin(null)
      await fetchAdmins()
    } catch (err: any) {
      console.error("Error deleting admin:", err)
      setError(err.response?.data?.message ?? "Failed to delete admin")
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle toggling admin suspension status
  const handleToggleAdminStatus = async (admin: OrphanageAdmin) => {
    if (!admin.publicId) return
    
    try {
      const newStatus = !admin.suspended
      await SuperuserAuthService.toggleAdminStatus(admin.publicId, newStatus)
      
      toast({
        title: "Success",
        description: `Admin ${admin.fullName} has been ${newStatus ? "suspended" : "activated"} successfully`,
      })
      
      await fetchAdmins()
    } catch (err: any) {
      console.error("Error updating admin status:", err)
      toast({
        title: "Error",
        description: `Failed to update admin status: ${err.message}`,
        variant: "destructive",
      })
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
  }
  return (
    <div className="w-full px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>          <h1 className="text-3xl font-bold tracking-tight text-green-600">Superuser Dashboard</h1>
          <p className="text-muted-foreground">
            Manage orphanage admins and monitor system-wide statistics
          </p>
          {error && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2 text-green-800 flex items-center">
              <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-green-100">
                <span className="text-green-600 font-bold">!</span>
              </div>
              <p>{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
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
      }}>        <TabsList className="grid w-full grid-cols-3 bg-green-100">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "dashboard") {
                const url = new URL(window.location.href)
                url.searchParams.delete('tab')
                window.history.pushState({}, '', url)
              }
            }}
          >Overview</TabsTrigger>
          <TabsTrigger 
            value="admins"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all" 
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "admins") {
                const url = new URL(window.location.href)
                url.searchParams.set('tab', 'admins')
                window.history.pushState({}, '', url)
              }
            }}
          >Orphanage Admins</TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all" 
            onClick={() => {
              // Ensure proper routing when clicking the tab directly
              if (activeTab !== "reports") {
                const url = new URL(window.location.href)
                url.searchParams.set('tab', 'reports')
                window.history.pushState({}, '', url)
              }
            }}
          >Reports</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Overview Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orphanage Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrphanageCenters}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBranches}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrphans}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Fundraisers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeFundraisers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Summary</CardTitle>
              <CardDescription>
                Overview of the entire orphanage management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The system currently manages {stats.totalOrphanageCenters} orphanage centers with {stats.totalBranches} branches.
                There are {stats.totalOrphans} orphans being cared for by {stats.totalAdmins} administrators.
                The system has processed {stats.totalDonations} donations and has {stats.activeFundraisers} active fundraising campaigns.
                The inventory system tracks {stats.totalInventoryItems} items, and {stats.totalVolunteers} volunteers are registered.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orphanage Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Orphanage Admins Management</h2>
            <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Orphanage Admin</DialogTitle>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
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
                          <span className={`px-2 py-1 rounded text-xs ${admin.suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                            {admin.suspended ? "Suspended" : "Active"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAdminStatus(admin)}
                            >
                              {admin.suspended ? (
                                <UserCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <UserX className="h-4 w-4 text-amber-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(admin)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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
            <h2 className="text-2xl font-bold text-green-700">System Reports</h2>
          </div>
          
          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-green-100">
              <TabsTrigger 
                value="generator"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                <FileText className="mr-2 h-4 w-4" />
                Report Generator
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                System Analytics
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
      
      {/* Delete Admin Confirmation Dialog */}
      <Dialog open={deleteAdminDialogOpen} onOpenChange={setDeleteAdminDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Admin Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the admin <strong>{selectedAdmin?.fullName}</strong>?
              <br /><br />
              This action cannot be undone. The admin will no longer be able to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAdminDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAdmin}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
