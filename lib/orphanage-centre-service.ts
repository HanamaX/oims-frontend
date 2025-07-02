import API from "./api-service"

// Define the OrphanageCentre interface based on the API response
export interface OrphanageCentre {
  publicId: string
  name: string
  location: string
  address: string | null
  phoneNumber: string
  email: string
  description: string | null
  isActive: boolean
  exitReason: string | null
  exitDate: string | null
  createdDate: string
  lastModifiedDate: string
  certificateUrl: string | null
  certificateFileName: string | null
  originatingRequest: string | null
  admins?: OrphanageCentreAdmin[]
}

export interface OrphanageCentreAdmin {
  publicId: string
  fullName: string
  username: string
  email: string
  phone: string
  sex: string | null
  imageUrl: string | null
  roles: string[]
  branchPublicId: string | null
  branchName: string | null
  orphanageCentrePublicId: string | null
  orphanageCentreName: string | null
  enabled: boolean
  accountNonLocked: boolean
}

export interface UpdateOrphanageCentreStatusRequest {
  centrePublicId: string
  isActive: boolean
  reason?: string // Required when deactivating
}

export interface LeaveRequestSubmitRequest {
  reason: string
}

export interface LeaveRequestProcessRequest {
  approved: boolean
  rejectionReason?: string
}

// Service for handling orphanage centre operations
const OrphanageCentreService = {
  // Get all orphanage centres
  getAllCentres: async (): Promise<OrphanageCentre[]> => {
    try {
      const response = await API.get('/app/oims/superuser/orphanages')
      return response.data?.data ?? []
    } catch (error) {
      console.error("Error fetching orphanage centres:", error)
      throw error
    }
  },

  // Get a single orphanage centre by ID
  getCentreById: async (centreId: string): Promise<OrphanageCentre | null> => {
    try {
      const response = await API.get(`/app/oims/superuser/orphanages/${centreId}`)
      return response.data?.data ?? null
    } catch (error) {
      console.error(`Error fetching orphanage centre with ID ${centreId}:`, error)
      throw error
    }
  },

  // Update orphanage centre status
  updateCentreStatus: async (centreId: string, isActive: boolean, reason?: string): Promise<void> => {
    try {
      const request: UpdateOrphanageCentreStatusRequest = {
        centrePublicId: centreId,
        isActive,
        reason: !isActive ? reason : undefined // Only include reason when deactivating
      }
      
      await API.patch('/app/oims/superuser/orphanages/status', request)
    } catch (error) {
      console.error(`Error updating status for orphanage centre ${centreId}:`, error)
      throw error
    }
  },

  // Submit a leave request for an orphanage centre
  submitLeaveRequest: async (centreId: string, reason: string): Promise<void> => {
    try {
      const request: LeaveRequestSubmitRequest = { reason }
      await API.post(`/app/oims/superuser/orphanages/${centreId}/leave-request`, request)
    } catch (error) {
      console.error(`Error submitting leave request for orphanage centre ${centreId}:`, error)
      throw error
    }
  },

  // Process (approve/reject) a leave request
  processLeaveRequest: async (
    centreId: string, 
    approved: boolean, 
    rejectionReason?: string
  ): Promise<void> => {
    try {
      const request: LeaveRequestProcessRequest = { 
        approved,
        rejectionReason
      }
      await API.post(`/app/oims/superuser/orphanages/${centreId}/process-leave-request`, request)
    } catch (error) {
      console.error(`Error processing leave request for orphanage centre ${centreId}:`, error)
      throw error
    }
  }
}

export default OrphanageCentreService
