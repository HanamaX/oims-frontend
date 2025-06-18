"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()
  
  return (
    <div className="w-full">
      {children}
    </div>
  )
}