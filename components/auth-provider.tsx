"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import AuthService from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Phone } from "lucide-react"

type UserRole = "admin" | "superadmin" | null

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

export function AuthProvider({ children }: { children: ReactNode }) {
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
    const protectedRoutes = ["/dashboard", "/orphans", "/volunteers", "/fundraisers", "/inventory", "/profile"]

    // Public routes that should be accessible without auth
    const publicRoutes = ["/", "/login", "/about-us", "/reset-password"]

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isPublicRoute = publicRoutes.some((route) => pathname === route)

    // If trying to access protected route without auth, redirect to login
    if (isProtectedRoute && !user) {
      console.log("Redirecting to login: Protected route without auth")
      router.push("/login")
      return
    }

    // If authenticated and trying to access login page, redirect to appropriate dashboard
    if (pathname === "/login" && user && !isLoggingOut.current) {
      console.log("Redirecting from login to dashboard")
      if (user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (user.role === "superadmin") {
        router.push("/dashboard/superadmin")
      }
      return
    }

    // If trying to access admin routes without admin role
    if (pathname.includes("/dashboard/admin") && user?.role !== "admin") {
      console.log("Unauthorized access to admin routes")
      router.push("/")
      return
    }

    // If trying to access superadmin routes without superadmin role
    if (pathname.includes("/dashboard/superadmin") && user?.role !== "superadmin") {
      console.log("Unauthorized access to superadmin routes")
      router.push("/")
      return
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

      // Determine role from the roles array
      const isAdmin = adminData.roles.includes("ROLE_ADMIN")
      const isSuperAdmin = adminData.roles.includes("ROLE_SUPER_ADMIN")
      const role = isSuperAdmin ? ("superadmin" as UserRole) : isAdmin ? ("admin" as UserRole) : null

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
        firstName: adminData.fullName?.split(" ")[0] || adminData.username,
        lastName: adminData.fullName?.split(" ").slice(1).join(" ") || "",
        email: adminData.email,
        phone: adminData.phone,
        // Explicitly check and log branchName
        branchName: response.data.branchName || "",
        imageUrl: adminData.imageUrl,
        sex: adminData.sex,
        enabled: adminData.enabled,
        username: adminData.username,
        publicId: adminData.publicId,
        firstLogin: response.data.isFirstTimeLogin || false,
        isCentreCreated: response.data.isCentreCreated || false,
        dashboardStats: {
          totalOrphans: response.data.totalOrphans || 0,
          totalBranches: response.data.totalBranches || 0,
          totalVolunteers: response.data.totalVolunteers || 0,
          totalFundraising: response.data.totalFundraising || 0,
        },
        unreadNotificationsCount: response.data.unreadNotificationsCount || 0,
      }
      
      console.log("Branch name before saving to localStorage:", userData.branchName)

      // Store user data in state
      setUser(userData)
      console.log("User data set in state:", userData)

      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("jwt_token", response.data.token)

      setIsLoading(false)

      // Redirect to the appropriate dashboard
      if (role === "admin") {
        router.push("/dashboard/admin")
      } else if (role === "superadmin") {
        router.push("/dashboard/superadmin")
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

    // First clear localStorage
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user")

    // Then update state
    setUser(null)

    // Force a hard navigation to login page
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
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
