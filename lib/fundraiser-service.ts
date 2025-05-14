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

const FundraiserService = {  createFundraiser: async (fundraiserData: FundraiserCreateRequest): Promise<Fundraiser> => {
    try {
      const response = await API.post("/app/oims/events/fundraisers", fundraiserData)
      console.log("Fundraiser created successfully:", response.data)
      return response.data.data  
    } catch (error) {
      console.error("Create fundraiser error:", error)
      throw error
    }
  },  uploadFundraiserImage: async (fundraiserId: string, file: File): Promise<void> => {
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
      return response.data
    } catch (error) {
      console.error("Get fundraisers by branch error:", error)
      throw error
    }
  },

  getFundraiserById: async (fundraiserId: string): Promise<Fundraiser> => {
    try {
      const response = await API.get<Fundraiser>(`/app/oims/events/fundraisers/detail/${fundraiserId}`)
      return response.data
    } catch (error) {
      console.error("Get fundraiser by ID error:", error)
      throw error
    }
  },
  
  getCurrentBranchFundraisers: async (): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<{data: Fundraiser[], message: string, status: string}>(`/app/oims/events/fundraisers/current`)
      return response.data.data
    } catch (error) {
      console.error("Get current branch fundraisers error:", error)
      throw error
    }
  },

  getCentreFundraisers: async (centreId: string): Promise<Fundraiser[]> => {
    try {
      const response = await API.get<Fundraiser[]>(`/app/oims/events/fundraisers/centre/${centreId}`)
      return response.data
    } catch (error) {
      console.error("Get centre fundraisers error:", error)
      throw error
    }
  },

  updateFundraiserStatus: async (fundraiserId: string, status: string): Promise<void> => {
    try {
      await API.patch(`/app/oims/events/fundraisers/${fundraiserId}/status?status=${status}`)
    } catch (error) {
      console.error("Update fundraiser status error:", error)
      throw error
    }
  },

  deleteFundraiser: async (fundraiserId: string): Promise<void> => {
    try {
      await API.delete(`/app/oims/events/fundraisers/${fundraiserId}`)
    } catch (error) {
      console.error("Delete fundraiser error:", error)
      throw error
    }
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
      return response.data
    } catch (error) {
      console.error("Get all campaigns error:", error)
      throw error
    }
  },
}

export default FundraiserService
