"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"

interface ReportStatsProps {
  data: any
  type: "orphans" | "inventory" | "fundraising" | "volunteers" | "staff" | "branches"
}

export default function ReportStats({ data, type }: ReportStatsProps) {
  // Use language context for translations
  const { t } = useLanguage()
  
  // Green theme color palette for charts - inspired by Spotify
  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#22c55e", "#15803d"]
  // Format currency values
  const formatCurrency = (value: number) => {
    return `Tshs ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)}`
  }
    // Translate chart labels based on their type
  const getTranslatedData = (rawData: any) => {
    if (!rawData) return [];
    
    return rawData.map((item: any) => {
      const newItem = { ...item };
      
      // Translate age groups
      if (item.name === "0-2 years") {
        newItem.name = t("report.age.0-2");
      } else if (item.name === "3-5 years") {
        newItem.name = t("report.age.3-5");
      } else if (item.name === "6-12 years") {
        newItem.name = t("report.age.6-12");
      } else if (item.name === "13-17 years") {
        newItem.name = t("report.age.13-17");
      }
      
      // Translate gender
      else if (item.name === "Male") {
        newItem.name = t("report.gender.male");
      } else if (item.name === "Female") {
        newItem.name = t("report.gender.female");
      }
      
      // Translate status
      else if (item.name === "Active") {
        newItem.name = t("report.active");
      } else if (item.name === "Inactive") {
        newItem.name = t("report.inactive");
      } else if (item.name === "Adopted") {
        newItem.name = t("report.adopted");
      }
      
      // Translate inventory categories
      else if (item.name === "Food") {
        newItem.name = t("report.food");
      } else if (item.name === "Clothing") {
        newItem.name = t("report.clothing");
      } else if (item.name === "Medicine") {
        newItem.name = t("report.medicine");
      } else if (item.name === "School") {
        newItem.name = t("report.schoolSupplies");
      } else if (item.name === "Other") {
        newItem.name = t("report.other");
      }
        // Translate stock status
      else if (item.name === "In Stock") {
        newItem.name = t("report.inStock");
      } else if (item.name === "Low Stock") {
        newItem.name = t("report.lowStock");
      } else if (item.name === "Out of Stock") {
        newItem.name = t("report.outOfStock");
      }
        // Translate fundraising status
      else if (item.name === "Pending") {
        newItem.name = t("report.pending");
      } else if (item.name === "Approved") {
        newItem.name = t("report.approved");
      } else if (item.name === "Completed") {
        newItem.name = t("report.completed");
      } else if (item.name === "Rejected") {
        newItem.name = t("report.rejected");
      }
      
      // Translate activities and categories
      else if (item.name === "Education") {
        newItem.name = t("report.education");
      } else if (item.name === "Healthcare") {
        newItem.name = t("report.healthcare");
      } else if (item.name === "Facilities") {
        newItem.name = t("report.facilities");
      } else if (item.name === "Events") {
        newItem.name = t("report.events");
      } else if (item.name === "Activities") {
        newItem.name = t("report.activities");
      } else if (item.name === "Administration") {
        newItem.name = t("report.administration");
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
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="demographics"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.orphans.demographics")}
              </TabsTrigger>
              <TabsTrigger 
                value="age"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.orphans.ageDistribution")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.orphans.status")}
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
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="categories"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.inventory.categories")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.inventory.stockStatus")}
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.inventory.transactions")}
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
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="amount"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.fundraising.amounts")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.fundraising.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.fundraising.timeline")}
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
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.volunteers.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="activities"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.volunteers.activities")}
              </TabsTrigger>
              <TabsTrigger 
                value="hours"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.volunteers.volunteerHours")}
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
            </TabsContent>            <TabsContent value="activities" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTranslatedData(data.activities)}>
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
                <LineChart data={getTranslatedData(data.hours)}>
                  <XAxis dataKey="date" />
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
        return (          <Tabs defaultValue="departments">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="departments"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.staff.departments")}
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.staff.status")}
              </TabsTrigger>
              <TabsTrigger 
                value="roles"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
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
                    animationDuration={1500}
                  >
                    {data.departments.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>                  <Tooltip formatter={(value) => [`${value} ${t("dashboard.staff")}`, t("report.count")]} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="status" className="pt-4">
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
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="distribution"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.branches.distribution")}
              </TabsTrigger>
              <TabsTrigger 
                value="orphans"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                {t("report.branches.orphans")}
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
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
