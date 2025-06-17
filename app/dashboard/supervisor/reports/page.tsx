"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileText, BarChart3, Users, Package, CalendarClock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SupervisorReportsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [selectedReport, setSelectedReport] = useState<string>("orphans")
  
  const reportTypes = [
    { id: "orphans", name: t("supervisor.reports.orphans"), icon: <Users className="h-5 w-5" /> },
    { id: "inventory", name: t("supervisor.reports.inventory"), icon: <Package className="h-5 w-5" /> },
    { id: "staff", name: t("supervisor.reports.staff"), icon: <Users className="h-5 w-5" /> },
    { id: "volunteers", name: t("supervisor.reports.volunteers"), icon: <CalendarClock className="h-5 w-5" /> },
  ]  
  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue={selectedReport} onValueChange={setSelectedReport} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 bg-blue-100">
          {reportTypes.map(report => (
            <TabsTrigger 
              key={report.id}
              value={report.id}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
            >
              <div className="flex items-center space-x-2">
                {report.icon}
                <span>{report.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {reportTypes.map(report => (
          <TabsContent key={report.id} value={report.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {report.icon}
                  <span>{report.name}</span>
                </CardTitle>
                <CardDescription>{t("report.note")}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {t("report.action.generate")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm">{t("report.dateRange")}</span>
                      </div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {t("report.action.generate")}
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        {t("report.action.view")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        {t("supervisor.reports.description")}
                      </p>
                      <Button variant="outline" className="w-full">
                        {t("report.action.view")}
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}