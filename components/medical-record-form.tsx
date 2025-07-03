"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2 } from "lucide-react"
import API from "@/lib/api-service"
import { MedicalRecordDetail } from "@/lib/orphan-types"
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

interface MedicalRecordFormProps {
  orphanId: string
  record?: MedicalRecordDetail // If provided, form is in edit mode
  onSuccess: () => void
  onCancel: () => void
}

export default function MedicalRecordForm({ 
  orphanId, 
  record,
  onSuccess, 
  onCancel 
}: Readonly<MedicalRecordFormProps>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isEditMode = !!record
    const [formData, setFormData] = useState({
    diagnosis: record?.diagnosis ?? "",
    treatment: record?.treatment ?? "",
    description: record?.description ?? "",
    doctorName: record?.doctorName ?? "",
    hospitalName: record?.hospitalName ?? "",
    hospitalAddress: record?.hospitalAddress ?? "",
    hospitalPhoneNumber: record?.hospitalPhoneNumber ?? "",
  })
  
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle delete medical record
  const handleDeleteRecord = async () => {
    if (!record?.publicId) return
    
    setDeleteLoading(true)
    try {
      await API.delete(`/app/oims/orphans/medical/records/${record.publicId}`)
      onSuccess()
    } catch (err: any) {
      console.error("Error deleting medical record:", err)
      setError(err.message ?? "Failed to delete medical record")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)
    
    try {
      if (isEditMode && record?.publicId) {
        // Update existing medical record
        const updatePayload = {
          medicalRecordPublicId: record.publicId,
          ...formData
        }
        
        await API.patch("/app/oims/orphans/medical/records", updatePayload)
      } else {
        // Create new medical record
        const createPayload = {
          orphanPublicId: orphanId,
          ...formData
        }
        
        await API.post("/app/oims/orphans/medical/records", createPayload)
      }
      
      onSuccess()
    } catch (err: any) {
      console.error(isEditMode ? "Error updating medical record:" : "Error creating medical record:", err)
      setError(err.message ?? `Failed to ${isEditMode ? 'update' : 'create'} medical record`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditMode ? 'Edit Medical Record' : 'Add Medical Record'}</CardTitle>
          {isEditMode && (
            <Button 
              type="button" 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Record
            </Button>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
          
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input 
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea 
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                name="description"                value={formData.description ?? ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor's Name (Optional)</Label>
                <Input 
                  id="doctorName"
                  name="doctorName"                  value={formData.doctorName ?? ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital Name</Label>
                <Input 
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address (Optional)</Label>
              <Input 
                id="hospitalAddress"
                name="hospitalAddress"
                value={formData.hospitalAddress || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hospitalPhoneNumber">Hospital Phone Number (Optional)</Label>
              <Input 
                id="hospitalPhoneNumber"
                name="hospitalPhoneNumber"
                value={formData.hospitalPhoneNumber || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || deleteLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Record' : 'Save Record'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Delete Record Confirmation Dialog */}
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
                handleDeleteRecord()
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