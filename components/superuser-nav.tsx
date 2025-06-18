"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileBarChart, LogOut, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import SuperuserAuthService from "@/lib/superuser-auth-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-provider"

interface NavItem {
  name: string
  tab: string
  icon: React.ReactNode
}

// Create a component that contains useSearchParams
function SuperuserNavContent() {  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, logout: authLogout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  // Check if user is authenticated as superuser
  useEffect(() => {
    if (mounted) {
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
  }, [user, router, toast, mounted])

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      tab: "dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      name: "Orphanage Admins",
      tab: "admins",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      name: "Reports",
      tab: "reports",
      icon: <FileBarChart className="mr-2 h-5 w-5" />,
    },
  ]
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    setActiveTab(tab ?? 'dashboard')
  }, [searchParams])
  const handleNavigation = (item: NavItem) => {
    const url = item.tab === 'dashboard' 
      ? '/superuser/dashboard'
      : `/superuser/dashboard?tab=${item.tab}`
    router.push(url)
  }
    const handleLogout = () => {
    // First use the SuperuserAuthService to remove the superuser specific flag
    SuperuserAuthService.logout()
    
    // Check if user is authenticated through the main auth system
    if (user) {
      // Use the auth context's logout function for a complete logout
      // This will redirect to login page
      authLogout()
    } else {
      // If not authenticated through the main system, do a thorough cleanup
      try {
        // Clear all authentication tokens
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user")
        localStorage.removeItem("superuser_auth")
        
        // Show success message
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully",
        })
        
        // Add a small delay before redirecting to make sure toast is seen
        setTimeout(() => {
          // Use window.location for a complete page refresh to reset all state
          window.location.href = "/login"
        }, 500)
      } catch (e) {
        console.error("Error during logout:", e)
        // Redirect anyway
        window.location.href = "/login"
      }
    }
  }

  if (!mounted) return null

  return (
    <nav className="h-screen flex flex-col bg-green-50 border-r border-green-200 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-green-900 px-2 mb-4">
          Super Admin
        </h2>
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            onClick={() => handleNavigation(item)}
            className={cn(
              "w-full justify-start py-2 text-sm font-medium rounded-md transition-colors",
              item.tab === activeTab
                ? "bg-green-600 text-white hover:bg-green-700"
                : "text-green-900 hover:bg-green-200"
            )}
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
      </div>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-green-900 hover:bg-green-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </nav>
  )
}

// Loading component for the Suspense boundary
function SuperuserNavLoading() {
  return (
    <nav className="h-screen flex flex-col bg-green-50 border-r border-green-200 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-green-900 px-2 mb-4">
          Super Admin
        </h2>
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      </div>
    </nav>
  )
}

// Main component with Suspense boundary
export default function SuperuserNav() {
  return (
    <Suspense fallback={<SuperuserNavLoading />}>
      <SuperuserNavContent />
    </Suspense>
  )
}
