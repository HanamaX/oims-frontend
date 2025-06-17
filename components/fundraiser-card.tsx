"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Calendar, Mail, Phone, DollarSign, ClipboardList } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/contexts/LanguageContext"

// Define types for our data
import { Fundraiser } from "@/lib/fundraiser-service"

interface FundraiserCardProps {
  fundraiser: Fundraiser
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
  onComplete?: (id: string, reason?: string) => void
  onCancel?: (id: string, reason: string) => void
  readOnly?: boolean
}

export default function FundraiserCard({ 
  fundraiser, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  onComplete, 
  onCancel,
  readOnly = false 
}: Readonly<FundraiserCardProps>) {
  const { t, language } = useLanguage()
  const [imageError, setImageError] = useState(false)

  // Helper function to construct image URLs consistently
  const getImageUrl = useCallback((imageUrl?: string) => {
    if (!imageUrl || imageUrl.trim() === "") return null
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    return `https://oims-4510ba404e0e.herokuapp.com${imageUrl}`
  }, [])

  // Memoized image URL to prevent unnecessary recalculations
  const fundraiserImageUrl = useMemo(() => {
    if (!fundraiser?.imageUrl || imageError) return null
    return getImageUrl(fundraiser.imageUrl)
  }, [fundraiser?.imageUrl, imageError, getImageUrl])

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])
  // Format date
  const formatDate = useCallback((dateString: string) => {
    // Using Intl.DateTimeFormat for proper localization
    const date = new Date(dateString);
    
    // Set locale based on current language
    const locale = language === 'sw' ? 'sw-TZ' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, [language])
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  // Get translated status
  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return t("fundraiser.status.approved")
      case "COMPLETED":
        return t("fundraiser.status.completed")
      case "PENDING":
        return t("fundraiser.status.pending")
      case "REJECTED":
        return t("fundraiser.status.rejected")
      default:
        return status.charAt(0) + status.slice(1).toLowerCase()
    }
  }

  return (
    <Card className="w-full overflow-hidden">      <div className="grid md:grid-cols-3 gap-4">
        {/* Image section */}
        <div className="md:col-span-1">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {fundraiserImageUrl ? (
              <div className="w-full h-full relative">
                <Image
                  src={fundraiserImageUrl}
                  alt={fundraiser.eventName}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-l"
                  onError={handleImageError}
                  unoptimized
                  priority
                />
              </div>
            ) : (              <div className="w-full h-full bg-gray-100 rounded-l flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-xs">{t("fundraiser.image.placeholder")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content section */}
        <div className="md:col-span-2 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">                <CardTitle className="text-xl">{fundraiser.eventName}</CardTitle>
                <Badge className={getStatusColor(fundraiser.status)}>
                  {getTranslatedStatus(fundraiser.status)}
                </Badge>
              </div>              {/* Show rejection reason if status is REJECTED */}
              {fundraiser.status === 'REJECTED' && (fundraiser.reason ?? fundraiser.inactiveReason) && (                <div className="mt-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-700">{t("fundraiser.card.rejectionReason")}:</p>
                  <p className="text-sm text-red-600">{fundraiser.reason ?? fundraiser.inactiveReason}</p>
                </div>
              )}              <CardDescription className="flex items-center gap-1">
                <span className="font-medium">{t("fundraiser.card.coordinator")}:</span> {fundraiser.coordinatorName}
              </CardDescription>
            </div>            <div className="flex space-x-2">
              {!readOnly && onEdit && (
                <Button variant="outline" size="icon" onClick={() => onEdit(fundraiser.publicId)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}              {/* Delete button and dialog removed as requested */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">              <div>
                <p className="text-sm font-medium">{t("fundraiser.card.purpose")}</p>
                <p className="text-sm text-muted-foreground">{fundraiser.purpose}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">{t("fundraiser.card.fundraisingReason")}</p>
                <p className="text-sm text-muted-foreground">{fundraiser.fundraisingReason}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("fundraiser.card.timeline")}</p>
                  <p className="text-sm">
                    {formatDate(fundraiser.eventStartDate)} - {formatDate(fundraiser.eventEndDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">{t("fundraiser.card.contactEmail")}</p>
                  <p className="text-sm truncate">{fundraiser.coordinatorEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />                <div>
                  <p className="text-xs text-muted-foreground">{t("fundraiser.card.contactPhone")}</p>
                  <p className="text-sm">{fundraiser.phoneNumber}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("fundraiser.card.fundraisingGoal")}</p>
                  <p className="text-sm">{t("fundraiser.currency")} {fundraiser.goal.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">{t("fundraiser.card.branch")}</p>
                  <p className="text-sm truncate">{fundraiser.branchName}</p>
                </div>
              </div>
            </div>
          </div>            <div className="mt-5">
            <p className="text-sm font-medium">{t("fundraiser.card.budgetBreakdown")}</p>
            <p className="text-sm text-muted-foreground">{fundraiser.budgetBreakdown}</p>
          </div><div className="mt-6 flex flex-wrap gap-3">
            {!readOnly && fundraiser.status === "PENDING" && onApprove && onReject && (
              <>                <Button 
                  variant="outline" 
                  className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                  onClick={() => onApprove(fundraiser.publicId)}
                >                  {t("fundraiser.card.approve")}
                </Button><AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                    >
                      {t("fundraiser.card.reject")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("fundraiser.card.rejectFundraiser")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("fundraiser.card.rejectReason")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">                      <input
                        id="rejectReason"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={t("fundraiser.card.enterRejectReason")}
                        defaultValue={t("fundraiser.card.rejectedBy")}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("form.cancel")}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          const reasonInput = document.getElementById('rejectReason') as HTMLInputElement;
                          onReject(fundraiser.publicId, reasonInput?.value || t("fundraiser.card.rejectedBy"))
                        }}
                      >
                        {t("fundraiser.card.confirmRejection")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}              {!readOnly && fundraiser.status === "APPROVED" && (
                <>                  <Button 
                    variant="outline" 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                    onClick={() => {
                      // Use router navigation if in Next.js, otherwise fallback to direct navigation
                      if (typeof window !== "undefined" && window.history) {
                        window.location.href = `/dashboard/shared/campaign/${fundraiser.publicId}`;
                      }
                    }}
                  >
                    {t("fundraiser.card.viewCampaign")}
                  </Button>
                  
                  {/* Mark as Completed Button
                  {onComplete && (
                    <Button 
                      variant="outline" 
                      className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                      onClick={() => onComplete(fundraiser.publicId)}
                    >
                      Mark as Completed
                    </Button>
                  )} */}
                  
                  {/* Cancel Button */}                  {onCancel && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                        >
                          {t("fundraiser.card.cancelFundraiserButton")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("fundraiser.card.cancelFundraiser")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("fundraiser.card.cancelReason")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                          <input
                            id="cancelReason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder={t("fundraiser.card.enterCancelReason")}
                            defaultValue={t("fundraiser.card.cancelledBy")}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("fundraiser.card.goBack")}</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              const reasonInput = document.getElementById('cancelReason') as HTMLInputElement;
                              onCancel(fundraiser.publicId, reasonInput?.value || t("fundraiser.card.cancelledBy"))
                            }}
                          >
                            {t("fundraiser.card.confirmCancellation")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>                    </AlertDialog>
                  )}
                </>
              )
            }            {/* View Details button for read-only mode (orphanage admin view) */}
            {readOnly && fundraiser.status === "APPROVED" && (              <Button 
                variant="outline" 
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                onClick={() => {
                  window.location.href = `/dashboard/shared/campaign/${fundraiser.publicId}`;
                }}
              >
                {t("fundraiser.card.viewDetails")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
