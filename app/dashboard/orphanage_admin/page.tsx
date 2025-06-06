"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Users, Building, DollarSign, UserPlus, Bell } from "lucide-react"
import API from "@/lib/api-service"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

interface DashboardStats {
  totalOrphans: number
  totalBranches: number
  totalVolunteers: number
  totalFundraising: number
}

interface Notification {
  publicId: string
  message: string
  createdDate: string
  notificationType: string
  isRead: boolean
}

export default function OrphanageAdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrphans: 0,
    totalBranches: 0,
    totalVolunteers: 0,
    totalFundraising: 0,
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [notificationsPerPage] = useState(5)
  const [error, setError] = useState<string | null>(null)

  // Effect to handle page change
  useEffect(() => {
    if (allNotifications.length > 0) {
      const indexOfLastNotification = currentPage * notificationsPerPage;
      const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
      const currentNotifications = allNotifications.slice(indexOfFirstNotification, indexOfLastNotification);
      setNotifications(currentNotifications);
    }
  }, [currentPage, allNotifications, notificationsPerPage]);
  
  useEffect(() => {
    // Only fetch data if user is authenticated and is an orphanage_admin
    if (!isAuthenticated || (user?.role !== "orphanage_admin" && user?.role !== "super_admin")) {
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use stats from login if available
        if (user?.dashboardStats) {
          setStats({
            totalOrphans: user.dashboardStats.totalOrphans ?? 0,
            totalBranches: user.dashboardStats.totalBranches ?? 0,
            totalVolunteers: user.dashboardStats.totalVolunteers ?? 0,
            totalFundraising: user.dashboardStats.totalFundraising ?? 0,
          })
        }

        // Fetch notifications - wrapped in try/catch to handle errors gracefully
        try {
          // For orphanage_admin, use the getAllNotifications endpoint
          const notificationsResponse = await API.get("/app/oims/orphanages/notifications/all")
          if (notificationsResponse.data?.data) {
            const allNotifs = notificationsResponse.data.data;
            setAllNotifications(allNotifs);
            
            // Initial pagination will be handled by the effect above
          }
        } catch (notifErr: any) {
          console.error("Error fetching notifications:", notifErr)
          // Don't set the main error state for this - just log it
          // We'll show empty notifications instead
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message ?? "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, isAuthenticated, router])

  // If not authenticated or not an orphanage_admin, don't render anything
  // This prevents unnecessary API calls
  if (!isAuthenticated || (user?.role !== "orphanage_admin" && user?.role !== "super_admin")) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orphanage Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName ?? "Admin"}!</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Using cached data where available.</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrphans}</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBranches}</div>
            <p className="text-xs text-muted-foreground">Active branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fundraising</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalFundraising.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Funds raised to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground">Active volunteers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" /> Notifications
            </CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No notifications at this time</p>
            ) : (
              <>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {notifications.map((notification, index) => (
                    <div key={notification.publicId}>
                      <div className="flex items-start space-x-4 mb-2">
                        <div className={`min-w-1 h-full w-1 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium whitespace-pre-line">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.createdDate ? new Date(notification.createdDate.replace(' ', 'T')).toLocaleString() : 'Date unavailable'}
                          </p>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <hr className="my-3 border-gray-100" />}
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {allNotifications.length > notificationsPerPage && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, Math.ceil(allNotifications.length / notificationsPerPage)) }, (_, i) => {
                          // Show at most 5 page numbers
                          let pageNum;
                          const totalPages = Math.ceil(allNotifications.length / notificationsPerPage);
                          
                          if (totalPages <= 5) {
                            // If 5 or fewer pages, show all page numbers
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // If on pages 1-3, show pages 1-5
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            // If on last 3 pages, show last 5 pages
                            pageNum = totalPages - 4 + i;
                          } else {
                            // Otherwise show current page and 2 pages on each side
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink 
                                isActive={currentPage === pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage < Math.ceil(allNotifications.length / notificationsPerPage) && setCurrentPage(currentPage + 1)}
                            className={currentPage >= Math.ceil(allNotifications.length / notificationsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "new-branch", title: "New branch added", branch: "Hillside Branch", time: "2 days ago" },
                { id: "admin-created", title: "Admin account created", branch: "Riverside Branch", time: "3 days ago" },
                { id: "system-update", title: "System update completed", branch: "All branches", time: "5 days ago" },
                { id: "fundraiser-approved", title: "Fundraiser campaign approved", branch: "Downtown Branch", time: "1 week ago" },
                { id: "inventory-audit", title: "Inventory audit completed", branch: "Springfield Branch", time: "1 week ago" },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.branch} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
