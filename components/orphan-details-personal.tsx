"use client"

import { useState, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, Plus, Loader2, User } from "lucide-react"
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
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

interface OrphanDetailsPersonalProps {
  readonly orphan: OrphanDetails | null
  readOnly?: boolean
}

export default function OrphanDetailsPersonal({ orphan, readOnly = false }: Readonly<OrphanDetailsPersonalProps>) {
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const [isGuardianFormOpen, setIsGuardianFormOpen] = useState(false)
  const [isDeleteGuardianDialogOpen, setIsDeleteGuardianDialogOpen] = useState(false)
  const [isDeleteOrphanDialogOpen, setIsDeleteOrphanDialogOpen] = useState(false)
  const [isEditOrphanOpen, setIsEditOrphanOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Add states for status change dialogs
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [isInactivateDialogOpen, setIsInactivateDialogOpen] = useState(false)
  const [statusChangeReason, setStatusChangeReason] = useState("")
  
  // Image error states
  const [orphanImageError, setOrphanImageError] = useState(false)
  const [guardianImageError, setGuardianImageError] = useState(false)

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
    return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Orphan Image */}
      <Card className="md:col-span-1">        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("orphan.details.profileImage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {orphanImageUrl ? (
            <div className="w-64 h-64 overflow-hidden relative rounded-full border">
              <Image 
                src={orphanImageUrl}
                alt={`${orphan.fullName} Profile`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
                onError={handleOrphanImageError}
                unoptimized
                priority
              />
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded-full border flex items-center justify-center">
              <div className="text-blue-500">
                <User className="h-12 w-12" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Details */}
      <Card className="md:col-span-2">        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>{t("orphan.details.personalInformation")}</CardTitle>
            {orphan.status && (
              <Badge className={`${orphan.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {orphan.status === 'ACTIVE' ? t("orphan.details.active") : t("orphan.details.inactive")}
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
                {t("orphan.details.editDetails")}
              </Button>
              {orphan.status?.toLowerCase() !== 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-50 text-green-700 hover:bg-green-100"
                  onClick={() => setIsActivateDialogOpen(true)}
                >
                  {t("orphan.details.activate")}
                </Button>
              )}
              {orphan.status?.toLowerCase() === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-orange-50 text-orange-700 hover:bg-orange-100"
                  onClick={() => setIsInactivateDialogOpen(true)}
                >
                  {t("orphan.details.inactivate")}
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.fullName")}</h3>
              <p className="text-base font-medium">{orphan.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.age")}</h3>
              <p className="text-base font-medium">{orphan.age} {t("orphan.details.years")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.dateOfBirth")}</h3>
              <p className="text-base font-medium">{formatDate(orphan.dateOfBirth ?? '')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.gender")}</h3>
              <p className="text-base font-medium">{orphan.gender === 'M' ? t("orphan.details.male") : t("orphan.details.female")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.origin")}</h3>
              <p className="text-base font-medium">{orphan.origin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.religion")}</h3>
              <p className="text-base font-medium">{orphan.religion}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.bloodGroup")}</h3>
              <p className="text-base font-medium">{orphan.bloodGroup}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.branch")}</h3>
              <p className="text-base font-medium">{orphan.branchName}</p>
            </div>
          </div>

          <Separator />          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("orphan.details.adoptionReason")}</h3>
            <p className="text-base">{orphan.adoptionReason}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("orphan.details.education")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-muted-foreground">{t("orphan.details.currentLevel")}</h4>
                <p className="text-sm">{orphan.educationLevel}</p>
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground">{t("orphan.details.currentSchool")}</h4>
                <p className="text-sm">{orphan.currentSchoolName ?? t("orphan.details.notEnrolled")}</p>
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground">{t("orphan.details.previousSchool")}</h4>
                <p className="text-sm">{orphan.previousSchoolName ?? t("orphan.details.none")}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("orphan.details.specialNeeds")}</h3>
            <p className="text-base">{orphan.specialNeeds ?? t("orphan.details.none")}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("orphan.details.hobbies")}</h3>
            <p className="text-base">{orphan.hobbies ?? t("orphan.details.none")}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("orphan.details.allergies")}</h3>
            {orphan.allergies && orphan.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {orphan.allergies.map((allergy) => (
                  <Badge key={`allergy-${allergy}`} variant="outline">{allergy}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-base">{t("orphan.details.noKnownAllergies")}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Orphan Activation Dialog */}
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>        <AlertDialogContent>
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
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            >
              {t("orphan.details.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleActivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
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
      <AlertDialog open={isInactivateDialogOpen} onOpenChange={setIsInactivateDialogOpen}>        <AlertDialogContent>
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
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            >
              {t("orphan.details.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleInactivateOrphan}
              disabled={!statusChangeReason.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
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
      
      {/* Guardian Information */}
      <Card>        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("orphan.details.guardianInformation")}</CardTitle>
            <CardDescription>{t("orphan.details.guardianInformationDesc")}</CardDescription>
          </div>
          {!readOnly && (
            orphan.guardian ? (              
            <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsGuardianFormOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {t("orphan.details.edit")}
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
                {t("orphan.details.addGuardian")}
              </Button>
            )
          )}
        </CardHeader><CardContent>
          {orphan.guardian ? (
            <div className="space-y-4">              {/* Guardian Image - centered at top */}
              <div className="flex flex-col items-center">
                {guardianImageUrl ? (
                  <div className="w-32 h-32 overflow-hidden relative rounded-full border">
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
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-full border flex items-center justify-center">
                    <div className="text-blue-500">
                      <User className="h-12 w-12" />
                    </div>
                  </div>
                )}
              </div>
                {/* Guardian Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.name")}</h3>
                  <p className="text-base font-medium">{orphan.guardian.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.relationship")}</h3>
                  <p className="text-base">{orphan.guardian.relationship}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.phoneNumber")}</h3>
                  <p className="text-base">{orphan.guardian.contactNumber || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.email")}</h3>
                  <p className="text-base">{orphan.guardian.email || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.address")}</h3>
                  <p className="text-base">{orphan.guardian.address || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("orphan.details.occupation")}</h3>
                  <p className="text-base">{orphan.guardian.occupation || "-"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">{t("orphan.details.noGuardianInfo")}</p>
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