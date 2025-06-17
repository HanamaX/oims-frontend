import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import ReportService, { ReportFilters } from '@/lib/report-service'
import { useToast } from '@/hooks/use-toast'

interface InventoryReportDataHookProps {
  branchId?: string
  centreId?: string
  startDate?: string
  endDate?: string
}

interface ChartDataItem {
  name: string
  value: number
}

interface InventoryChartData {
  categories: ChartDataItem[]
  stockStatus: ChartDataItem[]
  transactions: ChartDataItem[]
  metadata?: any
  items?: any[]
  recentTransactions?: any[]
  totalItems?: number
  lowStockItems?: number
  noStockItems?: number
  healthyStockItems?: number
  totalInventoryValue?: number
  averageItemValue?: number
  transactionsByType?: Record<string, number>
  // Additional fields from API response
  itemsByCategory?: Record<string, number>
  valueByCategory?: Record<string, number>
  transactionsByDate?: Record<string, number>
  topItems?: any[]
  criticalItems?: any[]
}

export function useInventoryReportData({ branchId, centreId, startDate, endDate }: InventoryReportDataHookProps = {}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [inventoryData, setInventoryData] = useState<InventoryChartData>({
    categories: [],
    stockStatus: [],
    transactions: []
  })

  useEffect(() => {
    fetchInventoryData()
  }, [branchId, centreId, startDate, endDate])
  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      
      // Determine filters based on user role and provided parameters
      const requestFilters: ReportFilters = {
        exportFormat: 'json'
      }
      
      // Add date range filters if provided
      if (startDate) requestFilters.startDate = startDate
      if (endDate) requestFilters.endDate = endDate
      

        // Call the new API endpoint
      const response = await ReportService.generateInventoryReport(requestFilters)
      console.log('Inventory data response:', response)
      
      if (response?.data) {        // Extract the data from the response - handle both direct data and nested data structure
        const data = response.data.data ?? response.data
        
        // Transform API response to match the chart data structure expected by ReportStats
        const transformedData: InventoryChartData = {
          // Transform category data - prioritize itemsByCategory, fallback to categories
          categories: Object.entries(data.itemsByCategory ?? data.categories ?? {}).map(([category, count]) => ({
            name: category,
            value: Number(count)
          })),
          
          // Transform stock status data
          stockStatus: [
            { name: "In Stock", value: data.healthyStockItems ?? 0 },
            { name: "Low Stock", value: data.lowStockItems ?? 0 },
            { name: "Out of Stock", value: data.noStockItems ?? 0 },
          ],
          
          // Transform transaction data - use recentTransactions or transactionsByDate
          transactions: data.recentTransactions?.map((transaction: any, index: number) => ({
            date: transaction.date,
            value: Number(transaction.quantity)
          })) ?? Object.entries(data.transactionsByDate ?? {}).map(([date, count]) => ({
            date: date,
            value: Number(count)
          })) ?? [],
          
          // Include all available metadata and fields from API response
          metadata: data.metadata,
          items: data.items,
          recentTransactions: data.recentTransactions,
          totalItems: data.totalItems,
          lowStockItems: data.lowStockItems,
          noStockItems: data.noStockItems,
          healthyStockItems: data.healthyStockItems,
          totalInventoryValue: data.totalInventoryValue,
          averageItemValue: data.averageItemValue,
          transactionsByType: data.transactionsByType,
          itemsByCategory: data.itemsByCategory,
          valueByCategory: data.valueByCategory,
          transactionsByDate: data.transactionsByDate,
          topItems: data.topItems,
          criticalItems: data.criticalItems
        }
        
        setInventoryData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load inventory statistics. Using sample data instead.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return { inventoryData, loading, refetch: fetchInventoryData }
}
