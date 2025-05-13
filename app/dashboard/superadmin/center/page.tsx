"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Loader2 } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define types for our data
interface OrphanageCentre {
  publicId?: string
  name: string
  location: string
  address: string
  phoneNumber: string
  email: string
  description: string
}

export default function CenterManagementPage() {
  // State for form
  const [centre, setCentre] = useState<OrphanageCentre>({
    name: "",
    location: "",
    address: "",
    phoneNumber: "",
    email: "",
    description: "",
  })

  // Get auth context to access isCentreCreated flag
  const { user } = useAuth()
  
  // State to track if center exists (now initialized from auth context)
  const [centerExists, setCenterExists] = useState(user?.isCentreCreated ?? false)
  
  // Debug log for user context
  useEffect(() => {
    console.log("User auth context:", user)
    console.log("Center exists (from user context):", user?.isCentreCreated)
    console.log("Center exists state:", centerExists)
  }, [user, centerExists])
  // State to track if editing mode is active
  const [isEditing, setIsEditing] = useState(false)
  // State to track loading
  const [loading, setLoading] = useState(true)
  // State to track form submission
  const [submitting, setSubmitting] = useState(false)
  // State to track error
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  // Fetch center data on component mount - try regardless of centerExists flag
  useEffect(() => {
    // Always try to fetch center data, even if centerExists is false
    // This will ensure we check for center data regardless of what the auth context says
    fetchCenterData()
    
    // Log the current state for debugging
    console.log("Component mounted, centerExists:", centerExists)
    console.log("User from auth context:", user)
  }, [])

  // Function to fetch center data
  const fetchCenterData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching center data...")

      // Call API to get orphanage info
      const response = await API.get("/app/oims/orphanages/centre")
      
      console.log("Center API response:", response)

      // Check if we have data in the expected format
      if (response.data?.data) {
        const centerData = response.data.data
        console.log("Center data:", centerData)
        
        // Update centerExists based on API response
        setCenterExists(true)
        
        // Also update localStorage if needed
        try {
          const userData = localStorage.getItem("user")
          if (userData) {
            const parsedUser = JSON.parse(userData)
            if (!parsedUser.isCentreCreated) {
              parsedUser.isCentreCreated = true
              localStorage.setItem("user", JSON.stringify(parsedUser))
              console.log("Updated isCentreCreated in localStorage")
            }
          }
        } catch (e) {
          console.error("Error updating localStorage:", e)
        }
        
        setCentre({
          publicId: centerData.publicId,
          name: centerData.name ?? "",
          location: centerData.location ?? "",
          address: centerData.address ?? "",
          phoneNumber: centerData.phoneNumber ?? "",
          email: centerData.email ?? "",
          description: centerData.description ?? "",
        })
      } else {
        console.error("Center data not found in response:", response.data)
        
        // If there's an error message in the response, use it
        if (response.data?.errorMessage || response.data?.description) {
          const apiError = response.data?.errorMessage || response.data?.description
          setError(`Server response: ${apiError}`)
        } else {
          setError("Invalid response from server. Center data not found.")
        }
        
        // Set centerExists to false since we couldn't find center data
        setCenterExists(false)
      }
    } catch (err: any) {
      console.error("Error fetching center data:", err)
      
      // Check for specific error types
      if (err.response?.status === 401) {
        setError("Authentication error. Please try logging out and back in.")
      } else if (err.response?.status === 404) {
        console.log("Center not found (404). This is normal if center hasn't been created yet.")
        setCenterExists(false)
        setError(null)
        // In this case, we don't want to show an error, just the create center form
      } else {
        const errorMessage = err.response?.data?.errorMessage || err.response?.data?.description || 
                            err.response?.data?.message || err.message || "Failed to load center information"
        console.error("Detailed error:", errorMessage)
        setError(`Failed to load center information: ${errorMessage}. Please try again later.`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCentre((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (centerExists) {
        // Update existing center - format data according to API requirements
        const updateData = {
          centrePublicId: centre.publicId,
          name: centre.name,
          location: centre.location,
          address: centre.address,
          phoneNumber: centre.phoneNumber,
          email: centre.email,
          description: centre.description
        }
        await API.patch("/app/oims/orphanages/updateorphanage", updateData)
        toast({
          title: "Success",
          description: "Center information updated successfully",
        })
      } else {
        // Create new center
        const response = await API.post("/app/oims/orphanages/addorphanage", centre)
        if (response.data?.data) {
          setCentre((prev) => ({
            ...prev,
            publicId: response.data.data.publicId,
          }))
        }
        
        // Update center exists state
        setCenterExists(true)
        
        // Also update isCentreCreated in local storage
        try {
          const userData = localStorage.getItem("user")
          if (userData) {
            const parsedUser = JSON.parse(userData)
            parsedUser.isCentreCreated = true
            localStorage.setItem("user", JSON.stringify(parsedUser))
          }
        } catch (storageErr) {
          console.error("Failed to update local storage:", storageErr)
        }
        
        toast({
          title: "Success",
          description: "Center created successfully",
        })
      }
      setIsEditing(false)
    } catch (err: any) {
      console.error("Error saving center data:", err)
      setError(err.response?.data?.message ?? "Failed to save center information. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save center information",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  // State for deletion dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Handle center deletion initiation
  const handleDeleteCenter = () => {
    if (!centre.publicId) {
      toast({
        title: "Error",
        description: "Cannot delete center: Missing center ID",
        variant: "destructive",
      })
      return
    }
    
    setDeleteDialogOpen(true)
  }
  
  // Confirm and execute center deletion
  const confirmDeleteCenter = async () => {
    if (!centre.publicId) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      await API.delete(`/app/oims/orphanages/delorphanage/${centre.publicId}`)
      
      // Reset state
      setCentre({
        name: "",
        location: "",
        address: "",
        phoneNumber: "",
        email: "",
        description: "",
      })
      setCenterExists(false)
      
      // Update localStorage to reflect center deletion
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          parsedUser.isCentreCreated = false
          localStorage.setItem("user", JSON.stringify(parsedUser))
        }
      } catch (storageErr) {
        console.error("Failed to update local storage:", storageErr)
      }
      
      toast({
        title: "Success",
        description: "Center has been deleted successfully",
      })
    } catch (err: any) {
      console.error("Error deleting center:", err)
      setError(err.response?.data?.message ?? "Failed to delete center. Please try again.")
      toast({
        title: "Error",
        description: "Failed to delete center",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading center information...</span>
      </div>
    )
  }
  
  // Add a warning banner if user context says center exists but our state doesn't match
  // This helps diagnose issues where the stored flag is wrong but center doesn't actually exist
  const centerStateMismatch = user?.isCentreCreated && !centerExists;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Center Management</h1>
        <p className="text-muted-foreground">
          {centerExists ? "View and manage your orphanage center details" : "Create your main orphanage center"}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        {centerStateMismatch && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">
            <h3 className="text-lg font-medium">Data Inconsistency Detected</h3>
            <p className="mt-1">Your account is marked as having a center, but we couldn't load the center data. 
            This might be due to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Network connectivity issues</li>
              <li>The center was deleted but your account wasn't updated</li>
              <li>Authentication or permission problems</li>
            </ul>
            <p className="mt-2">You can try refreshing the page or logging out and back in.</p>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Orphanage Center Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the orphanage center <strong>{centre.name}</strong>?
              <br /><br />
              This action cannot be undone. All data associated with this center including all branches, 
              orphans, staff records, inventory, donations, and other information will be permanently deleted.
              <br /><br />
              <span className="text-red-600 font-medium">This is a critical action that will remove ALL data from your system.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteCenter}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Orphanage Center"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {centerExists && !isEditing ? (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Building className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle>{centre.name}</CardTitle>
              <CardDescription>{centre.location}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{centre.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">{centre.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{centre.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{centre.description}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleEdit}>
              Edit Center Details
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCenter}
              disabled={submitting}
            >
              Delete Center
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Orphanage Center" : "Create Orphanage Center"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update the details for your orphanage center"
                  : "Enter the details for your main orphanage center"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Center Name</Label>
                  <Input id="name" name="name" value={centre.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={centre.location} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={centre.address} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={centre.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={centre.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={centre.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={submitting}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Center" : "Create Center"}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
