"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Building2, Loader2, Plus, Mail, Phone, User } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import StaffEditForm from "@/components/staff-edit-form"
import { useAuth } from "@/components/auth-provider"
import { T, useLanguage } from "@/contexts/LanguageContext"

// Define types for our data
interface Branch {
  publicId?: string
  name: string
  location: string
  phoneNumber: string
  isHQ?: boolean
  createdDate?: string
  staffCount?: number
  orphanCount?: number
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

// Props interface for the component
interface StaffManagementProps {
  readonly staffMembers: Staff[]
  readonly branches: Branch[]
  readonly centerPublicId?: string
  readonly onStaffChange: (staffMembers: Staff[]) => void
  readonly onFetchStaff: () => Promise<void>
  readonly error: string | null
}

export default function StaffManagement({
  staffMembers,
  branches,
  centerPublicId,
  onStaffChange,
  onFetchStaff,
  error
}: StaffManagementProps) {
  // Local state
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [showStaffEditModal, setShowStaffEditModal] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [newStaffMember, setNewStaffMember] = useState<Staff>({
    email: "",
    branchPublicId: "",
    role: "ROLE_SUPERVISOR", // Default role
  })
  const [submitting, setSubmitting] = useState(false)
  
  const { user } = useAuth()
  const { toast } = useToast()
  const { language } = useLanguage()

  // Handle image loading errors
  const handleImageError = (staffId: string) => {
    setImageErrors(prev => new Set(prev).add(staffId))
  }

  // Handle staff click to open edit modal
  const handleStaffClick = (staff: Staff) => {
    setSelectedStaff(staff)
    setShowStaffEditModal(true)
  }
  // Handle staff update
  const handleStaffUpdate = async (updatedStaff: Staff) => {
    try {
      setSubmitting(true)
        // Prevent self-suspension
      if (updatedStaff.publicId === user?.publicId && updatedStaff.suspended) {
        toast({
          title: language === 'sw' ? 'Hitilafu' : 'Error',
          description: language === 'sw' ? 'Huwezi kusimamisha akaunti yako mwenyewe' : 'You cannot suspend your own account',
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }
      
      const response = await API.patch(`/app/oims/admins/supupdate`, {
        branchPublicId: updatedStaff.branchPublicId,
        suspended: updatedStaff.suspended,
        adminPublicId: updatedStaff.publicId,
        role: updatedStaff.role,
      })

      if (response.status === 200) {
        // Update staff in local state
        const updatedStaffMembers = staffMembers.map(staff => 
          staff.publicId === updatedStaff.publicId 
            ? { ...staff, ...updatedStaff }
            : staff
        )
          onStaffChange(updatedStaffMembers)

        toast({
          title: language === 'sw' ? 'Mafanikio' : 'Success',
          description: language === 'sw' ? 'Mfanyakazi amebadilishwa kikamilifu' : 'Staff member updated successfully',
        })
        
        setShowStaffEditModal(false)
        setSelectedStaff(null)
      }
    } catch (err: any) {      console.error("Error updating staff:", err)
      toast({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        description: err.response?.data?.message ?? (language === 'sw' ? 'Imeshindwa kubadilisha mfanyakazi' : 'Failed to update staff member'),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }
  // Handle staff delete
  const handleStaffDelete = async (staffId: string) => {
    try {
      setSubmitting(true)
        // Prevent self-deletion
      if (staffId === user?.publicId) {
        toast({
          title: language === 'sw' ? 'Hitilafu' : 'Error',
          description: language === 'sw' ? 'Huwezi kufuta akaunti yako mwenyewe' : 'You cannot delete your own account',
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }
      
      const response = await API.delete(`/app/oims/admins/del/${staffId}`)

      if (response.status === 200) {
        // Remove staff from local state
        const updatedStaffMembers = staffMembers.filter(staff => staff.publicId !== staffId)
        onStaffChange(updatedStaffMembers)

        toast({
          title: language === 'sw' ? 'Mafanikio' : 'Success',
          description: language === 'sw' ? 'Mfanyakazi amefutwa kikamilifu' : 'Staff member deleted successfully',
        })
        
        setShowStaffEditModal(false)
        setSelectedStaff(null)
      }
    } catch (err: any) {      console.error("Error deleting staff:", err)
      toast({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        description: err.response?.data?.message ?? (language === 'sw' ? 'Imeshindwa kufuta mfanyakazi' : 'Failed to delete staff member'),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle staff form input change
  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewStaffMember((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle staff form select change
  const handleStaffSelectChange = (name: string, value: string) => {
    setNewStaffMember((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle staff form submission
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!centerPublicId) {
      toast({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        description: language === 'sw' ? 'Unahitaji kuunda kituo kwanza' : 'You need to create a center first',
        variant: "destructive",
      })
      return
    }

    if (!newStaffMember.branchPublicId) {
      toast({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        description: language === 'sw' ? 'Tafadhali chagua tawi' : 'Please select a branch',
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await API.post("/app/oims/admins/add", {
        email: newStaffMember.email,
        branchPublicId: newStaffMember.branchPublicId,
        role: newStaffMember.role,
      })

      if (response.data?.data) {
        toast({
          title: language === 'sw' ? 'Mafanikio' : 'Success',
          description: language === 'sw' ? 'Mfanyakazi ameundwa kikamilifu' : 'Staff member created successfully',
        })

        // Reset form
        setNewStaffMember({
          email: "",
          branchPublicId: "",
          role: "ROLE_SUPERVISOR",
        })
        setShowStaffForm(false)

        // Refresh staff list
        await onFetchStaff()
      }
    } catch (err: any) {      console.error("Error creating staff:", err)
      const errorMessage = err.response?.data?.errorMessage ?? 
                          err.response?.data?.description ?? 
                          err.response?.data?.message ?? 
                          (language === 'sw' ? 'Imeshindwa kuunda mfanyakazi' : 'Failed to create staff member')
      toast({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle canceling staff form
  const handleStaffCancel = () => {
    setNewStaffMember({
      email: "",
      branchPublicId: "",
      role: "ROLE_SUPERVISOR",
    })
    setShowStaffForm(false)
  }

  return (
    <div className="space-y-4">      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold"><T k="staffManagement.title" /></h2>
          <p className="text-sm text-muted-foreground mt-1"><T k="staffManagement.description" /></p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowStaffForm(true)}
            variant="default"
            className="flex items-center gap-2"
            disabled={!centerPublicId || branches.length === 0}
          >
            <Plus className="h-4 w-4" />
            <T k="staff.addStaff" />
          </Button>
        </div>
      </div>
        {staffMembers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium"><T k="staff.noStaffMembers" /></h3>
          <p className="text-muted-foreground"><T k="staff.addStaffToGetStarted" /></p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Orphanage Administrators Section */}
          {staffMembers.filter(staff => !staff.branchPublicId).length > 0 && (
            <div>              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <T k="staff.orphanageAdministrators" />
                <span className="text-sm font-normal text-muted-foreground">
                  ({staffMembers.filter(staff => !staff.branchPublicId).length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffMembers
                  .filter(staff => !staff.branchPublicId)
                  .map(staff => (
                    <Card 
                      key={staff.publicId} 
                      className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border-purple-200 hover:border-purple-300 max-h-[160px]  -mt-3"
                      onClick={() => handleStaffClick(staff)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {staff.imageUrl && !imageErrors.has(staff.publicId ?? staff.email) ? (
                              <Image
                                src={staff.imageUrl}
                                alt={staff.fullName ?? 'Staff'}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                                onError={() => handleImageError(staff.publicId ?? staff.email)}
                              />
                            ) : (
                              <Users className="h-6 w-6 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold text-base text-gray-900">
                                {staff.fullName ?? <T k="staff.noName" />}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  staff.role === 'ROLE_SUPER_ADMIN' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>                                  {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
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
                              )}                              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-2">
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
          )}
          
          {/* Branch Staff Section */}
          {branches.length > 0 && (
            <div>              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <T k="staff.branchStaff" />
                <span className="text-sm font-normal text-muted-foreground">
                  ({staffMembers.filter(staff => staff.branchPublicId).length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                  <Card key={branch.publicId} className="flex flex-col h-[350px] -mt-3">
                    <CardHeader className="flex-shrink-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4" />
                        {branch.name}
                      </CardTitle>                      <CardDescription>
                        {staffMembers.filter(s => s.branchPublicId === branch.publicId).length} <T k="staff.staffMembers" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full pb-2">
                        <div className="space-y-2">
                          {staffMembers
                            .filter(staff => staff.branchPublicId === branch.publicId)
                            .map(staff => (
                              <div 
                                key={staff.publicId} 
                                className="p-3 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleStaffClick(staff)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {staff.imageUrl && !imageErrors.has(staff.publicId ?? staff.email) ? (
                                      <Image
                                        src={staff.imageUrl}
                                        alt={staff.fullName ?? 'Staff'}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover"
                                        onError={() => handleImageError(staff.publicId ?? staff.email)}
                                      />
                                    ) : (
                                      <User className="h-5 w-5 text-blue-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="font-medium">{staff.fullName ?? <T k="staff.noName" />}</p>
                                      <div className="flex flex-wrap gap-2">                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                          staff.role === 'ROLE_SUPER_ADMIN' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                          {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
                                        </span>
                                        {staff.suspended ? (
                                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                            <T k="staff.suspended" />
                                          </span>
                                        ) : (
                                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
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
                            ))}                          {staffMembers.filter(s => s.branchPublicId === branch.publicId).length === 0 && (
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
      )}      {/* Staff Edit Modal */}
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
          onDelete={async (staffId: string) => {
            await handleStaffDelete(staffId)
          }}
          currentUserPublicId={user?.publicId}
        />
      )}

      {/* Add Staff Modal */}
      <Dialog open={showStaffForm} onOpenChange={setShowStaffForm}>
        <DialogContent className="sm:max-w-[425px]">          <DialogHeader>
            <DialogTitle><T k="staff.addNewStaffMember" /></DialogTitle>
            <DialogDescription>
              <T k="staff.enterEmailSelectBranchRole" />
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStaffSubmit}>
            <div className="grid gap-4 py-4">              <div className="space-y-2">
                <Label htmlFor="email"><T k="common.email" /></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newStaffMember.email}
                  onChange={handleStaffChange}
                  placeholder={language === 'sw' ? 'Ingiza barua pepe ya mfanyakazi' : 'Enter staff email'}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchPublicId"><T k="common.branch" /></Label>
                <Select
                  value={newStaffMember.branchPublicId}
                  onValueChange={(value) => handleStaffSelectChange("branchPublicId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'sw' ? 'Chagua Tawi' : 'Select Branch'} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.publicId} value={branch.publicId ?? ""}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>              <div className="space-y-2">
                <Label htmlFor="role"><T k="common.role" /></Label>
                <Select
                  value={newStaffMember.role}
                  onValueChange={(value) => handleStaffSelectChange("role", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'sw' ? 'Chagua Jukumu' : 'Select Role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLE_SUPERVISOR"><T k="staff.supervisor" /></SelectItem>
                    <SelectItem value="ROLE_ORPHANAGE_ADMIN"><T k="staff.orphanageAdmin" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleStaffCancel}
                disabled={submitting}
              >
                <T k="common.cancel" />
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <T k="common.adding" />
                  </>
                ) : (
                  <T k="staff.addStaff" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
