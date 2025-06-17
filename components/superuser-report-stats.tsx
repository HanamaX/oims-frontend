"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js'
import { Download } from 'lucide-react'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, 
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface SystemStats {
  totalOrphanageCenters: number
  totalBranches: number
  totalOrphans: number
  totalAdmins: number
  totalDonations: number
  activeFundraisers: number
  totalInventoryItems: number
  totalVolunteers: number
}

interface SuperuserReportStatsProps {
  stats: SystemStats
}

export default function SuperuserReportStats({ stats }: SuperuserReportStatsProps) {
  const [activeChart, setActiveChart] = useState("orphanage")
  // Generate sample data for more detailed reports (in a real app, this would come from API)
  const orphanageCenterData = {
    labels: ['Center 1', 'Center 2', 'Center 3', 'Center 4', 'Center 5'],
    datasets: [
      {
        label: 'Number of Orphans',
        data: [65, 42, 80, 38, 72],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green-500 with transparency
      },
      {
        label: 'Number of Staff',
        data: [28, 18, 40, 19, 36],
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // Green-600 with transparency
      }
    ],
  }
  const monthlyDonationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Donations',
        data: [1500, 2300, 1800, 3200, 2800, 3500, 4200, 3800, 5000, 4500, 6000, 5500],
        borderColor: 'rgb(16, 185, 129)', // Green-600
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
      }
    ],
  }
  const demographicsData = {
    labels: ['0-5 years', '6-10 years', '11-15 years', '16-18 years'],
    datasets: [
      {
        label: 'Age Distribution',
        data: [stats.totalOrphans * 0.3, stats.totalOrphans * 0.35, stats.totalOrphans * 0.25, stats.totalOrphans * 0.1],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)', // Green-500
          'rgba(16, 185, 129, 0.7)', // Green-600
          'rgba(20, 184, 166, 0.7)', // Teal-500
          'rgba(6, 182, 212, 0.7)',  // Cyan-500
        ],
        borderWidth: 1,
      },
    ],
  }
  const inventoryData = {
    labels: ['Food', 'Clothing', 'School Supplies', 'Medicine', 'Furniture', 'Other'],
    datasets: [
      {
        label: 'Inventory Distribution',
        data: [
          stats.totalInventoryItems * 0.25,
          stats.totalInventoryItems * 0.2,
          stats.totalInventoryItems * 0.15,
          stats.totalInventoryItems * 0.1,
          stats.totalInventoryItems * 0.1,
          stats.totalInventoryItems * 0.2
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // Green-500
          'rgba(16, 185, 129, 0.7)',  // Green-600
          'rgba(5, 150, 105, 0.7)',   // Green-700
          'rgba(4, 120, 87, 0.7)',    // Green-800
          'rgba(6, 95, 70, 0.7)',     // Green-900
          'rgba(20, 184, 166, 0.7)',  // Teal-500
        ],
      },
    ],
  }

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Orphanage Center Comparison',
      },
    },
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Donations Trend',
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Orphan Age Demographics',
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Inventory Distribution',
      },
    },
  }

  // Mock download functionality
  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF or Excel report
    alert("In a production environment, this would download a comprehensive report.")
  }

  // Generate summary text based on stats
  const generateSummary = () => {
    return (
      <div>
        <p className="mb-4">
          This report provides a comprehensive overview of the entire orphanage management system.
          Currently, the system manages <strong>{stats.totalOrphanageCenters}</strong> orphanage centers
          with <strong>{stats.totalBranches}</strong> branches across different locations.
        </p>
        <p className="mb-4">
          There are <strong>{stats.totalOrphans}</strong> orphans being cared for by a team of <strong>{stats.totalAdmins}</strong> administrators.
          The orphanages receive support through <strong>{stats.totalDonations}</strong> donations and currently have
          <strong> {stats.activeFundraisers}</strong> active fundraising campaigns.
        </p>
        <p>
          The inventory system tracks <strong>{stats.totalInventoryItems}</strong> items across all centers,
          and <strong>{stats.totalVolunteers}</strong> volunteers are registered to provide additional support to the orphanages.
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Report Header */}
      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-green-800">System-Wide Analytics Report</CardTitle>
              <CardDescription className="text-green-600">
                Comprehensive data analysis of all orphanage centers and operations
              </CardDescription>
            </div>
            <Button onClick={handleDownloadReport} className="bg-green-600 text-white hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {generateSummary()}
        </CardContent>
      </Card>      {/* Charts Section */}
      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-green-800">Detailed Analytics</CardTitle>
          <CardDescription className="text-green-600">
            Visual representation of system data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeChart} onValueChange={setActiveChart} className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2 bg-green-100">
              <TabsTrigger 
                value="orphanage"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >Orphanage Data</TabsTrigger>
              <TabsTrigger 
                value="donations"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >Donations</TabsTrigger>
              <TabsTrigger 
                value="demographics"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >Demographics</TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-200 transition-all"
              >Inventory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orphanage" className="h-96">
              <Bar options={barOptions} data={orphanageCenterData} />
            </TabsContent>
            
            <TabsContent value="donations" className="h-96">
              <Line options={lineOptions} data={monthlyDonationData} />
            </TabsContent>
            
            <TabsContent value="demographics" className="h-96">
              <div className="flex justify-center">
                <div className="w-1/2 h-full">
                  <Pie options={pieOptions} data={demographicsData} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="h-96">
              <div className="flex justify-center">
                <div className="w-1/2 h-full">
                  <Doughnut options={doughnutOptions} data={inventoryData} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>      {/* Key Metrics */}
      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-green-800">Key Performance Indicators</CardTitle>
          <CardDescription className="text-green-600">
            Important metrics to monitor system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-green-200 rounded p-4 bg-green-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-800">Average Orphans per Center</h3>
              <p className="text-3xl font-bold mt-2 text-green-700">
                {stats.totalOrphanageCenters > 0 
                  ? Math.round(stats.totalOrphans / stats.totalOrphanageCenters) 
                  : 0}
              </p>
            </div>
            <div className="border border-green-200 rounded p-4 bg-green-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-800">Average Donations per Fundraiser</h3>
              <p className="text-3xl font-bold mt-2 text-green-700">
                {stats.activeFundraisers > 0 
                  ? Math.round(stats.totalDonations / stats.activeFundraisers) 
                  : 0}
              </p>
            </div>
            <div className="border border-green-200 rounded p-4 bg-green-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-800">Admin to Orphan Ratio</h3>
              <p className="text-3xl font-bold mt-2 text-green-700">
                1:{stats.totalAdmins > 0 
                  ? Math.round(stats.totalOrphans / stats.totalAdmins) 
                  : 0}
              </p>
            </div>
            <div className="border border-green-200 rounded p-4 bg-green-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-800">Inventory Items per Center</h3>
              <p className="text-3xl font-bold mt-2 text-green-700">
                {stats.totalOrphanageCenters > 0 
                  ? Math.round(stats.totalInventoryItems / stats.totalOrphanageCenters) 
                  : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
