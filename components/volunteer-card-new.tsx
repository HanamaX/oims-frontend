"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Phone, Calendar, Briefcase, Mail, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"
import { useCallback } from "react"

// Define types for our data
interface Volunteer {
  publicId: string
  name: string
  email?: string
  phoneNumber: string
  scheduledDate: string
  jobRole: string
  branchPublicId: string
  branchName?: string
  status: string
  createdAt?: string
  reason?: string  // For rejection reason
  inactiveReason?: string  // Alternative field name for rejection reason
}

interface VolunteerCardProps {
  volunteer: Volunteer
  onApprove?: (id: string) => void
  onReject?: (id: string) => void  // This will now initiate the rejection flow
  onDelete?: (id: string) => void
  readOnly?: boolean
}

export default function VolunteerCardNew({ 
  volunteer, 
  onApprove, 
  onReject, 
  onDelete,
  readOnly = false
}: Readonly<VolunteerCardProps>) {
  const { t, language } = useLanguage()

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
  // Get status badge color with translations
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("volunteer.card.pending")}</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{t("volunteer.card.approved")}</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{t("volunteer.card.rejected")}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>        <div className="flex items-center gap-2">
              <CardTitle>{volunteer.name}</CardTitle>
              {getStatusBadge(volunteer.status)}
            </div>            <CardDescription>{volunteer.branchName ?? `${t("volunteer.card.branchId")}: ${volunteer.branchPublicId}`}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {!readOnly && volunteer.status.toUpperCase() === "PENDING" && onApprove && (
              <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100" onClick={() => onApprove(volunteer.publicId)}>
                <CheckCircle className="h-4 w-4 mr-1" /> {t("volunteer.card.approve")}
              </Button>
            )}
            {!readOnly && volunteer.status.toUpperCase() === "PENDING" && onReject && (
              <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100" onClick={() => onReject(volunteer.publicId)}>
                <XCircle className="h-4 w-4 mr-1" /> {t("volunteer.card.reject")}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>      <CardContent className="space-y-4">        {/* Rejection reason shown for rejected volunteers */}
        {volunteer.status === "REJECTED" && (volunteer.reason ?? volunteer.inactiveReason) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-700">{t("volunteer.card.rejectionReason")}:</p>
            <p className="text-sm text-red-600">{volunteer.reason ?? volunteer.inactiveReason}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t("volunteer.card.email")}</p>
              <p className="text-sm truncate max-w-[180px]">{volunteer.email ?? t("volunteer.card.notProvided")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t("volunteer.card.phone")}</p>
              <p className="text-sm">{volunteer.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t("volunteer.card.scheduledDate")}</p>
              <p className="text-sm">{formatDate(volunteer.scheduledDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t("volunteer.card.jobRole")}</p>
              <p className="text-sm">{volunteer.jobRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t("volunteer.card.registeredOn")}</p>
              <p className="text-sm">{volunteer.createdAt ? formatDate(volunteer.createdAt) : t("volunteer.card.unknown")}</p>
            </div>
          </div>
        </div></CardContent><CardFooter className="flex justify-end">
        {/* Delete button removed as requested */}
      </CardFooter>
    </Card>
  )
}
