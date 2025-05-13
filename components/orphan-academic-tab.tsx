"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Eye } from "lucide-react"
import AcademicRecordForm from "@/components/academic-record-form"
import AcademicRecordDetails from "@/components/academic-record-details"
import { AcademicRecord } from "@/lib/orphan-types"
import Image from "next/image"
import API from "@/lib/api-service"

interface AcademicTabProps {
  readonly orphanId: string
  readonly records: AcademicRecord[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly onRetry: () => void
  readonly fetchRecords: () => void
}

export default function OrphanAcademicTab({
  orphanId,
  records,
  isLoading,
  error,
  onRetry,
  fetchRecords
}: Readonly<AcademicTabProps>) {
  const [showForm, setShowForm] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null)
  const [orphanImage, setOrphanImage] = useState<string | null>(null)

  // Fetch orphan image when component mounts
  useEffect(() => {
    const fetchOrphanDetails = async () => {
      try {
        const response = await API.get(`/app/oims/orphans/orphan/${orphanId}`)
        if (response.data?.data?.imageUrl) {
          setOrphanImage(response.data.data.imageUrl)
        }
      } catch (err) {
        console.error("Failed to fetch orphan image:", err)
      }
    }
    
    fetchOrphanDetails()
  }, [orphanId])

  // Helper to determine badge variant from grade
  const getBadgeVariant = (grade: string) => {
    if (grade.includes("A")) return "default"
    if (grade.includes("B")) return "secondary"
    if (grade.includes("C")) return "outline"
    return "destructive"
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading academic records...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    )
  }

  if (showForm || editingRecord) {
    return (
      <AcademicRecordForm
        orphanId={orphanId}
        record={editingRecord ? {
          publicId: editingRecord.publicId,
          schoolName: editingRecord.schoolName,
          gradeLevel: editingRecord.gradeLevel,
          semester: editingRecord.semester,
          subjects: editingRecord.subjects || []
        } : undefined}
        onSuccess={() => {
          setShowForm(false)
          setEditingRecord(null)
          fetchRecords()
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingRecord(null)
        }}
      />
    )
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No academic records found for this orphan</p>
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Academic Record
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {selectedRecordId && (
        <AcademicRecordDetails
          recordId={selectedRecordId}
          isOpen={!!selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
          onRecordUpdated={fetchRecords}
        />
      )}
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Record
        </Button>
      </div>
      
      {records.map((record) => (
        <Card key={record.publicId || `academic-${record.schoolName}-${record.semester}`} className="mb-4">
          <div className="flex flex-col md:flex-row">
            {/* Image column - only shown on medium screens and above */}
            {orphanImage && (
              <div className="hidden md:block w-[100px] h-[100px] overflow-hidden relative m-4">
                <Image 
                  src={orphanImage}
                  alt="Orphan"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{record.schoolName}</CardTitle>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {record.semester}
                  </Badge>
                </div>
                <CardDescription>Grade Level: {record.gradeLevel || "Unknown"}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                {/* On mobile, show the image at the top of content area */}
                {orphanImage && (
                  <div className="md:hidden w-full h-[120px] overflow-hidden relative mb-4">
                    <Image 
                      src={orphanImage}
                      alt="Orphan"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    {record.subjects && record.subjects.length > 0 ? (
                      <>
                        <h3 className="text-sm font-medium mb-2">Subjects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {record.subjects.map((subject) => (
                            <div 
                              key={`${record.publicId}-${subject.name}`} 
                              className="flex justify-between items-center border-b pb-2"
                            >
                              <span>{subject.name}</span>
                              <div className="flex items-center">
                                <Badge variant={getBadgeVariant(subject.grade)}>
                                  {subject.grade}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {record.createdAt && <p>Record Date: {new Date(record.createdAt.replace(" ", "T")).toLocaleDateString()}</p>}
                      </div>
                    )}
                  </div>
                  
                  <div className="sm:self-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedRecordId(record.publicId)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
