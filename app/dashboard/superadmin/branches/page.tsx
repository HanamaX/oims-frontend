"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Building2, Edit, Trash2, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import API from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define types for our data
interface Branch {
  publicId?: string
  name: string
  location: string
  phoneNumber: string
  isHQ?: boolean
  createdDate?: string
  // The following fields are not in the API response but needed for UI/UX
  orphanageCentrePublicId?: string
}

interface OrphanageCentre {
  publicId?: string
  name: string
}

export default function BranchManagementPage() {
  // State for form
  const [showForm, setShowForm] = useState(false)
  const [branch, setBranch] = useState<Branch>({
    name: "",
    location: "",
    phoneNumber: "",
    isHQ: false,
  })

  // State for branches
  const [branches, setBranches] = useState<Branch[]>([])
  // State for loading
  const [loading, setLoading] = useState(true)
  // State for submitting
  const [submitting, setSubmitting] = useState(false)
  // State for error
  const [error, setError] = useState<string | null>(null)
  // State for center
  const [center, setCenter] = useState<OrphanageCentre | null>(null)
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  // Fetch center and branches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First check if center exists
        const centerResponse = await API.get("/app/oims/orphanages/centre")

        if (centerResponse.data && centerResponse.data.data) {
          if (!centerResponse.data.data.publicId) {
            console.warn("Center data is missing publicId property:", centerResponse.data.data);
            setError("Center information is incomplete. Please ensure the center is properly configured.");
            setCenter({
              publicId: "unknown",
              name: centerResponse.data.data.name || "Unknown Center"
            });
          } else {
            setCenter({
              publicId: centerResponse.data.data.publicId,
              name: centerResponse.data.data.name,
            });
          }

          // If center exists, fetch branches
          try {
            console.log("Fetching branches for center:", centerResponse.data.data.publicId);
            const branchesResponse = await API.get("/app/oims/orphanages/branches")
            console.log("Branches API response:", branchesResponse.data);
            
            if (branchesResponse.data && branchesResponse.data.data) {
              console.log("Branches data found:", branchesResponse.data.data);
              
              // Validate branch data structure
              const validBranches = branchesResponse.data.data
                .filter((branch: any) => {
                  if (!branch.publicId) {
                    console.warn("Found branch without publicId:", branch);
                    return false;
                  }
                  return true;
                })
                .map((branch: any) => ({
                  ...branch,
                  name: branch.name || "Unnamed Branch",
                  location: branch.location || "Unknown Location",
                  phoneNumber: branch.phoneNumber || "No Phone"
                }));
              
              if (validBranches.length < branchesResponse.data.data.length) {
                console.warn(`Filtered out ${branchesResponse.data.data.length - validBranches.length} invalid branches`);
              }
              
              setBranches(validBranches);
            } else {
              console.log("No branches found in API response");
              setBranches([])
            }
          } catch (branchErr: any) {
            console.error("Error fetching branches:", branchErr)
            setError(`Failed to load branches: ${branchErr.message || "Unknown error"}`)
            setBranches([])
          }
        } else {
          console.warn("No center found in API response:", centerResponse.data);
          setCenter(null)
          setError("No orphanage center found. Please create a center first.")
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(`Failed to load center and branch information: ${err.message || "Please try again later."}`)
        setCenter(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setBranch((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!center?.publicId) {
      toast({
        title: "Error",
        description: "You need to create a center first",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (branch.publicId) {
        // Update existing branch - matching API structure from backend.json
        const updateData = {
          branchPublicId: branch.publicId,
          name: branch.name,
          location: branch.location,
          phoneNumber: branch.phoneNumber,
          isHQ: branch.isHQ || false,
          orphanageCentrePublicId: center?.publicId
        }
        console.log("Updating branch with data:", updateData);
        await API.patch("/app/oims/orphanages/branches/update", updateData)

        // Update branches list
        setBranches(branches.map((b) => (b.publicId === branch.publicId ? { ...branch } : b)))

        toast({
          title: "Success",
          description: "Branch updated successfully",
        })
      } else {
        // Create new branch - matching API structure from backend.json
        const branchData = {
          name: branch.name,
          location: branch.location,
          phoneNumber: branch.phoneNumber,
          isHQ: branch.isHQ || false,
          orphanageCentrePublicId: center?.publicId
        }
        console.log("Creating branch with data:", branchData);
        const response = await API.post("/app/oims/orphanages/branches", branchData)

        if (response.data && response.data.data) {
          const newBranch = {
            ...branch,
            publicId: response.data.data.publicId,
          }
          setBranches([...branches, newBranch])
        }

        toast({
          title: "Success",
          description: "Branch created successfully",
        })
      }

      // Reset form
      setBranch({
        name: "",
        location: "",
        phoneNumber: "",
        isHQ: false,
      })
      setShowForm(false)
    } catch (err: any) {
      console.error("Error saving branch:", err)
      
      // Provide more detailed error information
      let errorMessage = "Failed to save branch. Please try again.";
      
      // Check for specific API error formats
      if (err.response?.data) {
        if (err.response.data.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (branchId: string) => {
    const branchToEdit = branches.find((b) => b.publicId === branchId)
    if (branchToEdit) {
      // Make sure we handle all required fields, even if some are missing from the API response
      setBranch({
        publicId: branchToEdit.publicId,
        name: branchToEdit.name || '',
        location: branchToEdit.location || '',
        phoneNumber: branchToEdit.phoneNumber || '',
        isHQ: branchToEdit.isHQ || false
      })
      setShowForm(true)
    }
  }

  // Handle delete
  const handleDelete = (branchId: string) => {
    setBranchToDelete(branchId)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!branchToDelete) return

    try {
      // Use the correct API endpoint from backend.json
      await API.delete(`/app/oims/orphanages/branches/${branchToDelete}`)
      setBranches(branches.filter((branch) => branch.publicId !== branchToDelete))
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      })
    } catch (err) {
      console.error("Error deleting branch:", err)
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setBranchToDelete(null)
    }
  }

  // Navigate to branch details
  const navigateToBranch = (branchId: string) => {
    router.push(`/dashboard/branch/${branchId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading branch information...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">Manage all branches of your orphanage center</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        {center ? (
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Branch
          </Button>
        ) : null}
      </div>

      {!center && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Center Found</AlertTitle>
          <AlertDescription>
            You need to create an orphanage center before you can manage branches.{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-red-700 hover:text-red-900"
              onClick={() => router.push("/dashboard/superadmin/center")}
            >
              Create Center
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {center && showForm && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{branch.publicId ? "Edit Branch" : "Add New Branch"}</CardTitle>
              <CardDescription>Enter the details for the branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input id="name" name="name" value={branch.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={branch.location} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={branch.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="isHQ"
                    name="isHQ"
                    checked={branch.isHQ || false}
                    onCheckedChange={(checked) => setBranch((prev) => ({ ...prev, isHQ: checked === true }))}
                  />
                  <Label htmlFor="isHQ">Is Headquarters</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setBranch({
                      name: "",
                      location: "",
                      phoneNumber: "",
                      isHQ: false,
                    })
                  }}
                  disabled={submitting}
                >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {branch.publicId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{branch.publicId ? "Update Branch" : "Add Branch"}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {branches.length === 0 && !loading ? (
          <div className="col-span-2 text-center py-10">
            <p className="text-muted-foreground">No branches found. Add your first branch to get started.</p>
          </div>
        ) : (
          branches.map((branch) => (
            <Card key={branch.publicId}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle>{branch.name}</CardTitle>
                    {branch.isHQ && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Headquarters
                      </span>
                    )}
                  </div>
                  <CardDescription>{branch.location}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">{branch.phoneNumber}</p>
                  </div>
                  {branch.createdDate && (
                    <div>
                      <p className="text-sm font-medium">Created Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(branch.createdDate.replace(' ', 'T')).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between space-x-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(branch.publicId!)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(branch.publicId!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Branch Deletion</DialogTitle>
            <DialogDescription>
              {branchToDelete ? (
                <>
                  Are you sure you want to delete branch <strong>{branches.find(b => b.publicId === branchToDelete)?.name}</strong>?
                  <br /><br />
                  This action cannot be undone. All data associated with this branch including orphans, staff, inventory, 
                  and other records will be permanently deleted.
                </>
              ) : (
                <>Are you sure you want to delete this branch? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
