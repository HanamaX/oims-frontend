// filepath: d:\Programming\orphanage-management\lib\fundraiser-service.ts
import API from "./api-service"

export interface Fundraiser {
  publicId: string
  eventName: string
  fundraisingReason: string
  goal: number
  amountPayedPerIndividual: number
  orphanageAmountPerIndividual: number
  purpose: string
  budgetBreakdown: string
  eventStartDate: string
  eventEndDate: string
  status: string
  imageUrl?: string
  branchPublicId: string
  branchName?: string
  coordinatorName: string
  coordinatorEmail: string
  phoneNumber: string
  reason?: string // For rejection, cancellation, or completion reasons
  inactiveReason?: string // Alternative field name for rejection reason
}

export interface FundraiserCreateRequest {
  eventName: string
  fundraisingReason: string
  goal: number
  amountPayedPerIndividual: number
  orphanageAmountPerIndividual: number
  purpose: string
  budgetBreakdown: string
  eventStartDate: string
  eventEndDate: string
  branchPublicId: string
  coordinatorName: string
  coordinatorEmail: string
  phoneNumber: string
}

// Event status enum for fundraiser status change
export enum EventStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Interface for fundraiser status change request
export interface FundraiserStatusChangeRequest {
  eventPublicId: string
  status: EventStatus
  reason?: string
}

const FundraiserService = {
  createFundraiser: async (fundraiserData: FundraiserCreateRequest): Promise<Fundraiser> => {
    try {
      const response = await API.post("/app/oims/events/fundraisers", fundraiserData)
      console.log("Fundraiser created successfully:", response.data)
      return response.data.data  
    } catch (error) {
      console.error("Create fundraiser error:", error)
      throw error
    }
  },
  
  uploadFundraiserImage: async (fundraiserId: string, file: File): Promise<void> => {
    // Validation checks
    if (!fundraiserId) {
      console.error("Cannot upload image: Missing fundraiserId");
      throw new Error("Missing fundraiserId");
    }
    
    if (!file || !(file instanceof File)) {
      console.error("Cannot upload image: Invalid file object", file);
      throw new Error("Invalid file object");
    }
    
    try {
      const formData = new FormData();
      
      // Add the file with the field name that backend expects
      formData.append("file", file);
      
      // Log detailed debugging info
      console.log(`Uploading image for fundraiser ${fundraiserId}:`, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      console.log("Uploading image to endpoint:", `/app/oims/events/fundraisers/image/${fundraiserId}`);
      
      // Use XMLHttpRequest which handles multipart requests more reliably
      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API.defaults.baseURL}/app/oims/events/fundraisers/image/${fundraiserId}`);
        
        // Don't set content-type header, browser will set it with the correct boundary
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Image upload successful:", xhr.responseText);
            resolve();
          } else {
            console.error("Image upload failed:", xhr.status, xhr.responseText);
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        };
        
        xhr.onerror = function() {
          console.error("XMLHttpRequest network error");
          reject(new Error("Network error during upload"));
        };
        
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Failed to upload fundraiser image:", error);
      throw error;
    }
  },
  getFundraisersByBranch: async (branchId: string): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<Fundraiser[]>(`/app/oims/events/fundraisers/${branchId}`)
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const fundraisers = response.data.map(fundraiser => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (fundraiser.inactiveReason && !fundraiser.reason) {
          return {
            ...fundraiser,
            reason: fundraiser.inactiveReason
          };
        }
        return fundraiser;
      });
      
      return fundraisers;
    } catch (error) {
      console.error("Get fundraisers by branch error:", error)
      throw error
    }
  },
  getFundraiserById: async (fundraiserId: string): Promise<Fundraiser> => {
    try {
      const response = await API.get<Fundraiser>(`/app/oims/events/fundraisers/detail/${fundraiserId}`)
      const fundraiser = response.data;
      
      // If the API returns inactiveReason but not reason, map inactiveReason to reason
      if (fundraiser.inactiveReason && !fundraiser.reason) {
        return {
          ...fundraiser,
          reason: fundraiser.inactiveReason
        };
      }
      
      return fundraiser;
    } catch (error) {
      console.error("Get fundraiser by ID error:", error)
      throw error
    }
  },
    getCurrentBranchFundraisers: async (): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<{data: Fundraiser[], message: string, status: string}>(`/app/oims/events/fundraisers/current`)
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const fundraisers = response.data.data.map(fundraiser => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (fundraiser.inactiveReason && !fundraiser.reason) {
          return {
            ...fundraiser,
            reason: fundraiser.inactiveReason
          };
        }
        return fundraiser;
      });
      
      return fundraisers;
    } catch (error) {
      console.error("Get current branch fundraisers error:", error)
      throw error
    }
  },
  getCentreFundraisers: async (centreId: string): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<Fundraiser[]>(`/app/oims/events/fundraisers/centre/${centreId}`)
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const fundraisers = response.data.map(fundraiser => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (fundraiser.inactiveReason && !fundraiser.reason) {
          return {
            ...fundraiser,
            reason: fundraiser.inactiveReason
          };
        }
        return fundraiser;
      });
      
      return fundraisers;
    } catch (error) {
      console.error("Get centre fundraisers error:", error)
      throw error
    }
  },
  
  updateFundraiserStatus: async (eventPublicId: string, status: EventStatus, reason?: string): Promise<void> => {
    try {
      if (!eventPublicId) {
        throw new Error("Fundraiser ID is required for status update");
      }
      
      const payload: FundraiserStatusChangeRequest = {
        eventPublicId,
        status
      }
      
      // Only include reason if status is REJECTED or if reason is provided
      if (status === EventStatus.REJECTED || reason) {
        payload.reason = reason ?? "No reason provided";
      }
      
      await API.patch("/app/oims/events/fundraisers/status", payload)
      console.log(`Fundraiser ${eventPublicId} status changed to ${status}`)
    } catch (error) {
      console.error("Update fundraiser status error:", error)
      throw error
    }
  },
  
  // Helper method to approve a fundraiser
  approveFundraiser: async (eventPublicId: string): Promise<void> => {
    return FundraiserService.updateFundraiserStatus(eventPublicId, EventStatus.APPROVED);
  },
  
  // Direct deletion is discouraged - use status change instead with EventStatus.CANCELLED
  deleteFundraiser: async (fundraiserId: string): Promise<void> => {
    try {
      // Instead of direct deletion, use cancellation with a standard reason
      console.log(`Deletion requested for fundraiser ${fundraiserId} - using cancellation instead`);
      
      // Call the cancelFundraiser method with a standard reason for deletion requests
      await FundraiserService.updateFundraiserStatus(
        fundraiserId, 
        EventStatus.CANCELLED, 
        "Deletion requested by supervisor"
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error("Delete fundraiser error:", error);
      throw error;
    }
  },
  
  rejectFundraiser: async (eventPublicId: string, reason: string): Promise<void> => {
    if (!reason || reason.trim() === '') {
      throw new Error("A reason is required when rejecting a fundraiser");
    }
    return FundraiserService.updateFundraiserStatus(eventPublicId, EventStatus.REJECTED, reason);
  },
  
  completeFundraiser: async (eventPublicId: string, reason?: string): Promise<void> => {
    return FundraiserService.updateFundraiserStatus(
      eventPublicId, 
      EventStatus.COMPLETED,
      reason || "Fundraising goal met or event period ended"
    );
  },
  
  cancelFundraiser: async (eventPublicId: string, reason: string): Promise<void> => {
    if (!reason || reason.trim() === '') {
      throw new Error("A reason is required when cancelling a fundraiser");
    }
    return FundraiserService.updateFundraiserStatus(eventPublicId, EventStatus.CANCELLED, reason);
  },

  sendFundraiserFeedback: async (feedbackData: any): Promise<void> => {
    try {
      await API.post("/app/oims/events/fundraisers/feedback", feedbackData)
    } catch (error) {
      console.error("Send fundraiser feedback error:", error)
      throw error
    }
  },
    getAllCampaigns: async (): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<Fundraiser[]>("/app/oims/events/campaigns/all")
      
      // Map the response data to ensure we handle both reason and inactiveReason fields
      const campaigns = response.data.map(fundraiser => {
        // If the API returns inactiveReason but not reason, map inactiveReason to reason
        if (fundraiser.inactiveReason && !fundraiser.reason) {
          return {
            ...fundraiser,
            reason: fundraiser.inactiveReason
          };
        }
        return fundraiser;
      });
      
      return campaigns;
    } catch (error) {
      console.error("Get all campaigns error:", error)
      throw error
    }
  },
  
  getCampaignById: async (campaignId: string): Promise<any> => {
    try {
      const response = await API.get(`/app/oims/events/campaign/fundraiser/${campaignId}`)
      return response.data.data
    } catch (error) {
      console.error("Get campaign by ID error:", error)
      throw error
    }
  },
  
  getCampaignContributors: async (campaignId: string): Promise<any[]> => {
    try {
      const response = await API.get(`/app/oims/events/contributors/${campaignId}`)
      const data = response.data.data || []
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Get campaign contributors error:", error)
      throw error
    }
  },
}

export default FundraiserService
