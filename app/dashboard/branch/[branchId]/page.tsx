"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, Heart, UserPlus, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Sample branch data
const branchData = [
  {
    branchId: 1,
    name: "Springfield Branch",
    location: "Springfield",
    orphans: 45,
    inventory: 120,
    fundraisers: 5,
    volunteers: 12,
  },
  {
    branchId: 2,
    name: "Downtown Branch",
    location: "Downtown",
    orphans: 38,
    inventory: 95,
    fundraisers: 3,
    volunteers: 9,
  },
  {
    branchId: 3,
    name: "Riverside Branch",
    location: "Riverside",
    orphans: 42,
    inventory: 110,
    fundraisers: 4,
    volunteers: 8,
  },
  {
    branchId: 4,
    name: "Hillside Branch",
    location: "Hillside",
    orphans: 31,
    inventory: 85,
    fundraisers: 2,
    volunteers: 7,
  },
]

export default function BranchViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [branch, setBranch] = useState<any>(null)
  const branchId = Number(params.branchId)

  useEffect(() => {
    // In a real app, this would be an API call to fetch branch data
    const foundBranch = branchData.find((b) => b.branchId === branchId)
    if (foundBranch) {
      setBranch(foundBranch)
    } else {
      router.push("/dashboard/superadmin/branches")
    }
  }, [branchId, router])

  // Ensure superadmin access only
  useEffect(() => {
    if (user?.role !== "superadmin") {
      router.push("/login")
    }
  }, [user, router])

  if (!branch) {
    return <div className="p-8 text-center">Loading branch data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
          <p className="text-muted-foreground">View only access to {branch.location}.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/superadmin/branches")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Branches
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/dashboard/branch/${branchId}/orphans`)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch.orphans}</div>
            <p className="text-xs text-muted-foreground">Click to view</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/dashboard/branch/${branchId}/inventory`)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch.inventory}</div>
            <p className="text-xs text-muted-foreground">Click to view</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/dashboard/branch/${branchId}/fundraisers`)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fundraisers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch.fundraisers}</div>
            <p className="text-xs text-muted-foreground">Click to view</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/dashboard/branch/${branchId}/volunteers`)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch.volunteers}</div>
            <p className="text-xs text-muted-foreground">Click to view</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Key metrics for {branch.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Orphan Capacity</p>
                  <span className="text-xs text-muted-foreground">{branch.orphans}/50 Orphans</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(branch.orphans / 50) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Inventory Status</p>
                  <span className="text-xs text-muted-foreground">{branch.inventory}/150 Items</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(branch.inventory / 150) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Fundraising Progress</p>
                  <span className="text-xs text-muted-foreground">{branch.fundraisers}/10 Campaigns</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(branch.fundraisers / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Volunteer Engagement</p>
                  <span className="text-xs text-muted-foreground">{branch.volunteers}/15 Volunteers</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(branch.volunteers / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Branch Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{branch.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm">{branch.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-green-600">Active</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm">2023-05-10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
