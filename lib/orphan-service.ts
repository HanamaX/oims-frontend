import API, { getErrorMessage } from "./api-service"
import { Orphan } from "./orphan-types"

export interface OrphanCreateRequest {
  fullName: string
  dateOfBirth: string
  gender: string
  background: string
  branchPublicId?: string
  educationLevel?: string
  imageUrl?: string
}

export interface OrphanUpdateRequest {
  orphanPublicId: string
  fullName: string
  dateOfBirth: string
  gender: string
  background: string
  educationLevel?: string
  imageUrl?: string
  origin?: string
  religion?: string
  bloodGroup?: string
  specialNeeds?: string
  hobbies?: string
  allergies?: string[]
}

const OrphanService = {
  createOrphan: async (orphanData: OrphanCreateRequest): Promise<Orphan> => {
    try {
      const response = await API.post<Orphan>("/app/oims/orphans/addorphan", orphanData)
      return response.data
    } catch (error: any) {
      console.error("Create orphan error:", error)
      // Enhance error with a more specific message
      error.friendlyMessage = `Failed to create orphan: ${getErrorMessage(error)}`
      throw error
    }
  },

  uploadOrphanPhoto: async (orphanPublicId: string, file: File): Promise<void> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      await API.post(`/app/oims/orphans/orphanimage/${orphanPublicId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error: any) {
      console.error("Upload orphan photo error:", error)
      error.friendlyMessage = `Failed to upload orphan photo: ${getErrorMessage(error)}`
      throw error
    }
  },

  getOrphansByBranch: async (branchPublicId: string): Promise<Orphan[]> => {
    try {
      const response = await API.get<Orphan[]>(`/app/oims/orphans/branch/${branchPublicId}`)
      return response.data
    } catch (error: any) {
      console.error("Get orphans by branch error:", error)
      error.friendlyMessage = `Failed to fetch orphans for this branch: ${getErrorMessage(error)}`
      throw error
    }
  },

  getCurrentBranchOrphans: async (): Promise<Orphan[]> => {
    try {
      const response = await API.get<Orphan[]>("/app/oims/orphans/branch/current")
      return response.data
    } catch (error: any) {
      console.error("Get current branch orphans error:", error)
      error.friendlyMessage = `Failed to fetch orphans for your branch: ${getErrorMessage(error)}`
      throw error
    }
  },

  getOrphanById: async (orphanPublicId: string): Promise<Orphan> => {
    try {
      const response = await API.get<Orphan>(`/app/oims/orphans/orphan/${orphanPublicId}`)
      return response.data
    } catch (error: any) {
      console.error("Get orphan by ID error:", error)
      error.friendlyMessage = `Failed to fetch orphan details: ${getErrorMessage(error)}`
      throw error
    }
  },

  getAllOrphans: async (): Promise<Orphan[]> => {
    try {
      const response = await API.get<Orphan[]>("/app/oims/orphans/centre/all")
      
      // Log the structure of the response for debugging
      if (process.env.NODE_ENV === 'development') {
        console.debug("All orphans API response structure:", {
          hasData: Boolean(response.data),
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          length: Array.isArray(response.data) ? response.data.length : 'not an array',
        });
      }
      
      return response.data
    } catch (error: any) {
      console.error("Get all orphans error:", error)
      error.friendlyMessage = `Failed to fetch all orphans: ${getErrorMessage(error)}`
      throw error
    }
  },

  updateOrphan: async (orphanData: OrphanUpdateRequest): Promise<Orphan> => {
    try {
      // Validate required fields before making API request
      if (!orphanData.orphanPublicId) {
        throw new Error("Orphan ID is required for updates");
      }
      
      console.debug("Updating orphan with data:", orphanData);
      console.log(orphanData)
      const response = await API.patch<Orphan>("/app/oims/orphans/updateorphan", orphanData)
      return response.data
    } catch (error: any) {
      console.error("Update orphan error:", error)
      error.friendlyMessage = `Failed to update orphan information: ${getErrorMessage(error)}`
      throw error
    }
  },

  deleteOrphan: async (orphanPublicId: string): Promise<void> => {
    try {
      if (!orphanPublicId) {
        throw new Error("Orphan ID is required for deletion");
      }
      
      console.debug(`Deleting orphan with ID: ${orphanPublicId}`);
      await API.delete(`/app/oims/orphans/delorphan/${orphanPublicId}`)
    } catch (error: any) {
      console.error("Delete orphan error:", error)
      error.friendlyMessage = `Failed to delete orphan: ${getErrorMessage(error)}`
      throw error
    }
  },
}

export default OrphanService
