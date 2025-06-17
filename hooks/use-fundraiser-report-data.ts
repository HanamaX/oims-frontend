import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import ReportService, { ReportFilters } from '@/lib/report-service'
import { useToast } from '@/hooks/use-toast'

interface FundraiserReportDataHookProps {
  branchId?: string
  centreId?: string
  startDate?: string
  endDate?: string
}

interface ChartDataItem {
  name: string
  value: number
}

interface FundraiserChartData {
  amounts: ChartDataItem[]
  status: ChartDataItem[]
  timeline: ChartDataItem[]
  contributionsByEvent: ChartDataItem[]
  monthlyTrends: ChartDataItem[]
  metadata?: any
  totalAmountRaised?: number
  totalContributions?: number
  uniqueContributors?: number
  recurringContributors?: number
  averageContributionAmount?: number
  topContributors?: any[]
  recentContributions?: any[]
  // Event status fields
  eventsByStatus?: Record<string, number>
  pendingEvents?: number
  approvedEvents?: number
  activeEvents?: number
  completedEvents?: number
  rejectedEvents?: number
  cancelledEvents?: number
}

export function useFundraiserReportData({ branchId, centreId, startDate, endDate }: FundraiserReportDataHookProps = {}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fundraiserData, setFundraiserData] = useState<FundraiserChartData>({
    amounts: [],
    status: [],
    timeline: [],
    contributionsByEvent: [],
    monthlyTrends: []
  })

  useEffect(() => {
    fetchFundraiserData()
  }, [branchId, centreId, startDate, endDate])

  const fetchFundraiserData = async () => {
    try {
      setLoading(true)
      
      // Determine filters based on user role and provided parameters
      const requestFilters: ReportFilters = {
        exportFormat: 'json'
      }
        // Add date range filters if provided
      if (startDate) {
        requestFilters.startDate = startDate
      }
      if (endDate) {
        requestFilters.endDate = endDate
      }
      

      
      // Call the API endpoint
      const response = await ReportService.generateFundraiserReport(requestFilters)
      console.log('Fundraiser report response:', response)
      
      if (response) {
        setFundraiserData(transformApiResponse(response))
      }
    } catch (error) {
      console.error('Error fetching fundraiser data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load fundraiser statistics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)    }
  }

  // Helper function to transform API response into chart data
  const transformApiResponse = (response: any): FundraiserChartData => {
    return {
      amounts: transformContributionsByEvent(response.contributionsByEvent),
      status: generateStatusDistribution(response),
      timeline: transformMonthlyTrends(response.monthlyTrends),
      contributionsByEvent: transformContributionsByEvent(response.contributionsByEvent),
      monthlyTrends: transformMonthlyTrends(response.monthlyTrends),
      metadata: response.metadata,
      totalAmountRaised: response.totalAmountRaised,
      totalContributions: response.totalContributions,
      uniqueContributors: response.uniqueContributors,
      recurringContributors: response.recurringContributors,
      averageContributionAmount: response.averageContributionAmount,
      topContributors: response.topContributors,
      recentContributions: response.recentContributions,
      // Include event status fields
      eventsByStatus: response.eventsByStatus,
      pendingEvents: response.pendingEvents,
      approvedEvents: response.approvedEvents,
      activeEvents: response.activeEvents,
      completedEvents: response.completedEvents,
      rejectedEvents: response.rejectedEvents,
      cancelledEvents: response.cancelledEvents
    }
  }

  // Helper functions to transform the data
  const transformContributionsByEvent = (eventData: any) => {
    if (!eventData) return []
    
    return Object.entries(eventData).map(([eventName, amount]) => ({
      name: eventName,
      value: Number(amount)
    }))
  }
  
  const transformMonthlyTrends = (trendsData: any) => {
    if (!trendsData) return []
    
    return Object.entries(trendsData).map(([month, amount]) => {
      // Convert YYYY-MM format to more readable format
      const date = new Date(month + '-01')
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      return {
        name: monthName,
        value: Number(amount)
      }
    })
  }
    // Generate status distribution based on events status data
  const generateStatusDistribution = (response: any) => {
    // If we have eventsByStatus data, use it
    if (response.eventsByStatus) {
      return Object.entries(response.eventsByStatus).map(([status, count]) => ({
        name: formatStatusName(status),
        value: Number(count)
      })).filter(item => item.value > 0) // Only include statuses with at least one event
    }
    
    // Fallback to using event counts if available
    if (response.pendingEvents !== undefined) {
      return [
        { name: 'Pending', value: response.pendingEvents ?? 0 },
        { name: 'Approved', value: response.approvedEvents ?? 0 },
        { name: 'Active', value: response.activeEvents ?? 0 },
        { name: 'Completed', value: response.completedEvents ?? 0 },
        { name: 'Rejected', value: response.rejectedEvents ?? 0 },
        { name: 'Cancelled', value: response.cancelledEvents ?? 0 }
      ].filter(item => item.value > 0) // Only include statuses with at least one event
    }
    
    // Legacy fallback to contributor data if neither is available
    const totalContributions = response.totalContributions ?? 0
    const uniqueContributors = response.uniqueContributors ?? 0
    const recurringContributors = response.recurringContributors ?? 0
    const oneTimeContributors = uniqueContributors - recurringContributors
    
    return [
      { name: 'One-time Contributors', value: oneTimeContributors },
      { name: 'Recurring Contributors', value: recurringContributors },
      { name: 'Total Contributions', value: totalContributions }
    ].filter(item => item.value > 0) // Only include items with values > 0
  }
  
  // Helper function to format status names for display
  const formatStatusName = (status: string): string => {
    // Convert "PENDING" to "Pending", "APPROVED" to "Approved", etc.
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  return { fundraiserData, loading, refetch: fetchFundraiserData }
}
