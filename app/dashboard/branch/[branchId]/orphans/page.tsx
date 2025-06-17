// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { ArrowLeft, Search } from "lucide-react"
// import { useAuth } from "@/components/auth-provider"
// import OrphanCard from "@/components/orphan-card"
// import { T, useLanguage } from "@/contexts/LanguageContext"

// // Sample data - same as in admin view
// const sampleOrphans = [
//   {
//     orphanId: 1,
//     fullName: "John Doe",
//     origin: "msapagula",
//     dateOfBirth: "2010-05-15",
//     guardianName: "Jane Doe",
//     religion: "Christianity",
//     adoptionReason: "Lost parents in an accident",
//     gender: "M",
//     bloodGroup: "O+",
//     branchId: 1,
//   },
//   {
//     orphanId: 2,
//     fullName: "Sarah Smith",
//     origin: "Riverside",
//     dateOfBirth: "2012-08-22",
//     guardianName: "Robert Smith",
//     religion: "Islam",
//     adoptionReason: "Parents unable to provide care",
//     gender: "F",
//     bloodGroup: "A-",
//     branchId: 1,
//   },
//   {
//     orphanId: 3,
//     fullName: "Michael Johnson",
//     origin: "Downtown",
//     dateOfBirth: "2009-03-10",
//     guardianName: "Emily Johnson",
//     religion: "Christianity",
//     adoptionReason: "Abandoned at birth",
//     gender: "M",
//     bloodGroup: "B+",
//     branchId: 1,
//   },
// ]

// const sampleAcademicRecords = [
//   {
//     academicRecordId: 1,
//     semester: "Fall 2024",
//     grade_level: "10",
//     school_name: "Springfield High School",
//     orphanId: 1,
//   },
//   {
//     academicRecordId: 2,
//     semester: "Fall 2024",
//     grade_level: "8",
//     school_name: "Riverside Middle School",
//     orphanId: 2,
//   },
//   {
//     academicRecordId: 3,
//     semester: "Fall 2024",
//     grade_level: "11",
//     school_name: "Downtown High School",
//     orphanId: 3,
//   },
// ]

// const sampleAcademicSubjects = [
//   {
//     academicSubjectId: 1,
//     name: "Mathematics",
//     code: "MATH101",
//     grade: "A",
//     academicRecordId: 1,
//   },
//   {
//     academicSubjectId: 2,
//     name: "Science",
//     code: "SCI101",
//     grade: "B+",
//     academicRecordId: 1,
//   },
//   {
//     academicSubjectId: 3,
//     name: "English",
//     code: "ENG101",
//     grade: "A-",
//     academicRecordId: 1,
//   },
//   {
//     academicSubjectId: 4,
//     name: "Mathematics",
//     code: "MATH101",
//     grade: "B",
//     academicRecordId: 2,
//   },
//   {
//     academicSubjectId: 5,
//     name: "Science",
//     code: "SCI101",
//     grade: "A",
//     academicRecordId: 2,
//   },
//   {
//     academicSubjectId: 6,
//     name: "Mathematics",
//     code: "MATH101",
//     grade: "C+",
//     academicRecordId: 3,
//   },
// ]

// const sampleMedicalRecords = [
//   {
//     medicalRecordId: 1,
//     diagnosis: "Flu",
//     treatment: "Rest and medication",
//     description: "Mild flu symptoms",
//     doctorName: "Dr. Smith",
//     hospitalName: "Springfield Hospital",
//     hospitalAddress: "456 Elm St",
//     hospitalPhoneNumber: "9876543210",
//     orphanId: 1,
//   },
//   {
//     medicalRecordId: 2,
//     diagnosis: "Asthma",
//     treatment: "Inhaler",
//     description: "Mild asthma, needs regular checkups",
//     doctorName: "Dr. Johnson",
//     hospitalName: "Riverside Hospital",
//     hospitalAddress: "789 Oak St",
//     hospitalPhoneNumber: "9876543211",
//     orphanId: 2,
//   },
// ]

// const sampleGuardians = [
//   {
//     name: "Jane Doe",
//     relationship: "Aunt",
//     contactNumber: "1234567890",
//     email: "jane.doe@example.com",
//     address: "123 Main St",
//     occupation: "Teacher",
//     orphanId: 1,
//   },
//   {
//     name: "Robert Smith",
//     relationship: "Uncle",
//     contactNumber: "2345678901",
//     email: "robert.smith@example.com",
//     address: "456 Pine St",
//     occupation: "Engineer",
//     orphanId: 2,
//   },
//   {
//     name: "Emily Johnson",
//     relationship: "Grandmother",
//     contactNumber: "3456789012",
//     email: "emily.johnson@example.com",
//     address: "789 Maple St",
//     occupation: "Retired",
//     orphanId: 3,
//   },
// ]

// export default function BranchOrphansPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user } = useAuth()
//   const { t } = useLanguage()
//   const branchId = Number(params.branchId)
//   const [searchTerm, setSearchTerm] = useState("")

//   // Ensure superadmin access only
//   useEffect(() => {
//     if (user?.role !== "superadmin") {
//       router.push("/login")
//     }
//   }, [user, router])

//   // Filter orphans based on search term
//   const filteredOrphans = sampleOrphans.filter(
//     (orphan) =>
//       orphan.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       orphan.origin.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight"><T k="branch.orphans.management" /></h1>
//           <p className="text-muted-foreground">
//             <T k="branch.orphans.description" />
//           </p>
//         </div>
//         <Button variant="outline" onClick={() => router.push(`/dashboard/branch/${branchId}`)}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           <T k="branch.backToBranch" />
//         </Button>
//       </div>

//       <div className="flex items-center space-x-2">
//         <Search className="h-5 w-5 text-muted-foreground" />
//         <Input
//           placeholder={t("orphans.search")}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>

//       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
//         {filteredOrphans.map((orphan) => {
//           // Find related records
//           const academicRecord = sampleAcademicRecords.find((record) => record.orphanId === orphan.orphanId)
//           const academicSubjects = academicRecord
//             ? sampleAcademicSubjects.filter((subject) => subject.academicRecordId === academicRecord.academicRecordId)
//             : []
//           const medicalRecord = sampleMedicalRecords.find((record) => record.orphanId === orphan.orphanId)
//           const guardian = sampleGuardians.find((guardian) => guardian.orphanId === orphan.orphanId)

//           return (
//             <Card key={orphan.orphanId}>
//               <CardContent className="p-4">
//                 <OrphanCard
//                   orphan={orphan}
//                   academicRecord={academicRecord}
//                   academicSubjects={academicSubjects}
//                   medicalRecord={medicalRecord}
//                   guardian={guardian}
//                   // No edit or delete handlers for superadmin view
//                 />
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {filteredOrphans.length === 0 && (
//         <div className="text-center py-10">
//           <p className="text-muted-foreground"><T k="orphans.noData" /></p>
//         </div>
//       )}
//     </div>
//   )
// }
