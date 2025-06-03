"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface ReportStatsProps {
  data: any
  type: "orphans" | "inventory" | "fundraising" | "volunteers" | "staff" | "branches"
}

export default function ReportStats({ data, type }: ReportStatsProps) {
  // Green theme color palette for charts - inspired by Spotify
  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#22c55e", "#15803d"]

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

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
                Demographics
              </TabsTrigger>
              <TabsTrigger 
                value="age"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Age Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Status
              </TabsTrigger>
            </TabsList>
            <TabsContent value="demographics" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.demographics}
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
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} orphans`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="age" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ageGroups}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} orphans`, 'Count']} />
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
                <BarChart data={data.statusDistribution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} orphans`, 'Count']} />
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
        return (
          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="categories"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Stock Status
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="categories" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.categories}
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
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.stockStatus}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Bar 
                    dataKey="value" 
                    fill="#047857" 
                    animationDuration={1500}
                    animationBegin={300}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="transactions" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.transactions}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
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
        return (
          <Tabs defaultValue="amount">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="amount"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Amounts
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Status
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="amount" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.amounts}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
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
                <PieChart>
                  <Pie
                    data={data.status}
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
                  <Tooltip formatter={(value) => [`${value} campaigns`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="timeline" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.timeline}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
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
        return (
          <Tabs defaultValue="status">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Status
              </TabsTrigger>
              <TabsTrigger 
                value="activities"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Activities
              </TabsTrigger>
              <TabsTrigger 
                value="hours"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Volunteer Hours
              </TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.status}
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
                  <Tooltip formatter={(value) => [`${value} volunteers`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="activities" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.activities}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} volunteers`, 'Count']} />
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
                <LineChart data={data.hours}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
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
        return (
          <Tabs defaultValue="departments">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger 
                value="departments"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Departments
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Status
              </TabsTrigger>
              <TabsTrigger 
                value="roles"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Roles
              </TabsTrigger>
            </TabsList>
            <TabsContent value="departments" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.departments}
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
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="status" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.status}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
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
            <TabsContent value="roles" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.roles}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
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
                Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="orphans"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Orphans
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >
                Resources
              </TabsTrigger>
            </TabsList>
            <TabsContent value="distribution" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.distribution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
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
            <TabsContent value="orphans" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.orphans}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} orphans`, 'Count']} />
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
            <TabsContent value="resources" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.resources}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
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
        return <p>No visualization available for this report type.</p>
    }
  }

  return (
    <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="text-green-800">Report Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}
