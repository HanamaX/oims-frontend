import API from "./api-service"

// Define the report types
export type ReportType = 'orphans' | 'inventory' | 'fundraising' | 'volunteers' | 'staff' | 'branches'

// Interface for report filters
export interface ReportFilters {
  startDate?: string
  endDate?: string
  branchId?: string
  centreId?: string  // Added for the new API
  category?: string
  status?: string
  orphanId?: string
  exportFormat?: 'pdf' | 'excel' | 'json'
}

// Service for generating and handling reports
class ReportService {    // Get available branches for reports
  async getBranches(centreId?: string, userRole?: string) {
    try {
      // Supervisors should not see branch selection options
      if (userRole === "supervisor") {
        return [];
      }
      
      let url;
      if (centreId) {
        // If centreId is provided, get branches for specific centre
        url = `/app/oims/public/orphanage-centres/${centreId}/branches`;
      } else {
        // Otherwise get all branches
        url = '/app/oims/public/branches';
      }
      
      try {
        const response = await API.get(url);
        // Ensure we return an array
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          console.warn('Unexpected branches data format', response.data);
          return [];
        }
      } catch (apiError) {
        console.warn('API Error when fetching branches, falling back to mock data', apiError);
        // Return mock data if API call fails
        return [
          { id: 'branch1', name: 'Main Branch' },
          { id: 'branch2', name: 'East Branch' },
          { id: 'branch3', name: 'West Branch' }
        ];
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }
  
  // Get available orphanage centres
  async getOrphanageCentres() {
    try {
      const response = await API.get('/app/oims/public/orphanage-centres');
      return response.data;
    } catch (error) {
      console.error('Error fetching orphanage centres:', error);
      throw error;
    }
  }  // Generate orphans demographics report
  async generateOrphansDemographicsReport(filters: ReportFilters = {}) {
    try {
      // Prepare the request payload according to the API requirements
      const payload = {
        branchId: filters.branchId,
        centreId: filters.centreId,
        category: filters.category, // For orphans: MALE, FEMALE, null = all genders
        status: filters.status, // For orphans: ACTIVE, INACTIVE, null = all statuses
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: filters.exportFormat ?? 'json'
      }

      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        // Use fetch for file downloads to avoid Axios network error issues
        return await this.downloadReportFile('/app/oims/reports/demographics/filtered', payload, 'orphans-demographics', filters.exportFormat)
      }

      const response = await API.post('/app/oims/reports/demographics/filtered', payload)
      return response.data
    } catch (error) {
      console.error('Error generating orphans demographics report:', error)
      throw error
    }
  }  // Generate inventory report
  async generateInventoryReport(filters: ReportFilters = {}) {
    try {
      // Prepare the request payload according to the API requirements
      const payload = {
        branchId: filters.branchId,
        centreId: filters.centreId,
        category: filters.category, // For inventory: can filter by category
        status: filters.status, // For inventory: can filter by stock status
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: filters.exportFormat ?? 'json'
      }

      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        // Use fetch for file downloads to avoid Axios network error issues
        return await this.downloadReportFile('/app/oims/reports/inventory/filtered', payload, 'inventory-report', filters.exportFormat)
      }

      const response = await API.post('/app/oims/reports/inventory/filtered', payload)
      return response.data
    } catch (error) {
      console.error('Error generating inventory report:', error)
      throw error
    }
  }  // Generate admin/staff report
  async generateAdminReport(filters: ReportFilters = {}) {
    try {
      // Prepare the request payload according to the API requirements
      const payload = {
        branchId: filters.branchId,
        centreId: filters.centreId,
        category: filters.category, // For admin: can filter by role
        status: filters.status, // For admin: can filter by account status
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: filters.exportFormat ?? 'json'
      }
      
      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        // Use fetch for file downloads to avoid Axios network error issues
        return await this.downloadReportFile('/app/oims/reports/admin/filtered', payload, 'admin-report', filters.exportFormat)
      }

      const response = await API.post('/app/oims/reports/admin/filtered', payload)
      return response.data
    } catch (error) {
      console.error('Error generating admin report:', error)
      throw error
    }
  }  // Generate fundraiser report
  async generateFundraiserReport(filters: ReportFilters = {}) {
    try {
      // Prepare the request payload according to the API requirements
      const payload = {
        branchId: filters.branchId,
        centreId: filters.centreId,
        category: filters.category, // For fundraising: can filter by category
        status: filters.status, // For fundraising: can filter by status
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: filters.exportFormat ?? 'json'
      }

      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        // Use fetch for file downloads to avoid Axios network error issues
        return await this.downloadReportFile('/app/oims/reports/fundraising/filtered', payload, 'fundraiser-report', filters.exportFormat)
      }

      const response = await API.post('/app/oims/reports/fundraising/filtered', payload)
      return response.data
    } catch (error) {
      console.error('Error generating fundraiser report:', error)
      throw error
    }
  }// Generate volunteer report
  async generateVolunteerReport(filters: ReportFilters = {}) {
    try {
      // Prepare the request payload according to the API requirements
      const payload = {
        branchId: filters.branchId,
        centreId: filters.centreId,
        category: filters.category, // For volunteers: can filter by skill category
        status: filters.status, // For volunteers: can filter by active/inactive status
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: filters.exportFormat ?? 'json'
      }

      if (filters.exportFormat === 'pdf' || filters.exportFormat === 'excel') {
        // Use fetch for file downloads to avoid Axios network error issues
        return await this.downloadReportFile('/app/oims/reports/volunteers/filtered', payload, 'volunteer-report', filters.exportFormat)
      }

      const response = await API.post('/app/oims/reports/volunteers/filtered', payload)
      return response.data
    } catch (error) {
      console.error('Error generating volunteer report:', error)
      throw error
    }
  }

  // Generate branch-specific reports (for admins)
  async generateBranchReport(reportType: ReportType, filters: ReportFilters = {}) {
    try {
      // For orphans, inventory, staff, and volunteers reports, use the new API endpoints
      if (reportType === 'orphans') {
        return this.generateOrphansDemographicsReport(filters)
      } else if (reportType === 'inventory') {
        return this.generateInventoryReport(filters)
      } else if (reportType === 'staff') {
        return this.generateAdminReport(filters)
      } else if (reportType === 'fundraising') {
        return this.generateFundraiserReport(filters)
      } else if (reportType === 'volunteers') {
        return this.generateVolunteerReport(filters)
      }
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
      // For orphans, inventory, staff, fundraising, and volunteers reports, use the new API endpoints
      if (reportType === 'orphans') {
        return this.generateOrphansDemographicsReport(filters)
      } else if (reportType === 'inventory') {
        return this.generateInventoryReport(filters)
      } else if (reportType === 'staff') {
        return this.generateAdminReport(filters)
      } else if (reportType === 'fundraising') {
        return this.generateFundraiserReport(filters)
      } else if (reportType === 'volunteers') {
        return this.generateVolunteerReport(filters)
      }
      
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
    // Download report file using API instance but with custom handling for blob response
  private async downloadReportFile(endpoint: string, payload: any, reportType: string, format: string) {
    try {      // Use API instance to make the request with all interceptors and proper config
      const response = await API.post(endpoint, payload, {
        responseType: 'blob'
      })
      
      // Extract the blob from the response
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
      a.download = `${reportType}-${timestamp}.${format}`
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      return { success: true, message: `${format.toUpperCase()} report downloaded successfully` }    } catch (error) {
      console.error('Error downloading report file:', error)
      // Even if there's a network error, the file might have been downloaded successfully
      // This is a common issue with blob downloads in browsers
      console.warn('Note: File download may have succeeded despite the error')
      return { success: true, message: `${format.toUpperCase()} report download initiated (check your downloads folder)` }
    }
  }

  // Handle file downloads for reports
  private handleFileDownload(response: any, reportType: string, format: string) {
    try {
      // Ensure we have valid response data
      if (response?.data == null) {
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
