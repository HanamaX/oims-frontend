"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import OrphanageCentreService, { OrphanageCentre } from "@/lib/orphanage-centre-service"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage, T } from "@/contexts/LanguageContext"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertTriangle
} from "lucide-react"

export default function OrphanageCentreDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  useLanguage() // Initialize language context
  const centreId = params.centreId as string
  
  const [centre, setCentre] = useState<OrphanageCentre | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  
  // Status management
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)
  const [statusChangeReason, setStatusChangeReason] = useState("")

  // Leave request management
  const [leaveRequestDialogOpen, setLeaveRequestDialogOpen] = useState(false)
  const [leaveRequestReason, setLeaveRequestReason] = useState("")
  const [processingLeaveRequest, setProcessingLeaveRequest] = useState(false)
  const [leaveRequestAction, setLeaveRequestAction] = useState<"approve" | "reject" | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  
  // Fetch centre data on component mount
  useEffect(() => {
    const fetchCentreData = async () => {
      try {
        setLoading(true)
        const data = await OrphanageCentreService.getCentreById(centreId)
        if (data) {
          setCentre(data)
        } else {
          setError("Orphanage centre not found")
        }
      } catch (err: any) {
        console.error("Failed to load orphanage centre:", err)
        setError(err.message ?? "Failed to load orphanage centre details")
      } finally {
        setLoading(false)
      }
    }

    if (centreId) {
      fetchCentreData()
    }
  }, [centreId])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Handle status toggle
  const handleStatusToggle = () => {
    if (!centre) return
    
    // Store the new pending status
    setPendingStatus(!centre.isActive)
    setStatusDialogOpen(true)
  }

  // Confirm status change
  const confirmStatusChange = async () => {
    if (pendingStatus === null || !centre) return
    
    setIsChangingStatus(true)
    
    try {
      // Pass reason only when deactivating (setting to inactive)
      await OrphanageCentreService.updateCentreStatus(
        centreId, 
        pendingStatus, 
        !pendingStatus ? statusChangeReason : undefined
      )
      
      // Update local state
      setCentre({
        ...centre,
        isActive: pendingStatus,
        // If deactivating, update the exit reason and date
        ...(pendingStatus === false && {
          exitReason: statusChangeReason || null,
          exitDate: new Date().toISOString()
        })
      })
      
      // Show success message
      toast({
        title: "Status Updated",
        description: `The orphanage centre is now ${pendingStatus ? "active" : "inactive"}.`,
        variant: "default"
      })
      
    } catch (error: any) {
      console.error("Failed to update centre status:", error)
      toast({
        title: "Update Failed",
        description: error.message ?? "Failed to update orphanage centre status.",
        variant: "destructive"
      })
    } finally {
      setIsChangingStatus(false)
      setStatusDialogOpen(false)
      setPendingStatus(null)
      setStatusChangeReason("")
    }
  }

  // Handle leave request button click
  const handleLeaveRequestClick = () => {
    setLeaveRequestDialogOpen(true)
    setLeaveRequestAction(null)
  }

  // Handle leave request process
  const handleLeaveRequestProcess = (action: "approve" | "reject") => {
    setLeaveRequestAction(action)
  }

  // Confirm leave request action
  const confirmLeaveRequestAction = async () => {
    if (!leaveRequestAction || !centre) return
    
    setProcessingLeaveRequest(true)
    
    try {
      // Call the API to process the leave request
      if (leaveRequestAction === "approve") {
        // In a real implementation, this would be a separate endpoint
        // For now, we'll use the updateCentreStatus to simulate this action
        await OrphanageCentreService.updateCentreStatus(centreId, false)
        
        // Update local state to show as inactive
        setCentre({
          ...centre,
          isActive: false,
          exitReason: leaveRequestReason,
          exitDate: new Date().toISOString()
        })
        
        toast({
          title: "Leave Request Approved",
          description: "The orphanage centre leave request has been approved.",
          variant: "default"
        })
      } else {
        // In a real implementation, this would call a reject endpoint
        // For now, we'll just show a success toast
        toast({
          title: "Leave Request Rejected",
          description: "The orphanage centre leave request has been rejected.",
          variant: "default"
        })
      }
    } catch (error: any) {
      console.error("Failed to process leave request:", error)
      toast({
        title: "Action Failed",
        description: error.message ?? "Failed to process the leave request.",
        variant: "destructive"
      })
    } finally {
      setProcessingLeaveRequest(false)
      setLeaveRequestDialogOpen(false)
      setLeaveRequestAction(null)
      setLeaveRequestReason("")
      setRejectReason("")
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p><T k="orphanageCentre.details.loading" /></p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4"><T k="orphanageCentre.details.error" />: {error}</p>
        <Button variant="outline" onClick={() => router.back()}><T k="orphanageCentre.details.backToList" /></Button>
      </div>
    )
  }

  // Not found state
  if (!centre) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-amber-600 mb-4"><T k="orphanageCentre.details.notFound" /></p>
        <Button variant="outline" onClick={() => router.back()}><T k="orphanageCentre.details.backToList" /></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/superuser/dashboard/orphanage-centres")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T k="orphanageCentre.details.backToList" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{centre.name}</h1>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              {centre.location}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Badge 
            variant={centre.isActive ? "outline" : "destructive"}
            className={`${centre.isActive 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'} px-3 py-1`}
          >
            {centre.isActive 
              ? <><CheckCircle2 className="h-4 w-4 mr-2" /> <T k="orphanageCentre.details.active" /></> 
              : <><XCircle className="h-4 w-4 mr-2" /> <T k="orphanageCentre.details.inactive" /></>}
          </Badge>
          
          <Button 
            variant="outline"
            onClick={handleLeaveRequestClick}
            className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Process Leave Request
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details"><T k="orphanageCentre.details.tabDetails" /></TabsTrigger>
          <TabsTrigger value="certificate"><T k="orphanageCentre.details.tabCertificate" /></TabsTrigger>
          <TabsTrigger value="admins"><T k="orphanageCentre.details.tabLeaveRequests" /></TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" /> <T k="orphanageCentre.details.centreInformation" />
              </CardTitle>
              <CardDescription>
                <T k="orphanageCentre.details.centreOverview" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p className="text-base font-medium">{centre.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p className="text-base">{centre.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p className="text-base">{centre.address ?? "Not provided"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
                    <p className="text-base flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                      {centre.phoneNumber}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="text-base flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                      {centre.email}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                    <p className="text-base flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatDate(centre.createdDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              {!centre.isActive && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">Inactive Status Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-red-700">Exit Reason:</p>
                      <p className="text-sm">{centre.exitReason ?? "No reason provided"}</p>
                    </div>
                    {centre.exitDate && (
                      <div>
                        <p className="text-sm text-red-700">Exit Date:</p>
                        <p className="text-sm">{formatDate(centre.exitDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {centre.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-line">{centre.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="status"
                  checked={centre.isActive} 
                  onCheckedChange={handleStatusToggle}
                />
                <label htmlFor="status" className="text-sm font-medium">
                  {centre.isActive ? "Active" : "Inactive"}
                </label>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleStatusToggle}
                className={centre.isActive ? "border-red-200 text-red-700 hover:bg-red-50" : "border-green-200 text-green-700 hover:bg-green-50"}
              >
                {centre.isActive ? "Deactivate Centre" : "Activate Centre"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Certificate Tab */}
        <TabsContent value="certificate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" /> <T k="orphanageCentre.details.registrationCertificate" />
              </CardTitle>
              <CardDescription>
                <T k="orphanageCentre.details.viewCertificateDescription" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {centre.certificateUrl ? (
                <div className="flex items-center justify-between border rounded-md p-6 bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                      <h3 className="font-medium">{centre.certificateFileName ?? "Certificate Document"}</h3>
                      <p className="text-sm text-muted-foreground">
                        <T k="orphanageCentre.details.registrationDocumentFor" /> {centre.name}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="ml-4"
                    onClick={() => centre.certificateUrl && window.open(centre.certificateUrl, '_blank')}
                  >
                    <T k="orphanageCentre.details.downloadCertificate" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-amber-700 mb-2"><T k="orphanageCentre.details.noCertificate" /></p>
                  <p className="text-muted-foreground"><T k="orphanageCentre.details.noCertificateDescription" /></p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admins Tab */}
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Administrators
              </CardTitle>
              <CardDescription>
                List of administrators managing this orphanage centre
              </CardDescription>
            </CardHeader>
            <CardContent>
              {centre.admins && centre.admins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {centre.admins.map((admin) => (
                    <Card key={admin.publicId} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{admin.fullName}</CardTitle>
                          <Badge variant={admin.enabled ? "outline" : "destructive"} className={admin.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {admin.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardDescription>{admin.roles?.[0] || "Administrator"}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{admin.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{admin.phone}</span>
                          </div>
                          {admin.branchName && (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Branch: {admin.branchName}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No administrators found for this orphanage centre.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus ? "Activate Orphanage Centre" : "Deactivate Orphanage Centre"}
            </DialogTitle>
            <DialogDescription>
              {pendingStatus 
                ? "Are you sure you want to activate this orphanage centre? It will allow them to use the system again."
                : "Are you sure you want to deactivate this orphanage centre? They will no longer be able to use the system."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for {pendingStatus ? "activation" : "deactivation"}
                {!pendingStatus && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                id="reason"
                placeholder={`Enter reason for ${pendingStatus ? "activation" : "deactivation"}...`}
                value={statusChangeReason}
                onChange={(e) => setStatusChangeReason(e.target.value)}
                className="min-h-[100px]"
                required={!pendingStatus}
              />
              {!pendingStatus && (
                <p className="text-xs text-muted-foreground">
                  <T k="orphanageCentre.details.deactivationReasonRequired" />
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false)
                setPendingStatus(null)
                setStatusChangeReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant={pendingStatus ? "default" : "destructive"}
              onClick={confirmStatusChange}
              disabled={isChangingStatus || (!pendingStatus && !statusChangeReason.trim())}
            >
              {isChangingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                pendingStatus === false ? "Deactivate" : "Activate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Leave Request Dialog */}
      <Dialog open={leaveRequestDialogOpen} onOpenChange={setLeaveRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {leaveRequestAction 
                ? leaveRequestAction === "approve" 
                  ? "Approve Leave Request" 
                  : "Reject Leave Request"
                : "Process Leave Request"
              }
            </DialogTitle>
            <DialogDescription>
              {leaveRequestAction 
                ? leaveRequestAction === "approve"
                  ? "This will deactivate the orphanage centre and record the reason for exit."
                  : "Please provide a reason for rejecting this leave request."
                : "Choose whether to approve or reject this orphanage centre's leave request."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!leaveRequestAction ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="leaveReason" className="text-sm font-medium">
                    Leave Request Reason
                  </label>
                  <Textarea
                    id="leaveReason"
                    placeholder="Enter the leave request reason..."
                    value={leaveRequestReason}
                    onChange={(e) => setLeaveRequestReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleLeaveRequestProcess("reject")}
                  >
                    Reject Request
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => handleLeaveRequestProcess("approve")}
                  >
                    Approve Request
                  </Button>
                </div>
              </div>
            ) : leaveRequestAction === "reject" ? (
              <div className="space-y-2">
                <label htmlFor="rejectReason" className="text-sm font-medium">
                  Rejection Reason
                </label>
                <Textarea
                  id="rejectReason"
                  placeholder="Enter reason for rejecting the leave request..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Approving this leave request will deactivate the orphanage centre. 
                  The centre will no longer be able to use the system, and all administrators will lose access.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {leaveRequestAction ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLeaveRequestAction(null)
                    setRejectReason("")
                  }}
                >
                  Back
                </Button>
                <Button
                  variant={leaveRequestAction === "approve" ? "destructive" : "default"}
                  onClick={confirmLeaveRequestAction}
                  disabled={leaveRequestAction === "reject" && !rejectReason.trim() || processingLeaveRequest}
                >
                {processingLeaveRequest ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : leaveRequestAction === "approve" ? (
                    "Confirm Approval"
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setLeaveRequestDialogOpen(false)
                  setLeaveRequestReason("")
                }}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
