"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileBarChart, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import SuperuserAuthService from "@/lib/superuser-auth-service"
import { useToast } from "@/components/ui/use-toast"

interface NavItem {
  name: string
  tab: string
  icon: React.ReactNode
}

export default function SuperuserNav() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

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
    setActiveTab(tab || 'dashboard')
  }, [searchParams])

  const handleNavigation = (item: NavItem) => {
    const url = item.tab === 'dashboard' 
      ? '/superuser/dashboard'
      : `/superuser/dashboard?tab=${item.tab}`
    router.push(url)
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
