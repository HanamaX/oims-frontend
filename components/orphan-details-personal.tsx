"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, Plus, Trash, Loader2 } from "lucide-react"
import { OrphanDetails, Guardian } from "@/lib/orphan-types"
import GuardianForm from "./guardian-form"
import { useToast } from "@/hooks/use-toast"
import API from "@/lib/api-service"
import OrphanService from "@/lib/orphan-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import OrphanFormEdit from "./orphan-form-edit"

interface OrphanDetailsPersonalProps {
  readonly orphan: OrphanDetails | null
  readOnly?: boolean
}

export default function OrphanDetailsPersonal({ orphan, readOnly = false }: Readonly<OrphanDetailsPersonalProps>) {
  const { toast } = useToast()
  const [isGuardianFormOpen, setIsGuardianFormOpen] = useState(false)
  const [isDeleteGuardianDialogOpen, setIsDeleteGuardianDialogOpen] = useState(false)
  const [isDeleteOrphanDialogOpen, setIsDeleteOrphanDialogOpen] = useState(false)
  const [isEditOrphanOpen, setIsEditOrphanOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Add states for status change dialogs
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [isInactivateDialogOpen, setIsInactivateDialogOpen] = useState(false)
  const [statusChangeReason, setStatusChangeReason] = useState("")
  
  if (!orphan) return null
  
  // Handle guardian operations
  const handleAddGuardian = async (guardianData: Guardian) => {
    setIsSubmitting(true)
    
    try {
      // Add orphanPublicId to the request
      const enrichedData = {
        ...guardianData,
        orphanPublicId: orphan.publicId
      }
      
      // Save guardian via API - correct endpoint based on backend.json
      const response = await API.post(`/app/oims/orphans/guardians`, enrichedData)
      
      // Show success message
      toast({
        title: "Guardian Added",
        description: "Guardian information has been successfully added."
      })
      
      // Close form and refresh page
      setIsGuardianFormOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to add guardian:", error)
      toast({
        title: "Failed to Add Guardian",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleUpdateGuardian = async (guardianData: Guardian) => {
    setIsSubmitting(true)
    
    try {
      // Include publicId and orphanPublicId in the request
      const enrichedData = {
        ...guardianData,
        publicId: orphan.guardian?.publicId,
        orphanPublicId: orphan.publicId
      }
      
      // Update guardian via API - use PATCH to correct endpoint
      const response = await API.patch(`/app/oims/orphans/guardians`, enrichedData)
      
      // Show success message
      toast({
        title: "Guardian Updated",
        description: "Guardian information has been successfully updated."
      })
      
      // Close form and refresh page
      setIsGuardianFormOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to update guardian:", error)
      toast({
        title: "Failed to Update Guardian",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteGuardian = async () => {
    if (!orphan?.guardian?.publicId) return;
    
    setIsSubmitting(true)
    
    try {
      // Delete guardian via API - use correct endpoint with guardian's publicId
      await API.delete(`/app/oims/orphans/guardians/${orphan.guardian.publicId}`)
      
      // Show success message
      toast({
        title: "Guardian Deleted",
        description: "Guardian information has been successfully deleted."
      })
      
      // Close dialog and refresh page
      setIsDeleteGuardianDialogOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to delete guardian:", error)
      toast({
        title: "Failed to Delete Guardian",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditOrphan = async (orphanData: any) => {
    setIsSubmitting(true)
    try {
      // Update orphan via API
      await OrphanService.updateOrphan(orphanData)
      
      // Show success message
      toast({
        title: "Orphan Updated",
        description: "Orphan information has been successfully updated."
      })
      
      // Close form and refresh page
      setIsEditOrphanOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to update orphan:", error)
      toast({
        title: "Failed to Update Orphan",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle orphan deletion
  const handleDeleteOrphan = async () => {
    if (!orphan?.publicId) return
    
    setIsSubmitting(true)
    try {
      // Delete orphan via API
      await OrphanService.deleteOrphan(orphan.publicId)
      
      // Show success message
      toast({
        title: "Orphan Deleted",
        description: "Orphan has been successfully deleted."
      })
      
      // Redirect to orphans list page
      window.location.href = '/dashboard/admin/orphans'
    } catch (error: any) {
      console.error("Failed to delete orphan:", error)
      toast({
        title: "Failed to Delete Orphan",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteOrphanDialogOpen(false)
    }
  }

  // Handle orphan status changes
  const handleActivateOrphan = async () => {
    if (!orphan?.publicId || !statusChangeReason) return;
    
    setIsSubmitting(true);
    try {
      await OrphanService.activateOrphan(orphan.publicId, statusChangeReason);
      
      toast({
        title: "Orphan Activated",
        description: "The orphan has been successfully activated."
      });
      
      setIsActivateDialogOpen(false);
      setStatusChangeReason("");
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to activate orphan:", error);
      toast({
        title: "Activation Failed",
        description: error.friendlyMessage || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInactivateOrphan = async () => {
    if (!orphan?.publicId || !statusChangeReason) return;
    
    setIsSubmitting(true);
    try {
      await OrphanService.inactivateOrphan(orphan.publicId, statusChangeReason);
      
      toast({
        title: "Orphan Inactivated",
        description: "The orphan has been successfully inactivated."
      });
      
      setIsInactivateDialogOpen(false);
      setStatusChangeReason("");
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to inactivate orphan:", error);
      toast({
        title: "Inactivation Failed",
        description: error.friendlyMessage || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Details */}
      <Card className="md:col-span-2">        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Personal Information</CardTitle>
            {orphan.status && (
              <Badge className={`${orphan.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {orphan.status || 'Active'}
              </Badge>
            )}
          </div>
          {!readOnly && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditOrphanOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Details
              </Button>
              {orphan.status?.toLowerCase() !== 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-50 text-green-700 hover:bg-green-100"
                  onClick={() => setIsActivateDialogOpen(true)}
                >
                  Activate
                </Button>
              )}
              {orphan.status?.toLowerCase() === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-orange-50 text-orange-700 hover:bg-orange-100"
                  onClick={() => setIsInactivateDialogOpen(true)}
                >
                  Inactivate
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p className="text-base font-medium">{orphan.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="text-base font-medium">{orphan.age} years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
              <p className="text-base font-medium">{new Date(orphan.dateOfBirth ?? '').toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
              <p className="text-base font-medium">{orphan.gender}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Origin</h3>
              <p className="text-base font-medium">{orphan.origin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Religion</h3>
              <p className="text-base font-medium">{orphan.religion}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Blood Group</h3>
              <p className="text-base font-medium">{orphan.bloodGroup}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
              <p className="text-base font-medium">{orphan.branchName}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Adoption</h3>
            <p className="text-base">{orphan.adoptionReason}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Education</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-muted-foreground">Current Level</h4>
                <p className="text-sm">{orphan.educationLevel}</p>
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground">Current School</h4>
                <p className="text-sm">{orphan.currentSchoolName ?? "Not enrolled"}</p>
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground">Previous School</h4>
                <p className="text-sm">{orphan.previousSchoolName ?? "None"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Special Needs</h3>
            <p className="text-base">{orphan.specialNeeds ?? "None"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Hobbies</h3>
            <p className="text-base">{orphan.hobbies ?? "None"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Allergies</h3>
            {orphan.allergies && orphan.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {orphan.allergies.map((allergy) => (
                  <Badge key={`allergy-${allergy}`} variant="outline">{allergy}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-base">No known allergies</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Orphan Activation Dialog */}
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Orphan</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the status of this orphan to active. 
              Please provide a reason for this change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for activation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why you're activating this orphan..."
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
            ></textarea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setStatusChangeReason("");
                setIsActivateDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleActivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Activate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Orphan Inactivation Dialog */}
      <AlertDialog open={isInactivateDialogOpen} onOpenChange={setIsInactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inactivate Orphan</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the status of this orphan to inactive. 
              This will remove them from active lists but preserve their records.
              Please provide a reason for this change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for inactivation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why you're inactivating this orphan..."
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
            ></textarea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setStatusChangeReason("");
                setIsInactivateDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleInactivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Inactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Guardian Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Guardian Information</CardTitle>
            <CardDescription>Information about the primary guardian</CardDescription>
          </div>
          {!readOnly && (
            orphan.guardian ? (              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsGuardianFormOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {/* Delete button removed as requested */}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsGuardianFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Guardian
              </Button>
            )
          )}
        </CardHeader>
        <CardContent>
          {orphan.guardian ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-base font-medium">{orphan.guardian.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Relationship</h3>
                <p className="text-base">{orphan.guardian.relationship}</p>
              </div>
              <div>                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p className="text-base">{orphan.guardian.contactNumber || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-base">{orphan.guardian.email || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p className="text-base">{orphan.guardian.address || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Occupation</h3>
                <p className="text-base">{orphan.guardian.occupation || "-"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No guardian information available</p>
          )}
        </CardContent>
      </Card>
        {/* Guardian Form Dialog - Only render when not in readOnly mode */}
      {!readOnly && (
        <>
          <GuardianForm 
            open={isGuardianFormOpen} 
            onOpenChange={setIsGuardianFormOpen} 
            onSubmit={orphan.guardian ? handleUpdateGuardian : handleAddGuardian} 
            guardian={orphan.guardian} 
          />
            {/* Delete Guardian Dialog removed as requested */}
          
          {/* Edit Orphan Form */}
          <OrphanFormEdit 
            open={isEditOrphanOpen} 
            onOpenChange={setIsEditOrphanOpen} 
            onSubmit={handleEditOrphan} 
            orphan={orphan}
          />
            {/* Delete Orphan Dialog removed as requested */}
        </>
      )}
    </div>
  )
}