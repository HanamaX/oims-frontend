"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function SupervisorReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()
    return (
    <div className="w-full px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t("supervisor.reports.title")}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("supervisor.reports.description")}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {children}
      </div>
    </div>
  )
}