"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import FundraiserCard from "@/components/fundraiser-card"

// Sample data - same as in admin view
const sampleFundraisers = [
  {
    id: 1,
    title: "Education for All Children",
    purpose: "Raise funds for school supplies and tuition",
    objective: "Provide education for 50 orphans",
    reason: "Many orphans lack access to quality education",
    fundraisingMethod: "Online donations",
    budgetBreakdown: "School supplies: $2000, Tuition: $5000, Books: $1000",
    timeline: "3 months",
    promotionPlan: "Social media, email campaigns",
    coordinatorName: "John Smith",
    posterUrl: "/images/adoption-family-1.png",
    status: "active" as const,
    amountRaised: 3500,
    targetAmount: 8000,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
  },
  {
    id: 2,
    title: "Healthcare Initiative",
    purpose: "Provide medical checkups and treatments",
    objective: "Ensure all orphans receive proper healthcare",
    reason: "Many orphans have unaddressed health issues",
    fundraisingMethod: "Charity event",
    budgetBreakdown: "Medical checkups: $3000, Treatments: $4000, Medicines: $2000",
    timeline: "6 months",
    promotionPlan: "Local media, partnerships with hospitals",
    coordinatorName: "Sarah Johnson",
    posterUrl: "/images/adoption-family-2.png",
    status: "active" as const,
    amountRaised: 5000,
    targetAmount: 9000,
    startDate: "2025-03-15",
    endDate: "2025-09-15",
  },
  {
    id: 3,
    title: "Sports Equipment Drive",
    purpose: "Purchase sports equipment for recreational activities",
    objective: "Promote physical health and teamwork",
    reason: "Physical activities are essential for development",
    fundraisingMethod: "Sports tournament",
    budgetBreakdown: "Football equipment: $1000, Basketball equipment: $1000, Other sports: $1000",
    timeline: "2 months",
    promotionPlan: "Partnerships with local sports clubs",
    coordinatorName: "Michael Brown",
    posterUrl: "/images/adoption-family-3.png",
    status: "completed" as const,
    amountRaised: 3000,
    targetAmount: 3000,
    startDate: "2025-01-01",
    endDate: "2025-02-28",
  },
  {
    id: 4,
    title: "Nutrition Program",
    purpose: "Provide nutritious meals for all orphans",
    objective: "Improve overall health and development",
    reason: "Proper nutrition is crucial for growth",
    fundraisingMethod: "Food drive and donations",
    budgetBreakdown: "Food supplies: $4000, Kitchen equipment: $1000, Staff: $2000",
    timeline: "4 months",
    promotionPlan: "Partnerships with local restaurants and food suppliers",
    coordinatorName: "Emily Davis",
    posterUrl: "/placeholder.svg?height=200&width=400&text=Nutrition+Campaign",
    status: "pending" as const,
    amountRaised: 0,
    targetAmount: 7000,
    startDate: "2025-05-01",
    endDate: "2025-08-31",
  },
]

export default function BranchFundraisersPage() {
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

  // Filter fundraisers based on search term
  const filteredFundraisers = sampleFundraisers.filter(
    (fundraiser) =>
      fundraiser.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fundraiser Management - Read Only</h1>
          <p className="text-muted-foreground">
            View fundraiser details for this branch. Superadmins cannot edit this data.
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
          placeholder="Search fundraisers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFundraisers.map((fundraiser) => (
          <Card key={fundraiser.id}>
            <CardContent className="p-0">
              <FundraiserCard fundraiser={fundraiser} />
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFundraisers.length === 0 && searchTerm !== "" && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No fundraisers found matching your search.</p>
        </div>
      )}
    </div>
  )
}
