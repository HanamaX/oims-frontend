"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, User, BookOpen, Stethoscope, Users } from "lucide-react"

// Define types for our data
interface Orphan {
  orphanId: number
  fullName: string
  origin: string
  dateOfBirth: string
  guardianName: string
  religion: string
  adoptionReason: string
  gender: string
  bloodGroup: string
  branchId: number
}

interface AcademicRecord {
  academicRecordId: number
  semester: string
  grade_level: string
  school_name: string
  orphanId: number
}

interface AcademicSubject {
  academicSubjectId: number
  name: string
  code: string
  grade: string
  academicRecordId: number
}

interface MedicalRecord {
  medicalRecordId: number
  diagnosis: string
  treatment: string
  description: string
  doctorName: string
  hospitalName: string
  hospitalAddress: string
  hospitalPhoneNumber: string
  orphanId: number
}

interface Guardian {
  name: string
  relationship: string
  contactNumber: string
  email: string
  address: string
  occupation: string
  orphanId: number
}

interface OrphanCardProps {
  orphan: Orphan
  academicRecord?: AcademicRecord
  academicSubjects?: AcademicSubject[]
  medicalRecord?: MedicalRecord
  guardian?: Guardian
  onEdit?: (orphanId: number) => void
  onDelete?: (orphanId: number) => void
}

export default function OrphanCard({
  orphan,
  academicRecord,
  academicSubjects = [],
  medicalRecord,
  guardian,
  onEdit,
  onDelete,
}: OrphanCardProps) {
  const [activeTab, setActiveTab] = useState("personal")

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{orphan.fullName}</CardTitle>
            <CardDescription>
              ID: {orphan.orphanId} • Age: {calculateAge(orphan.dateOfBirth)} •{" "}
              {orphan.gender === "M" ? "Male" : "Female"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" size="icon" onClick={() => onEdit(orphan.orphanId)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="icon" onClick={() => onDelete(orphan.orphanId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Medical</span>
            </TabsTrigger>
            <TabsTrigger value="guardian" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Guardian</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Origin</p>
                <p className="text-sm text-muted-foreground">{orphan.origin}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-sm text-muted-foreground">{new Date(orphan.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Religion</p>
                <p className="text-sm text-muted-foreground">{orphan.religion}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Blood Group</p>
                <p className="text-sm text-muted-foreground">{orphan.bloodGroup}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Adoption Reason</p>
              <p className="text-sm text-muted-foreground">{orphan.adoptionReason}</p>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            {academicRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Semester</p>
                    <p className="text-sm text-muted-foreground">{academicRecord.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Grade Level</p>
                    <p className="text-sm text-muted-foreground">{academicRecord.grade_level}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium">School Name</p>
                    <p className="text-sm text-muted-foreground">{academicRecord.school_name}</p>
                  </div>
                </div>

                {academicSubjects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Subjects</p>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {academicSubjects.map((subject) => (
                            <tr key={subject.academicSubjectId}>
                              <td className="px-4 py-2 text-sm">{subject.name}</td>
                              <td className="px-4 py-2 text-sm">{subject.code}</td>
                              <td className="px-4 py-2 text-sm">{subject.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No academic records available.</p>
            )}
          </TabsContent>

          <TabsContent value="medical">
            {medicalRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Diagnosis</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Treatment</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.treatment}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Doctor</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hospital</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hospital Address</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.hospitalAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hospital Phone</p>
                    <p className="text-sm text-muted-foreground">{medicalRecord.hospitalPhoneNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No medical records available.</p>
            )}
          </TabsContent>

          <TabsContent value="guardian">
            {guardian ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{guardian.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Relationship</p>
                  <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Number</p>
                  <p className="text-sm text-muted-foreground">{guardian.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{guardian.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Occupation</p>
                  <p className="text-sm text-muted-foreground">{guardian.occupation}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{guardian.address}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No guardian information available.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
