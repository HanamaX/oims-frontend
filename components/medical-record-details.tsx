"use client"

import { useState, useEffect } from "react"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { MedicalRecordDetail } from "@/lib/orphan-types"
import API from "@/lib/api-service"
import RecordDetailsDialog from "./record-details-dialog"
import MedicalRecordForm from "./medical-record-form"

interface MedicalRecordDetailsProps {
  recordId: string
  isOpen: boolean
  onClose: () => void
  onRecordUpdated?: () => void
}

export default function MedicalRecordDetails({
  recordId,
  isOpen,
  onClose,
  onRecordUpdated
}: Readonly<MedicalRecordDetailsProps>) {
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (isOpen && recordId) {
      fetchRecordDetails()
    }
  }, [recordId, isOpen])

  const fetchRecordDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await API.get(`/app/oims/orphans/medical/record-details/${recordId}`)
      if (response.data?.data) {
        setRecord(response.data.data)
      } else {
        setError("No record details found")
      }
    } catch (err: any) {
      console.error("Error fetching medical record details:", err)
      setError(err.message ?? "Failed to fetch medical record details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!record?.publicId) return
    
    setDeleteLoading(true)
    try {
      await API.delete(`/app/oims/orphans/medical/records/${record.publicId}`)
      setDeleteDialogOpen(false)
      onClose()
      if (onRecordUpdated) {
        onRecordUpdated()
      }
    } catch (err: any) {
      console.error("Error deleting medical record:", err)
      setError(err.message ?? "Failed to delete medical record")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <RecordDetailsDialog title="Medical Record Details" isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RecordDetailsDialog>
    )
  }

  if (error) {
    return (
      <RecordDetailsDialog title="Medical Record Details" isOpen={isOpen} onClose={onClose}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </RecordDetailsDialog>
    )
  }

  if (!record) {
    return null
  }
  if (isEditing && record) {
    // Extract orphanId from the API endpoint
    const parts = recordId.split("-")
    const orphanId = parts.length > 1 ? parts[0] : ''
    
    return (
      <MedicalRecordForm 
        orphanId={orphanId}
        record={record}
        onSuccess={() => {
          setIsEditing(false)
          fetchRecordDetails()
          if (onRecordUpdated) {
            onRecordUpdated()
          }
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <>
      <RecordDetailsDialog 
        title="Medical Record Details" 
        isOpen={isOpen} 
        onClose={onClose}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{record.diagnosis}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(record.createdAt.replace(' ', 'T')).toLocaleDateString()}
            </p>
          </div>

          {record.description && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="text-sm">{record.description}</p>
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Treatment</h4>
            <p className="text-sm">{record.treatment}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <h4 className="text-sm font-medium">Hospital Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Hospital Name</p>
                <p>{record.hospitalName}</p>
              </div>
              
              {record.hospitalAddress && (
                <div>
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p>{record.hospitalAddress}</p>
                </div>
              )}
              
              {record.hospitalPhoneNumber && (
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p>{record.hospitalPhoneNumber}</p>
                </div>
              )}
              
              {record.doctorName && (
                <div>
                  <p className="text-muted-foreground text-xs">Doctor</p>
                  <p>{record.doctorName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </RecordDetailsDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this medical record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the medical record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
