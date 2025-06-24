"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileBarChart, LogOut, Loader2, Heading1 } from 'lucide-react'
import { cn } from "@/lib/utils"
import SuperuserAuthService from "@/lib/superuser-auth-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-provider"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage, T } from "@/contexts/LanguageContext"

interface NavItem {
  name: string
  tab: string
  icon: React.ReactNode
  url: string
}

// Create a component that contains useSearchParams
function SuperuserNavContent() {  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()
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
      name: t("superuser.dashboard.overview"),
      tab: "dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      url: "/superuser/dashboard"
    },
    {
      name: t("superuser.dashboard.orphanageAdmins"),
      tab: "admins",
      icon: <Users className="mr-2 h-5 w-5" />,
      url: "/superuser/dashboard?tab=admins"
    },
    {
      name: t("superuser.dashboard.registrationRequests"),
      tab: "registration-requests",
      icon: <FileBarChart className="mr-2 h-5 w-5" />,
      url: "/superuser/dashboard/registration-requests"
    },
    {
      name: t("superuser.dashboard.systemReports"),
      tab: "reports",
      icon: <FileBarChart className="mr-2 h-5 w-5" />,
      url: "/superuser/dashboard?tab=reports"
    },
  ]
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    setActiveTab(tab ?? 'dashboard')
  }, [searchParams])

  const handleNavigation = (item: NavItem) => {
    router.push(item.url);
  }

  const handleLogout = () => {
    SuperuserAuthService.logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
    router.push("/")
  }

  if (!mounted) return null

  return (
    <nav className="h-screen flex flex-col bg-blue-50 border-r border-blue-200 p-4">
      <div className="space-y-2">        <h1 className="text-xl font-bold text-blue-900 px-10 mb-2 flex items-center font-semibold">
          <T k="superuser.title" />
        </h1>
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            onClick={() => handleNavigation(item)}
            className={cn(
              "w-full justify-start py-2 text-sm font-medium rounded-md transition-colors",
              item.tab === activeTab
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-blue-900 hover:bg-blue-200"
            )}
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
      </div>      <div className="mt-auto">
        <div className="mb-4 flex justify-center">
          <div className="w-full">
            <LanguageSwitcher />
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-900 hover:bg-blue-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <T k="common.logout" />
        </Button>
      </div>
    </nav>
  )
}

// Loading component for the Suspense boundary
function SuperuserNavLoading() {
  return (
    <nav className="h-screen flex flex-col bg-blue-50 border-r border-blue-200 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-blue-900 px-2 mb-4">
          <T k="superuser.title" />
        </h2>
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
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
