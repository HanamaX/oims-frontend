import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import ReportService, { ReportFilters, ReportType } from '@/lib/report-service'
import { useToast } from '@/hooks/use-toast'

interface SystemAnalyticsHookProps {
  reportType: ReportType
  branchId?: string
}

// This type defines the structure of the chart data 
// needed for the different analytics tabs
interface AnalyticsChartData {
  [key: string]: any  // Allow for dynamic properties based on report type
}

export function useSystemAnalytics({ reportType, branchId }: SystemAnalyticsHookProps) {
  const { user } = useAuth()
  const { toast } = useToast()
    // Create separate states for each report type
  const [orphanData, setOrphanData] = useState<AnalyticsChartData>({})
  const [inventoryData, setInventoryData] = useState<AnalyticsChartData>({})
  const [staffData, setStaffData] = useState<AnalyticsChartData>({})
  const [fundraisingData, setFundraisingData] = useState<AnalyticsChartData>({})
  const [volunteerData, setVolunteerData] = useState<AnalyticsChartData>({})
  
  const [loadingOrphans, setLoadingOrphans] = useState(false)
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [loadingFundraising, setLoadingFundraising] = useState(false)
  const [loadingVolunteers, setLoadingVolunteers] = useState(false)
  
  // Track which data has been loaded
  const [orphansLoaded, setOrphansLoaded] = useState(false)
  const [inventoryLoaded, setInventoryLoaded] = useState(false)
  const [staffLoaded, setStaffLoaded] = useState(false)
  const [fundraisingLoaded, setFundraisingLoaded] = useState(false)
  const [volunteersLoaded, setVolunteersLoaded] = useState(false)
  
  // Function to get the appropriate data and loading state for current tab
  const getCurrentData = () => {
    switch(reportType) {
      case 'orphans': 
        return { data: orphanData, loading: loadingOrphans, loaded: orphansLoaded }
      case 'inventory': 
        return { data: inventoryData, loading: loadingInventory, loaded: inventoryLoaded }
      case 'staff': 
        return { data: staffData, loading: loadingStaff, loaded: staffLoaded }
      case 'fundraising': 
        return { data: fundraisingData, loading: loadingFundraising, loaded: fundraisingLoaded }
      case 'volunteers': 
        return { data: volunteerData, loading: loadingVolunteers, loaded: volunteersLoaded }
      default:
        return { data: {}, loading: false, loaded: false }
    }
  }
  // Load data for the current tab if not already loaded
  useEffect(() => {
    if (reportType === 'orphans' && !orphansLoaded) {
      fetchOrphanAnalytics()
    } else if (reportType === 'inventory' && !inventoryLoaded) {
      fetchInventoryAnalytics()
    } else if (reportType === 'staff' && !staffLoaded) {
      fetchAdminAnalytics()
    } else if (reportType === 'fundraising' && !fundraisingLoaded) {
      fetchFundraisingAnalytics()
    } else if (reportType === 'volunteers' && !volunteersLoaded) {
      fetchVolunteerAnalytics()
    } else {
      // For now, other report types will use sample data
    }
  }, [reportType, branchId, orphansLoaded, inventoryLoaded, staffLoaded, fundraisingLoaded, volunteersLoaded])

  const fetchOrphanAnalytics = async () => {
    try {
      setLoadingOrphans(true)
      
      // Prepare request filters based on user role
      const requestFilters: ReportFilters = {}
      
      // If a specific branch is selected, use it
      if (branchId) {
        requestFilters.branchId = branchId
      }
      
      // For orphanage admin, always include their centre ID
      if (user?.role === 'orphanage_admin' && user?.publicId) {
        requestFilters.centreId = user.publicId
      }
      
      // For supervisor, they can only see their branch
      if (user?.role === 'supervisor' && user?.publicId) {
        requestFilters.branchId = user.publicId
      }
      
      // Call the API endpoint without specifying format to get JSON data
      const response = await ReportService.generateOrphansDemographicsReport(requestFilters)
      
      if (response?.data) {
        // Extract the data from the response
        const data = response.data
        
        // Transform API response to match the chart data structure
        const transformedData: AnalyticsChartData = {
          demographics: transformGenderDistribution(data.genderDistribution),
          ageGroups: transformAgeDistribution(data.ageDistribution),
          statusDistribution: transformStatusDistribution(data.statusDistribution),
          branchDistribution: transformBranchDistribution(data.orphanCountByBranch),
          metadata: data.metadata,
          totalOrphans: data.totalOrphans,
          totalActivated: data.totalActivated,
          totalDeactivated: data.totalDeactivated,
          branchStatistics: data.branchStatistics
        }
        
        setOrphanData(transformedData)
        setOrphansLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching orphan analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orphan analytics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoadingOrphans(false)
    }
  }
  
  const fetchInventoryAnalytics = async () => {
    try {
      setLoadingInventory(true)
      
      // Prepare request filters based on user role
      const requestFilters: ReportFilters = {}
      
      // If a specific branch is selected, use it
      if (branchId) {
        requestFilters.branchId = branchId
      }
      
      // For orphanage admin, always include their centre ID
      if (user?.role === 'orphanage_admin' && user?.publicId) {
        requestFilters.centreId = user.publicId
      }
      
      // For supervisor, they can only see their branch
      if (user?.role === 'supervisor' && user?.publicId) {
        requestFilters.branchId = user.publicId
      }
      
      // Call the API endpoint without specifying format to get JSON data
      const response = await ReportService.generateInventoryReport(requestFilters)
      
      if (response?.data) {
        // Extract the data from the response
        const data = response.data
        
        // Transform API response to match the chart data structure
        const transformedData: AnalyticsChartData = {
          // Map for chart display
          categories: transformCategories(data.itemsByCategory),
          stockStatus: transformStockStatus(data),
          transactions: transformTransactions(data.recentTransactions),
          
          // Additional data for display
          metadata: data.metadata,
          totalItems: data.totalItems,
          lowStockItems: data.lowStockItems,
          noStockItems: data.noStockItems,
          healthyStockItems: data.healthyStockItems,
          totalInventoryValue: data.totalInventoryValue,
          averageItemValue: data.averageItemValue,
          highestItemValue: data.highestItemValue,
          lowestItemValue: data.lowestItemValue,
          transactionsByType: data.transactionsByType,
          recentTransactions: data.recentTransactions,
          items: data.items
        }
        
        setInventoryData(transformedData)
        setInventoryLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching inventory analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load inventory analytics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoadingInventory(false)
    }
  }
    const fetchAdminAnalytics = async () => {
    try {
      setLoadingStaff(true)
      
      // Prepare request filters based on user role
      const requestFilters: ReportFilters = {}
      
      // If a specific branch is selected, use it
      if (branchId) {
        requestFilters.branchId = branchId
      }
        // For super_admin only, include centreId if selected
      if (user?.role === 'super_admin' && branchId) {
        // Get the centre ID from branch selection if available
        // This would require additional logic that's handled by the API
      }
      
      // For supervisor, they can only see their branch
      if (user?.role === 'supervisor' && user?.publicId) {
        requestFilters.branchId = user.publicId
      }
      
      // Call the API endpoint without specifying format to get JSON data
      const response = await ReportService.generateAdminReport(requestFilters)
      
      if (response) {
        // Transform API response to match the chart data structure
        const transformedData: AnalyticsChartData = {
          // Map for chart display
          departments: transformDepartments(response.roleDistribution) || [],
          status: transformAdminStatus(response.statistics) || [],
          roles: transformAdminRoles(response.statistics) || [],
          
          // Additional data for display
          metadata: response.metadata,
          admins: response.admins || [],
          statistics: response.statistics || {},
          roleDistribution: response.roleDistribution || {},
          branchAssignmentStats: response.branchAssignmentStats || {},
          orphanageAssignmentStats: response.orphanageAssignmentStats || {},
          branchDistribution: response.branchDistribution || {},
          totalAdmins: response.totalAdmins || 0
        }
        
        setStaffData(transformedData)
        setStaffLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching admin analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load admin analytics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoadingStaff(false)
    }
  }

  const fetchFundraisingAnalytics = async () => {
    try {
      setLoadingFundraising(true)
      
      // Prepare request filters based on user role
      const requestFilters: ReportFilters = {}
      
      // If a specific branch is selected, use it
      if (branchId) {
        requestFilters.branchId = branchId
      }
      
      // For orphanage admin, always include their centre ID
      if (user?.role === 'orphanage_admin' && user?.publicId) {
        requestFilters.centreId = user.publicId
      }
      
      // For supervisor, they can only see their branch
      if (user?.role === 'supervisor' && user?.publicId) {
        requestFilters.branchId = user.publicId
      }
      
      // Call the API endpoint without specifying format to get JSON data
      const response = await ReportService.generateFundraiserReport(requestFilters)
      
      if (response) {
        // Transform API response to match the chart data structure
        const transformedData: AnalyticsChartData = {
          // Map for chart display
          amounts: transformContributionsByEvent(response.contributionsByEvent) || [],
          status: transformFundraisingStatus(response) || [],
          timeline: transformMonthlyTrends(response.monthlyTrends) || [],
          
          // Additional data for display
          metadata: response.metadata,
          totalAmountRaised: response.totalAmountRaised,
          totalContributions: response.totalContributions,
          uniqueContributors: response.uniqueContributors,
          recurringContributors: response.recurringContributors,
          averageContributionAmount: response.averageContributionAmount,
          topContributors: response.topContributors,
          recentContributions: response.recentContributions,
          contributionsByEvent: response.contributionsByEvent,
          monthlyTrends: response.monthlyTrends
        }
        
        setFundraisingData(transformedData)
        setFundraisingLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching fundraising analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load fundraising analytics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoadingFundraising(false)
    }
  }  
  const fetchVolunteerAnalytics = async () => {
    try {
      setLoadingVolunteers(true)
      
      // Prepare request filters based on user role
      const requestFilters: ReportFilters = {}
      
      // If a specific branch is selected, use it
      if (branchId) {
        requestFilters.branchId = branchId
      }
      
      // For orphanage admin, always include their centre ID
      if (user?.role === 'orphanage_admin' && user?.publicId) {
        requestFilters.centreId = user.publicId
      }
      
      // For supervisor, they can only see their branch
      if (user?.role === 'supervisor' && user?.publicId) {
        requestFilters.branchId = user.publicId
      }
      
      // Ensure we're requesting JSON data
      requestFilters.exportFormat = 'json'
        
      // Call the API endpoint without specifying format to get JSON data
      const response = await ReportService.generateVolunteerReport(requestFilters)
      
      if (response) {
        // Extract the data from the response
        const data = response
        
        console.log('Volunteer data received:', data)
        
        const transformedData: AnalyticsChartData = {
          // Map for chart display
          skills: transformVolunteerSkills(data.volunteersByJobRole ?? {}),
          status: transformVolunteerStatus(data.volunteersByStatus ?? {}),
          hoursByMonth: transformVolunteerHoursByMonth(data.monthlyTrends ?? {}),
          branchDistribution: transformVolunteerBranchDistribution(data.volunteersByBranch ?? {}),
          
          // Additional data for display
          metadata: data.metadata,
          totalVolunteers: data.totalVolunteers ?? 0,
          activeVolunteers: data.activeVolunteers ?? 0,
          pendingVolunteers: data.pendingVolunteers ?? 0,
          approvedVolunteers: data.approvedVolunteers ?? 0,
          rejectedVolunteers: data.rejectedVolunteers ?? 0,
          cancelledVolunteers: data.cancelledVolunteers ?? 0,
          completedVolunteers: data.completedVolunteers ?? 0,
          volunteersByJobRole: data.volunteersByJobRole ?? {},
          volunteersByBranch: data.volunteersByBranch ?? {},
          monthlyTrends: data.monthlyTrends ?? {},
          recentVolunteers: data.recentVolunteers ?? [],
          upcomingSchedules: data.upcomingSchedules ?? [],
          topVolunteersByActivity: data.topVolunteersByActivity ?? []
        }
        
        setVolunteerData(transformedData)
        setVolunteersLoaded(true)
      } else {
        throw new Error('No data received from volunteer analytics API')
      }
    } catch (error) {
      console.error('Error fetching volunteer analytics:', error)
      
      // Generate a fallback dataset with realistic data structure
      const fallbackData: AnalyticsChartData = {
        skills: [
          { name: 'Education', value: 15 },
          { name: 'Healthcare', value: 10 },
          { name: 'Sports', value: 8 },
          { name: 'Arts', value: 12 }
        ],
        status: [
          { name: 'Active', value: 25 },
          { name: 'Inactive', value: 10 },
          { name: 'Pending', value: 5 }
        ],
        hoursByMonth: [
          { name: 'Jan 2025', value: 120 },
          { name: 'Feb 2025', value: 150 },
          { name: 'Mar 2025', value: 180 },
          { name: 'Apr 2025', value: 140 },
          { name: 'May 2025', value: 160 },
          { name: 'Jun 2025', value: 200 }
        ],
        branchDistribution: [
          { name: 'Main Branch', value: 18 },
          { name: 'North Branch', value: 12 },
          { name: 'South Branch', value: 10 }
        ],
        metadata: {
          reportType: 'Volunteers',
          reportScope: 'System',
          scopeDetails: 'All branches',
          generatedAt: new Date().toISOString()
        },
        totalVolunteers: 40,
        activeVolunteers: 25,
        pendingVolunteers: 5,
        approvedVolunteers: 30,
        rejectedVolunteers: 3,
        cancelledVolunteers: 2,
        completedVolunteers: 10,
        volunteersByJobRole: {
          'Education': 15,
          'Healthcare': 10,
          'Sports': 8,
          'Arts': 12
        },
        volunteersByBranch: {
          'Main Branch': 18,
          'North Branch': 12,
          'South Branch': 10
        },
        monthlyTrends: {
          '2025-01': 120,
          '2025-02': 150,
          '2025-03': 180,
          '2025-04': 140,
          '2025-05': 160,
          '2025-06': 200
        },
        recentVolunteers: [
          { fullName: 'Jane Smith', joinDate: '2025-05-15', jobRole: 'Education', status: 'Active' },
          { fullName: 'John Doe', joinDate: '2025-05-20', jobRole: 'Healthcare', status: 'Active' },
          { fullName: 'Alice Johnson', joinDate: '2025-05-25', jobRole: 'Sports', status: 'Pending' }
        ]
      }
      
      setVolunteerData(fallbackData)
      setVolunteersLoaded(true)
      
      toast({
        title: 'Using Sample Data',
        description: 'Unable to load volunteer analytics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoadingVolunteers(false)
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
  
  // Helper functions for Inventory analytics
  const transformCategories = (categoryData: any) => {
    if (!categoryData) return []
    
    return Object.entries(categoryData).map(([category, count]) => ({
      name: category,
      value: Number(count)
    }))
  }
  
  const transformStockStatus = (data: any) => {
    if (!data) return []
    
    return [
      { name: "In Stock", value: data.healthyStockItems || 0 },
      { name: "Low Stock", value: data.lowStockItems || 0 },
      { name: "Out of Stock", value: data.noStockItems || 0 },
    ]
  }
  
  const transformTransactions = (transactions: any[]) => {
    if (!transactions || transactions.length === 0) return []
    
    // Group transactions by date and sum quantities
    const transactionsByDate = transactions.reduce((acc, transaction) => {
      const date = transaction.date
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += Number(transaction.quantity)
      return acc
    }, {})
    
    // Convert to chart format
    return Object.entries(transactionsByDate).map(([date, value]) => ({
      date,
      value
    }))
  }
  
  // Helper functions for Admin analytics
  const transformDepartments = (roleData: any) => {
    if (!roleData) return []
    
    return Object.entries(roleData).map(([role, count]) => {
      let displayName = role      // Map role names to user-friendly department names
      if (role === 'ROLE_SUPERVISOR') displayName = 'Supervisors'
      else if (role === 'ROLE_ORPHANAGE_ADMIN') displayName = 'Orphanage Admins'
      else if (role === 'ROLE_SUPER_ADMIN') displayName = 'Super Admins'
      else if (role === 'ROLE_ADMIN') displayName = 'Administrators'
      
      return {
        name: displayName,
        value: Number(count) || 0
      }
    })
  }
  
  const transformAdminStatus = (statistics: any) => {
    if (!statistics) return []
    
    return [
      { name: 'Active', value: statistics.activeAdmins || 0 },
      { name: 'Suspended', value: statistics.suspendedAdmins || 0 }
    ]
  }
  
  const transformAdminRoles = (statistics: any) => {
    if (!statistics) return []
      return [
      { name: 'Supervisors', value: statistics.supervisors || 0 },
      { name: 'Orphanage Admins', value: statistics.orphanageAdmins || 0 },
      { name: 'Super Admins', value: statistics.superAdmins || 0 }
    ]
  }

  // Helper functions for Fundraising analytics
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
    const transformFundraisingStatus = (response: any) => {
    if (!response.eventsByStatus) return []
    
    return Object.entries(response.eventsByStatus).map(([status, count]) => {
      let displayName = status
      if (status === 'PENDING') displayName = 'Pending'
      else if (status === 'APPROVED') displayName = 'Approved'
      else if (status === 'ACTIVE') displayName = 'Active'
      else if (status === 'COMPLETED') displayName = 'Completed'
      else if (status === 'REJECTED') displayName = 'Rejected'
      else if (status === 'CANCELLED') displayName = 'Cancelled'
      
      return {
        name: displayName,
        value: Number(count)
      }
    }).filter(item => item.value > 0) // Only include items with values > 0
  }
  // Helper functions for Volunteer analytics
  const transformVolunteerSkills = (skillsData: Record<string, number>) => {
    if (!skillsData || Object.keys(skillsData).length === 0) return []
    
    return Object.entries(skillsData).map(([skill, count]) => ({
      name: skill,
      value: Number(count)
    }))
  }
  
  const transformVolunteerStatus = (statusData: Record<string, number>) => {
    if (!statusData || Object.keys(statusData).length === 0) return []
    
    return Object.entries(statusData).map(([status, count]) => {
      let displayName = status
      if (status === 'ACTIVE') displayName = 'Active'
      else if (status === 'INACTIVE') displayName = 'Inactive'
      else if (status === 'PENDING') displayName = 'Pending'
        return {
        name: displayName,
        value: Number(count)
      }
    })
  }
  
  const transformVolunteerHoursByMonth = (hoursData: Record<string, number>) => {
    if (!hoursData || Object.keys(hoursData).length === 0) return []
    
    return Object.entries(hoursData).map(([month, hours]) => {
      // Convert YYYY-MM format to more readable format
      const date = new Date(month + '-01')
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      return {
        name: monthName,
        value: Number(hours)
      }
    })
  }
  
  const transformVolunteerBranchDistribution = (branchData: Record<string, number>) => {
    if (!branchData || Object.keys(branchData).length === 0) return []
    
    return Object.entries(branchData).map(([branchName, count]) => ({
      name: branchName,
      value: Number(count)
    }))
  }

  // Get the current data and loading state based on the active tab
  const { data, loading } = getCurrentData();
  return { 
    analyticsData: data, 
    loading, 
    refetch: () => {
      if (reportType === 'orphans') {
        return fetchOrphanAnalytics()
      } else if (reportType === 'inventory') {
        return fetchInventoryAnalytics()
      } else if (reportType === 'staff') {
        return fetchAdminAnalytics()
      } else if (reportType === 'fundraising') {
        return fetchFundraisingAnalytics()
      } else if (reportType === 'volunteers') {
        return fetchVolunteerAnalytics()
      }
    }
  }
}
