"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Mail, Phone, Calendar, Briefcase, Clock } from "lucide-react"
// Removed unused alert dialog imports

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
}

interface VolunteerCardProps {
  readonly volunteer: Volunteer
  readonly onApprove?: (id: string) => void
  readonly onReject?: (id: string) => void
  readonly onDelete?: (id: string) => void
}

export default function VolunteerCard({ volunteer, onApprove, onReject, onDelete }: VolunteerCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{volunteer.name}</CardTitle>
            <CardDescription>Branch ID: {volunteer.branchPublicId}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {onApprove && volunteer.publicId && (
              <Button variant="outline" size="sm" className="bg-green-50 text-green-600" onClick={() => onApprove(volunteer.publicId)}>
                <Edit className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
            {onReject && volunteer.publicId && (
              <Button variant="outline" size="sm" className="bg-red-50 text-red-600" onClick={() => onReject(volunteer.publicId)}>
                <Trash2 className="h-4 w-4 mr-1" /> Reject
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm truncate max-w-[180px]">{volunteer.email ?? "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{volunteer.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Job Role</p>
              <p className="text-sm">{volunteer.jobRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Scheduled Date</p>
              <p className="text-sm">{formatDate(volunteer.scheduledDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Registered On</p>
              <p className="text-sm">{volunteer.createdAt ? formatDate(volunteer.createdAt) : "Unknown"}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Contact Volunteer
        </Button>
      </CardFooter>
    </Card>
  )
}
