import API, { getErrorMessage } from "./api-service"
import { Orphan } from "./orphan-types"

export interface OrphanCreateRequest {
  origin: string
  fullName: string
  dateOfBirth: string
  religion: string
  adoptionReason: string
  gender: string
  bloodGroup: string
  allergies: string[]
  medicalHistory: string
  specialNeeds: string
  hobbies: string
  educationLevel: string
  previousSchoolName: string
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

export interface OrphanStatusChangeRequest {
  orphanPublicId: string
  reason: string
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
      
      // Ensure all orphans have a status property, defaulting to "active" if not specified
      const orphansWithStatus = Array.isArray(response.data) ? response.data.map(orphan => ({
        ...orphan,
        status: orphan.status ?? "active"
      })) : [];
      
      return orphansWithStatus
    } catch (error: any) {
      console.error("Get all orphans error:", error)
      error.friendlyMessage = `Failed to fetch all orphans: ${getErrorMessage(error)}`
      throw error
    }
  },
  
  // Get the status of an orphan
  getOrphanStatus: async (orphanPublicId: string): Promise<string> => {
    try {
      const orphan = await OrphanService.getOrphanById(orphanPublicId)
      // Return the status if it exists, otherwise default to "active"
      return orphan.status ?? "active"
    } catch (error: any) {
      console.error("Get orphan status error:", error)
      error.friendlyMessage = `Failed to get orphan status: ${getErrorMessage(error)}`
      throw error
    }
  },

  // Get all orphans filtered by status
  getOrphansByStatus: async (status: string): Promise<Orphan[]> => {
    try {
      const allOrphans = await OrphanService.getAllOrphans();
      return allOrphans.filter(orphan => 
        (orphan.status ?? "active").toLowerCase() === status.toLowerCase()
      );
    } catch (error: any) {
      console.error("Get orphans by status error:", error);
      error.friendlyMessage = `Failed to fetch orphans with status ${status}: ${getErrorMessage(error)}`;
      throw error;
    }
  },
  
  // Check if an orphan is active
  isOrphanActive: async (orphanPublicId: string): Promise<boolean> => {
    try {
      const status = await OrphanService.getOrphanStatus(orphanPublicId);
      return status.toLowerCase() === "active";
    } catch (error: any) {
      console.error("Check orphan active status error:", error);
      error.friendlyMessage = `Failed to check if orphan is active: ${getErrorMessage(error)}`;
      throw error;
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

  // Activate an orphan (set status to active)
  activateOrphan: async (orphanPublicId: string, reason: string): Promise<void> => {
    try {
      if (!orphanPublicId) {
        throw new Error("Orphan ID is required for activation");
      }
      
      if (!reason || reason.trim() === '') {
        throw new Error("Reason is required for orphan activation");
      }
      
      const payload: OrphanStatusChangeRequest = {
        orphanPublicId,
        reason: reason
      }
      
      await API.patch("/app/oims/orphans/reactivate", payload)
      console.log(`Orphan ${orphanPublicId} has been activated`)
    } catch (error: any) {
      console.error("Activate orphan error:", error)
      error.friendlyMessage = `Failed to activate orphan: ${getErrorMessage(error)}`
      throw error
    }
  },

  // Inactivate an orphan (set status to inactive)
  inactivateOrphan: async (orphanPublicId: string, reason: string): Promise<void> => {
    try {
      if (!orphanPublicId) {
        throw new Error("Orphan ID is required for inactivation");
      }
      
      if (!reason || reason.trim() === '') {
        throw new Error("Reason is required for orphan inactivation");
      }
      
      const payload: OrphanStatusChangeRequest = {
        orphanPublicId,
        reason: reason
      }
      
      await API.patch("/app/oims/orphans/inactivate", payload)
      console.log(`Orphan ${orphanPublicId} has been inactivated`)
    } catch (error: any) {
      console.error("Inactivate orphan error:", error)
      error.friendlyMessage = `Failed to inactivate orphan: ${getErrorMessage(error)}`
      throw error
    }
  },
  
  // Direct deletion has been replaced with status change functionality (activate/inactivate)
  // The deleteOrphan method below is kept for backward compatibility
  deleteOrphan: async (orphanPublicId: string): Promise<void> => {
    try {
      if (!orphanPublicId) {
        throw new Error("Orphan ID is required for deletion");
      }
      
      console.debug(`Deletion of orphan with ID: ${orphanPublicId} was requested but has been disabled`);
      // Temporarily commented delete operation
      // await API.delete(`/app/oims/orphans/delorphan/${orphanPublicId}`)
      return Promise.resolve() // Return resolved promise to keep code flow intact
    } catch (error: any) {
      console.error("Delete orphan error:", error)
      error.friendlyMessage = `Failed to delete orphan: ${getErrorMessage(error)}`
      throw error
    }
  },
}

export default OrphanService
