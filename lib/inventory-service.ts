import API from "./api-service"

export interface InventoryItem {
  publicId: string
  name: string
  description: string
  quantity: number
  category: string
  branchPublicId: string
  branchName?: string
  minQuantity: number
  lastUpdated?: string
}

// Current branch inventory item response from API
export interface CurrentInventoryItemResponse {
  createdDate: string
  publicId: string
  itemName: string
  itemCategory: string
  itemQuantity: string
  itemPrice: string
  minQuantity: string
  lowStock: boolean
}

export interface CurrentInventoryItemsApiResponse {
  data: CurrentInventoryItemResponse[]
  message: string
  status: string
}

export interface InventoryItemCreateRequest {
  name: string
  description: string
  quantity: number
  category: string
  branchPublicId: string
  minQuantity: number
}

export interface InventoryItemUpdateRequest {
  publicId: string
  name: string
  description: string
  quantity: number
  category: string
  branchPublicId: string
  minQuantity: number
}

export interface InventoryTransaction {
  itemPublicId: string
  transactionType: "IN" | "OUT"
  quantity: number
  description: string
  branchPublicId: string
  branchName?: string
  createdAt: string
}

export interface InventoryTransactionCreateRequest {
  itemPublicId: string
  transactionType: "IN" | "OUT"
  quantity: number
  description: string
  branchPublicId: string
}

export interface InventoryTransactionUpdateRequest {
  publicId: string
  transactionType: "IN" | "OUT"
  quantity: number
  description: string
}

// Interface for inventory transaction from API
export interface InventoryTransactionResponse {
  publicId: string
  transactionType: "IN" | "OUT"
  transactionQuantity: string
  transactionCreationDate: string
  transactionDescription: string
}

// Interface for inventory item details with transactions
export interface InventoryItemDetailsResponse {
  publicId: string
  itemName: string
  itemCategory: string
  itemQuantity: string
  itemPrice: string
  minQuantity: string // Add minQuantity field
  inventoryTransactions: InventoryTransactionResponse[]
  branchPublicId: string
  branchName: string
}

export interface InventoryItemDetailsApiResponse {
  data: InventoryItemDetailsResponse
  message: string
  status: string
}

// Interface for adding inventory transaction
export interface AddInventoryTransactionRequest {
  inventoryItemPublicId: string
  transactionType: "IN" | "OUT"
  transactionQuantity: string
  transactionDescription: string
}

// Interface for updating inventory transaction
export interface UpdateInventoryTransactionRequest {
  transactionPublicId: string
  transactionType: "IN" | "OUT"
  transactionQuantity: string
  transactionDescription: string
  inventoryItemPublicId: string
}

// Interface for API response when adding/updating inventory item
export interface InventoryItemApiResponse {
  data: CurrentInventoryItemResponse
  message: string
  status: string
}

// Interface for API response when adding/updating/deleting inventory transaction
export interface InventoryTransactionApiResponse {
  data: InventoryTransactionResponse
  message: string
  status: string
}

const InventoryService = {
  addInventoryItem: async (itemData: {
    itemName: string;
    itemCategory: string;
    itemQuantity: string;
    itemPrice: string;
    minQuantity: string;
  }): Promise<CurrentInventoryItemResponse> => {
    try {
      const response = await API.post<InventoryItemApiResponse>("/app/oims/inventory/items", itemData)
      return response.data.data
    } catch (error) {
      console.error("Add inventory item error:", error)
      throw error
    }
  },

  getCentreInventoryItems: async (): Promise<InventoryItem[]> => {
    try {
      const response = await API.get<InventoryItem[]>("/app/oims/inventory/items/centre")
      return response.data
    } catch (error) {
      console.error("Get centre inventory items error:", error)
      throw error
    }
  },

  getBranchInventoryItems: async (branchPublicId: string): Promise<InventoryItem[]> => {
    try {
      const response = await API.get<InventoryItem[]>(`/app/oims/inventory/items/${branchPublicId}`)
      return response.data
    } catch (error) {
      console.error("Get branch inventory items error:", error)
      throw error
    }
  },

  getInventoryItemById: async (itemPublicId: string): Promise<InventoryItem> => {
    try {
      const response = await API.get<InventoryItem>(`/app/oims/inventory/items/item/${itemPublicId}`)
      return response.data
    } catch (error) {
      console.error("Get inventory item by ID error:", error)
      throw error
    }
  },

  updateInventoryItem: async (itemData: {
    itemPublicId: string;
    itemName: string;
    itemCategory: string;
    itemQuantity: string;
    itemPrice: string;
    minQuantity: string;
  }): Promise<CurrentInventoryItemResponse> => {
    try {
      const response = await API.patch<InventoryItemApiResponse>("/app/oims/inventory/items", itemData)
      return response.data.data
    } catch (error) {
      console.error("Update inventory item error:", error)
      throw error
    }
  },

  deleteInventoryItem: async (itemPublicId: string): Promise<void> => {
    try {
      await API.delete(`/app/oims/inventory/items/${itemPublicId}`)
    } catch (error) {
      console.error("Delete inventory item error:", error)
      throw error
    }
  },

  addInventoryTransaction: async (
    transactionData: AddInventoryTransactionRequest
  ): Promise<InventoryTransactionResponse> => {
    try {
      console.log("Adding transaction with data:", transactionData);
      const response = await API.post<InventoryTransactionApiResponse>("/app/oims/inventory/transactions", transactionData)
      return response.data.data
    } catch (error: any) {
      console.error("Add inventory transaction error:", error)
      throw new Error(error.response?.data?.message ?? "Failed to add inventory transaction")
    }
  },

  updateInventoryTransaction: async (
    transactionData: UpdateInventoryTransactionRequest
  ): Promise<InventoryTransactionResponse> => {
    try {
      console.log("Updating transaction with data:", transactionData);
      const response = await API.patch<InventoryTransactionApiResponse>("/app/oims/inventory/transactions", transactionData)
      return response.data.data
    } catch (error: any) {
      console.error("Update inventory transaction error:", error)
      throw new Error(error.response?.data?.message ?? "Failed to update inventory transaction")
    }
  },

  deleteInventoryTransaction: async (transactionPublicId: string): Promise<void> => {
    try {
      console.log("Deleting transaction with ID:", transactionPublicId);
      await API.delete(`/app/oims/inventory/transactions/${transactionPublicId}`)
    } catch (error: any) {
      console.error("Delete inventory transaction error:", error)
      throw new Error(error.response?.data?.message ?? "Failed to delete inventory transaction")
    }
  },

  getCurrentBranchInventoryItems: async (): Promise<CurrentInventoryItemResponse[]> => {
    try {
      console.log("Fetching current branch inventory items");
      const response = await API.get<CurrentInventoryItemsApiResponse>("/app/oims/inventory/items/current")
      console.log(`Retrieved ${response.data.data.length} inventory items`);
      return response.data.data
    } catch (error: any) {
      console.error("Get current branch inventory items error:", error)
      throw new Error(error.response?.data?.message ?? "Failed to fetch inventory items")
    }
  },

  getInventoryItemDetails: async (itemPublicId: string): Promise<InventoryItemDetailsResponse> => {
    try {
      console.log("Fetching inventory item details for:", itemPublicId);
      const response = await API.get<InventoryItemDetailsApiResponse>(`/app/oims/inventory/items/item/${itemPublicId}`)
      // If API doesn't provide minQuantity yet, add it with a default value
      if (!response.data.data.minQuantity) {
        response.data.data.minQuantity = "10"; // Default value
      }
      console.log("Inventory item details response:", response.data);
      return response.data.data
    } catch (error: any) {
      console.error("Get inventory item details error:", error)
      throw new Error(error.response?.data?.message ?? "Failed to fetch inventory item details")
    }
  },


}

export default InventoryService
