"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, AlertTriangle, Plus, Loader2 } from "lucide-react"
import FundraiserCard from "@/components/fundraiser-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FundraiserService, { Fundraiser, EventStatus } from "@/lib/fundraiser-service"
import { T, useLanguage } from "@/contexts/LanguageContext"
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

export default function FundraisersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  } | null>(null)
  const { t } = useLanguage()
  
  // State for rejection dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [selectedFundraiserId, setSelectedFundraiserId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch fundraisers from API
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        setIsLoading(true)
        const data = await FundraiserService.getCurrentBranchFundraisers()
        setFundraisers(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching fundraisers:", err)
        setError("Failed to load fundraisers. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFundraisers()
  }, [])

  // Filter fundraisers based on search term and status
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const matchesSearch =
      fundraiser.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.fundraisingReason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || fundraiser.status === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  // Handle approve and reject
  const handleApprove = async (id: string) => {
    try {
      await FundraiserService.updateFundraiserStatus(id, EventStatus.APPROVED)
      setFundraisers(
        fundraisers.map((fundraiser) =>
          fundraiser.publicId === id ? { ...fundraiser, status: EventStatus.APPROVED } : fundraiser,
        ),
      )
      
      setNotification({
        message: "Fundraiser approved successfully",
        type: "success",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to approve fundraiser:", error)
      
      setNotification({
        message: "Failed to approve fundraiser. Please try again.",
        type: "error",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // Initialize rejection process by opening the dialog
  const initiateReject = (id: string) => {
    setSelectedFundraiserId(id);
    setRejectReason("");
    setIsRejectDialogOpen(true);
  }

  // Handle rejection with reason
  const handleReject = async () => {
    if (!selectedFundraiserId || !rejectReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await FundraiserService.rejectFundraiser(selectedFundraiserId, rejectReason)
      
      // Update local state
      setFundraisers(
        fundraisers.map((fundraiser) => 
          fundraiser.publicId === selectedFundraiserId 
            ? { 
                ...fundraiser, 
                status: EventStatus.REJECTED,
                reason: rejectReason 
              } 
            : fundraiser
        )
      )
      
      // Show success notification
      setNotification({
        message: "Fundraiser rejected successfully",
        type: "success",
        visible: true
      })
      
      // Close dialog and reset state
      setIsRejectDialogOpen(false);
      setSelectedFundraiserId(null);
      setRejectReason("");
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to reject fundraiser:", error)
      
      // Show error notification
      setNotification({
        message: "Failed to reject fundraiser. Please try again.",
        type: "error",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await FundraiserService.deleteFundraiser(id)
      setFundraisers(fundraisers.filter((fundraiser) => fundraiser.publicId !== id))
      
      setNotification({
        message: "Fundraiser deleted successfully",
        type: "success",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to delete fundraiser:", error)
      
      setNotification({
        message: "Failed to delete fundraiser. Please try again.",
        type: "error",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  
  // Handle complete (mark as completed)
  const handleComplete = async (id: string, reason?: string) => {
    try {
      await FundraiserService.updateFundraiserStatus(id, EventStatus.COMPLETED, reason)
      setFundraisers(
        fundraisers.map((fundraiser) =>
          fundraiser.publicId === id ? { ...fundraiser, status: EventStatus.COMPLETED } : fundraiser,
        ),
      )
      
      setNotification({
        message: "Fundraiser marked as completed successfully",
        type: "success",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to complete fundraiser:", error)
      
      setNotification({
        message: "Failed to mark fundraiser as completed. Please try again.",
        type: "error",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  
  // Handle cancel
  const handleCancel = async (id: string, reason: string) => {
    try {
      await FundraiserService.updateFundraiserStatus(id, EventStatus.CANCELLED, reason)
      setFundraisers(
        fundraisers.map((fundraiser) =>
          fundraiser.publicId === id ? { ...fundraiser, status: EventStatus.CANCELLED } : fundraiser,
        ),
      )
      
      setNotification({
        message: "Fundraiser cancelled successfully",
        type: "success",
        visible: true
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to cancel fundraiser:", error)
      
      setNotification({
        message: "Failed to cancel fundraiser. Please try again.",
        type: "error",
        visible: true
      })
      
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
          <p className="text-muted-foreground">Loading fundraisers...</p>
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
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rejection Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Fundraiser</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this fundraiser. 
              This information will be stored and displayed in the fundraiser record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why you're rejecting this fundraiser..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setRejectReason("");
                setIsRejectDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={!rejectReason.trim() || isSubmitting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="fundraiser.management" /></h1>
          <p className="text-muted-foreground mt-2"><T k="fundraiser.description" /></p>
        </div>
        <Button 
          onClick={() => window.open('/news/ongoing', '_blank')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          View Public Campaigns
        </Button>
      </div>      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("fundraiser.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("fundraiser.filter.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="fundraiser.filter.all" /></SelectItem>
              <SelectItem value="PENDING"><T k="fundraiser.filter.pending" /></SelectItem>
              <SelectItem value="APPROVED"><T k="fundraiser.filter.active" /></SelectItem>
              <SelectItem value="COMPLETED"><T k="fundraiser.filter.completed" /></SelectItem>
              <SelectItem value="REJECTED"><T k="fundraiser.filter.rejected" /></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFundraisers.map((fundraiser) => (
          <Card key={fundraiser.publicId} className="overflow-hidden">
            <CardContent className="p-0">
              <FundraiserCard 
                fundraiser={fundraiser} 
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        ))}

        {filteredFundraisers.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-muted-foreground">No fundraisers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
