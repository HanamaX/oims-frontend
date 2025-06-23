"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VolunteerCardNew from "@/components/volunteer-card-new"
import VolunteerService, { CurrentVolunteerResponse } from "@/lib/volunteer-service"
import { useLanguage, T } from "@/contexts/LanguageContext"

export default function VolunteersPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [volunteers, setVolunteers] = useState<CurrentVolunteerResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  } | null>(null)

  // Fetch volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true)
        const data = await VolunteerService.getCurrentVolunteers()
        setVolunteers(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching volunteers:", err)
        setError("Failed to load volunteers. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  // Filter volunteers based on search term and status
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phoneNumber.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle approve volunteer
  const handleApprove = async (id: string) => {
    try {
      await VolunteerService.updateVolunteerStatus(id, "APPROVED")
      
      // Update local state
      setVolunteers(
        volunteers.map((volunteer) => 
          volunteer.publicId === id ? { ...volunteer, status: "APPROVED" } : volunteer
        )
      )
      
      // Show success notification
      setNotification({
        message: "Volunteer approved successfully",
        type: "success",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      
    } catch (error) {
      console.error("Failed to approve volunteer:", error)
      
      // Show error notification
      setNotification({
        message: "Failed to approve volunteer. Please try again.",
        type: "error",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // Handle reject volunteer
  const handleReject = async (id: string) => {
    try {
      await VolunteerService.updateVolunteerStatus(id, "REJECTED")
      
      // Update local state
      setVolunteers(
        volunteers.map((volunteer) => 
          volunteer.publicId === id ? { ...volunteer, status: "REJECTED" } : volunteer
        )
      )
      
      // Show success notification
      setNotification({
        message: "Volunteer rejected successfully",
        type: "success",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      
    } catch (error) {
      console.error("Failed to reject volunteer:", error)
      
      // Show error notification
      setNotification({
        message: "Failed to reject volunteer. Please try again.",
        type: "error",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // Handle delete volunteer
  const handleDelete = async (id: string) => {
    try {
      await VolunteerService.deleteVolunteer(id)
      
      // Update local state
      setVolunteers(volunteers.filter((volunteer) => volunteer.publicId !== id))
      
      // Show success notification
      setNotification({
        message: "Volunteer removed successfully",
        type: "success",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      
    } catch (error) {
      console.error("Failed to delete volunteer:", error)
      
      // Show error notification
      setNotification({
        message: "Failed to remove volunteer. Please try again.",
        type: "error",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground"><T k="volunteers.loading" /></p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            <T k="volunteers.tryAgain" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {notification && notification.visible && (
        <div className={`p-4 rounded-md ${
          notification.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  aria-label="Close notification"
                  title="Close"
                  className={`inline-flex rounded-md p-1.5 ${
                    notification.type === "success"
                      ? "bg-green-100 text-green-500 hover:bg-green-200"
                      : "bg-red-100 text-red-500 hover:bg-red-200"
                  }`}
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><T k="volunteers.title" /></h1>
        <p className="text-muted-foreground mt-2">
          <T k="volunteers.viewAcrossBranches" />
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("volunteers.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("volunteers.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="volunteers.status.all" /></SelectItem>
              <SelectItem value="PENDING"><T k="volunteers.status.pending" /></SelectItem>
              <SelectItem value="APPROVED"><T k="volunteers.status.approved" /></SelectItem>
              <SelectItem value="REJECTED"><T k="volunteers.status.rejected" /></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <VolunteerCardNew
            key={volunteer.publicId}
            volunteer={volunteer}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        ))}

        {filteredVolunteers.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow col-span-full">
            <p className="text-muted-foreground"><T k="volunteers.noResults" /></p>
          </div>
        )}
      </div>
    </div>
  )
}
