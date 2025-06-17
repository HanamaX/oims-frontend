"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, User, Trash2, Loader2, AlertCircle, UserCheck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import API from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { T, useLanguage } from "@/contexts/LanguageContext"


// Define types for our data
interface StaffMember {
  publicId?: string
  firstName?: string
  lastName?: string
  email: string
  phoneNumber?: string  // maps to 'phone' in API
  branchPublicId?: string
  role?: string        // maps to roles[0] in API
  suspended?: boolean  // inverse of 'enabled' in API
  username?: string
  // Additional fields from the API
  createdDate?: string
  fullName?: string    // Combined firstName + lastName, from API
  isActive?: boolean   // Combination of enabled & accountNonLocked
  sex?: string         // Named sex but stores gender from API and displayed as Gender in UI
  imageUrl?: string    // Profile image URL from API
}

interface Branch {
  publicId: string
  branchName: string
}

interface OrphanageCentre {
  publicId?: string
  name: string
}

export default function StaffManagementPage() {
  const { t } = useLanguage()
  
  // State for form
  const [showForm, setShowForm] = useState(false)
  const [staffMember, setStaffMember] = useState<StaffMember>({
    email: "",
    branchPublicId: "",
    role: "ROLE_SUPERVISOR", // Default role
  })

  // State for staff members
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  // State for branches
  const [branches, setBranches] = useState<Branch[]>([])
  // State for center
  const [center, setCenter] = useState<OrphanageCentre | null>(null)
  // State for loading
  const [loading, setLoading] = useState(true)
  // State for submitting
  const [submitting, setSubmitting] = useState(false)
  // State for error
  const [error, setError] = useState<string | null>(null)
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)  // State for admin update dialog
  const [adminUpdateDialogOpen, setAdminUpdateDialogOpen] = useState(false)
  const [staffToUpdate, setStaffToUpdate] = useState<StaffMember | null>(null)
  // State for image error handling
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()  // Helper function to get the correct image URL
  const getImageUrl = useCallback((imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === "") return ""
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API.defaults.baseURL}${imageUrl}`
    console.log("Staff image URL construction:", { input: imageUrl, baseURL: API.defaults.baseURL, output: fullUrl })
    return fullUrl
  }, [])

  // Handle image load errors
  const handleImageError = useCallback((staffId: string) => {
    setImageErrors(prev => new Set(prev).add(staffId))
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First check if center exists
        const centerResponse = await API.get("/app/oims/orphanages/centre")

        if (centerResponse.data && centerResponse.data.data) {
          setCenter({
            publicId: centerResponse.data.data.publicId,
            name: centerResponse.data.data.name,
          })

          // If center exists, fetch branches
          try {
            const branchesResponse = await API.get("/app/oims/orphanages/branches")

            if (branchesResponse.data && branchesResponse.data.data) {
              // Map the branches to the expected format
              const formattedBranches = branchesResponse.data.data.map((branch: any) => ({
                publicId: branch.publicId,
                branchName: branch.name // Map API's 'name' field to component's 'branchName' field
              }))
              setBranches(formattedBranches)

              // If branches exist, fetch admins
              try {
                const adminsResponse = await API.get("/app/oims/admins/centre")

                if (adminsResponse.data && adminsResponse.data.data) {                  // Map API response to our StaffMember structure
                  const formattedStaff = adminsResponse.data.data.map((admin: any) => ({
                    publicId: admin.publicId,
                    firstName: admin.fullName ? admin.fullName.split(' ')[0] : '',
                    lastName: admin.fullName ? admin.fullName.split(' ').slice(1).join(' ') : '',
                    email: admin.email || '',
                    phoneNumber: admin.phone || '',
                    username: admin.username,
                    role: admin.roles?.[0] || '',
                    suspended: !admin.enabled,
                    createdDate: admin.createdDate,
                    isActive: admin.enabled && admin.accountNonLocked,
                    // Map sex field from gender in API response but display as gender in UI
                    sex: admin.sex || null, 
                    imageUrl: admin.imageUrl || null,
                    fullName: admin.fullName || '',
                    branchPublicId: admin.branchPublicId || ''
                  }));
                  console.log("Staff members with images:", formattedStaff.map((s: StaffMember) => ({ name: s.fullName, imageUrl: s.imageUrl })))
                  setStaffMembers(formattedStaff)
                } else {
                  setStaffMembers([])
                }
              } catch (adminsErr) {
                console.error("Error fetching admins:", adminsErr)
                setStaffMembers([])
              }
            } else {
              setBranches([])
            }
          } catch (branchErr) {
            console.error("Error fetching branches:", branchErr)
            setBranches([])
          }
        } else {
          setCenter(null)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    // Ensure orphanage_admin access only
    if (user?.role !== "orphanage_admin") {
      router.push("/login")
    } else {
      fetchData()
    }
  }, [user, router])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStaffMember((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setStaffMember((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  // Handle form submission (only for adding new staff)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!center?.publicId) {
      toast({
        title: t("common.error"),
        description: t("staff.createCenterFirst"),
        variant: "destructive",
      })
      return
    }

    if (!staffMember.branchPublicId) {
      toast({
        title: t("common.error"),
        description: t("staff.selectBranch"),
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // We've removed the edit functionality as editing should only be done from profile page
      // Only allow creating new staff
      const response = await API.post("/app/oims/admins/add", {
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        email: staffMember.email,
        phoneNumber: staffMember.phoneNumber,
        branchPublicId: staffMember.branchPublicId,
        role: staffMember.role,
      })

      if (response.data && response.data.data) {
        const newStaff = {
          ...staffMember,
          publicId: response.data.data.publicId,
        }
        setStaffMembers([...staffMembers, newStaff])
      }      toast({
        title: t("common.success"),
        description: t("staff.adminCreatedSuccessfully"),
      })

      // Reset form
      setStaffMember({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        branchPublicId: "",
        role: "ROLE_SUPERVISOR",
      })
      setShowForm(false)
    } catch (err: any) {
      console.error("Error saving admin:", err)
      setError(err.response?.data?.message || t("staff.failedToSaveAdmin"))
      toast({
        title: t("common.error"),
        description: t("staff.failedToSaveAdminInfo"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }
  // Redirect to profile view (editing removed as per requirements)
  const viewProfile = (staffId: string) => {
    // This would navigate to a profile view page if implemented
    toast({
      title: t("staff.profileView"),
      description: t("staff.staffEditOwnProfile"),
    })
  }

  // Handle delete
  const handleDelete = (staffId: string) => {
    setStaffToDelete(staffId)
    setDeleteDialogOpen(true)
  }
  // Confirm delete
  const confirmDelete = async () => {
    if (!staffToDelete) return

    try {
      await API.delete(`/app/oims/admins/del/${staffToDelete}`)
      setStaffMembers(staffMembers.filter((staff) => staff.publicId !== staffToDelete))
      toast({
        title: t("common.success"),
        description: t("staff.adminDeletedSuccessfully"),
      })
    } catch (err) {
      console.error("Error deleting admin:", err)
      toast({
        title: t("common.error"),
        description: t("staff.failedToDeleteAdmin"),
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setStaffToDelete(null)
    }
  }

  // Handle admin information update
  const handleAdminUpdate = (staff: StaffMember) => {
    setStaffToUpdate(staff)
    setAdminUpdateDialogOpen(true)
  }

  // Confirm admin update
  const confirmAdminUpdate = async () => {
    if (!staffToUpdate?.publicId) return

    try {
      // Build the request payload according to the OrphanageAdminUpdateRequest interface
      // Only sending what orphanage_admins are allowed to update
      // For ROLE_ORPHANAGE_ADMIN, branch assignment isn't needed as they have global access
      let updatePayload: any = {
        adminPublicId: staffToUpdate.publicId,
        role: staffToUpdate.role,
        suspend: staffToUpdate.suspended
      };
      
      // Only include branch assignment for regular admins
      if (staffToUpdate.role !== "ROLE_ORPHANAGE_ADMIN") {
        updatePayload.branchPublicId = staffToUpdate.branchPublicId;
      }
      
      await API.patch("/app/oims/admins/supupdate", updatePayload)

      // Find the current staff data to preserve other fields
      const existingStaff = staffMembers.find(s => s.publicId === staffToUpdate.publicId);
      
      if (existingStaff) {
        // Update only the fields that changed while preserving other data
        const updatedStaff = {
          ...existingStaff,
          suspended: staffToUpdate.suspended
        };
        
        // Only update branch for regular admins
        if (staffToUpdate.role !== "ROLE_ORPHANAGE_ADMIN" && staffToUpdate.branchPublicId) {
          updatedStaff.branchPublicId = staffToUpdate.branchPublicId;
        }

        // Update staff members list
        setStaffMembers(staffMembers.map((s) => (s.publicId === staffToUpdate.publicId ? updatedStaff : s)))
      }      toast({
        title: t("common.success"),
        description: t("staff.adminStatusUpdatedSuccessfully"),
      })
    } catch (err) {
      console.error("Error updating admin status:", err)
      toast({
        title: t("common.error"),
        description: t("staff.failedToUpdateAdminStatus"),
        variant: "destructive",
      })
    } finally {
      setAdminUpdateDialogOpen(false)
      setStaffToUpdate(null)
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2"><T k="staff.loadingStaffInfo" /></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="staff.management" /></h1>
          <p className="text-muted-foreground"><T k="staff.description" /></p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        {center && branches.length > 0 ? (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> <T k="staff.add" />
          </Button>
        ) : null}
      </div>      {!center && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle><T k="staff.noCenterFound" /></AlertTitle>
          <AlertDescription>
            <T k="staff.createCenterBeforeStaff" />{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-red-700 hover:text-red-900"
              onClick={() => router.push("/dashboard/orphanage_admin/center")}
            >
              <T k="staff.createCenter" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {center && branches.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle><T k="staff.noBranchesFound" /></AlertTitle>
          <AlertDescription>
            <T k="staff.createBranchBeforeStaff" />{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/dashboard/orphanage_admin/branches")}>
              <T k="staff.createBranch" />
            </Button>
          </AlertDescription>
        </Alert>
      )}      {/* Staff Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><T k="staff.addNew" /></DialogTitle>
            <DialogDescription>
              <T k="staff.enterStaffDetails" />
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email"><T k="staff.email" /></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={staffMember.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchPublicId"><T k="staff.branch" /></Label>
                <Select
                  value={staffMember.branchPublicId}
                  onValueChange={(value) => handleSelectChange("branchPublicId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("staff.selectBranch")} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.publicId} value={branch.publicId}>
                        {branch.branchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!staffMember.publicId && (
                <div className="space-y-2">
                  <Label htmlFor="role"><T k="staff.role" /></Label>
                  <Select
                    value={staffMember.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("staff.selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_SUPERVISOR"><T k="staff.supervisor" /></SelectItem>
                      <SelectItem value="ROLE_ORPHANAGE_ADMIN"><T k="staff.orphanageAdmin" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setStaffMember({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    branchPublicId: "",
                    role: "ROLE_SUPERVISOR",
                  })
                }}
                disabled={submitting}
              >
                <T k="common.cancel" />
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <T k="staff.adding" />
                  </>
                ) : (
                  <><T k="staff.addStaff" /></>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>      <div className="grid gap-6 xs:grid-cols-1 md:grid-cols-2">
        {staffMembers.length === 0 && !loading ? (
          <div className="col-span-1 md:col-span-2 text-center py-10">
            <p className="text-muted-foreground"><T k="staff.noStaffMembersFound" /></p>
          </div>
        ) : (
          staffMembers.map((staff) => (
            <Card key={staff.publicId} className={`${staff.suspended ? "opacity-70" : ""} overflow-hidden`}>
              <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 min-w-0">                  <CardTitle className="flex flex-wrap items-center gap-2">
                    <span className="truncate">{staff.fullName || t("staff.notAssigned")}</span>
                    {staff.username && <span className="text-sm font-normal text-gray-500">@{staff.username}</span>}
                  </CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap gap-2">
                    {staff.role === "ROLE_ORPHANAGE_ADMIN" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <T k="staff.orphanageAdmin" />
                      </span>
                    ) : (
                      <>
                        <span key="branch-name" className="inline-block max-w-full truncate">
                          {branches.find((b) => b.publicId === staff.branchPublicId)?.branchName || t("staff.noBranchAssigned")}
                        </span>
                        <span key="role-badge" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <T k="staff.supervisor" />
                        </span>
                      </>
                    )}
                    {staff.suspended ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <T k="staff.suspended" />
                      </span>
                    ) : staff.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <T k="staff.active" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <T k="staff.inactive" />
                      </span>
                    )}
                  </CardDescription>
                </div>                <div className="flex-shrink-0 order-first sm:order-last">
                  {staff.imageUrl && staff.imageUrl.trim() !== "" && !imageErrors.has(staff.publicId || '') ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src={getImageUrl(staff.imageUrl)}
                        alt={staff.fullName || `${staff.firstName} ${staff.lastName}` || 'Staff member'}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(staff.publicId || '')}
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <User className="h-8 w-8 text-blue-500" />
                    </div>
                  )}
                </div>
              </CardHeader>              <CardContent>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium"><T k="staff.email" /></p>
                    <p className="text-sm text-muted-foreground break-words">{staff.email || t("staff.notAssigned")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium"><T k="staff.phone" /></p>
                    <p className="text-sm text-muted-foreground break-words">{staff.phoneNumber || t("staff.notAssigned")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium"><T k="staff.gender" /></p>
                    <p className="text-sm text-muted-foreground">{staff.sex || t("staff.notSpecified")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium"><T k="staff.accountStatus" /></p>
                    <p className="text-sm text-muted-foreground">
                      {staff.suspended ? t("staff.suspended") : (staff.isActive ? t("staff.active") : t("staff.inactive"))}
                    </p>
                  </div>
                  {staff.createdDate && (
                    <div className="col-span-1 xs:col-span-2">
                      <p className="text-sm font-medium"><T k="staff.accountCreated" /></p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(staff.createdDate.replace(' ', 'T')).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>              <CardFooter className="flex justify-end gap-2 flex-wrap">
                <Button variant="outline" size="icon" onClick={() => handleAdminUpdate(staff)} title={t("staff.manageStatus")}>
                  <UserCheck className="h-4 w-4" aria-label={t("staff.manageStatus")} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(staff.publicId!)} title={t("common.delete")}>
                  <Trash2 className="h-4 w-4" aria-label={t("common.delete")} />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T k="staff.confirmAdminDeletion" /></DialogTitle>
            <DialogDescription>
              {staffToDelete && (
                <>
                  {t("staff.deleteConfirmationMessage")} <strong>
                    {staffMembers.find(s => s.publicId === staffToDelete)?.firstName} {staffMembers.find(s => s.publicId === staffToDelete)?.lastName}
                  </strong>? 
                  <br /><br />
                  <T k="staff.deleteWarningMessage" />
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              <T k="common.cancel" />
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <T k="staff.deleteAdmin" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>      {/* Admin Update Dialog */}
      <Dialog open={adminUpdateDialogOpen} onOpenChange={setAdminUpdateDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle><T k="staff.updateAdminStatus" /></DialogTitle>
            <DialogDescription>
              {t("staff.manageBranchAndStatus")} {staffToUpdate?.fullName || `${staffToUpdate?.firstName} ${staffToUpdate?.lastName}` || t("staff.admin")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {staffToUpdate?.role !== "ROLE_ORPHANAGE_ADMIN" && (
                <div className="space-y-2">
                  <Label htmlFor="branch-update"><T k="staff.assignedBranch" /></Label>
                  <Select
                    value={staffToUpdate?.branchPublicId}
                    onValueChange={(value) =>
                      setStaffToUpdate(staffToUpdate ? { ...staffToUpdate, branchPublicId: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("staff.selectBranch")} />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white">
                      {branches.map((branch) => (
                        <SelectItem key={branch.publicId} value={branch.publicId}>
                          {branch.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2 bg-white">
                <Label htmlFor="account-status"><T k="staff.accountStatus" /></Label>
                <Select
                  value={staffToUpdate?.suspended ? "suspended" : "active"}
                  onValueChange={(value) =>
                    setStaffToUpdate(staffToUpdate ? { ...staffToUpdate, suspended: value === "suspended" } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("staff.selectStatus")} />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white">
                    <SelectItem value="active"><T k="staff.active" /></SelectItem>
                    <SelectItem value="suspended"><T k="staff.suspended" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                <p className="font-medium mb-1"><T k="staff.orphanageAdminPermissions" /></p>
                {staffToUpdate?.role === "ROLE_ORPHANAGE_ADMIN" ? (
                  <p><T k="staff.orphanageAdminNote" /></p>
                ) : (
                  <p><T k="staff.supervisorNote" /></p>
                )}
                <p className="mt-1"><T k="staff.suspendNote" /></p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminUpdateDialogOpen(false)}>
              <T k="common.cancel" />
            </Button>
            <Button onClick={confirmAdminUpdate}><T k="staff.updateAdminStatus" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
