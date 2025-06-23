"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Building2, Loader2, Users, ChevronRight, Mail, Phone } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

import { ScrollArea } from "@/components/ui/scroll-area"
import StaffEditForm from "@/components/staff-edit-form"
import { useLanguage, T } from "@/contexts/LanguageContext"

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
}

export default function CenterManagementPage() {
  const { language, t } = useLanguage()
  
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
  const [isEditingCenter, setIsEditingCenter] = useState(false)
  
  // Branch state
  const [branches, setBranches] = useState<Branch[]>([])
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [branch, setBranch] = useState<Branch>({
    name: "",
    location: "",
    phoneNumber: "",
    isHQ: false,
  })
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [showBranchDetails, setShowBranchDetails] = useState(false)
  const [isEditingBranchInDetailView, setIsEditingBranchInDetailView] = useState(false)
  
  // Staff state
  const [staffMembers, setStaffMembers] = useState<Staff[]>([])
  const [branchStaff, setBranchStaff] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [showStaffEditModal, setShowStaffEditModal] = useState(false)
    // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

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
            publicId: branch.publicId,            name: branch.name ?? "Unnamed Branch",
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
      
      if (staffResponse.data?.data) {        const formattedStaff = staffResponse.data.data.map((admin: any) => ({
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
        }))
        
        setStaffMembers(formattedStaff)
      } else {
        setStaffMembers([])
      }
    } catch (err: any) {
      console.error("Error fetching staff:", err)
      setStaffMembers([])
    }
  }

  // Handle center form change
  const handleCenterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCentre((prev) => ({ ...prev, [name]: value }))
  }

  // Handle branch form change
  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setBranch((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }  // Handle center form submission (read-only mode)
  const handleCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: t("common.readOnlyMode"),
      description: t("common.cannotModifyCenter"),
      variant: "destructive",
    })
  }  // Handle branch form submission (read-only mode)
  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: t("common.readOnlyMode"),
      description: t("common.cannotModifyBranch"),
      variant: "destructive",
    })
  }// Handle opening branch details
  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch)
    // Filter staff for the selected branch
    setBranchStaff(staffMembers.filter(staff => staff.branchPublicId === branch.publicId))
    setShowBranchDetails(true)
  }  // Handle closing branch details
  const handleCloseBranchDetails = () => {
    setSelectedBranch(null)
    setBranchStaff([])
    setShowBranchDetails(false)
    setIsEditingBranchInDetailView(false)
  }

  // Handle staff click to open edit modal
  const handleStaffClick = (staff: Staff) => {
    setSelectedStaff(staff)
    setShowStaffEditModal(true)
  }  // Handle staff update (read-only mode)
  const handleStaffUpdate = async (updatedStaff: Staff) => {
    toast({
      title: t("common.readOnlyMode"),
      description: t("common.cannotModifyStaff"),
      variant: "destructive",
    })
    setShowStaffEditModal(false)
    setSelectedStaff(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2"><T k="centerManagement.loadingMessage" /></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">      <div className="flex justify-between items-center">
        <div>          <h1 className="text-3xl font-bold tracking-tight"><T k="centerManagement.title" /></h1>
          <p className="text-muted-foreground">
            {centerExists ? <T k="centerManagement.description.exists" /> : <T k="centerManagement.description.create" />}
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {!centerExists ? (
        // Create Center Form
        <Card>
          <form onSubmit={handleCenterSubmit}>            <CardHeader>
              <CardTitle><T k="centerOverview.createCenter" /></CardTitle>
              <CardDescription><T k="centerOverview.createCenterDescription" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name"><T k="centerOverview.form.centerName" /></Label>
                  <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required />
                </div>                <div className="space-y-2">
                  <Label htmlFor="location"><T k="centerOverview.form.location" /></Label>
                  <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required />
                </div>                <div className="space-y-2">
                  <Label htmlFor="address"><T k="centerOverview.form.address" /></Label>
                  <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required />
                </div>                <div className="space-y-2">
                  <Label htmlFor="phoneNumber"><T k="centerOverview.form.phoneNumber" /></Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={centre.phoneNumber}
                    onChange={handleCenterChange}
                    required
                  />
                </div>                <div className="space-y-2">
                  <Label htmlFor="email"><T k="centerOverview.form.email" /></Label>
                  <Input id="email" name="email" type="email" value={centre.email} onChange={handleCenterChange} required />
                </div>
              </div>              <div className="space-y-2">
                <Label htmlFor="description"><T k="centerOverview.form.description" /></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={centre.description}
                  onChange={handleCenterChange}
                  required
                />
              </div>
            </CardContent>            <CardFooter>
              <Button type="submit" disabled={false}>
                {false ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <T k="common.creating" />
                  </>                ) : (
                  <T k="centerOverview.createCenter" />
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>      ) : showBranchDetails ? (
        // Branch Details View
        <div className="space-y-4">          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleCloseBranchDetails}>
              <T k="branch.backToCenter" />
            </Button>
          </div>
          
          {isEditingBranchInDetailView ? (
            <Card>
              <form onSubmit={handleBranchSubmit}>                <CardHeader>
                  <CardTitle><T k="branch.editBranch" /></CardTitle>
                  <CardDescription><T k="branch.editBranchDescription" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name"><T k="branch.branchName" /></Label>
                      <Input id="name" name="name" value={branch.name} onChange={handleBranchChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location"><T k="centerOverview.location" /></Label>
                      <Input id="location" name="location" value={branch.location} onChange={handleBranchChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber"><T k="centerOverview.phoneNumber" /></Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={branch.phoneNumber}
                        onChange={handleBranchChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="isHQ"
                        name="isHQ"
                        checked={branch.isHQ || false}
                        onCheckedChange={(checked) => setBranch((prev) => ({ ...prev, isHQ: checked === true }))}
                      />
                      <Label htmlFor="isHQ"><T k="branch.isHeadquarters" /></Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingBranchInDetailView(false)}
                    disabled={false}
                  >
                    <T k="common.cancel" />
                  </Button>
                  <Button type="submit" disabled={false}>
                    {false ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <T k="common.updating" />
                      </>
                    ) : (
                      <T k="branch.updateBranchButton" />
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedBranch?.name}</CardTitle>                    {selectedBranch?.isHQ && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        <T k="branch.headquarters" />
                      </span>
                    )}
                  </div>
                  <CardDescription>{selectedBranch?.location}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium"><T k="centerOverview.phoneNumber" /></p>
                      <p className="text-sm text-muted-foreground">{selectedBranch?.phoneNumber}</p>
                    </div>
                    {selectedBranch?.createdDate && (
                      <div>
                        <p className="text-sm font-medium"><T k="common.createdDate" /></p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedBranch.createdDate.replace(' ', 'T')).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}                    <div>
                      <p className="text-sm font-medium"><T k="dashboard.orphans" /></p>
                      <p className="text-sm text-muted-foreground">{selectedBranch?.orphanCount ?? 0} <T k="branch.orphansInBranch" /></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium"><T k="staff.staff" /></p>
                      <p className="text-sm text-muted-foreground">{selectedBranch?.staffCount ?? 0} <T k="staff.staffMembers" /></p>
                    </div>
                  </div>
                    {/* Branch Staff Section */}                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4"><T k="staff.branchStaff" /></h3>
                    {branchStaff.length > 0 ? (
                      <div className="space-y-4">                        {branchStaff.map((staff) => (
                          <Card 
                            key={staff.publicId} 
                            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleStaffClick(staff)}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-500" />
                                  </div>                                  <div>
                                    <p className="font-medium text-base">{staff.fullName ?? 'No Name'}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm mt-1">
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-gray-500" /> {staff.email}
                                      </span>
                                      {staff.phoneNumber && (
                                        <span className="flex items-center gap-1">
                                          <Phone className="h-3 w-3 text-gray-500" /> {staff.phoneNumber}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">                                  <span className={`px-2 py-1 rounded text-xs ${
                                    staff.role === 'ROLE_SUPER_ADMIN' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
                                  </span>
                                  {staff.suspended ? (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                      <T k="staff.suspended" />
                                    </span>
                                  ) : (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      <T k="staff.active" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>                    ) : (
                      <p className="text-muted-foreground"><T k="staff.noStaffAssigned" /></p>
                    )}
                  </div>
                </div>              </CardContent>
              <CardFooter>                <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    <T k="branch.readOnlyModeMessage" />
                  </p>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      ) : (
        // Center and Branches View
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-blue-100 rounded-lg p-1 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-800 px-4 py-2 rounded transition-all"> <T k="centerOverview.centerOverview" /></TabsTrigger>
            <TabsTrigger value="branches" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-800 px-4 py-2 rounded transition-all"> <T k="branch.branches" /></TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-800 px-4 py-2 rounded transition-all"> <T k="staff.staff" /></TabsTrigger>
          </TabsList>
          {/* Center Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {isEditingCenter ? (
              <Card className="shadow-lg border-blue-200">
                <form onSubmit={handleCenterSubmit}>                  <CardHeader className="bg-blue-100 rounded-t-lg">                    <CardTitle className="text-blue-800"><T k="centerOverview.edit.title" /></CardTitle>
                    <CardDescription className="text-blue-700"><T k="centerOverview.edit.description" /></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-blue-900"><T k="centerOverview.form.centerName" /></Label>
                        <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-blue-900"><T k="centerOverview.form.location" /></Label>
                        <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-blue-900"><T k="centerOverview.form.address" /></Label>
                        <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-blue-900"><T k="centerOverview.form.phoneNumber" /></Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={centre.phoneNumber}
                          onChange={handleCenterChange}
                          required
                          className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-blue-900"><T k="centerOverview.form.email" /></Label>
                        <Input id="email" name="email" value={centre.email} onChange={handleCenterChange} required className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description" className="text-blue-900"><T k="centerOverview.form.description" /></Label>
                        <Textarea id="description" name="description" value={centre.description} onChange={handleCenterChange} className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end bg-blue-50 rounded-b-lg">                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <T k="centerOverview.form.updateButton" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card className="shadow-lg border-blue-200 bg-blue-50">
                <CardHeader className="bg-blue-100 rounded-t-lg">
                  <CardTitle className="text-blue-800"><T k="centerOverview.centerOverview" /></CardTitle>
                  <CardDescription className="text-blue-700"><T k="centerOverview.centerOverviewDescription" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-900"><T k="centerOverview.form.centerName" /></p>
                      <p className="text-lg font-bold text-blue-800">{centre.name}</p>
                      <p className="text-sm text-blue-700">{centre.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900"><T k="centerOverview.form.phoneNumber" /></p>
                      <p className="text-blue-800">{centre.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-blue-900"><T k="centerOverview.form.address" /></p>
                    <p className="text-blue-700">{centre.address}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-blue-900"><T k="centerOverview.form.email" /></p>
                    <p className="text-blue-700">{centre.email}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-blue-900"><T k="centerOverview.form.description" /></p>
                    <p className="text-blue-700">{centre.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-blue-50 rounded-b-lg flex justify-between items-center">                  <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100 hover:text-blue-900">
                    <T k="centerOverview.actions.editDetails" />
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-900">
                    <T k="centerOverview.actions.deleteCenter" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
            {/* Branches Tab */}          <TabsContent value="branches" className="space-y-4">            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold"><T k="branch.branchManagement" /></h2>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  🔒 <T k="branch.readOnlyMode" />
                </p>
              </div>
            </div>
            
            {showBranchForm && (
              <Card>
                <form onSubmit={handleBranchSubmit}>                  <CardHeader>
                    <CardTitle>{branch.publicId ? <T k="branch.editBranch" /> : <T k="branch.addNewBranch" />}</CardTitle>
                    <CardDescription><T k="branch.enterBranchDetails" /></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">                        <Label htmlFor="name"><T k="branch.branchName" /></Label>
                        <Input id="name" name="name" value={branch.name} onChange={handleBranchChange} required />
                      </div>
                      <div className="space-y-2">                        <Label htmlFor="location"><T k="centerOverview.form.location" /></Label>
                        <Input id="location" name="location" value={branch.location} onChange={handleBranchChange} required />
                      </div>
                      <div className="space-y-2">                        <Label htmlFor="phoneNumber"><T k="centerOverview.form.phoneNumber" /></Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={branch.phoneNumber}
                          onChange={handleBranchChange}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="isHQ"
                          name="isHQ"
                          checked={branch.isHQ || false}
                          onCheckedChange={(checked) => setBranch((prev) => ({ ...prev, isHQ: checked === true }))}
                        />
                        <Label htmlFor="isHQ"><T k="branch.isHeadquarters" /></Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowBranchForm(false)
                        setBranch({
                          name: "",
                          location: "",
                          phoneNumber: "",
                          isHQ: false,
                        })                      }}                      disabled={false}
                    >
                      <T k="common.cancel" />
                    </Button>
                    <Button type="submit" disabled={false}>
                      {false ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {branch.publicId ? <T k="common.updating" /> : <T k="common.adding" />}
                        </>
                      ) : (
                        <>{branch.publicId ? <T k="branch.updateBranch" /> : <T k="branch.addBranch" />}</>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
            
            {!showBranchForm && (
              <>                {branches.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium"><T k="branch.noBranches" /></h3>
                    <p className="text-muted-foreground"><T k="branch.createFirstBranch" /></p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4">
                      {branches.map((branch) => (
                        <Card 
                          key={branch.publicId} 
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleBranchClick(branch)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex items-start gap-3">
                                <Building2 className="h-6 w-6 text-blue-500 mt-1" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{branch.name}</h3>
                                    {branch.isHQ && (                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                        <T k="branch.headquarters" />
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{branch.location}</p>                                  <div className="flex items-center gap-4 mt-1 text-sm">                                    <span className="text-muted-foreground">
                                      <T k="staff.staff" />: {branch.staffCount ?? 0}
                                    </span>
                                    <span className="text-muted-foreground">
                                      <T k="orphan.orphans" />: {branch.orphanCount ?? 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </>
            )}
          </TabsContent>
            {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <div className="flex justify-between items-center">              <div>                <h2 className="text-xl font-bold"><T k="staffManagement.title" /></h2>
                <p className="text-sm text-muted-foreground mt-1"><T k="staff.viewStaffMessage" /></p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  <T k="staff.readOnlyModeMessage" />
                </p>
              </div>
            </div>
              {staffMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />                <h3 className="text-lg font-medium"><T k="staff.noStaffMembers" /></h3>
                <p className="text-muted-foreground"><T k="staff.goToStaffManagement" /></p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Orphanage Administrators Section */}
                {staffMembers.filter(staff => !staff.branchPublicId).length > 0 && (
                  <div>                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <T k="staff.orphanageAdministrators" />
                      <span className="text-sm font-normal text-muted-foreground">
                        ({staffMembers.filter(staff => !staff.branchPublicId).length})
                      </span>
                    </h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staffMembers
                        .filter(staff => !staff.branchPublicId)
                        .map(staff => (                          <Card 
                            key={staff.publicId} 
                            className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border-purple-200 hover:border-purple-300  max-h-[130px] -mt-3"
                            onClick={() => handleStaffClick(staff)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                                  <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">                                    <h4 className="font-semibold text-base text-gray-900">
                                      {staff.fullName ?? 'No Name'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        staff.role === 'ROLE_SUPER_ADMIN' 
                                          ? 'bg-purple-100 text-purple-800' 
                                          : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
                                      </span>
                                      {staff.suspended ? (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                          <T k="staff.suspended" />
                                        </span>
                                      ) : (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                          <T k="staff.active" />
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Mail className="h-4 w-4 text-purple-500" />
                                      <span className="truncate">{staff.email}</span>
                                    </div>
                                    {staff.phoneNumber && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-purple-500" />
                                        <span>{staff.phoneNumber}</span>
                                      </div>
                                    )}                                      <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-2">
                                      <Building2 className="h-4 w-4" />
                                      <span><T k="staff.organizationLevel" /></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}                {/* Branch Staff Section */}
                {branches.length > 0 && (
                  <div>                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <T k="staff.branchStaff" />
                      <span className="text-sm font-normal text-muted-foreground">
                        ({staffMembers.filter(staff => staff.branchPublicId).length})
                      </span>
                    </h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {branches.map(branch => (
                        <Card key={branch.publicId} className="flex flex-col h-[350px] -mt-3">
                          <CardHeader className="flex-shrink-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Building2 className="h-4 w-4" />
                              {branch.name}
                            </CardTitle>                            <CardDescription>
                              {staffMembers.filter(s => s.branchPublicId === branch.publicId).length} <T k="staff.staffMembers" />
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full pb-2">
                              <div className="space-y-2">{staffMembers
                                  .filter(staff => staff.branchPublicId === branch.publicId)
                                  .map(staff => (
                                    <div 
                                      key={staff.publicId} 
                                      className="p-3 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
                                      onClick={() => handleStaffClick(staff)}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                          <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">                                          <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium">{staff.fullName ?? 'No Name'}</p>
                                            <div className="flex flex-wrap gap-2">
                                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                staff.role === 'ROLE_SUPER_ADMIN' 
                                                  ? 'bg-blue-100 text-blue-800' 
                                                  : 'bg-green-100 text-green-800'
                                              }`}>
                                                {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
                                              </span>
                                              {staff.suspended ? (                                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                                  <T k="staff.suspended" />
                                                </span>
                                              ) : (                                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                                                  <T k="staff.active" />
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm mt-1">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                              <Mail className="h-3 w-3" /> {staff.email}
                                            </span>
                                            {staff.phoneNumber && (
                                              <span className="flex items-center gap-1 text-muted-foreground">
                                                <Phone className="h-3 w-3" /> {staff.phoneNumber}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                {staffMembers.filter(s => s.branchPublicId === branch.publicId).length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center py-2"><T k="staff.noStaffAssigned" /></p>
                                )}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>        </Tabs>
      )}
      
      {/* Staff Edit Modal */}
      {selectedStaff && (
        <StaffEditForm
          open={showStaffEditModal}
          onOpenChange={(open) => {
            setShowStaffEditModal(open)
            if (!open) {
              setSelectedStaff(null)
            }
          }}
          staff={selectedStaff}
          branches={branches}
          onUpdate={async (staffId: string, updateData: any) => {
            await handleStaffUpdate({ ...selectedStaff, ...updateData })
          }}
          readOnly={true}
        />
      )}
    </div>
  )
}
