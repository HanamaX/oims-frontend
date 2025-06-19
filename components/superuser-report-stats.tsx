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
  totalOrphans: number
  totalBranches: number
  totalVolunteers: number
  totalFundraising: number
  totalAdmins?: number
  totalOrphanageCenters?: number
  // Added these for backward compatibility with the component
  totalDonations?: number
  activeFundraisers?: number
  totalInventoryItems?: number
}

interface SuperuserReportStatsProps {
  stats: SystemStats
}

export default function SuperuserReportStats({ stats }: Readonly<SuperuserReportStatsProps>) {
  const [activeChart, setActiveChart] = useState("orphanage")
  // Generate sample data for more detailed reports (in a real app, this would come from API)
  // Multi-color palette for charts (blue, red, green, yellow, purple, orange, etc.)
  const chartColors = [
    'rgba(37, 99, 235, 0.7)',   // Blue-600
    'rgba(239, 68, 68, 0.7)',   // Red-500
    'rgba(16, 185, 129, 0.7)',  // Green-500
    'rgba(251, 191, 36, 0.7)',  // Yellow-400
    'rgba(168, 85, 247, 0.7)',  // Purple-500
    'rgba(251, 146, 60, 0.7)',  // Orange-400
    'rgba(59, 130, 246, 0.7)',  // Blue-500
    'rgba(244, 63, 94, 0.7)',   // Rose-500
    'rgba(20, 184, 166, 0.7)',  // Teal-500
    'rgba(250, 204, 21, 0.7)'   // Amber-400
  ];
  const orphanageCenterData = {
    labels: ['Center 1', 'Center 2', 'Center 3', 'Center 4', 'Center 5'],
    datasets: [
      {
        label: 'Number of Orphans',
        data: [65, 42, 80, 38, 72],
        backgroundColor: chartColors,
      },
      {
        label: 'Number of Staff',
        data: [28, 18, 40, 19, 36],
        backgroundColor: chartColors,
      }
    ],
  }
  
  const monthlyDonationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Donations (Tsh)',
        data: [1500000, 2300000, 1800000, 3200000, 2800000, 3500000, 4200000, 3800000, 5000000, 4500000, 6000000, 5500000],
        borderColor: 'rgb(37, 99, 235)', // Blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
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
        backgroundColor: chartColors,
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
          (stats.totalInventoryItems ?? 0) * 0.25,
          (stats.totalInventoryItems ?? 0) * 0.2,
          (stats.totalInventoryItems ?? 0) * 0.15,
          (stats.totalInventoryItems ?? 0) * 0.1,
          (stats.totalInventoryItems ?? 0) * 0.1,
          (stats.totalInventoryItems ?? 0) * 0.2
        ],
        backgroundColor: chartColors,
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
      },      title: {
        display: true,
        text: 'Monthly Donations Trend (Tsh)',
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

  // Animated stat card for system-wide analytics
  function AnimatedStatCard({ title, value, icon, color }: { title: string; value: string | number; icon?: React.ReactNode; color: string }) {
    return (
      <div className={`relative overflow-hidden rounded-xl shadow-lg p-6 bg-white flex flex-col items-center justify-center min-w-[180px] min-h-[110px] group`}>
        <div className="absolute inset-0 z-0 animate-ripple bg-gradient-to-br from-white via-[${color}] to-white opacity-30 group-hover:opacity-50 transition-all" />
        <div className="absolute -bottom-8 left-0 w-full h-12 z-0 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill={color} fillOpacity="0.2" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,197.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          {icon && <div className="mb-2 text-2xl">{icon}</div>}
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm font-medium text-gray-600 mt-1">{title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800">System-Wide Analytics Report</CardTitle>
              <CardDescription className="text-blue-600 flex items-center mt-3">
                Comprehensive data analysis of all orphanage centers and operations
              </CardDescription>
            </div>
            <Button onClick={handleDownloadReport} className="bg-blue-600 text-white hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Replace the summary <div> with animated stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
            <AnimatedStatCard title="Orphanage Centers" value={stats.totalOrphanageCenters ?? 0} color="#2563eb" icon={<span>🏠</span>} />
            <AnimatedStatCard title="Branches" value={stats.totalBranches ?? 0} color="#f59e42" icon={<span>🌿</span>} />
            <AnimatedStatCard title="Orphans" value={stats.totalOrphans ?? 0} color="#10b981" icon={<span>🧒</span>} />
            <AnimatedStatCard title="Admins" value={stats.totalAdmins ?? 0} color="#a21caf" icon={<span>🧑‍💼</span>} />
            <AnimatedStatCard title="Donations (Tsh)" value={(stats.totalDonations ?? 0).toLocaleString()} color="#f43f5e" icon={<span>💰</span>} />
            <AnimatedStatCard title="Active Fundraisers" value={stats.activeFundraisers ?? 0} color="#fbbf24" icon={<span>🎯</span>} />
            <AnimatedStatCard title="Inventory Items" value={stats.totalInventoryItems ?? 0} color="#0ea5e9" icon={<span>📦</span>} />
            <AnimatedStatCard title="Volunteers" value={stats.totalVolunteers ?? 0} color="#22d3ee" icon={<span>🤝</span>} />
          </div>
          <style jsx>{`
            @keyframes ripple {
              0% { transform: scale(1); opacity: 0.7; }
              70% { transform: scale(1.2); opacity: 0.4; }
              100% { transform: scale(1.4); opacity: 0.2; }
            }
            .animate-ripple {
              animation: ripple 2.5s infinite alternate;
            }
          `}</style>
        </CardContent>
      </Card>      {/* Charts Section */}
      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-800">Detailed Analytics</CardTitle>
          <CardDescription className="text-blue-600 flex items-center mt-3">
            Visual representation of system data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeChart} onValueChange={setActiveChart} className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2 bg-blue-100">
              <TabsTrigger 
                value="orphanage"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >Orphanage Data</TabsTrigger>              <TabsTrigger 
                value="donations"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >Donations (Tsh)</TabsTrigger>
              <TabsTrigger 
                value="demographics"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
              >Demographics</TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-200 transition-all"
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
      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-800">Key Performance Indicators</CardTitle>
          <CardDescription className="text-blue-600">
            Important metrics to monitor system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-blue-200 rounded p-4 bg-blue-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-blue-800">Average Orphans per Center</h3>
              <p className="text-3xl font-bold mt-2 text-blue-700">                {(stats.totalOrphanageCenters ?? 0) > 0
                  ? Math.round(stats.totalOrphans / (stats.totalOrphanageCenters ?? 1))
                  : 0}
              </p>
            </div>
            <div className="border border-blue-200 rounded p-4 bg-blue-50 hover:shadow-md transition-all">              <h3 className="text-lg font-medium text-blue-800">Average Donations per Fundraiser (Tsh)</h3>
              <p className="text-3xl font-bold mt-2 text-blue-700">                {(stats.activeFundraisers ?? 0) > 0
                  ? Math.round((stats.totalDonations ?? 0) / (stats.activeFundraisers ?? 1)).toLocaleString() + " Tsh"
                  : "0 Tsh"}
              </p>
            </div>
            <div className="border border-blue-200 rounded p-4 bg-blue-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-blue-800">Admin to Orphan Ratio</h3>
              <p className="text-3xl font-bold mt-2 text-blue-700">                1:{(stats.totalAdmins ?? 0) > 0
                  ? Math.round(stats.totalOrphans / (stats.totalAdmins ?? 1))
                  : 0}
              </p>
            </div>
            <div className="border border-blue-200 rounded p-4 bg-blue-50 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-blue-800">Inventory Items per Center</h3>
              <p className="text-3xl font-bold mt-2 text-blue-700">                {(stats.totalOrphanageCenters ?? 0) > 0
                  ? Math.round((stats.totalInventoryItems ?? 0) / (stats.totalOrphanageCenters ?? 1))
                  : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
