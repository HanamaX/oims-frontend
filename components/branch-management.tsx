"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Building2, Loader2 } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage, T } from "@/locales/client"

// Define types for our data
interface Branch {
  publicId?: string
  name: string
  location: string
  phoneNumber: string
  isHQ?: boolean
  createdDate?: string
  staffCount?: number
  orphanCount?: number
  orphanageCentrePublicId?: string
}

// Props interface for the component
interface BranchManagementProps {
  readonly branches: Branch[]
  readonly centerPublicId?: string
  readonly onBranchesChange: (branches: Branch[]) => void
  readonly onBranchClick: (branch: Branch) => void
  readonly error: string | null
}

export default function BranchManagement({
  branches,
  centerPublicId,
  onBranchesChange,
  onBranchClick,
  error
}: BranchManagementProps) {
  // Local state
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [branch, setBranch] = useState<Branch>({
    name: "",
    location: "",
    phoneNumber: "",    isHQ: false,
  })
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { toast } = useToast()
  const { language } = useLanguage()

  // Handle branch form change
  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setBranch((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle branch form submission
  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()      
    if (!centerPublicId) {
      toast({
        title: language === "sw" ? "Hitilafu" : "Error",
        description: language === "sw" ? "Unahitaji kuunda kituo kwanza" : "You need to create a center first",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      if (branch.publicId) {
        // Update existing branch
        const updateData = {
          branchPublicId: branch.publicId,
          name: branch.name,
          location: branch.location,
          phoneNumber: branch.phoneNumber,
          isHQ: branch.isHQ || false,
          orphanageCentrePublicId: centerPublicId
        }
        await API.patch("/app/oims/orphanages/branches/update", updateData)
        
        // Update branches list
        const updatedBranches = branches.map((b) => 
          b.publicId === branch.publicId ? { ...branch } : b
        )        
        onBranchesChange(updatedBranches)

        toast({
          title: language === "sw" ? "Mafanikio" : "Success",
          description: language === "sw" ? "Tawi limebadilishwa kikamilifu" : "Branch updated successfully",
        })
      } else {
        // Create new branch
        const branchData = {
          name: branch.name,
          location: branch.location,
          phoneNumber: branch.phoneNumber,
          isHQ: branch.isHQ ?? false,
          orphanageCentrePublicId: centerPublicId
        }
        const response = await API.post("/app/oims/orphanages/branches", branchData)

        if (response.data?.data) {
          const newBranch = {
            ...branch,
            publicId: response.data.data.publicId,
          }
          onBranchesChange([...branches, newBranch])        }
        
        toast({
          title: language === "sw" ? "Mafanikio" : "Success",
          description: language === "sw" ? "Tawi limeundwa kikamilifu" : "Branch created successfully",
        })
      }
      
      // Reset form
      setBranch({
        name: "",
        location: "",
        phoneNumber: "",
        isHQ: false,
      })
      setShowBranchForm(false)
    } catch (err: any) {
      console.error("Error saving branch:", err)
      
      let errorMessage = "Failed to save branch. Please try again.";
      
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
      toast({
        title: language === "sw" ? "Hitilafu" : "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle branch edit
  const handleEditBranch = (branchId: string) => {
    const branchToEdit = branches.find((b) => b.publicId === branchId)
    if (branchToEdit) {
      setBranch({
        publicId: branchToEdit.publicId,
        name: branchToEdit.name || '',
        location: branchToEdit.location || '',
        phoneNumber: branchToEdit.phoneNumber || '',
        isHQ: branchToEdit.isHQ || false
      })
      setShowBranchForm(true)
    }
  }

  // Handle branch delete
  const handleDeleteBranch = (branchId: string) => {
    setBranchToDelete(branchId)
    setDeleteDialogOpen(true)
  }

  // Confirm branch delete
  const confirmDeleteBranch = async () => {
    if (!branchToDelete) return
      try {
      await API.delete(`/app/oims/orphanages/branches/${branchToDelete}`)
      const updatedBranches = branches.filter((branch) => branch.publicId !== branchToDelete)
      onBranchesChange(updatedBranches)
      
      toast({
        title: language === "sw" ? "Mafanikio" : "Success",
        description: language === "sw" ? "Tawi limefutwa kikamilifu" : "Branch deleted successfully",
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Branch Management</h2>
        <Button onClick={() => {
          setBranch({
            name: "",
            location: "",
            phoneNumber: "",
            isHQ: false,
          })
          setShowBranchForm(true)
        }} disabled={showBranchForm || !centerPublicId}>
          <Plus className="mr-2 h-4 w-4" /> Add Branch
        </Button>
      </div>
      
      {showBranchForm && (
        <Card>
          <form onSubmit={handleBranchSubmit}>
            <CardHeader>
              <CardTitle>{branch.publicId ? "Edit Branch" : "Add New Branch"}</CardTitle>
              <CardDescription>Enter the details for the branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input id="name" name="name" value={branch.name} onChange={handleBranchChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={branch.location} onChange={handleBranchChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={branch.phoneNumber}
                    onChange={handleBranchChange}
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
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBranchForm(false)
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
      
      {!showBranchForm && (
        <>
          {branches.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-muted-foreground">No branches found. Add your first branch to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {branches.map((branch) => (
                <Card 
                  key={branch.publicId} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onBranchClick(branch)}
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                        <CardDescription>{branch.location}</CardDescription>
                      </div>
                    </div>
                    {branch.isHQ && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        HQ
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex">
                        <span className="bg-blue-100 px-3 py-2 rounded-l-md text-xs text-blue-600 font-medium flex items-center w-1/3">Phone</span>
                        <span className="bg-gray-50 px-3 py-2 rounded-r-md text-sm text-black w-2/3">{branch.phoneNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="bg-blue-100 px-3 py-2 rounded-l-md text-xs text-blue-600 font-medium flex items-center w-1/3">Staff</span>
                        <span className="bg-gray-50 px-3 py-2 rounded-r-md text-sm text-black w-2/3">{branch.staffCount || 0} members</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      {branch.orphanCount || 0} orphans
                    </p>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBranch(branch.publicId!);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBranch(branch.publicId!);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Branch Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBranch}>
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
