"use client"

import SuperuserNav from "@/components/superuser-nav"

export default function SuperuserLayout({
  children
}: {
  children: React.ReactNode
}) {  return (
    <div className="flex h-screen w-full bg-white">
      <div className="flex-shrink-0 w-64">
        <SuperuserNav />
      </div>
      <div className="flex-1 w-full overflow-auto bg-gradient-to-br from-green-50/50 to-white">
        {children}
      </div>
    </div>
  )
}
