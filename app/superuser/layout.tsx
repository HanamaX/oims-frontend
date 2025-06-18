"use client"

import SuperuserNav from "@/components/superuser-nav"
import { Suspense, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import SuperuserAuthService from "@/lib/superuser-auth-service"

export default function SuperuserLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuth()
  const router = useRouter()
    // Check if user is authenticated as superuser
  useEffect(() => {
    // Check if user is authenticated as a superuser
    if (user?.role !== 'ROLE_SUPERUSER' && !SuperuserAuthService.isSuperuserAuthenticated()) {
      router.push("/")
    }
  }, [user, router])

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="flex-shrink-0 w-64">
        <SuperuserNav />
      </div>
      <div className="flex-1 w-full overflow-auto bg-gradient-to-br from-blue-50/50 to-white">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}
