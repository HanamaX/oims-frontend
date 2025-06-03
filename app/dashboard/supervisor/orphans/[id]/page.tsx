"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useOrphanData } from "@/hooks/use-orphan-data"
import OrphanDetailsPersonal from "@/components/orphan-details-personal"
import OrphanAcademicTab from "@/components/orphan-academic-tab"
import OrphanMedicalTab from "@/components/orphan-medical-tab"
import OrphanFormEdit from "@/components/orphan-form-edit"
import OrphanService from "@/lib/orphan-service"
import { useToast } from "@/hooks/use-toast"

export default function SupervisorOrphanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orphanId = params.id as string
  const [activeTab, setActiveTab] = useState("details")
  const { toast } = useToast()
    // State for edit UI
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const {
    orphan,
    academicRecords,
    medicalRecords,
    loading,
    error,
    fetchAcademicRecords,
    fetchMedicalRecords,
    retryAcademic,
    retryMedical
  } = useOrphanData(orphanId)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "academic") {
      fetchAcademicRecords()
    } else if (value === "medical") {
      fetchMedicalRecords()
    }
  }  // Handle orphan edit - this is now handled in the detailed component
  const handleEditOrphan = (data: any) => {
    if (!orphan) return
    
    // Format data for API
    const updateData = {
      orphanPublicId: orphanId,
      fullName: data.fullName ?? orphan.fullName,
      dateOfBirth: data.dateOfBirth ?? orphan.dateOfBirth,
      gender: data.gender ?? orphan.gender,
      background: data.background ?? data.adoptionReason ?? orphan.adoptionReason ?? '',
      educationLevel: data.educationLevel ?? orphan.educationLevel,
      origin: data.origin ?? orphan.origin,
      religion: data.religion ?? orphan.religion,
      bloodGroup: data.bloodGroup ?? orphan.bloodGroup,
      specialNeeds: data.specialNeeds ?? orphan.specialNeeds,
      hobbies: data.hobbies ?? orphan.hobbies
    }
    
    // Update via API
    OrphanService.updateOrphan(updateData)
      .then(() => {
        toast({
          title: "Orphan Updated",
          description: "Orphan details have been successfully updated."
        })
        
        // Close modal and reload data
        setIsEditModalOpen(false)
        // Force a refresh of the page to show updated data
        window.location.reload()
      })
      .catch(error => {
        console.error('Failed to update orphan:', error)
        toast({          
          title: "Update Failed",
          description: error.friendlyMessage ?? "Something went wrong. Please try again.",
          variant: "destructive"
        })
      })
  }
    // Orphan deletion is now handled in OrphanDetailsPersonal component

  // Show loading state
  if (loading.details) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading orphan details...</p>
      </div>
    )
  }

  // Show error state
  if (error.details) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
        <p className="text-red-600 mb-4">Error: {error.details}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orphans
          </Button>
          <h1 className="text-3xl font-bold">{orphan?.fullName}</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="details">Orphan Details</TabsTrigger>
          <TabsTrigger value="academic">Academic Records</TabsTrigger>
          <TabsTrigger value="medical">Medical Records</TabsTrigger>
        </TabsList>

        {/* Orphan Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <OrphanDetailsPersonal orphan={orphan} />
        </TabsContent>

        {/* Academic Records Tab */}
        <TabsContent value="academic">
          <OrphanAcademicTab
            orphanId={orphanId}
            records={academicRecords}
            isLoading={loading.academic}
            error={error.academic}
            onRetry={retryAcademic}
            fetchRecords={fetchAcademicRecords}
          />
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="medical">
          <OrphanMedicalTab
            orphanId={orphanId}
            records={medicalRecords}
            isLoading={loading.medical}
            error={error.medical}
            onRetry={retryMedical}
            fetchRecords={fetchMedicalRecords}
          />
        </TabsContent>
      </Tabs>
        {/* Edit Orphan Modal */}
      <OrphanFormEdit
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditOrphan}
        orphan={orphan}      />
    </div>
  )
}
