"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import AuthService from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

type UserRole = "supervisor" | "orphanage_admin" | "admin" | "super_admin" | "ROLE_SUPERUSER" | null

interface AuthContextType {
  user: {
    role: UserRole
    firstLogin?: boolean
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    imageUrl?: string | null
    sex?: string | null
    enabled?: boolean
    branchName?: string | null
    username?: string | null
    publicId?: string | null
    branchPublicId?: string | null
    orphanageCentrePublicId?: string | null
    orphanageCentreName?: string | null
    isCentreCreated?: boolean
    dashboardStats?: {
      totalOrphans: number
      totalBranches: number
      totalVolunteers: number
      totalFundraising: number
    }
    unreadNotificationsCount?: number
  } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<{
    role: UserRole
    firstLogin?: boolean
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    imageUrl?: string | null
    enabled?: boolean
    sex?: string | null
    branchName?: string | null
    username?: string | null
    publicId?: string | null
    branchPublicId?: string | null
    orphanageCentrePublicId?: string | null
    isCentreCreated?: boolean
    dashboardStats?: {
      totalOrphans: number
      totalBranches: number
      totalVolunteers: number
      totalFundraising: number
    }
    unreadNotificationsCount?: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const isLoggingOut = useRef(false)
  const [redirectAfterLogout, setRedirectAfterLogout] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check for stored auth on mount
  useEffect(() => {
    try {
      setIsLoading(true)
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("jwt_token")

      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      setIsLoading(false)
      setIsInitialized(true)
      // Continue without stored authentication
    }
  }, [])

  // Protect routes
  useEffect(() => {
    if (isLoading || !isInitialized) return

    // Skip redirect checks if we're handling a logout redirect
    if (redirectAfterLogout) {
      return
    }

    // List of protected routes
    const protectedRoutes = ["/dashboard", "/orphans", "/volunteers", "/fundraisers", "/inventory", "/profile"]    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))    // If trying to access protected route without auth, redirect to login
    // Skip this check for superuser routes or if superuser auth is set
    const superuserAuth = typeof window !== 'undefined' && localStorage.getItem('superuser_auth') === 'true';
    if (isProtectedRoute && !user && !pathname.startsWith("/superuser") && !superuserAuth) {
      console.log("Redirecting to login: Protected route without auth")
      router.push("/login")
    }    // If authenticated and trying to access login page, redirect to appropriate dashboard
    // But don't redirect if we just completed a logout
    const isLogoutComplete = typeof window !== 'undefined' && 
      window.location.search.includes('logout=complete');
    
    if (pathname === "/login" && user && !isLoggingOut.current && !isLogoutComplete) {
      console.log("Redirecting from login to dashboard")
      if (user.role === "ROLE_SUPERUSER") {
        // Redirect ROLE_SUPERUSER to the superuser dashboard
        router.push("/superuser/dashboard")
      } else if (user.role === "supervisor" || user.role === "admin") {
        router.push("/dashboard/supervisor")
      } else if (user.role === "orphanage_admin" || user.role === "super_admin") {
        router.push("/dashboard/orphanage_admin")
      }
    }

    // If trying to access supervisor routes without supervisor role
    if (pathname.includes("/dashboard/supervisor") && user?.role !== "supervisor" && user?.role !== "admin") {
      console.log("Unauthorized access to supervisor routes")
      router.push("/")
    }

    // If trying to access orphanage_admin routes without orphanage_admin role
    if (pathname.includes("/dashboard/orphanage_admin") && user?.role !== "orphanage_admin" && user?.role !== "super_admin") {
      console.log("Unauthorized access to orphanage_admin routes")
      router.push("/")
    }
  }, [pathname, user, router, isLoading, isInitialized, redirectAfterLogout])

  // Add a special effect to handle post-logout navigation
  useEffect(() => {
    if (redirectAfterLogout && pathname === "/login") {
      // Reset the redirect flag after we've successfully reached the login page
      setRedirectAfterLogout(false)
    }
  }, [pathname, redirectAfterLogout])

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      console.log("Attempting login with credentials:", { username, password: "***" })

      // The API expects username and password
      const response = await AuthService.login({ username, password })

      // Extract user data from the response
      const adminData = response.data.admin
      
      // Log the admin data to help with debugging
      console.log("Admin data from login response:", adminData);

      // Determine role from the roles array
      const isSupervisor = adminData.roles.includes("ROLE_SUPERVISOR") || adminData.roles.includes("ROLE_ADMIN")
      const isOrphanageAdmin = adminData.roles.includes("ROLE_ORPHANAGE_ADMIN") || adminData.roles.includes("ROLE_SUPER_ADMIN")
      const isSuperuser = adminData.roles.includes("ROLE_SUPERUSER")
      
      let role: UserRole = null
      if (isSuperuser) {
        role = "ROLE_SUPERUSER"
      } else if (isSupervisor) {
        role = adminData.roles.includes("ROLE_ADMIN") ? "admin" : "supervisor"
      } else if (isOrphanageAdmin) {
        role = adminData.roles.includes("ROLE_SUPER_ADMIN") ? "super_admin" : "orphanage_admin"
      }

      if (!role) {
        console.error("No valid role found in user data")
        toast({
          title: "Login Error",
          description: "Your account doesn't have the required permissions.",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }

      const userData = {
        role: role,
        firstName: adminData.fullName?.split(" ")[0] ?? adminData.username,
        lastName: adminData.fullName?.split(" ").slice(1).join(" ") ?? "",
        email: adminData.email ?? "",
        phone: adminData.phone,
        // Explicitly check and log branchName
        branchName: response.data.branchName ?? "",
        imageUrl: adminData.imageUrl ?? "",
        sex: adminData.sex,
        enabled: adminData.enabled,
        username: adminData.username,
        publicId: adminData.publicId,
        // Add branch and orphanage center IDs from admin data
        branchPublicId: adminData.branchPublicId ?? null,
        orphanageCentrePublicId: adminData.orphanageCentrePublicId ?? null,
        firstLogin: response.data.isFirstTimeLogin ?? false,
        isCentreCreated: response.data.isCentreCreated ?? false,
        dashboardStats: {
          totalOrphans: response.data.totalOrphans ?? 0,
          totalBranches: response.data.totalBranches ?? 0,
          totalVolunteers: response.data.totalVolunteers ?? 0,
          totalFundraising: response.data.totalFundraising ?? 0,
        },
        unreadNotificationsCount: response.data.unreadNotificationsCount ?? 0,
      }
      
      console.log("Branch info before saving to localStorage:", {
        branchName: userData.branchName,
        branchPublicId: userData.branchPublicId,
        orphanageCentrePublicId: userData.orphanageCentrePublicId
      })

      // Store user data in state
      setUser(userData)
      console.log("User data set in state:", userData)

      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("jwt_token", response.data.token)

      setIsLoading(false)      // Redirect to the appropriate dashboard
      if (role === "ROLE_SUPERUSER") {
        // Set superuser auth flag for superuser-specific routes
        localStorage.setItem('superuser_auth', 'true');
        router.push("/superuser/dashboard")
      } else if (role === "supervisor" || role === "admin") {
        router.push("/dashboard/supervisor")
      } else if (role === "orphanage_admin" || role === "super_admin") {
        router.push("/dashboard/orphanage_admin")
      }

      return true
    } catch (error: any) {
      console.error("Login failed:", error)

      // Show more specific error messages
      // if (error.message === "Network Error") {
      //   toast({
      //     title: "Connection Error",
      //     description: "Unable to connect to the server. The service might be down or unreachable.",
      //     variant: "destructive",
      //   })
      // } else if (error.response?.status === 403) {
      //   toast({
      //     title: "Authentication Failed",
      //     description: "Invalid username or password.",
      //     variant: "destructive",
      //   })
      // } else {
      //   toast({
      //     title: "Login Error",
      //     description: "An unexpected error occurred. Please try again later.",
      //     variant: "destructive",
      //   })
      // }

      setIsLoading(false)
      return false
    }
  }
  const logout = () => {
    // Set flag to indicate we're initiating a logout
    isLoggingOut.current = true
    setRedirectAfterLogout(true)

    // Clear all localStorage items related to authentication
    const authKeys = [
      "jwt_token", "user", "superuser_auth", "superuser_token", "superuser_data",
      "auth_token", "access_token", "refresh_token", "session_id"
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    });

    // Clear all cookies more aggressively
    if (typeof document !== 'undefined') {
      // Get all cookies and clear them
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        // Clear the cookie in multiple ways to ensure it's gone
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
    }

    // Then update state
    setUser(null)

    console.log("All authentication data cleared during logout");

    // Force a hard navigation to login page to clear any remaining state
    window.location.replace("/login?logout=complete")
  }

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  }), [user, isLoading])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
