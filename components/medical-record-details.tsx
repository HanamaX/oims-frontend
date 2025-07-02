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
  readOnly?: boolean
}

export default function MedicalRecordDetails({
  recordId,
  isOpen,
  onClose,
  onRecordUpdated,
  readOnly = false
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
    <>      <RecordDetailsDialog 
        title="Medical Record Details" 
        isOpen={isOpen} 
        onClose={onClose}
        actions={
          !readOnly ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="space-y-6">
          <div className="mb-4">
            <div className="mb-2">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Diagnosis</span>
              <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.diagnosis}</span>
            </div>
            <div className="mb-2">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Date</span>
              <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{new Date(record.createdAt.replace(' ', 'T')).toLocaleDateString()}</span>
            </div>
          </div>

          {record.description && (
            <div className="mb-4">
              <div className="mb-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Description</span>
                <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.description}</span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="mb-2">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Treatment</span>
              <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.treatment}</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">Hospital Information</h3>
            
            <div className="space-y-2">
              <div className="mb-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Hospital Name</span>
                <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.hospitalName}</span>
              </div>
              
              {record.hospitalAddress && (
                <div className="mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Address</span>
                  <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.hospitalAddress}</span>
                </div>
              )}
              
              {record.hospitalPhoneNumber && (
                <div className="mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Phone</span>
                  <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.hospitalPhoneNumber}</span>
                </div>
              )}
              
              {record.doctorName && (
                <div className="mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 mr-2 inline-block min-w-[120px]">Doctor</span>
                  <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.doctorName}</span>
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
