"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Plus, Trash2 } from "lucide-react"
import API from "@/lib/api-service"
import { AcademicRecordDetail } from "@/lib/orphan-types"
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

interface AcademicRecordFormProps {
  orphanId: string
  record?: AcademicRecordDetail // If provided, form is in edit mode
  onSuccess: () => void
  onCancel: () => void
}

interface SubjectField {
  publicId?: string // Only present for existing subjects
  name: string
  code: string
  grade: string
}

export default function AcademicRecordForm({ 
  orphanId, 
  record,
  onSuccess, 
  onCancel 
}: Readonly<AcademicRecordFormProps>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isEditMode = !!record
    const [formData, setFormData] = useState({
    schoolName: record?.schoolName ?? "",
    gradeLevel: record?.gradeLevel ?? "",
    semester: record?.semester ?? ""
  })
  
  const [subjects, setSubjects] = useState<SubjectField[]>(
    record?.subjects?.map(subject => ({
      publicId: subject.publicId,
      name: subject.name,
      code: subject.code ?? "",
      grade: subject.grade
    })) || []
  )
  
  // Add a blank subject field
  const addSubject = () => {
    setSubjects(prevSubjects => [...prevSubjects, { name: "", code: "", grade: "C" }])
  }
  
  // Remove a subject field by index
  const removeSubject = (index: number) => {
    const subject = subjects[index]
    
    // If it's an existing subject with an ID, confirm deletion via API
    if (subject.publicId) {
      setDeleteSubjectId(subject.publicId)
      return
    }
    
    // For new subjects just remove from the array using functional update
    setSubjects(prevSubjects => prevSubjects.filter((_, i) => i !== index))
  }
  
  // Handle subject field changes directly
  const handleSubjectNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    console.log(`Subject name change: ${newValue}`)
    setSubjects(prevSubjects => {
      // Create a deep copy of the subjects array
      const newSubjects = [...prevSubjects]
      // Create a new object for the updated subject
      newSubjects[index] = { 
        ...newSubjects[index], 
        name: newValue 
      }
      return newSubjects
    })
  }
  
  // Handle subject code changes directly
  const handleSubjectCodeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    console.log(`Subject code change: ${newValue}`)
    setSubjects(prevSubjects => {
      // Create a deep copy of the subjects array
      const newSubjects = [...prevSubjects]
      // Create a new object for the updated subject
      newSubjects[index] = { 
        ...newSubjects[index], 
        code: newValue 
      }
      return newSubjects
    })
  }
  
  // Handle subject grade changes 
  const handleSubjectGradeChange = (index: number, newValue: string) => {
    setSubjects(prevSubjects => {
      // Create a deep copy of the subjects array
      const newSubjects = [...prevSubjects]
      // Create a new object for the updated subject
      newSubjects[index] = { 
        ...newSubjects[index], 
        grade: newValue 
      }
      return newSubjects
    })
  }
  
  // This function is now unused since we're using the specific handlers
  // Keeping it just for reference
  const updateSubject = (index: number, field: keyof SubjectField, value: string) => {
    setSubjects(prevSubjects => {
      const updatedSubjects = [...prevSubjects]
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value }
      return updatedSubjects
    })
  }
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle delete academic record
  const handleDeleteRecord = async () => {
    if (!record?.publicId) return
    
    setDeleteLoading(true)
    try {
      await API.delete(`/app/oims/orphans/academic/records/${record.publicId}`)
      onSuccess()
    } catch (err: any) {
      console.error("Error deleting academic record:", err)
      setError(err.message ?? "Failed to delete academic record")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }
  
  // Handle delete subject
  const handleDeleteSubject = async (subjectId: string) => {
    setDeleteLoading(true)
    try {
      await API.delete(`/app/oims/orphans/academic/subjects/${subjectId}`)
      // Remove from local state
      setSubjects(subjects.filter(subject => subject.publicId !== subjectId))
    } catch (err: any) {
      console.error("Error deleting subject:", err)
      setError(err.message ?? "Failed to delete subject")
    } finally {
      setDeleteLoading(false)
      setDeleteSubjectId(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)
    
    try {
      let academicRecordId = record?.publicId
      
      if (isEditMode && academicRecordId) {
        // Update the existing academic record
        const recordPayload = {
          academicRecordPublicId: academicRecordId,
          semester: formData.semester,
          grade_level: formData.gradeLevel,
          school_name: formData.schoolName
        }
        
        await API.patch("/app/oims/orphans/academic/records", recordPayload)
        
      } else {
        // Create a new academic record
        const recordPayload = {
          orphanPublicId: orphanId,
          semester: formData.semester,
          grade_level: formData.gradeLevel,
          school_name: formData.schoolName
        }
        
        const response = await API.post("/app/oims/orphans/academic/records", recordPayload)
        
        if (!response.data?.data?.publicId) {
          setError("Failed to create academic record")
          return
        }
        
        // Store the new record ID
        academicRecordId = response.data.data.publicId
      }
      
      // Process subjects: update existing ones and add new ones
      if (academicRecordId) {
        const subjectPromises = subjects.map(subject => {
          if (subject.publicId) {
            // Update existing subject
            const updatePayload = {
              academicSubjectPublicId: subject.publicId,
              name: subject.name,
              code: subject.code,
              grade: subject.grade
            }
            return API.patch("/app/oims/orphans/academic/subjects", updatePayload)
          } else {
            // Add new subject
            const createPayload = {
              academicRecordPublicId: academicRecordId,
              name: subject.name,
              code: subject.code,
              grade: subject.grade
            }
            return API.post("/app/oims/orphans/academic/subjects", createPayload)
          }
        })
        
        await Promise.all(subjectPromises)
      }
      
      onSuccess()
      
    } catch (err: any) {
      console.error(isEditMode ? "Error updating academic record:" : "Error creating academic record:", err)
      setError(err.message ?? `Failed to ${isEditMode ? 'update' : 'create'} academic record`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditMode ? 'Edit Academic Record' : 'Add Academic Record'}</CardTitle>
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
              <Label htmlFor="schoolName">School Name</Label>
              <Input 
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input 
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                required
                placeholder="e.g. Form 2, Grade 8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input 
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                placeholder="e.g. 2025 Spring"
              />
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <Label>Subjects (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
              
              {subjects.length === 0 && (
                <div className="text-center py-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground text-sm">You can add individual subjects and grades (optional).</p>
                </div>
              )}
              
              {subjects.map((subject, index) => (
                <div key={subject.publicId ?? `subject-new-${index}`} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-md">
                  <div className="col-span-4">
                    <Label htmlFor={`subject-name-${index}`} className="text-xs mb-1 block">Subject Name</Label>
                    <input
                      name={`subject-name-${index}`}
                      value={subject.name}
                      onChange={(e) => handleSubjectNameChange(index, e)}
                      placeholder="e.g. Mathematics"
                      required
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Label htmlFor={`subject-code-${index}`} className="text-xs mb-1 block">Subject Code</Label>
                    <input
                      name={`subject-code-${index}`}
                      value={subject.code}
                      onChange={(e) => handleSubjectCodeChange(index, e)}
                      placeholder="e.g. MATH101"
                      required
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="col-span-4">
                    <Label htmlFor={`subject-grade-${index}`} className="text-xs mb-1 block">Grade</Label>
                    <Select
                      value={subject.grade}
                      onValueChange={(value) => handleSubjectGradeChange(index, value)}
                    >
                      <SelectTrigger id={`subject-grade-${index}`}>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="C+">C+</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="C-">C-</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeSubject(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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

      {/* Delete Subject Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteSubjectId} 
        onOpenChange={(open) => !open && setDeleteSubjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this subject?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                if (deleteSubjectId) {
                  handleDeleteSubject(deleteSubjectId)
                }
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