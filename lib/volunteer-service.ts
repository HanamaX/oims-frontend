import API from "./api-service"

// Status enum for volunteer status changes
export enum EventStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

// Request interface for volunteer status change
export interface VolunteerStatusChangeRequest {
  volunteerId: string
  status: EventStatus
  reason?: string
}

export interface Volunteer {
  publicId: string
  firstName?: string
  lastName?: string
  name?: string  // For current volunteers response
  email?: string
  phoneNumber: string
  skills?: string
  availability?: string
  status: string
  scheduledDate?: string
  jobRole?: string
  branchPublicId: string
  branchName?: string
  reason?: string // For rejection reason
  inactiveReason?: string // Alternative field name for rejection reason
}

export interface CurrentVolunteerResponse {
  publicId: string
  name: string
  email?: string
  phoneNumber: string
  status: string
  scheduledDate: string
  jobRole: string
  branchPublicId: string
  branchName: string
  createdAt?: string
  reason?: string // For rejection reason
  inactiveReason?: string // Alternative field name for rejection reason
}

export interface VolunteerCreateRequest {
  name: string
  email: string
  phoneNumber: string
  scheduledDate?: string
  jobRole: string
  branchPublicId: string
}

export interface Centre {
  publicId: string
  name: string
  location?: string
}

export interface Branch {
  publicId: string
  name: string
  location?: string
}

const VolunteerService = {
  registerVolunteer: async (volunteerData: VolunteerCreateRequest): Promise<Volunteer> => {
    try {
      const response = await API.post<Volunteer>("/app/oims/events/volunteers", volunteerData)
      return response.data
    } catch (error) {
      console.error("Register volunteer error:", error)
      throw error
    }
  },

  getCentres: async (): Promise<Centre[]> => {
    try {
      const response = await API.get("/app/oims/public/orphanage-centres")
      console.log("Centres response:", response.data)
      // Check if response.data is an array or if it has a data/content property containing the array
      if (Array.isArray(response.data)) {
        return response.data
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data
      } else if (Array.isArray(response.data?.content)) {
        return response.data.content
      } else {
        console.error("Unexpected centres response format:", response.data)
        return [] // Return empty array as fallback
      }
    } catch (error) {
      console.error("Get centres error:", error)
      return [] // Return empty array on error
    }
  },

  getBranchesByCentre: async (centrePublicId: string): Promise<Branch[]> => {
    try {
      const response = await API.get(`/app/oims/public/orphanage-centres/${centrePublicId}/branches`)
      console.log("Branches by centre response:", response.data)
      // Check if response.data is an array or if it has a data/content property containing the array
      if (Array.isArray(response.data)) {
        return response.data
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data
      } else if (Array.isArray(response.data?.content)) {
        return response.data.content
      } else {
        console.error("Unexpected branches by centre response format:", response.data)
        return [] // Return empty array as fallback
      }
    } catch (error) {
      console.error("Get branches by centre error:", error)
      return [] // Return empty array on error
    }
  },

  getBranches: async (): Promise<Branch[]> => {
    try {
      const response = await API.get("/app/oims/public/branches")
      console.log("Branches response:", response.data)
      // Check if response.data is an array or if it has a data/content property containing the array
      if (Array.isArray(response.data)) {
        return response.data
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data
      } else if (Array.isArray(response.data?.content)) {
        return response.data.content
      } else {
        console.error("Unexpected branches response format:", response.data)
        return [] // Return empty array as fallback
      }
    } catch (error) {
      console.error("Get branches error:", error)
      return [] // Return empty array on error
    }
  },

  getVolunteersByBranch: async (branchId: string): Promise<Volunteer[]> => {
    try {
      const response = await API.get<Volunteer[]>(`/app/oims/events/volunteers/${branchId}`)
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const volunteers = response.data.map(volunteer => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (volunteer.inactiveReason && !volunteer.reason) {
          return {
            ...volunteer,
            reason: volunteer.inactiveReason
          };
        }
        return volunteer;
      });
      
      return volunteers;
    } catch (error) {
      console.error("Get volunteers by branch error:", error)
      throw error
    }
  },

  getVolunteerById: async (volunteerId: string): Promise<Volunteer> => {
    try {
      const response = await API.get<Volunteer>(`/app/oims/events/volunteers/detail/${volunteerId}`)
      const volunteer = response.data;
      
      // If the API returns inactiveReason but not reason, map inactiveReason to reason
      if (volunteer.inactiveReason && !volunteer.reason) {
        return {
          ...volunteer,
          reason: volunteer.inactiveReason
        };
      }
      
      return volunteer;
    } catch (error) {
      console.error("Get volunteer by ID error:", error)
      throw error
    }
  },

  getCentreVolunteers: async (centreId: string): Promise<Volunteer[]> => {
    try {
      const response = await API.get<Volunteer[]>(`/app/oims/events/volunteers/centre/${centreId}`)
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const volunteers = response.data.map(volunteer => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (volunteer.inactiveReason && !volunteer.reason) {
          return {
            ...volunteer,
            reason: volunteer.inactiveReason
          };
        }
        return volunteer;
      });
      
      return volunteers;
    } catch (error) {
      console.error("Get centre volunteers error:", error)
      throw error
    }
  },

  updateVolunteerStatus: async (volunteerId: string, status: EventStatus, reason?: string): Promise<void> => {
    try {
      const payload: VolunteerStatusChangeRequest = {
        volunteerId,
        status
      }
      
      // Only include reason if status is REJECTED or if reason is explicitly provided
      if (status === EventStatus.REJECTED || reason) {
        payload.reason = reason ?? "No reason provided";
      }
      
      await API.patch(`/oims/events/volunteers/status`, payload)
    } catch (error) {
      console.error("Update volunteer status error:", error)
      throw error
    }
  },

  // Direct deletion is discouraged - use status change instead with EventStatus.REJECTED
  deleteVolunteer: async (volunteerId: string): Promise<void> => {
    try {
      // Instead of direct deletion, use rejection with a standard reason
      console.log(`Deletion requested for volunteer ${volunteerId} - using rejection instead`);
      
      // Call the rejectVolunteer method with a standard reason for deletion requests
      await VolunteerService.updateVolunteerStatus(
        volunteerId, 
        EventStatus.REJECTED, 
        "Removal requested by supervisor"
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error("Delete volunteer error:", error)
      throw error
    }
  },
  
  // Helper method to approve a volunteer
  approveVolunteer: async (volunteerId: string): Promise<void> => {
    return VolunteerService.updateVolunteerStatus(volunteerId, EventStatus.APPROVED);
  },
  
  // Helper method to reject a volunteer with a reason
  rejectVolunteer: async (volunteerId: string, reason: string): Promise<void> => {
    if (!reason || reason.trim() === '') {
      throw new Error("A reason is required when rejecting a volunteer");
    }
    return VolunteerService.updateVolunteerStatus(volunteerId, EventStatus.REJECTED, reason);
  },

  getCurrentVolunteers: async (): Promise<CurrentVolunteerResponse[]> => {
    try {
      const response = await API.get<{data: CurrentVolunteerResponse[], message: string, status: string}>("/app/oims/events/volunteers/current")
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const volunteers = response.data.data.map(volunteer => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (volunteer.inactiveReason && !volunteer.reason) {
          return {
            ...volunteer,
            reason: volunteer.inactiveReason
          };
        }
        return volunteer;
      });
      
      return volunteers;
    } catch (error) {
      console.error("Get current volunteers error:", error)
      throw error
    }
  },
}

export default VolunteerService
