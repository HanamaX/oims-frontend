import API from "./api-service"

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
}

export interface VolunteerCreateRequest {
  name: string
  email: string
  phoneNumber: string
  scheduledDate?: string
  jobRole: string
  branchPublicId: string
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
      return response.data
    } catch (error) {
      console.error("Get volunteers by branch error:", error)
      throw error
    }
  },

  getVolunteerById: async (volunteerId: string): Promise<Volunteer> => {
    try {
      const response = await API.get<Volunteer>(`/app/oims/events/volunteers/detail/${volunteerId}`)
      return response.data
    } catch (error) {
      console.error("Get volunteer by ID error:", error)
      throw error
    }
  },

  getCentreVolunteers: async (centreId: string): Promise<Volunteer[]> => {
    try {
      const response = await API.get<Volunteer[]>(`/app/oims/events/volunteers/centre/${centreId}`)
      return response.data
    } catch (error) {
      console.error("Get centre volunteers error:", error)
      throw error
    }
  },

  updateVolunteerStatus: async (volunteerId: string, status: string): Promise<void> => {
    try {
      await API.patch(`/app/oims/events/volunteers/${volunteerId}/status?status=${status}`)
    } catch (error) {
      console.error("Update volunteer status error:", error)
      throw error
    }
  },

  deleteVolunteer: async (volunteerId: string): Promise<void> => {
    try {
      await API.delete(`/app/oims/events/volunteers/${volunteerId}`)
    } catch (error) {
      console.error("Delete volunteer error:", error)
      throw error
    }
  },

  getCurrentVolunteers: async (): Promise<CurrentVolunteerResponse[]> => {
    try {
      const response = await API.get<{data: CurrentVolunteerResponse[], message: string, status: string}>("/app/oims/events/volunteers/current")
      return response.data.data
    } catch (error) {
      console.error("Get current volunteers error:", error)
      throw error
    }
  },
}

export default VolunteerService
