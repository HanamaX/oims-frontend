"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import VolunteerCard from "@/components/volunteer-card"

// Sample data - same as in admin view
const sampleVolunteers = [
  {
    publicId: "vol-001",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "1122334455",
    scheduledDate: "2025-04-15",
    jobRole: "Teacher",
    branchPublicId: "branch-001",
    branchName: "Main Branch",
    status: "Approved",
    createdAt: "2024-11-15"  // About 6 months ago
  },
  {
    publicId: "vol-002",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "2233445566",
    scheduledDate: "2025-04-20",
    jobRole: "Doctor",
    branchPublicId: "branch-001",
    branchName: "Main Branch",
    status: "Pending",
    createdAt: "2025-01-23"  // About 4 months ago
  },
  {
    publicId: "vol-003",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phoneNumber: "3344556677",
    scheduledDate: "2025-04-25",
    jobRole: "Counselor",
    branchPublicId: "branch-001",
    branchName: "Main Branch",
    status: "Approved",
    createdAt: "2025-03-20"  // About 2 months ago
  },
  {
    publicId: "vol-004",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phoneNumber: "4455667788",
    scheduledDate: "2025-05-01",
    jobRole: "Sports Coach",
    branchPublicId: "branch-001", 
    branchName: "Main Branch",
    status: "Pending",
    createdAt: "2025-04-29"  // About 2 weeks ago
  },
]

export default function BranchVolunteersPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const branchId = Number(params.branchId)
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure superadmin access only
  useEffect(() => {
    if (user?.role !== "superadmin") {
      router.push("/login")
    }
  }, [user, router])

  // Filter volunteers based on search term
  const filteredVolunteers = sampleVolunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.jobRole.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Management - Read Only</h1>
          <p className="text-muted-foreground">
            View volunteer details for this branch. Superadmins cannot edit this data.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/branch/${branchId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Branch
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search volunteers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.publicId}>
            <CardContent className="p-4">
              <VolunteerCard volunteer={volunteer} />
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No volunteers found matching your search.</p>
        </div>
      )}
    </div>
  )
}
