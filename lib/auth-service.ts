import API from "./api-service"

// Updated interface to match the actual API response
export interface LoginResponse {
  data: {
    token: string
    admin: {
      branchName: string
      publicId: string
      username: string
      email: string
      phone: string | null
      roles: string[]
      sex: string | null
      imageUrl: string | null
      fullName: string | null
      enabled: boolean
      accountNonLocked: boolean
      authorities: { authority: string }[]
      credentialsNonExpired: boolean
      accountNonExpired: boolean
      createdDate?: string
    }
    branchName?: string | null
    unreadNotificationsCount: number
    totalVolunteers: number
    totalBranches: number | null
    totalOrphans: number
    totalFundraising: number
    isFirstTimeLogin: boolean | null
    isCentreCreated: boolean | null
  }
  message: string
  status: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ChangePasswordRequest {
  email: string // The backend requires this, but we'll send an empty string as the token is sufficient
  activationToken: string
  password: string
}

export interface ActivateAccountRequest {
  email: string // This is used for the username in the activation context
  activationToken: string
  password: string
}

export interface UpdateProfileRequest {
  fullName?: string
  username?: string
  email?: string
  phone?: string
  phoneNumber?: string // Add this in case the backend expects phoneNumber instead of phone
  imageUrl?: string
  gender?: string
  sex?: string  // API might expect sex instead of gender
}

export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface UploadProfileImageResponse {
  imageUrl: string
  message: string
  status: string
}

export interface SuperAdminUpdateRequest {
  role?: string
  branchPublicId?: string
  suspend?: boolean
  adminPublicId: string
}

const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log("Attempting login with:", { ...credentials, password: "***" })

      // Make sure we're using the exact endpoint from the API documentation
      const response = await API.post<LoginResponse>("/app/oims/authorization/login", credentials)

      console.log("Login response:", response.data)

      // Store token and user data based on the actual response structure
      localStorage.setItem("jwt_token", response.data.data.token)

      // Determine role from the roles array
      const isAdmin = response.data.data.admin.roles.includes("ROLE_ADMIN")
      const isSuperAdmin = response.data.data.admin.roles.includes("ROLE_SUPER_ADMIN")
      const role = isSuperAdmin ? "superadmin" : isAdmin ? "admin" : null
      
      // Get fullName parts
      const adminData = response.data.data.admin
      
      const firstNamePart = adminData.fullName?.split(" ")[0] ?? adminData.username
      const lastNamePart = adminData.fullName?.split(" ").slice(1).join(" ") ?? ""

      // Store user data with enhanced profile information
      localStorage.setItem(
        "user",
        JSON.stringify({
          // Basic user info
          role: role,
          firstName: firstNamePart,
          lastName: lastNamePart,
          fullName: adminData.fullName ?? `${firstNamePart} ${lastNamePart}`.trim(),
          email: adminData.email,
          username: adminData.username,
          publicId: adminData.publicId,
          
          // Additional profile fields
          phone: adminData.phone ?? "",
          phoneNumber: adminData.phone ?? "", // Add both formats for compatibility
          imageUrl: adminData.imageUrl ?? "",
          branchName: adminData.branchName ?? "",
          
          // Account status properties
          enabled: adminData.enabled,
          accountNonLocked: adminData.accountNonLocked,
          
          gender: adminData.sex ?? "",
          
          // App metadata
          firstLogin: response.data.data.isFirstTimeLogin ?? false,
          isCentreCreated: response.data.data.isCentreCreated ?? false,
          
          // Dashboard stats
          dashboardStats: {
            totalOrphans: response.data.data.totalOrphans ?? 0,
            totalBranches: response.data.data.totalBranches ?? 0,
            totalVolunteers: response.data.data.totalVolunteers ?? 0,
            totalFundraising: response.data.data.totalFundraising ?? 0,
          },
        }),
      )


      return response.data
    } catch (error: any) {
      // More detailed error logging
      console.error("Login error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      })
      throw error
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await API.post("/app/oims/authorization/forgot-password", null, {
        params: { email },
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    try {
      // Using the exact endpoint as specified
      await API.post("/app/oims/authorization/change-password", data)
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  },

  activateAccount: async (data: ActivateAccountRequest): Promise<void> => {
    try {
      // Using the exact endpoint as specified
      await API.post("/app/oims/authorization/activate", data)
    } catch (error) {
      console.error("Activate account error:", error)
      throw error
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
    try {
      // Log the exact data being sent to the API
      console.log("Sending profile update data:", JSON.stringify(data, null, 2))
      await API.patch("/app/oims/admins/update", data)
      console.log("Profile update API call successful")
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    try {
      await API.patch("/app/oims/admins/change-password", data)
    } catch (error) {
      console.error("Update password error:", error)
      throw error
    }
  },

  superAdminUpdate: async (data: SuperAdminUpdateRequest): Promise<void> => {
    try {
      await API.patch("/app/oims/admin/supupdate", data)
    } catch (error) {
      console.error("Super admin update error:", error)
      throw error
    }
  },
  
  uploadProfileImage: async (file: File): Promise<UploadProfileImageResponse> => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      console.log("Uploading image file:", file.name, file.size, file.type)
      
      // Use XMLHttpRequest which handles multipart/form-data more reliably
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API.defaults.baseURL}/app/oims/admins/image`);
        
        // Get token for authentication
        const token = localStorage.getItem("jwt_token");
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        
        // Don't set Content-Type header, let browser set it with the boundary
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Image upload success response:", xhr.responseText);
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              console.error("Error parsing response:", error);
              reject(new Error("Invalid response format"));
            }
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
      console.error("Upload profile image error:", error)
      throw error
    }
  },

  logout: (): void => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user")
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("jwt_token")
  },

  getUser: (): any => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },
}

export default AuthService
