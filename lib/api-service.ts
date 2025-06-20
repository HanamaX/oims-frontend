import axios, { AxiosInstance } from "axios"

// Extend the AxiosInstance type to include our custom methods
interface ExtendedAxiosInstance extends AxiosInstance {
  clearAuth: () => void;
}

// Create an axios instance with default config
const API = axios.create({
  baseURL: "https://oims-4510ba404e0e.herokuapp.com",
  // baseURL: "http://localhost:8080", // Use localhost for local development
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
}) as ExtendedAxiosInstance

// Add a request interceptor to include the JWT token in requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
        // CRITICAL FIX: Special handling for FormData/file uploads
      const isFormData = config.data instanceof FormData;
      if (isFormData) {
        // For FormData, explicitly delete Content-Type so browser can set it with boundary
        delete config.headers['Content-Type'];
        console.log(`FormData detected - removed Content-Type to let browser handle it`);
        
        // Ensure transformRequest is not overridden for FormData
        if (!config.transformRequest) {
          config.transformRequest = [(data) => data];
        }
      } else if (config.headers['Content-Type'] !== 'multipart/form-data') {
        // For JSON data, set content type explicitly
        config.headers['Content-Type'] = 'application/json'
      }
      
      // Debug info
      console.debug(`API Request to ${config.url} with auth token: ${token.substring(0, 15)}...`)
      console.debug(`Request content type: ${config.headers['Content-Type'] ? String(config.headers['Content-Type']) : 'auto (FormData)'}`)
      console.debug(`Request body type: ${isFormData ? 'FormData' : typeof config.data}`)
    } else {
      console.warn(`API Request to ${config.url} without auth token!`)
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common error cases
API.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.debug(`API Response from ${response.config.url}: Status ${response.status}`)
    return response
  },
  (error) => {
    // Get request details for better error logs
    const requestMethod = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const requestUrl = error.config?.url || 'unknown endpoint';
    const requestData = error.config?.data ? JSON.stringify(error.config.data).substring(0, 200) : 'none';
    
    // Prepare detailed error information
    const errorInfo = {
      endpoint: requestUrl,
      method: requestMethod,
      status: error.response?.status || 'No response',
      statusText: error.response?.statusText || 'Unknown error',
      data: error.response?.data || {},
      requestData: requestData,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
    
    // Enhanced error logging with request details
    console.error(`API Error [${requestMethod} ${requestUrl}]:`, errorInfo);
    
    // Handle specific error scenarios
    if (error.message === "Network Error") {
      console.error("Network error detected. Server might be down or unreachable.");
      error.friendlyMessage = "Connection to server failed. Please check your internet connection and try again.";
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Server might be overloaded or unreachable.");
      error.friendlyMessage = "Request timed out. Please try again later.";
    }
      // Handle authorization errors (401)
    if (error.response?.status === 401) {
      console.error("Authentication error (401). Token might be invalid or expired.");
      error.friendlyMessage = "Your session has expired. Please log in again.";
      
      // Clear auth data and redirect to login
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      
      // Only redirect if we're in a browser environment, not already on login page, and not a superuser route
      if (typeof window !== "undefined" && 
          !window.location.pathname.includes("/login") && 
          !window.location.pathname.includes("/superuser")) {
        // Use a timeout to ensure the error is properly returned before redirect
        setTimeout(() => {
          window.location.href = "/login?expired=true";
        }, 100);
      }
    }
    
    // Handle forbidden errors (403)
    if (error.response?.status === 403) {
      console.error("Forbidden access (403). User doesn't have permission.");
      error.friendlyMessage = "You don't have permission to perform this action.";
    }
    
    // Handle not found errors (404)
    if (error.response?.status === 404) {
      console.error(`Resource not found at ${requestUrl}`);
      error.friendlyMessage = "The requested resource was not found.";
    }
    
    // Handle server errors (500+)
    if (error.response?.status >= 500) {
      console.error(`Server error (${error.response.status}) occurred.`);
      error.friendlyMessage = "The server encountered an error. Please try again later.";
    }
    
    // Extract API-specific error message if available
    if (error.response?.data) {
      if (error.response.data.message) {
        error.apiMessage = error.response.data.message;
      } else if (error.response.data.error) {
        error.apiMessage = error.response.data.error;
      } else if (error.response.data.errorMessage) {
        error.apiMessage = error.response.data.errorMessage;
      }
      
      // For debugging in development, add the full response
      if (process.env.NODE_ENV === 'development') {
        error.apiResponse = error.response.data;
      }
    }

    // Add a user-friendly error message that components can display
    if (!error.friendlyMessage) {
      error.friendlyMessage = error.apiMessage || "An error occurred. Please try again.";
    }
    
    return Promise.reject(error);
  },
)

// API auth utilities
API.clearAuth = () => {
  // Clear any cached auth headers or tokens
  delete API.defaults.headers.common['Authorization'];
  
  // Clear all localStorage items related to authentication
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  localStorage.removeItem("superuser_auth");
  localStorage.removeItem("superuser_token");
  localStorage.removeItem("superuser_data");
  
  // Clear session storage as well
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem("jwt_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("superuser_auth");
    sessionStorage.removeItem("superuser_token");
    sessionStorage.removeItem("superuser_data");
  }
  
  // Clear all auth-related cookies
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      // Clear auth-related cookies
      if (name.toLowerCase().includes("auth") || 
          name.toLowerCase().includes("token") || 
          name.toLowerCase().includes("user") ||
          name.toLowerCase().includes("session")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    }
  }
  
  console.log("API authorization headers and all session data cleared");
};

// Helper function to extract the most useful error message from API errors
export function getErrorMessage(error: any): string {
  if (!error) return "Unknown error occurred";
  
  // Return the most specific error message available
  return error.apiMessage || error.friendlyMessage || error.message || "An unexpected error occurred";
}

export default API
