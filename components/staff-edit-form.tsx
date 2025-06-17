"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, User, UserCheck, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  username?: string
  isActive?: boolean
  sex?: string | null
  imageUrl?: string | null
  createdDate?: string
}

interface Branch {
  publicId?: string
  name: string
  location?: string
  phoneNumber?: string
  isHQ?: boolean
}

interface StaffEditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: Staff | null
  branches: Branch[]
  onUpdate: (staffId: string, updateData: any) => Promise<void>
  onDelete?: (staffId: string) => Promise<void>
  readOnly?: boolean
  currentUserPublicId?: string | null
}

export default function StaffEditForm({
  open,
  onOpenChange,
  staff,
  branches,
  onUpdate,
  onDelete,
  readOnly = false,
  currentUserPublicId
}: StaffEditFormProps) {
  const [formData, setFormData] = useState({
    branchPublicId: "",
    suspended: false
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form data when staff changes
  useEffect(() => {
    if (staff) {
      setFormData({
        branchPublicId: staff.branchPublicId || "",
        suspended: staff.suspended || false
      })
    }
  }, [staff])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staff?.publicId) return

    setLoading(true)
    try {
      await onUpdate(staff.publicId, formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!staff?.publicId || !onDelete) return

    setLoading(true)
    try {
      await onDelete(staff.publicId)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting staff:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!staff) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {staff.imageUrl ? (
                <img 
                  src={staff.imageUrl} 
                  alt={staff.fullName || `${staff.firstName} ${staff.lastName}`} 
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" 
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
              )}
              <div>
                <DialogTitle className="text-xl">
                  {staff.fullName || `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'Staff Member'}
                </DialogTitle>                <DialogDescription className="flex items-center gap-2 mt-1">
                  {staff.username && <span className="text-sm text-gray-500">@{staff.username}</span>}
                  <span className="flex gap-1">
                    <Badge variant={staff.role === "ROLE_SUPER_ADMIN" ? "default" : "secondary"}>
                      {staff.role === "ROLE_SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </Badge>
                    <Badge variant={staff.suspended ? "destructive" : "outline"}>
                      {staff.suspended ? "Suspended" : (staff.isActive ? "Active" : "Inactive")}
                    </Badge>
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Staff Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Staff Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground break-words">{staff.email || "Not Assigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground break-words">{staff.phoneNumber || "Not Assigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground">{staff.sex || "Not Specified"}</p>
                </div>
                {staff.createdDate && (
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(staff.createdDate.replace(' ', 'T')).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Settings */}
            {!readOnly && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium">Staff Settings</h3>
                <div className="space-y-4">
                  {staff.role !== "ROLE_SUPER_ADMIN" && (
                    <div className="space-y-2">
                      <Label htmlFor="branch-assignment">Assigned Branch</Label>
                      <Select
                        value={formData.branchPublicId}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, branchPublicId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {branches.map((branch) => (
                            <SelectItem key={branch.publicId} value={branch.publicId || ""}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                    <div className="space-y-2">
                    <Label htmlFor="account-status">Account Status</Label>
                    <Select
                      value={formData.suspended ? "suspended" : "active"}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, suspended: value === "suspended" }))
                      }
                      disabled={staff.publicId === currentUserPublicId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    {staff.publicId === currentUserPublicId && (
                      <p className="text-sm text-amber-600 mt-1">
                        You cannot change your own account status
                      </p>
                    )}
                  </div>
                </div>                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {staff.role === "ROLE_SUPER_ADMIN" ? (
                      "Super Admins don't need branch assignments as they have access to all branches. You can only modify the account status for Super Admins."
                    ) : (
                      "You can only modify the branch assignment and account status for this admin. To change other details, ask the admin to update their own profile."
                    )}
                    <br />
                    {staff.publicId === currentUserPublicId ? (
                      <strong className="text-amber-600">Note: You cannot suspend or delete your own account for security reasons.</strong>
                    ) : (
                      <strong>Note: Suspending an admin will prevent them from logging in but preserve their account data.</strong>
                    )}
                  </AlertDescription>
                </Alert><DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {onDelete && (
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={loading || staff.publicId === currentUserPublicId}
                        title={staff.publicId === currentUserPublicId ? "You cannot delete your own account" : "Delete this staff member"}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <UserCheck className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Update Staff
                        </>
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}

            {readOnly && (
              <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Staff Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete staff member <strong>
                {staff.fullName || `${staff.firstName} ${staff.lastName}`}
              </strong>? 
              <br /><br />
              This action cannot be undone and will permanently remove their account and access to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
