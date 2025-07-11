"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, Mail, Phone, DollarSign, ClipboardList } from "lucide-react"
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
import { Fundraiser as FundraiserType } from "@/lib/fundraiser-service"

interface FundraiserCardProps {
  fundraiser: FundraiserType
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export default function FundraiserCardNew({ fundraiser, onEdit, onDelete, onApprove, onReject }: Readonly<FundraiserCardProps>) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Helper function to construct image URLs consistently
  const getImageUrl = useCallback((imageUrl?: string) => {
    if (!imageUrl || imageUrl.trim() === "") return null
    // Images should come as full URLs from the backend, just like profile pictures
    return imageUrl
  }, [])

  // Memoized image URL to prevent unnecessary recalculations
  const fundraiserImageUrl = useMemo(() => {
    if (!fundraiser?.imageUrl || imageError) return null
    const url = getImageUrl(fundraiser.imageUrl)
    console.debug(`Fundraiser image URL for ${fundraiser.eventName}:`, {
      original: fundraiser.imageUrl,
      isFullUrl: fundraiser.imageUrl.startsWith('http'),
      final: url
    })
    return url
  }, [fundraiser?.imageUrl, fundraiser.eventName, imageError, getImageUrl])

  // Handle image error
  const handleImageError = useCallback(() => {
    console.warn(`Failed to load fundraiser image: ${fundraiser.imageUrl}`)
    setImageError(true)
    setImageLoading(false)
  }, [fundraiser.imageUrl])
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

  return (
    <Card className="w-full overflow-hidden">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Image section */}
        <div className="md:col-span-1">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {fundraiserImageUrl ? (
              <div className="w-full h-full relative">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-l flex items-center justify-center">
                    <div className="text-gray-400">Loading...</div>
                  </div>
                )}
                <Image
                  src={fundraiserImageUrl}
                  alt={fundraiser.eventName}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-l"
                  onError={handleImageError}
                  onLoad={() => setImageLoading(false)}
                  unoptimized
                  priority={false}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-l flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-xs">No image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content section */}
        <div className="md:col-span-2 p-6">
          <div className="flex justify-between items-start">
            <div>              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CardTitle className="text-xl">{fundraiser.eventName}</CardTitle>
                <Badge className={getStatusColor(fundraiser.status)}>
                  {fundraiser.status.charAt(0) + fundraiser.status.slice(1).toLowerCase()}
                </Badge>
              </div>
              
              {/* Show rejection reason if status is REJECTED */}
              {fundraiser.status === 'REJECTED' && (fundraiser.reason || fundraiser.inactiveReason) && (
                <div className="mt-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-700">Rejection Reason:</p>
                  <p className="text-sm text-red-600">{fundraiser.reason || fundraiser.inactiveReason}</p>
                </div>
              )}              <CardDescription className="flex items-center gap-1">
                <span className="font-medium">Coordinator:</span> {fundraiser.coordinatorName}
              </CardDescription>
            </div>            
            <div className="flex space-x-2">
              {onEdit && (
                <Button variant="outline" size="icon" onClick={() => onEdit(fundraiser.publicId)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {/* Delete button removed as requested */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Purpose</p>
                <p className="text-sm text-muted-foreground">{fundraiser.purpose}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Fundraising Reason</p>
                <p className="text-sm text-muted-foreground">{fundraiser.fundraisingReason}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm">
                    {formatDate(fundraiser.eventStartDate)} - {formatDate(fundraiser.eventEndDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">Contact Email</p>
                  <p className="text-sm truncate">{fundraiser.coordinatorEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Contact Phone</p>
                  <p className="text-sm">{fundraiser.phoneNumber}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Fundraising Goal</p>
                  <p className="text-sm">Tshs {fundraiser.goal.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="text-sm truncate">{fundraiser.branchName}</p>
                </div>
              </div>
            </div>
          </div>
            <div className="mt-5">
            <p className="text-sm font-medium">Budget Breakdown</p>
            <p className="text-sm text-muted-foreground">{fundraiser.budgetBreakdown}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {fundraiser.status === "PENDING" && onApprove && onReject && (
              <>
                <Button 
                  variant="outline" 
                  className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                  onClick={() => onApprove(fundraiser.publicId)}
                >
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                  onClick={() => onReject(fundraiser.publicId)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
