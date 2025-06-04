"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Bell, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import API from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"
import { T, useLanguage } from "@/contexts/LanguageContext"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

interface Notification {
  publicId: string;
  message: string;
  createdDate: string;
  notificationType: string;
  isRead: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrphans: 0,
    totalVolunteers: 0,
    totalFundraising: 0,
    unreadNotificationsCount: 0
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [notificationsPerPage] = useState(5)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
    // Define mock events with proper IDs
  const events: Event[] = [
    { id: 'event-1', title: t("admin.dashboard.medicalCamp"), date: "May 15, 2025" },
    { id: 'event-2', title: t("admin.dashboard.educationWorkshop"), date: "May 22, 2025" },
    { id: 'event-3', title: t("admin.dashboard.volunteerOrientation"), date: "May 25, 2025" },
    { id: 'event-4', title: t("admin.dashboard.fundraisingGala"), date: "June 5, 2025" },
    { id: 'event-5', title: t("admin.dashboard.sportsDay"), date: "June 12, 2025" },
  ];

  // Function to mark a notification as read
  const handleMarkAsRead = async (notification: Notification) => {
    // Skip if already read or currently processing
    if (notification.isRead || markingAsRead === notification.publicId || !isAuthenticated) {
      return;
    }
    
    try {
      setMarkingAsRead(notification.publicId);
      
      // Call API to mark notification as read
      await API.patch(`/app/oims/orphanages/notifications/read/${notification.publicId}?isRead=true`);
      
      // Update local state
      const updatedNotifications = allNotifications.map(n => 
        n.publicId === notification.publicId ? { ...n, isRead: true } : n
      );
      
      setAllNotifications(updatedNotifications);
      
      // Update unread notifications count
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      setStats(prevStats => ({
        ...prevStats,
        unreadNotificationsCount: unreadCount
      }));
      
      // The pagination effect will update the displayed notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingAsRead(null);
    }
  };
  
  // Function to mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (markingAsRead !== null || !isAuthenticated || !allNotifications.some(n => !n.isRead)) {
      return;
    }
    
    try {
      setMarkingAsRead('all');
      
      // Call API to mark all notifications as read for current branch
      // Use the JWT token for authentication which identifies the branch
      await API.patch(`/app/oims/orphanages/notifications/read/all-current`);
      
      // Update local state - mark all as read
      const updatedNotifications = allNotifications.map(n => ({ ...n, isRead: true }));
      setAllNotifications(updatedNotifications);
      
      // Update unread count in stats
      setStats(prevStats => ({
        ...prevStats,
        unreadNotificationsCount: 0
      }));
      
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setMarkingAsRead(null);
    }
  };
  
  // Function to refresh notifications
  const refreshNotifications = async () => {
    if (!isAuthenticated || loading) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch unread notifications for current branch using correct endpoint
      const notificationsResponse = await API.get('/app/oims/orphanages/notifications');
      if (notificationsResponse.data?.data) {
        const notifications = notificationsResponse.data.data;
        setAllNotifications(notifications);
        
        // Update unread count in stats
        const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
        setStats(prevStats => ({
          ...prevStats,
          unreadNotificationsCount: unreadCount
        }));
        
        // Reset to first page when refreshing
        setCurrentPage(1);
      } else {
        // If data is empty but the call was successful, set empty array
        setAllNotifications([]);
        setStats(prevStats => ({
          ...prevStats,
          unreadNotificationsCount: 0
        }));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
      // Empty the notifications in case of error to avoid showing stale data
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to handle pagination
  useEffect(() => {
    if (allNotifications.length > 0) {
      const indexOfLastNotification = currentPage * notificationsPerPage;
      const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
      const currentNotifications = allNotifications.slice(indexOfFirstNotification, indexOfLastNotification);
      setNotifications(currentNotifications);
    }
  }, [currentPage, allNotifications, notificationsPerPage]);
  
  // Set up a refresh interval for notifications
  useEffect(() => {
    // Only set up interval if user is authenticated and is an admin
    if (!isAuthenticated || user?.role !== "admin") {
      return;
    }
    
    // Refresh notifications every 5 minutes
    const intervalId = setInterval(refreshNotifications, 300000);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Only fetch data if user is authenticated and is an admin
    if (!isAuthenticated || user?.role !== "admin") {
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Use stats from login if available
        if (user) {
          setStats({
            totalOrphans: user.dashboardStats?.totalOrphans ?? 0,
            totalVolunteers: user.dashboardStats?.totalVolunteers ?? 0,
            totalFundraising: user.dashboardStats?.totalFundraising ?? 0,
            unreadNotificationsCount: user.unreadNotificationsCount ?? 0
          })
        }

        // Fetch unread notifications for the current branch - wrapped in try/catch to handle errors gracefully
        try {
          // Use the endpoint to get unread notifications for current branch (uses JWT token for auth)
          const notificationsResponse = await API.get('/app/oims/orphanages/notifications')
          if (notificationsResponse.data?.data) {
            const notifications = notificationsResponse.data.data
            setAllNotifications(notifications)
            
            // Count unread notifications and update stats
            const unreadCount = notifications.filter((n: Notification) => !n.isRead).length
            // Only update if it's different from what we already have in user object or stats
            if (unreadCount !== stats.unreadNotificationsCount && unreadCount !== user?.unreadNotificationsCount) {
              setStats(prevStats => ({
                ...prevStats,
                unreadNotificationsCount: unreadCount
              }))
            }
            // Initial pagination will be handled by the separate effect
          } else {
            // If data is empty but the call was successful, set empty array
            setAllNotifications([])
            setStats(prevStats => ({
              ...prevStats,
              unreadNotificationsCount: 0
            }))
          }
        } catch (notifErr: any) {
          console.error("Error fetching notifications:", notifErr)
          // Empty the notifications in case of error to avoid showing stale data
          setAllNotifications([])
          // Just log errors for notifications but don't block dashboard display
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    
    // We don't need to include stats.unreadNotificationsCount in the dependency array
    // as it would create an infinite loop when it's updated inside this effect
  }, [user, isAuthenticated])

  // If not authenticated or not an admin, don't render anything
  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (loading) {    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2"><T k="admin.dashboard.loading" /></span>
      </div>
    )
  }

  return (    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><T k="admin.dashboard.title" /></h1>
        <p className="text-muted-foreground">
          <T k="admin.dashboard.welcome" />, {user?.username ?? "Admin"}! {user?.branchName ? 
            <><T k="admin.dashboard.overview" /> {user.branchName}.</> : 
            <><T k="admin.dashboard.overview" /> <T k="admin.dashboard.yourBranch" />.</>}
        </p>
      </div>      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.dashboard.totalOrphans" /></CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-in fade-in-50 duration-700">{stats.totalOrphans}</div>
            <p className="text-xs text-muted-foreground"><T k="admin.dashboard.currentBranchTotal" /></p>
          </CardContent>
        </Card>        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.dashboard.totalFunds" /></CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12"/>
              <path d="M16 10H9.5a2.5 2.5 0 0 0 0 5H12a2.5 2.5 0 0 1 0 5H8"/>
            </svg>          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-in fade-in-50 duration-700 delay-100">Tshs {stats.totalFundraising ?? 0}</div>
            <p className="text-xs text-muted-foreground"><T k="admin.dashboard.fundsRaised" /></p>
          </CardContent>
        </Card>        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.dashboard.branchName" /></CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M3 6h18"/>
              <path d="M7 12h10"/>
              <path d="M10 18h4"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-in fade-in-50 duration-700 delay-200 truncate">{user?.branchName ?? t("admin.dashboard.activeBranch")}</div>
            <p className="text-xs text-muted-foreground"><T k="admin.dashboard.currentLocation" /></p>
          </CardContent>
        </Card>        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.dashboard.volunteers" /></CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-in fade-in-50 duration-700 delay-300">{stats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground"><T k="admin.dashboard.fromLastMonth" /></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <div className="relative">
                    <Bell className="mr-2 h-5 w-5" />
                    {allNotifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {allNotifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </div>                  <T k="admin.dashboard.recentActivities" />
                </CardTitle>
                <CardDescription>
                  <T k="admin.dashboard.unreadNotifications" /> {user?.unreadNotificationsCount ?? 0} <T k="admin.dashboard.unreadNotificationsIn" /> {user?.branchName || <T k="admin.dashboard.yourBranch" />}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  className="text-xs text-gray-500 hover:text-gray-800"
                  onClick={refreshNotifications}
                  disabled={loading}                  title={t("admin.dashboard.refreshNotifications")}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                  )}
                </button>
                {allNotifications.length > 0 && allNotifications.some(n => !n.isRead) && (
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMarkAllAsRead();
                    }}
                    disabled={markingAsRead !== null || loading}
                  >
                    {markingAsRead === 'all' ? t("admin.dashboard.markingAll") : t("admin.dashboard.markAllAsRead")}
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[340px]">            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center"><T k="admin.dashboard.noNotifications" /></p>
            ) : (
              <>
                <div className="space-y-4">
                  {notifications.map((notification: Notification, index) => (
                    <div key={notification.publicId}>
                      <div 
                        className={`flex items-start space-x-4 mb-2 p-2 rounded hover:bg-gray-50 ${markingAsRead === notification.publicId ? 'opacity-60' : ''}`}
                        onClick={() => handleMarkAsRead(notification)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={`min-w-1 h-full w-1 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium whitespace-pre-line">{notification.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">
                              {notification.createdDate ? new Date(notification.createdDate.replace(' ', 'T')).toLocaleString() : t("admin.dashboard.dateUnavailable")}                            </p>
                            {!notification.isRead && markingAsRead !== notification.publicId && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"><T k="admin.dashboard.new" /></span>
                            )}
                            {markingAsRead === notification.publicId && (
                              <span className="text-xs text-muted-foreground"><T k="admin.dashboard.markingAsRead" /></span>
                            )}
                          </div>
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
        </Card>        <Card className="col-span-1">
          <CardHeader>
            <CardTitle><T k="admin.dashboard.upcomingEvents" /></CardTitle>
            <CardDescription><T k="admin.dashboard.eventsScheduled" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
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
