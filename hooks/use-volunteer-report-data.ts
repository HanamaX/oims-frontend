import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useToast } from '@/hooks/use-toast'
import ReportService, { ReportFilters } from '@/lib/report-service'

interface VolunteerReportDataHookProps {
  branchId?: string
  centreId?: string
  startDate?: string
  endDate?: string
}

interface ChartDataItem {
  name: string
  value: number
}

interface VolunteerChartData {
  status: ChartDataItem[]
  skills: ChartDataItem[]
  hoursByMonth: ChartDataItem[]
}

interface VolunteerReportData {
  totalVolunteers: number
  activeVolunteers: number
  pendingVolunteers: number
  approvedVolunteers: number
  rejectedVolunteers: number
  cancelledVolunteers: number
  completedVolunteers: number
  volunteersByStatus: Record<string, number>
  volunteersByJobRole: Record<string, number>
  volunteersByBranch: Record<string, number>
  monthlyTrends: Record<string, number>
  recentVolunteers: any[]
  upcomingSchedules: any[]
  topVolunteersByActivity: any[]
  metadata: {
    reportType: string
    centreName: string
    centreCode: string
    reportScope: string
    scopeDetails: string
    createdBy: string
    creatorRole: string
    createdAt: string
    totalRecordsProcessed: number
    filteredRecordsReturned: number
    appliedFilters?: string
    reportFormat: string
    executionTimeMs: string
  }
}

export function useVolunteerReportData({ branchId, centreId, startDate, endDate }: VolunteerReportDataHookProps = {}) {
  const { user } = useAuth()
  const [data, setData] = useState<VolunteerReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchVolunteerReport()
  }, [branchId, centreId, startDate, endDate])

  const fetchVolunteerReport = async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Determine filters based on user role and provided parameters
      const requestFilters: ReportFilters = {
        exportFormat: 'json',
        ...filters
      }
      
      // Add date range filters if provided
      if (startDate) requestFilters.startDate = startDate
      if (endDate) requestFilters.endDate = endDate
      
      
      
      const response = await ReportService.generateVolunteerReport(requestFilters)
      console.log('Volunteer report response:', response)
        if (response) {
        setData(response)
      } else {
        throw new Error('No data received from the server')
      }
    } catch (err) {
      console.error('Error fetching volunteer report:', err)
      setError('Failed to fetch volunteer report data')
      toast({
        title: 'Error',
        description: 'Failed to load volunteer report data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to transform data for charts
  const transformToChartData = (): VolunteerChartData | null => {
    if (!data) return null
    
    return {
      status: Object.entries(data.volunteersByStatus ?? {}).map(([status, count]) => ({
        name: formatStatusName(status),
        value: Number(count)
      })),
      skills: Object.entries(data.volunteersByJobRole ?? {}).map(([role, count]) => ({
        name: role,
        value: Number(count)
      })),
      hoursByMonth: Object.entries(data.monthlyTrends ?? {}).map(([month, count]) => ({
        name: formatMonthName(month),
        value: Number(count)
      }))
    }
  }

  // Helper function to format status names for display
  const formatStatusName = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }
  
  // Helper function to format month names for display
  const formatMonthName = (month: string): string => {
    // Handle different month formats (JUNE, 2025-06, etc.)
    if (month.includes('-')) {
      // Format: 2025-06
      const date = new Date(month + '-01')
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else {
      // Format: JUNE
      return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
    }
  }

  return {
    data,
    loading,
    error,
    fetchVolunteerReport,
    refetch: fetchVolunteerReport,
    chartData: transformToChartData()
  }
}
