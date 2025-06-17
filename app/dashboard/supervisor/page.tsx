"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, Package, CalendarCheck, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function SupervisorDashboardPage() {
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrphans: 0,
    inventoryItems: 0,
    scheduledActivities: 0,
    pendingRequests: 0
  })

  useEffect(() => {
    // Mock data loading
    const timer = setTimeout(() => {
      setStats({
        totalOrphans: 87,
        inventoryItems: 245,
        scheduledActivities: 12,
        pendingRequests: 5
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    )
  }
  return (
    <div className="w-full px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("supervisor.title")}</h1>
        <p className="text-gray-600">
          {t("supervisor.overview")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.orphans")}</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrphans}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.inventory")}</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventoryItems}</div>
            <p className="text-xs text-gray-500">+8 items added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledActivities}</div>
            <p className="text-xs text-gray-500">For this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-gray-500">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Activity chart would go here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/supervisor/orphans" className="text-blue-500 hover:underline">
                  {t("dashboard.orphans")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/supervisor/inventory" className="text-blue-500 hover:underline">
                  {t("dashboard.inventory")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/supervisor/reports" className="text-blue-500 hover:underline">
                  {t("supervisor.reports.title")}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}