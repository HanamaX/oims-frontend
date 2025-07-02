"use client"

import { useState, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, Plus, Loader2, User, File, Calendar } from "lucide-react"
import { OrphanDetails, Guardian, Certificate } from "@/lib/orphan-types"
import GuardianForm from "./guardian-form"
import CertificateForm from "./orphan-certificates-tab"
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
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"

interface OrphanDetailsPersonalProps {
  readonly orphan: OrphanDetails | null
  readOnly?: boolean
}

export default function OrphanDetailsPersonal({ orphan, readOnly = false }: Readonly<OrphanDetailsPersonalProps>) {
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const pathname = usePathname();
  const isSupervisorDashboard = pathname?.includes("/dashboard/supervisor/");
  const [isGuardianFormOpen, setIsGuardianFormOpen] = useState(false)
  const [isDeleteGuardianDialogOpen, setIsDeleteGuardianDialogOpen] = useState(false)
  const [isDeleteOrphanDialogOpen, setIsDeleteOrphanDialogOpen] = useState(false)
  const [isEditOrphanOpen, setIsEditOrphanOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Add states for status change dialogs
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [isInactivateDialogOpen, setIsInactivateDialogOpen] = useState(false)
  const [statusChangeReason, setStatusChangeReason] = useState("")
  
  // Add state for certificates
  const [certificates, setCertificates] = useState<Certificate[]>(orphan?.certificates || [])
  
  // Image error states
  const [orphanImageError, setOrphanImageError] = useState(false)
  const [guardianImageError, setGuardianImageError] = useState(false)
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false)

  // Format date with localization
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'sw' ? 'sw-TZ' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, [language])

  // Memoize image URLs to prevent recalculation on every render
  const orphanImageUrl = useMemo(() => {
    if (!orphan?.imageUrl || orphanImageError) return null
    
    if (orphan.imageUrl.startsWith('http')) {
      return orphan.imageUrl
    }
    
    return `https://oims-4510ba404e0e.herokuapp.com${orphan.imageUrl}`
  }, [orphan?.imageUrl, orphanImageError])

  const guardianImageUrl = useMemo(() => {
    if (!orphan?.guardian?.imageUrl || guardianImageError) return null
    
    if (orphan.guardian.imageUrl.startsWith('http')) {
      return orphan.guardian.imageUrl
    }
    
    return `https://oims-4510ba404e0e.herokuapp.com${orphan.guardian.imageUrl}`
  }, [orphan?.guardian?.imageUrl, guardianImageError])

  // Image error handlers
  const handleOrphanImageError = useCallback(() => {
    setOrphanImageError(true)
  }, [])

  const handleGuardianImageError = useCallback(() => {
    setGuardianImageError(true)
  }, [])
  
  // Handle orphan image upload
  const handleOrphanImageUpload = async (file: File, orphanPublicId: string) => {
    setIsSubmitting(true)
    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload the image using the appropriate endpoint
      await API.post(`/app/oims/orphans/orphanimage/${orphanPublicId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Show success message
      toast({
        title: t("orphan.details.photoUploaded") || "Photo uploaded",
        description: t("orphan.details.photoUploadedDesc") || "Orphan photo has been uploaded successfully"
      })
      
      // Refresh the page to show the new image
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to upload orphan image:", error)
      toast({
        title: t("orphan.details.photoUploadFailed") || "Upload failed",
        description: error.response?.data?.message || t("orphan.details.errorOccurred") || "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle guardian image upload
  const handleGuardianImageUpload = async (file: File, guardianPublicId: string) => {
    setIsSubmitting(true)
    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload the image using the appropriate endpoint for guardian images
      await API.post(`/app/oims/orphans/guardians/image/${guardianPublicId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Show success message
      toast({
        title: t("orphan.details.guardianPhotoUploaded") || "Photo uploaded",
        description: t("orphan.details.guardianPhotoUploadedDesc") || "Guardian photo has been uploaded successfully"
      })
      
      // Refresh the page to show the new image
      window.location.reload()
    } catch (error: any) {
      console.error("Failed to upload guardian image:", error)
      toast({
        title: t("orphan.details.photoUploadFailed") || "Upload failed",
        description: error.response?.data?.message || t("orphan.details.errorOccurred") || "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
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
      await API.post(`/app/oims/orphans/guardians`, enrichedData)
        // Show success message
      toast({
        title: t("orphan.details.guardianAdded"),
        description: t("orphan.details.guardianAddedDesc")
      })
      
      // Close form and refresh page
      setIsGuardianFormOpen(false)
      window.location.reload()
    } catch (error: any) {      console.error("Failed to add guardian:", error);
      toast({
        title: t("orphan.details.guardianAddFailed"),
        description: error.response?.data?.message ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.guardianUpdated"),
        description: t("orphan.details.guardianUpdatedDesc")
      })
      
      // Close form and refresh page
      setIsGuardianFormOpen(false)
      window.location.reload()
    } catch (error: any) {      console.error("Failed to update guardian:", error);
      toast({
        title: t("orphan.details.guardianUpdateFailed"),
        description: error.response?.data?.message ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.guardianDeleted"),
        description: t("orphan.details.guardianDeletedDesc")
      })
      
      // Close dialog and refresh page
      setIsDeleteGuardianDialogOpen(false)
      window.location.reload()
    } catch (error: any) {      console.error("Failed to delete guardian:", error);
      toast({
        title: t("orphan.details.guardianDeleteFailed"),
        description: error.response?.data?.message ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.orphanUpdated"),
        description: t("orphan.details.orphanUpdatedDesc")
      })
      
      // Close form and refresh page
      setIsEditOrphanOpen(false)
      window.location.reload()
    } catch (error: any) {      console.error("Failed to update orphan:", error);
      toast({
        title: t("orphan.details.orphanUpdateFailed"),
        description: error.response?.data?.message ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.orphanDeleted"),
        description: t("orphan.details.orphanDeletedDesc")
      })
        // Redirect to orphans list page
      window.location.href = '/dashboard/supervisor/orphans'
    } catch (error: any) {      console.error("Failed to delete orphan:", error);
      toast({
        title: t("orphan.details.orphanDeleteFailed"),
        description: error.response?.data?.message ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.orphanActivated"),
        description: t("orphan.details.orphanActivatedDesc")
      });
      
      setIsActivateDialogOpen(false);
      setStatusChangeReason("");
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to activate orphan:", error);      toast({
        title: t("orphan.details.activationFailed"),
        description: error.friendlyMessage ?? t("orphan.details.errorOccurred"),
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
        title: t("orphan.details.orphanInactivated"),
        description: t("orphan.details.orphanInactivatedDesc")
      });
      
      setIsInactivateDialogOpen(false);
      setStatusChangeReason("");
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to inactivate orphan:", error);      toast({
        title: t("orphan.details.inactivationFailed"),
        description: error.friendlyMessage ?? t("orphan.details.errorOccurred"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle adding a certificate
  const handleAddCertificate = async (certificate: Certificate) => {
    if (!orphan?.publicId) return
    
    // The actual certificate upload is now handled in the CertificateForm component
    // using the correct API endpoint: /api/certificates/upload/{orphanPublicId}/{certificateType}
    
    // Here we just need to update our local state to reflect the change
    try {
      // Add the certificate to our local state
      const newCertificate = {
        ...certificate,
        id: `cert-${Date.now()}`, 
        publicId: `cert-${Date.now()}`,
        orphanPublicId: orphan.publicId
      }
      
      // Add the new certificate to the list
      setCertificates([...certificates, newCertificate])
      
      // Close the form
      setIsCertificateFormOpen(false)
      
      // Show success message
      toast({
        title: t("orphan.certificates.addSuccess") || "Certificate Added",
        description: t("orphan.certificates.addSuccessDesc") || "Certificate has been added successfully"
      })
      
      // In a real implementation, we might want to refresh the page or fetch updated certificates
      // window.location.reload()
    } catch (error: any) {
      console.error("Failed to add certificate:", error)
      toast({
        title: t("orphan.certificates.addFailed") || "Failed to add certificate",
        description: error.message || t("orphan.details.errorOccurred") || "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

    return (
    <div className="grid grid-cols-1 gap-6 animate-fadeIn">

      {/* Main Details - Full width */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {/* Small profile image next to name */}
              <span className="flex items-center gap-2">
                <span className="relative w-10 h-10 cursor-pointer group" onClick={() => document.getElementById('orphan-profile-upload')?.click()}>
                  {orphanImageUrl ? (
                    <Image
                      src={orphanImageUrl}
                      alt={`${orphan.fullName} Profile`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full border border-blue-300 shadow-sm"
                      onError={handleOrphanImageError}
                      unoptimized
                      priority
                    />
                  ) : (
                    <span className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-blue-300 text-blue-400">
                      <User className="h-6 w-6" />
                    </span>
                  )}
                  <input
                    id="orphan-profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file && orphan?.publicId) {
                        handleOrphanImageUpload(file, orphan.publicId);
                      }
                    }}
                  />
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition-opacity">
                    <Edit className="h-3 w-3" />
                  </span>
                </span>
                <span className="font-bold text-lg">{orphan.fullName}</span>
              </span>
            </CardTitle>
            {orphan.status && (
              <Badge className={`${orphan.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {orphan.status === 'ACTIVE' ? t("orphan.details.active") : t("orphan.details.inactive")}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.fullName")}</span>
              <span className="px-3 py-1 inline-block">{orphan.fullName}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.age")}</span>
              <span className="px-3 py-1 inline-block">{orphan.age} {t("orphan.details.years")}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.dateOfBirth")}</span>
              <span className="px-3 py-1 inline-block">{formatDate(orphan.dateOfBirth ?? '')}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.gender")}</span>
              <span className="px-3 py-1 inline-block">{orphan.gender === 'M' ? t("orphan.details.male") : t("orphan.details.female")}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.origin")}</span>
              <span className="px-3 py-1 inline-block">{orphan.origin}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.religion")}</span>
              <span className="px-3 py-1 inline-block">{orphan.religion}</span>
            </div>
            
            <div>
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[100px]">{t("orphan.details.bloodGroup")}</span>
              <span className="px-3 py-1 inline-block">{orphan.bloodGroup}</span>
            </div>
            
            <div className="mb-2">
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.branch")}</span>
              <span className="px-3 py-1 inline-block">{orphan.branchName || "-"}</span>
            </div>
          </div>

          <Separator />
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="mb-2">
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.adoptionReason")}</span>
              <span className="px-3 py-1 inline-block">{orphan.adoptionReason || "-"}</span>
            </div>
          </div>

          <Separator />

          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-blue-700 px-2 py-1 inline-block">{t("orphan.details.education")}</h3>
            <div className="mt-4">
              <div className="mb-2">
                <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.currentLevel")}</span>
                <span className="px-3 py-1 inline-block">{orphan.educationLevel || t("orphan.details.none")}</span>
              </div>
              <div className="mb-2">
                <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.currentSchool")}</span>
                <span className="px-3 py-1 inline-block">{orphan.currentSchoolName ?? t("orphan.details.notEnrolled")}</span>
              </div>
              <div className="mb-2">
                <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.previousSchool")}</span>
                <span className="px-3 py-1 inline-block">{orphan.previousSchoolName ?? t("orphan.details.none")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="mb-2">
                <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.specialNeeds")}</span>
                <span className="px-3 py-1 inline-block">{orphan.specialNeeds ?? t("orphan.details.none")}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="mb-2">
                <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.hobbies")}</span>
                <span className="px-3 py-1 inline-block">{orphan.hobbies ?? t("orphan.details.none")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="mb-2">
              <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.allergies")}</span>
              {orphan.allergies && orphan.allergies.length > 0 ? (
                <span className="px-3 py-1 inline-block">
                  {orphan.allergies.map((allergy, index) => (
                    <span key={`allergy-${allergy}`}>{allergy}{index < orphan.allergies.length - 1 ? ', ' : ''}</span>
                  ))}
                </span>
              ) : (
                <span className="px-3 py-1 inline-block">{t("orphan.details.none")}</span>
              )}
            </div>
          </div>
        </CardContent>
        
        {!readOnly && (
          <div className="border-t p-4 flex flex-wrap justify-end gap-2 bg-gray-50">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('orphan-photo-upload-btn')?.click()}
              className="rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 mr-auto"
              disabled={isSubmitting}
            >
              <input
                id="orphan-photo-upload-btn"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file && orphan?.publicId) {
                    handleOrphanImageUpload(file, orphan.publicId);
                  }
                }}
              />
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Image className="h-4 w-4 mr-1" width={16} height={16} src="/icons/camera.svg" alt="Upload" />
              )}
              {t("orphan.details.uploadPhoto") || "Upload Photo"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditOrphanOpen(true)}
              className="rounded-xl"
            >
              <Edit className="h-4 w-4 mr-1" />
              {t("orphan.details.editDetails")}
            </Button>
            {orphan.status?.toLowerCase() !== 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50 text-green-700 hover:bg-green-100 rounded-xl"
                onClick={() => setIsActivateDialogOpen(true)}
              >
                {t("orphan.details.activate")}
              </Button>
            )}
            {orphan.status?.toLowerCase() === 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl"
                onClick={() => setIsInactivateDialogOpen(true)}
              >
                {t("orphan.details.inactivate")}
              </Button>
            )}
          </div>
        )}
      </Card>
      
      {/* Orphan Activation Dialog */}
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>        <AlertDialogContent className="rounded-xl overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("orphan.details.activateOrphan")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("orphan.details.activateOrphanDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              {t("orphan.details.reasonForActivation")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder={t("orphan.details.activationPlaceholder")}
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
              className="rounded-xl"
            >
              {t("orphan.details.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleActivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("orphan.details.processing")}
                </>
              ) : (
                t("orphan.details.activate")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Orphan Inactivation Dialog */}
      <AlertDialog open={isInactivateDialogOpen} onOpenChange={setIsInactivateDialogOpen}>        <AlertDialogContent className="rounded-xl overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("orphan.details.inactivateOrphan")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("orphan.details.inactivateOrphanDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              {t("orphan.details.reasonForInactivation")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder={t("orphan.details.inactivationPlaceholder")}
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
              className="rounded-xl"
            >
              {t("orphan.details.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleInactivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("orphan.details.processing")}
                </>
              ) : (
                t("orphan.details.inactivate")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Guardian Information - Full width */}
      <Card className="shadow-lg rounded-xl overflow-hidden">        
        <CardHeader>
          <div>
            <CardTitle>{t("orphan.details.guardianInformation")}</CardTitle>
            <CardDescription>{t("orphan.details.guardianInformationDesc")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {orphan.guardian ? (
            <div className="space-y-6">              
              {/* Guardian Image - centered at top, clickable for upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('guardian-profile-upload')?.click()}>
                  {guardianImageUrl ? (
                    <div className="w-36 h-36 overflow-hidden relative rounded-full border-4 border-blue-100 shadow-md">
                      <Image 
                        src={guardianImageUrl}
                        alt={`${orphan.guardian.name} Profile`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-full"
                        onError={handleGuardianImageError}
                        unoptimized
                        priority
                      />
                      {!readOnly && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-gray-100 rounded-full border-4 border-blue-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <div className="text-blue-500">
                        <User className="h-16 w-16" />
                      </div>
                      {!readOnly && (
                        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                          <Edit className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!readOnly && orphan.guardian?.publicId && (
                  <input
                    id="guardian-profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file && orphan?.guardian?.publicId) {
                        handleGuardianImageUpload(file, orphan.guardian.publicId);
                      }
                    }}
                  />
                )}
              </div>
              
              {/* Guardian Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <div className="mb-2">
                    <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.name")}</span>
                    <span className="px-3 py-1 inline-block">{orphan.guardian.name}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.relationship")}</span>
                  <span className="px-3 py-1 inline-block">{orphan?.guardian?.relationship || "-"}</span>
                </div>
                
                <div className="mb-2">
                  <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.phoneNumber")}</span>
                  <span className="px-3 py-1 inline-block">{orphan.guardian.contactNumber || "-"}</span>
                </div>
                
                <div className="mb-2">
                  <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.email")}</span>
                  <span className="px-3 py-1 inline-block">{orphan.guardian.email || "-"}</span>
                </div>
                
                <div className="mb-2">
                  <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.address")}</span>
                  <span className="px-3 py-1 inline-block">{orphan.guardian.address || "-"}</span>
                </div>
                
                <div className="mb-2">
                  <span className="text-blue-600 font-medium px-2 py-1 inline-block min-w-[120px]">{t("orphan.details.occupation")}</span>
                  <span className="px-3 py-1 inline-block">{orphan.guardian.occupation || "-"}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic p-4 text-center">{t("orphan.details.noGuardianInfo")}</p>
          )}
        </CardContent>
        {!readOnly && (
          <div className="border-t p-4 flex flex-wrap justify-end gap-2 bg-gray-50">
            {orphan.guardian?.publicId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('guardian-photo-upload-btn')?.click()}
                className="rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 mr-auto"
                disabled={isSubmitting}
              >
                <input
                  id="guardian-photo-upload-btn"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && orphan?.guardian?.publicId) {
                      handleGuardianImageUpload(file, orphan.guardian.publicId);
                    }
                  }}
                />
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Image className="h-4 w-4 mr-1" width={16} height={16} src="/icons/camera.svg" alt="Upload" />
                )}
                {t("orphan.details.uploadGuardianPhoto") || "Upload Photo"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGuardianFormOpen(true)}
              className="rounded-xl flex items-center"
            >
              {orphan.guardian ? (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  {t("orphan.details.editGuardian")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  {t("orphan.details.addGuardian")}
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Certificate Records - Full width */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>{t("orphan.details.certificateRecords")}</CardTitle>
            <CardDescription>{t("orphan.details.certificateRecordsDesc")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <p className="text-muted-foreground italic p-4 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">{t("orphan.details.noCertificates")}</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg border border-blue-100 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 text-blue-600 font-bold border-b border-blue-200">{t("orphan.details.certificateType")}</th>
                      <th className="text-left py-3 px-4 text-blue-600 font-bold border-b border-blue-200">{t("orphan.details.certificateDate")}</th>
                      <th className="text-right py-3 px-4 text-blue-600 font-bold border-b border-blue-200">{t("orphan.details.certificateOptions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert, index) => (
                      <tr key={cert.id || `cert-${index}`} className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <File className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {cert.type === 'BIRTH_CERTIFICATE' && (t("orphan.details.birthCertificate") || "Birth Certificate")}
                              {cert.type === 'CLASS_7' && (t("orphan.details.class7Certificate") || "Class 7 Certificate")}
                              {cert.type === 'FORM_4' && (t("orphan.details.form4Certificate") || "Form 4 Certificate")}
                              {cert.type === 'FORM_6' && (t("orphan.details.form6Certificate") || "Form 6 Certificate")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>{cert.issueDate ? formatDate(cert.issueDate) : '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="outline" size="sm" className="h-9 px-4 text-blue-600 rounded-lg border-blue-200 hover:bg-blue-50 font-medium">
                            {t("orphan.details.viewCertificate")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
        {!readOnly && (
          <div className="border-t p-4 flex justify-end space-x-2 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl flex items-center w-full"
              onClick={() => setIsCertificateFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("orphan.details.addCertificate")}
            </Button>
          </div>
        )}
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
          
          {/* Certificate Form */}
          {orphan && (
            <CertificateForm
              open={isCertificateFormOpen}
              onOpenChange={setIsCertificateFormOpen}
              onSubmit={handleAddCertificate}
              orphanId={orphan.publicId}
            />
          )}
          
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