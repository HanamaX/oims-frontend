import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import ReportService, { ReportFilters } from '@/lib/report-service'
import { useToast } from '@/hooks/use-toast'

interface OrphanReportDataHookProps {
  branchId?: string
  centreId?: string
  startDate?: string
  endDate?: string
}

interface ChartDataItem {
  name: string
  value: number
}

interface OrphanChartData {
  demographics: ChartDataItem[]
  ageGroups: ChartDataItem[]
  statusDistribution: ChartDataItem[]
  branchDistribution?: ChartDataItem[]
  metadata?: any
  totalOrphans?: number
  totalActivated?: number
  totalDeactivated?: number
  branchStatistics?: any[]
}

export function useOrphanReportData({ branchId, centreId, startDate, endDate }: OrphanReportDataHookProps = {}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [orphanData, setOrphanData] = useState<OrphanChartData>({
    demographics: [],
    ageGroups: [],
    statusDistribution: []
  })

  useEffect(() => {
    fetchOrphanData()
  }, [branchId, centreId, startDate, endDate])

  const fetchOrphanData = async () => {
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
      
      // Set branchId and centreId based on user role
      // setFiltersByUserRole(requestFilters)
        // Call the new API endpoint
      const response = await ReportService.generateOrphansDemographicsReport(requestFilters)
      console.log('Orphan data response:', response)
      if (response) {
        // Extract data from the response structure
        const responseData = response.data || response
        setOrphanData(transformApiResponse(responseData))
      }
    } catch (error) {
      console.error('Error fetching orphan data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orphan statistics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to set filters based on user role
  const setFiltersByUserRole = (filters: ReportFilters) => {
    if (user?.role === 'super_admin') {
      // Super admin can view all or specific branch/centre
      if (branchId) {
        filters.branchId = branchId
      }
      if (centreId) {
        filters.centreId = centreId
      }
    } else if (user?.role === 'orphanage_admin') {
      // Orphanage admin can only view their centre or specific branches within it
      if (branchId) {
        filters.branchId = branchId // If provided, this is a branch in their centre
      }
      if (centreId) {
        filters.centreId = centreId
      } else if (user?.publicId) {
        filters.centreId = user.publicId // Their own centre ID
      }
    } else if (user?.role === 'supervisor' && user?.publicId) {
      // Supervisor can only see their branch
      filters.branchId = user.publicId // Their branch ID
    }
  }

  // Helper function to transform API response into chart data
  const transformApiResponse = (response: any): OrphanChartData => {
    return {
      demographics: transformGenderDistribution(response.genderDistribution),
      ageGroups: transformAgeDistribution(response.ageDistribution),
      statusDistribution: transformStatusDistribution(response.statusDistribution),
      branchDistribution: transformBranchDistribution(response.orphanCountByBranch),
      metadata: response.metadata,
      totalOrphans: response.totalOrphans,
      totalActivated: response.totalActivated,
      totalDeactivated: response.totalDeactivated,
      branchStatistics: response.branchStatistics
    }
  }

  // Helper functions to transform the data
  const transformGenderDistribution = (genderData: any) => {
    if (!genderData) return []
    
    return Object.entries(genderData).map(([gender, count]) => {
      let displayName = gender
      if (gender === 'MALE') displayName = 'Male'
      else if (gender === 'FEMALE') displayName = 'Female'
      
      return {
        name: displayName,
        value: Number(count)
      }
    })
  }
  
  const transformAgeDistribution = (ageData: any) => {
    if (!ageData) return []
    
    return Object.entries(ageData).map(([ageRange, count]) => {
      // Map age ranges to proper display names
      let displayName = ageRange
      if (ageRange === '0-2' || ageRange === 'infant') displayName = '0-2 years'
      else if (ageRange === '3-5' || ageRange === 'toddler') displayName = '3-5 years'
      else if (ageRange === '6-12' || ageRange === 'child') displayName = '6-12 years'
      else if (ageRange === '13-17' || ageRange === 'teenager') displayName = '13-17 years'
      else if (ageRange === '6-10') displayName = '6-10 years'
      
      return {
        name: displayName,
        value: Number(count)
      }
    })
  }
  
  const transformStatusDistribution = (statusData: any) => {
    if (!statusData) return []
    
    return Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: Number(count)
    }))
  }
  
  const transformBranchDistribution = (branchData: any) => {
    if (!branchData) return []
    
    return Object.entries(branchData).map(([branchName, count]) => ({
      name: branchName,
      value: Number(count)
    }))
  }

  return { orphanData, loading, refetch: fetchOrphanData }
}
