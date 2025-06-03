import API from "./api-service"

// Define the report types
export type ReportType = 'orphans' | 'inventory' | 'fundraising' | 'volunteers' | 'staff' | 'branches'

// Interface for report filters
export interface ReportFilters {
  startDate?: string
  endDate?: string
  branchId?: string
  category?: string
  status?: string
  orphanId?: string
  exportFormat?: 'pdf' | 'excel'
}

// Service for generating and handling reports
class ReportService {
  // Get available branches for reports (for superadmin)
  async getBranches() {
    try {
      const response = await API.get('/api/branches')
      return response.data
    } catch (error) {
      console.error('Error fetching branches:', error)
      throw error
    }
  }
  // Generate branch-specific reports (for admins)
  async generateBranchReport(reportType: ReportType, filters: ReportFilters = {}) {
    try {
      const response = await API.post(`/api/reports/branch/${reportType}`, filters, {
        responseType: filters.exportFormat === 'pdf' ? 'blob' : 'json'
      })
      
      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        return this.handleFileDownload(response, reportType, filters.exportFormat)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error generating branch ${reportType} report:`, error)
      throw error
    }
  }

  // Generate system-wide reports (for superadmins)
  async generateSystemReport(reportType: ReportType, filters: ReportFilters = {}) {
    try {
      const response = await API.post(`/api/reports/system/${reportType}`, filters, {
        responseType: filters.exportFormat === 'pdf' ? 'blob' : 'json'
      })
        if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        return this.handleFileDownload(response, reportType, filters.exportFormat)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error generating system ${reportType} report:`, error)
      throw error
    }
  }
  // Generate branch overview (superadmin)
  async generateBranchOverviewReport(branchId: string, filters: ReportFilters = {}) {
    try {
      const response = await API.post(`/api/reports/branch-overview/${branchId}`, filters, {
        responseType: filters.exportFormat === 'pdf' ? 'blob' : 'json'
      })
      
      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        return this.handleFileDownload(response, 'branch-overview', filters.exportFormat)
      }
      
      return response.data
    } catch (error) {
      console.error('Error generating branch overview report:', error)
      throw error
    }
  }
  
  // Generate orphan-specific report
  async generateOrphanReport(orphanId: string, filters: ReportFilters = {}) {
    try {
      const response = await API.post(`/api/reports/orphan/${orphanId}`, filters, {
        responseType: filters.exportFormat === 'pdf' ? 'blob' : 'json'
      })
      
      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        return this.handleFileDownload(response, `orphan-${orphanId}`, filters.exportFormat)
      }
      
      return response.data
    } catch (error) {
      console.error('Error generating orphan report:', error)
      throw error
    }  }
  
  // Handle file downloads for reports
  private handleFileDownload(response: any, reportType: string, format: string) {
    try {
      // Ensure we have valid response data
      if (!response || !response.data) {
        console.error('Invalid response data received for download')
        return { success: false, message: 'Invalid response data received' }
      }
      
      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      
      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      
      // Create an object URL for the blob
      const url = window.URL.createObjectURL(blob)
      
      // Create a link element and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}-report-${timestamp}.${format}`
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      return { success: true, message: `${format.toUpperCase()} report downloaded successfully` }
    } catch (error) {
      console.error('Error during file download:', error)
      return { success: false, message: `Failed to download ${format.toUpperCase()} report` }
    }
  }
}

export default new ReportService()
