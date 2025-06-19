// Superuser authentication service
import API from "./api-service";

export interface SuperuserLoginRequest {
  username: string;
  password: string;
}

const SuperuserAuthService = {  // Check if user is authenticated as superuser
  isSuperuserAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check if user is authenticated as a superuser
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'ROLE_SUPERUSER') {
        // Ensure superuser authentication is set
        localStorage.setItem('superuser_auth', 'true');
        return true;
      }
    }
    
    // If not authenticated through normal auth, check for explicit superuser auth
    return localStorage.getItem('superuser_auth') === 'true';
  },

  // Login as superuser
  login: async (credentials: SuperuserLoginRequest): Promise<boolean> => {
    try {
      // For the superuser, we'll use a simple validation
      // In a real application, this should connect to a secure backend endpoint
      if (credentials.username === "superuser" && credentials.password === "superpassword") {
        // Set authentication state
        localStorage.setItem("superuser_auth", "true");
        return true;
      }
      throw new Error("Invalid username or password");
    } catch (error: any) {
      console.error("Superuser login error:", error);
      throw error;
    }
  },  // Logout superuser
  logout: (): void => {
    try {
      // Clear all superuser related tokens and data
      localStorage.removeItem("superuser_auth");
      localStorage.removeItem("superuser_token");
      localStorage.removeItem("superuser_data");
      
      // Clear API auth headers
      SuperuserAuthService.clearApiAuthHeaders();
        
      // Force removal of any session cookies by setting expired cookies
      // This helps with browser-based sessions
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        // If the cookie is related to auth, expire it
        if (name.toLowerCase().includes("auth") || name.toLowerCase().includes("token") || name.toLowerCase().includes("user")) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }
      
      console.log("Superuser logout completed successfully");
    } catch (e) {
      console.error("Error during superuser logout:", e);
    }
  },
  // Helper function to clear API authentication headers
  clearApiAuthHeaders: (): void => {
    try {
      // Clear any cached auth headers
      if (API.defaults && API.defaults.headers && API.defaults.headers.common) {
        delete API.defaults.headers.common['Authorization'];
        console.log("API authorization headers cleared");
      }
    } catch (e) {
      console.error("Error clearing API auth headers:", e);
    }
  },
  // Get all orphanage admins
  getAllOrphanageAdmins: async () => {
    try {
      // Since the backend API is not working, use mock data instead
      // In a real application, this would be replaced with an actual API call
      console.log("Using mock data for orphanage admins instead of API call")
      
      const mockAdmins = [
        {
          publicId: "admin-001",
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+255 712 345 678",
          branchPublicId: "branch-001",
          branchName: "Main Center",
          roles: ["ROLE_ORPHANAGE_ADMIN"]
        },
        {
          publicId: "admin-002",
          fullName: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+255 787 654 321",
          branchPublicId: "branch-002",
          branchName: "East Branch",
          roles: ["ROLE_ORPHANAGE_ADMIN"]
        },
        {
          publicId: "admin-003",
          fullName: "Robert Johnson",
          email: "robert.johnson@example.com",
          phone: "+255 755 123 456",
          branchPublicId: "branch-003",
          branchName: "West Branch",
          roles: ["ROLE_SUPERVISOR"]
        }
      ];
      
      // Format the mock admins the same way we would format API response
      const formattedAdmins = mockAdmins.map((admin: any) => ({
          publicId: admin.publicId,
          firstName: admin.fullName ? admin.fullName.split(' ')[0] : '',
          lastName: admin.fullName ? admin.fullName.split(' ').slice(1).join(' ') : '',
          fullName: admin.fullName ?? '',
          email: admin.email ?? '',
          phoneNumber: admin.phone ?? '',
          branchPublicId: admin.branchPublicId ?? '',
          branchName: admin.branchName ?? 'Unassigned',
          role: admin.roles?.[0] ?? '',
          suspended: !admin.enabled,
          imageUrl: admin.imageUrl ?? '',
          centerName: admin.centreName ?? '',
          centerPublicId: admin.centrePublicId ?? ''
        }));        return formattedAdmins;
    } catch (error) {
      console.error("Error fetching all orphanage admins:", error);
      // Return empty array instead of throwing error to make the UI more resilient
      return [];
    }
  },
  // Add orphanage admin
  addOrphanageAdmin: async (adminData: any) => {
    try {
      // Since the backend API is not working, mock a successful response
      console.log("Using mock implementation for adding an admin", adminData);
      
      // Generate a random ID for the new admin
      const newAdminId = `admin-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Return a mock response
      return {
        success: true,
        data: {
          ...adminData,
          publicId: newAdminId,
          branchName: adminData.branchName ?? "Newly Assigned Branch",
          roles: ["ROLE_ORPHANAGE_ADMIN"]
        },
        message: "Admin added successfully"
      };
    } catch (error) {
      console.error("Error adding orphanage admin:", error);
      throw error;
    }
  },
  // Delete orphanage admin
  deleteOrphanageAdmin: async (adminId: string) => {
    try {
      // Since the backend API is not working, mock a successful response
      console.log("Using mock implementation for deleting admin", adminId);
      
      // Return a mock success response
      return {
        success: true,
        message: `Admin ${adminId} deleted successfully`
      };
    } catch (error) {
      console.error("Error deleting orphanage admin:", error);
      throw error;
    }
  },
  // Suspend/unsuspend orphanage admin
  toggleAdminStatus: async (adminId: string, suspended: boolean) => {
    try {
      // Since the backend API is not working, mock a successful response
      console.log(`Using mock implementation for ${suspended ? 'suspending' : 'activating'} admin ${adminId}`);
      
      // Return a mock success response
      return {
        success: true,
        data: {
          publicId: adminId,
          suspended: suspended
        },
        message: `Admin ${suspended ? 'suspended' : 'activated'} successfully`
      };
    } catch (error) {
      console.error("Error updating admin status:", error);
      throw error;
    }
  },
  // Get system stats for superuser dashboard
  getSystemStats: async () => {
    try {
      // First try to get stats from the logged-in user data
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user.dashboardStats) {
              console.log("Using user dashboardStats from login:", user.dashboardStats);
              return {
                totalOrphans: user.dashboardStats.totalOrphans ?? 0,
                totalBranches: user.dashboardStats.totalBranches ?? 0,
                totalVolunteers: user.dashboardStats.totalVolunteers ?? 0,
                totalFundraising: user.dashboardStats.totalFundraising ?? 0,
                totalAdmins: 0,
                totalOrphanageCenters: 0,
              };
            }
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
      
      // Fallback to mock data if user data is not available
      console.log("Using mock data for system statistics");
      
      // Mock statistics data based on what's available in the login response
      const mockStats = {
        totalOrphans: 143,
        totalBranches: 12,
        totalVolunteers: 58,
        totalFundraising: 7,
        totalAdmins: 24,
        totalOrphanageCenters: 5
      };
      
      return mockStats;
    } catch (error) {
      console.error("Error fetching system statistics:", error);
      throw error;
    }
  },
};

export default SuperuserAuthService;
