"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Trash2, Phone, Calendar, Briefcase, Mail, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  volunteer: Volunteer
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
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
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
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
            </div>
            <CardDescription>{volunteer.branchName ?? `Branch ID: ${volunteer.branchPublicId}`}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {!readOnly && volunteer.status.toUpperCase() === "PENDING" && onApprove && (
              <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100" onClick={() => onApprove(volunteer.publicId)}>
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
            {!readOnly && volunteer.status.toUpperCase() === "PENDING" && onReject && (
              <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100" onClick={() => onReject(volunteer.publicId)}>
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            )}
          </div>
        </div>
      </CardHeader>      <CardContent className="space-y-4">
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
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Scheduled Date</p>
              <p className="text-sm">{formatDate(volunteer.scheduledDate)}</p>
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
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Registered On</p>
              <p className="text-sm">{volunteer.createdAt ? formatDate(volunteer.createdAt) : "Unknown"}</p>
            </div>
          </div>
        </div>      </CardContent><CardFooter className="flex justify-end">
        {onDelete && !readOnly && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete the volunteer &quot;{volunteer.name}&quot;. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(volunteer.publicId)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
}
