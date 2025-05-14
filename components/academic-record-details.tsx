"use client"

import { useState, useEffect } from "react"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { AcademicRecordDetail } from "@/lib/orphan-types"
import API from "@/lib/api-service"
import RecordDetailsDialog from "./record-details-dialog"
import AcademicRecordForm from "./academic-record-form"

interface AcademicRecordDetailsProps {
  recordId: string
  isOpen: boolean
  onClose: () => void
  onRecordUpdated?: () => void
  readOnly?: boolean
}

export default function AcademicRecordDetails({
  recordId,
  isOpen,
  onClose,
  onRecordUpdated,
  readOnly = false
}: Readonly<AcademicRecordDetailsProps>) {
  const [record, setRecord] = useState<AcademicRecordDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Helper function to determine badge variant from grade
  const getBadgeVariant = (grade: string) => {
    if (grade.includes("A")) return "default"
    if (grade.includes("B")) return "secondary"
    if (grade.includes("C")) return "outline"
    return "destructive"
  }

  useEffect(() => {
    if (isOpen && recordId) {
      fetchRecordDetails()
    }
  }, [recordId, isOpen])

  const fetchRecordDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await API.get(`/app/oims/orphans/academic/record-details/${recordId}`)
      if (response.data?.data) {
        setRecord(response.data.data)
      } else {
        setError("No record details found")
      }
    } catch (err: any) {
      console.error("Error fetching academic record details:", err)
      setError(err.message ?? "Failed to fetch academic record details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!record?.publicId) return
    
    setDeleteLoading(true)
    try {
      await API.delete(`/app/oims/orphans/academic/records/${record.publicId}`)
      setDeleteDialogOpen(false)
      onClose()
      if (onRecordUpdated) {
        onRecordUpdated()
      }
    } catch (err: any) {
      console.error("Error deleting academic record:", err)
      setError(err.message ?? "Failed to delete academic record")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <RecordDetailsDialog title="Academic Record Details" isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </RecordDetailsDialog>
    )
  }

  if (error) {
    return (
      <RecordDetailsDialog title="Academic Record Details" isOpen={isOpen} onClose={onClose}>
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
    // Extract orphanId from the API endpoint or record ID
    const parts = recordId.split("-")
    const orphanId = parts.length > 1 ? parts[0] : ''
    
    return (
      <AcademicRecordForm 
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
        title="Academic Record Details" 
        isOpen={isOpen} 
        onClose={onClose}
        actions={
          !readOnly ? (
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
          ) : undefined
        }
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{record.schoolName}</h3>
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {record.semester}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Grade Level: {record.gradeLevel}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Subjects & Grades</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <table className="w-full">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Subject</th>
                    <th className="text-left py-2">Code</th>
                    <th className="text-center py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {record.subjects.map((subject) => (
                    <tr key={subject.publicId ?? subject.name} className="border-t border-gray-200">
                      <td className="py-3">{subject.name}</td>
                      <td className="py-3 text-muted-foreground text-sm">{subject.code ?? "N/A"}</td>
                      <td className="py-3 text-center">
                        <Badge variant={getBadgeVariant(subject.grade)} className="min-w-16">
                          {subject.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RecordDetailsDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this academic record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the academic record 
              and all associated subjects.
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
