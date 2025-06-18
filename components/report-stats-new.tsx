"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAnalyticsTranslations } from "@/hooks/use-analytics-translations"

interface ReportStatsProps {
  data: any
  type: "orphans" | "inventory" | "fundraising" | "volunteers" | "staff" | "branches"
}

export default function ReportStats({ data, type }: ReportStatsProps) {
  // Use language context for translations
  const { t } = useLanguage()
  // Use analytics-specific translations
  const { t: ta } = useAnalyticsTranslations()
  
  // Green theme color palette for charts - inspired by Spotify
  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#22c55e", "#15803d"]
  
  // Make sure data exists to prevent errors
  if (!data) {
    data = {}; // Initialize with empty object if data is undefined
  }
    // Initialize all possible chart data arrays to prevent errors
  data.demographics = data.demographics || [];
  data.ageGroups = data.ageGroups || [];
  data.statusDistribution = data.statusDistribution || [];
  data.categories = data.categories || [];
  data.stockStatus = data.stockStatus || [];
  data.transactions = data.transactions || [];
  data.departments = data.departments || [];
  data.status = data.status || [];
  data.roles = data.roles || [];
  data.amounts = data.amounts || [];
  data.timeline = data.timeline || [];
  data.skills = data.skills || [];
  data.hoursByMonth = data.hoursByMonth || [];  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(ta("analytics.locale") === "sw" ? 'sw-TZ' : 'en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  // Translate chart labels based on their type
  const getTranslatedData = (rawData: any) => {
    if (!rawData) return [];
    
    return rawData.map((item: any) => {
      const newItem = { ...item };
        // Translate age groups
      if (item.name === "0-2 years") {
        newItem.name = ta("analytics.age.0-2");
      } else if (item.name === "3-5 years") {
        newItem.name = ta("analytics.age.3-5");
      } else if (item.name === "6-12 years") {
        newItem.name = ta("analytics.age.6-12");
      } else if (item.name === "13-17 years") {
        newItem.name = ta("analytics.age.13-17");
      }
      
      // Translate gender
      else if (item.name === "Male") {
        newItem.name = ta("analytics.male");
      } else if (item.name === "Female") {
        newItem.name = ta("analytics.female");
      }
      
      // Translate status
      else if (item.name === "Active") {
        newItem.name = ta("analytics.active");
      } else if (item.name === "Inactive") {
        newItem.name = ta("analytics.inactive");
      } else if (item.name === "Adopted") {
        newItem.name = ta("analytics.adopted");
      }
      
      // Translate inventory categories
      else if (item.name === "Food") {
        newItem.name = ta("analytics.food");
      } else if (item.name === "Clothing") {
        newItem.name = ta("analytics.clothing");
      } else if (item.name === "Medicine") {
        newItem.name = ta("analytics.medicine");
      } else if (item.name === "School") {
        newItem.name = ta("analytics.schoolSupplies");
      } else if (item.name === "Other") {
        newItem.name = ta("analytics.other");
      }
        // Translate stock status
      else if (item.name === "In Stock") {
        newItem.name = ta("analytics.inStock");
      } else if (item.name === "Low Stock") {
        newItem.name = ta("analytics.lowStock");
      } else if (item.name === "Out of Stock") {
        newItem.name = ta("analytics.outOfStock");
      }        // Translate fundraising status
      else if (item.name === "Pending") {
        newItem.name = ta("analytics.pending");
      } else if (item.name === "Approved") {
        newItem.name = ta("analytics.approved");
      } else if (item.name === "Completed") {
        newItem.name = ta("analytics.completed");
      } else if (item.name === "Rejected") {
        newItem.name = ta("analytics.rejected");
      }
      
      // Translate activities and categories
      else if (item.name === "Education") {
        newItem.name = ta("analytics.education");
      } else if (item.name === "Healthcare") {
        newItem.name = ta("analytics.healthcare");
      } else if (item.name === "Facilities") {
        newItem.name = ta("analytics.facilities");
      } else if (item.name === "Events") {
        newItem.name = ta("analytics.events");
      } else if (item.name === "Activities") {
        newItem.name = ta("analytics.activities");
      } else if (item.name === "Administration") {
        newItem.name = ta("analytics.administration");
      }
      
      return newItem;
    });
  };

  // Generate appropriate chart based on report type
  const renderChart = () => {
    switch (type) {
      case "orphans":
        return (
          <Tabs defaultValue="demographics">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="demographics"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.orphans.demographics")}
              </TabsTrigger>
              <TabsTrigger 
                value="age"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.orphans.ageDistribution")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.orphans.status")}
              </TabsTrigger>
            </TabsList>            <TabsContent value="demographics" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getTranslatedData(data.demographics)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={1500}
                    className="hover:opacity-95 transition-all"
                  >
                    {data.demographics.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t("report.orphansCount")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="age" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.ageGroups)}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ${t("report.orphansCount")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.statusDistribution)}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ${t("report.orphansCount")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#059669" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
      
      case "inventory":
        return (          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="categories"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.inventory.categories")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.inventory.stockStatus")}
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.inventory.transactions")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="categories" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>                  <Pie
                    data={getTranslatedData(data.categories)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {data.categories.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t("report.inventory.items")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.stockStatus)}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ${t("report.inventory.items")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#047857" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="transactions" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTranslatedData(data.transactions)}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ${t("report.inventory.transactions")}`, t("report.count")]} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: "#059669" }}
                    activeDot={{ r: 6 }}
                    animationDuration={2000}
                    animationBegin={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
      
      case "fundraising":
        return (          <Tabs defaultValue="amount">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="amount"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.fundraising.amounts")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.fundraising.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.fundraising.timeline")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="amount" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.amounts)}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), t("report.fundraising.amount")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getTranslatedData(data.status)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {data.status.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t("report.fundraising.campaigns")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="timeline" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTranslatedData(data.timeline)}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), t("report.fundraising.amount")]} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#15803d" 
                    strokeWidth={2}
                    dot={{ fill: "#16a34a" }}
                    activeDot={{ r: 6 }}
                    animationDuration={2000}
                    animationBegin={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
      
      case "volunteers":
        return (          <Tabs defaultValue="status">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.volunteers.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="skills"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.volunteers.skills")}
              </TabsTrigger>
              <TabsTrigger 
                value="hours"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.volunteers.volunteerHours")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>                  <Pie
                    data={getTranslatedData(data.status)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {data.status.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>                  <Tooltip formatter={(value) => [`${value} ${t("report.volunteers.count")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="skills" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.skills)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value} ${t("report.volunteers.count")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="hours" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTranslatedData(data.hoursByMonth)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value} ${t("report.volunteers.volunteerHours")}`, t("report.count")]} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#059669" }}
                    activeDot={{ r: 6 }}
                    animationDuration={2000}
                    animationBegin={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
        case "staff":
        // Make sure all the required data properties exist to avoid TypeErrors
        if (!data.departments) data.departments = [];
        if (!data.status) data.status = [];
        if (!data.roles) data.roles = [];
        
        return (          <Tabs defaultValue="departments">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="departments"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.staff.departments")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {ta("analytics.staff.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="roles"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {t("report.staff.roles")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="departments" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getTranslatedData(data.departments)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={1500}                  >
                    {data.departments && data.departments.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie><Tooltip formatter={(value) => [`${value} ${t("dashboard.staff")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.status)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value} ${t("dashboard.staff")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>            <TabsContent value="roles" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.roles)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value} ${t("dashboard.staff")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#059669" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
      
      case "branches":
        return (
          <Tabs defaultValue="distribution">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger 
                value="distribution"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {t("report.branches.distribution")}
              </TabsTrigger>
              <TabsTrigger 
                value="orphans"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {t("report.branches.orphans")}
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >
                {t("report.branches.resources")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="distribution" className="pt-4">              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.distribution)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="orphans" className="pt-4">              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.orphans)}>
                  <XAxis dataKey="name" />
                  <YAxis />                  <Tooltip formatter={(value) => [`${value} ${t("report.orphansCount")}`, t("report.count")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#15803d" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="resources" className="pt-4">              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.resources)}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />                  <Tooltip formatter={(value) => [formatCurrency(value as number), t("report.fundraising.amount")]} />
                  <Bar 
                    dataKey="value" 
                    fill="#059669" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )
      
      default:
        return <p>{t("report.noData")}</p>
    }
  }

  return (
    <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="text-green-800">{t("report.statistics")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}

