"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { T, useLanguage } from "@/contexts/LanguageContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CenterOverview from "@/components/center-overview"
import BranchManagement from "@/components/branch-management"
import StaffManagement from "@/components/staff-management"
import BranchDetails from "@/components/branch-details"

// Define types for our data
interface OrphanageCentre {
  publicId?: string
  name: string
  location: string
  address: string
  phoneNumber: string
  email: string
  description: string
}

interface Branch {
  publicId?: string
  name: string
  location: string
  phoneNumber: string
  isHQ?: boolean
  createdDate?: string
  staffCount?: number
  orphanCount?: number
  // The following fields are not in the API response but needed for UI/UX
  orphanageCentrePublicId?: string
}

interface Staff {
  publicId?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email: string
  phoneNumber?: string
  branchPublicId?: string
  branchName?: string
  role?: string
  suspended?: boolean
  imageUrl?: string
}

export default function CenterManagementPage() {
  // Center state
  const [centre, setCentre] = useState<OrphanageCentre>({
    name: "",
    location: "",
    address: "",
    phoneNumber: "",
    email: "",
    description: "",
  })
  const [centerExists, setCenterExists] = useState(false)
    // Branch state
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [showBranchDetails, setShowBranchDetails] = useState(false)
  const [branchStaff, setBranchStaff] = useState<Staff[]>([])
  
  // Staff state
  const [staffMembers, setStaffMembers] = useState<Staff[]>([])
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [deleteCenterDialogOpen, setDeleteCenterDialogOpen] = useState(false)

  const { toast } = useToast()
  const { t } = useLanguage()

  // Fetch center data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Function to fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First fetch center
      await fetchCenterData()
      
      // The branch and staff data will be fetched conditionally if center exists
    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError(`Failed to load data: ${err.message ?? "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch center data
  const fetchCenterData = async () => {
    try {
      const response = await API.get("/app/oims/orphanages/centre")
      
      if (response.data?.data) {
        const centerData = response.data.data
        
        setCenterExists(true)
        setCentre({
          publicId: centerData.publicId,
          name: centerData.name ?? "",
          location: centerData.location ?? "",
          address: centerData.address ?? "",
          phoneNumber: centerData.phoneNumber ?? "",
          email: centerData.email ?? "",
          description: centerData.description ?? "",
        })
        
        // If center exists, fetch branches and staff
        await fetchBranches()
        await fetchStaff()
      } else {
        setCenterExists(false)
        setError(null) // Don't show error if center doesn't exist yet
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Center not found - this is expected for new users
        setCenterExists(false)
        setError(null)
      } else {
        // Other errors
        const errorMessage = err.response?.data?.errorMessage ?? err.response?.data?.description ?? 
                          err.response?.data?.message ?? err.message ?? "Failed to load center information"
        console.error("Center fetch error:", errorMessage)
        setError(`Failed to load center information: ${errorMessage}`)
        setCenterExists(false)
      }
    }
  }

  // Function to fetch branches
  const fetchBranches = async () => {
    try {
      const branchesResponse = await API.get("/app/oims/orphanages/branches")
      
      if (branchesResponse.data?.data) {
        const validBranches = branchesResponse.data.data
          .filter((branch: any) => branch.publicId)
          .map((branch: any) => ({
            publicId: branch.publicId,
            name: branch.name ?? "Unnamed Branch",
            location: branch.location ?? "Unknown Location",
            phoneNumber: branch.phoneNumber ?? "No Phone",
            isHQ: branch.isHQ ?? false,
            createdDate: branch.createdDate,
            staffCount: branch.staffCount ?? 0,
            orphanCount: branch.orphanCount ?? 0,
          }))
        
        setBranches(validBranches)
      } else {
        setBranches([])
      }
    } catch (err: any) {
      console.error("Error fetching branches:", err)
      setBranches([])
    }
  }

  // Function to fetch staff
  const fetchStaff = async () => {
    try {
      const staffResponse = await API.get("/app/oims/admins/centre")
      
      if (staffResponse.data?.data) {
        const formattedStaff = staffResponse.data.data.map((admin: any) => ({
          publicId: admin.publicId,
          firstName: admin.fullName ? admin.fullName.split(' ')[0] : '',
          lastName: admin.fullName ? admin.fullName.split(' ').slice(1).join(' ') : '',
          fullName: admin.fullName ?? '',
          email: admin.email ?? '',
          phoneNumber: admin.phone ?? '',
          branchPublicId: admin.branchPublicId ?? '',
          branchName: admin.branchName ?? 'Unassigned',
          role: admin.roles?.[0] ?? '',
          suspended: !admin.enabled,
          imageUrl: admin.imageUrl ?? '',
        }))
        
        setStaffMembers(formattedStaff)
      } else {
        setStaffMembers([])
      }
    } catch (err: any) {
      console.error("Error fetching staff:", err)
      setStaffMembers([])
    }  }

  // Handle branch click
  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch)
    // Filter staff for the selected branch
    setBranchStaff(staffMembers.filter(staff => staff.branchPublicId === branch.publicId))
    setShowBranchDetails(true
    )
  }
    // Handle closing branch details
  const handleCloseBranchDetails = () => {
    setSelectedBranch(null)
    setBranchStaff([])
    setShowBranchDetails(false)
  }
  // Handle center delete
  const handleDeleteCenter = () => {
    if (!centre.publicId) {
      toast({
        title: t("common.error"),
        description: t("centerManagement.deleteDialog.deleteError"),
        variant: "destructive",
      })
      return
    }
    
    setDeleteCenterDialogOpen(true)
  }

  // Confirm center delete
  const confirmDeleteCenter = async () => {
    if (!centre.publicId) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      await API.delete(`/app/oims/orphanages/delorphanage/${centre.publicId}`)
      
      // Reset state
      setCentre({
        name: "",
        location: "",
        address: "",
        phoneNumber: "",
        email: "",
        description: "",
      })
      setCenterExists(false)
      setBranches([])
      
      // Update localStorage
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          parsedUser.isCentreCreated = false
          localStorage.setItem("user", JSON.stringify(parsedUser))
        }
      } catch (storageErr) {
        console.error("Failed to update local storage:", storageErr)
      }
        toast({
        title: t("common.success"),
        description: t("centerOverview.success.deleted"),
      })
    } catch (err: any) {
      console.error("Error deleting center:", err)
      setError(err.response?.data?.message ?? "Failed to delete center. Please try again.")
      toast({
        title: t("common.error"),
        description: t("centerOverview.error.delete"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      setDeleteCenterDialogOpen(false)
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2"><T k="centerManagement.loading" /></span>
      </div>
    )
  }

  return (    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="centerManagement.title" /></h1>
          <p className="text-muted-foreground">
            {centerExists ? <T k="centerManagement.description.exists" /> : <T k="centerManagement.description.create" />}
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      
      {!centerExists ? (
        // Create Center Form
        <CenterOverview
          centre={centre} 
          centerExists={centerExists} 
          onCentreChange={setCentre}
          onCenterDelete={handleDeleteCenter}
          onFetchBranches={fetchBranches}
          error={error}
        />      ) : showBranchDetails ? (
        // Branch Details View
        <BranchDetails 
          branch={selectedBranch}
          branchStaff={branchStaff}
          onBackClick={handleCloseBranchDetails}
        />
      ) : (        // Center and Branches View
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview"><T k="centerManagement.tabs.overview" /></TabsTrigger>
            <TabsTrigger value="branches"><T k="centerManagement.tabs.branches" /></TabsTrigger>
            <TabsTrigger value="staff"><T k="centerManagement.tabs.staff" /></TabsTrigger>
          </TabsList>
          
          {/* Center Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <CenterOverview 
              centre={centre} 
              centerExists={centerExists} 
              onCentreChange={setCentre}
              onCenterDelete={handleDeleteCenter}
              onFetchBranches={fetchBranches}
              error={error}
            />
          </TabsContent>
          
          {/* Branches Tab */}
          <TabsContent value="branches" className="space-y-4">
            <BranchManagement 
              branches={branches}
              centerPublicId={centre.publicId}
              onBranchesChange={setBranches}
              onBranchClick={handleBranchClick}
              error={error}
            />
          </TabsContent>
          
          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <StaffManagement 
              staffMembers={staffMembers}
              branches={branches}
              centerPublicId={centre.publicId}
              onStaffChange={setStaffMembers}
              onFetchStaff={fetchStaff}
              error={error}
            />
          </TabsContent>
        </Tabs>
      )}
        {/* Delete Center Confirmation Dialog */}
      <Dialog open={deleteCenterDialogOpen} onOpenChange={setDeleteCenterDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle><T k="centerManagement.deleteDialog.title" /></DialogTitle>
            <DialogDescription>
              <T k="centerManagement.deleteDialog.description" /> <strong>{centre.name}</strong>?
              <br /><br />
              <T k="centerManagement.deleteDialog.warning" />
              <br /><br />
              <span className="text-red-600 font-medium"><T k="centerManagement.deleteDialog.criticalWarning" /></span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCenterDialogOpen(false)}>
              <T k="common.cancel" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteCenter}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T k="centerManagement.deleteDialog.deleting" />
                </>
              ) : (
                <T k="centerManagement.deleteDialog.deleteButton" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}