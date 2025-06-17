import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import ReportService, { ReportFilters } from '@/lib/report-service'
import { useToast } from '@/hooks/use-toast'

interface AdminReportDataHookProps {
  branchId?: string
  centreId?: string
  startDate?: string
  endDate?: string
}

interface ChartDataItem {
  name: string
  value: number
}

interface AdminChartData {
  departments: ChartDataItem[]
  status: ChartDataItem[]
  roles: ChartDataItem[]
  metadata?: any
  admins?: any[]
  statistics?: any
  roleDistribution?: Record<string, number>
  branchAssignmentStats?: Record<string, number>
  orphanageAssignmentStats?: Record<string, number>
  branchDistribution?: Record<string, number>
  totalAdmins?: number
}

export function useAdminReportData({ branchId, centreId, startDate, endDate }: AdminReportDataHookProps = {}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState<AdminChartData>({
    departments: [],
    status: [],
    roles: []
  })
  useEffect(() => {
    fetchAdminData()
  }, [branchId, centreId, startDate, endDate])
  
  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Determine filters based on user role and provided parameters
      const requestFilters: ReportFilters = {
        exportFormat: 'json'
      }
      
      // Add date range filters if provided
      if (startDate) requestFilters.startDate = startDate
      if (endDate) requestFilters.endDate = endDate
      
      if (user?.role === 'super_admin') {
        // Super admin can view all or specific branch/centre
        if (branchId) requestFilters.branchId = branchId
        if (centreId) requestFilters.centreId = centreId
      } else if (user?.role === 'orphanage_admin') {
        // Orphanage admin can only view their centre or specific branches within it
        if (branchId) requestFilters.branchId = branchId
        if (centreId) {
          requestFilters.centreId = centreId
        } else if (user?.publicId) {
          requestFilters.centreId = user.publicId
        }
      } else if (user?.role === 'supervisor' && user?.publicId) {
        // Supervisor can only see their branch
        requestFilters.branchId = user.publicId
      }
      
      // Call the new API endpoint
      const response = await ReportService.generateAdminReport(requestFilters)
      
      if (response) {
        // Transform role distribution for departments chart
        const departmentsData = Object.entries(response.roleDistribution || {}).map(([role, count]) => {
          let displayName = role
          // Map role names to user-friendly department names
          if (role === 'ROLE_SUPERVISOR') displayName = 'Supervisors'
          else if (role === 'ROLE_ORPHANAGE_ADMIN') displayName = 'Orphanage Admins'
          else if (role === 'ROLE_SUPERUSER') displayName = 'Superusers'
          else if (role === 'ROLE_ADMIN') displayName = 'Administrators'
          
          return {
            name: displayName,
            value: Number(count)
          }
        })
        
        // Transform admin status for status chart
        const statusData = [
          { name: 'Active', value: response.statistics?.activeAdmins || 0 },
          { name: 'Suspended', value: response.statistics?.suspendedAdmins || 0 }
        ]
        
        // Transform branch assignment for roles chart
        const rolesData = [
          { name: 'With Branches', value: response.statistics?.adminsWithBranches || 0 },
          { name: 'With Orphanages', value: response.statistics?.adminsWithOrphanages || 0 },
          { name: 'Unassigned', value: response.statistics?.unassignedAdmins || 0 }
        ]
        
        // Set the transformed data
        setAdminData({
          departments: departmentsData,
          status: statusData,
          roles: rolesData,
          metadata: response.metadata,
          admins: response.admins,
          statistics: response.statistics,
          roleDistribution: response.roleDistribution,
          branchAssignmentStats: response.branchAssignmentStats,
          orphanageAssignmentStats: response.orphanageAssignmentStats,
          branchDistribution: response.branchDistribution,
          totalAdmins: response.totalAdmins
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load admin statistics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return { adminData, loading, refetch: fetchAdminData }
}
