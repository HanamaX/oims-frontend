"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, AlertTriangle } from "lucide-react"
import FundraiserCard from "@/components/fundraiser-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import API from "@/lib/api-service"
import FundraiserService, { Fundraiser } from "@/lib/fundraiser-service"

export default function SuperAdminFundraisersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branches, setBranches] = useState<{name: string, publicId: string}[]>([])
  
  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Use the public branches endpoint
        const response = await API.get("/app/oims/public/branches")
        if (response.data?.data) {
          const branchesData = response.data.data.map((branch: any) => ({
            name: branch.name,
            publicId: branch.publicId
          }))
          setBranches(branchesData)
        }
      } catch (err) {
        console.error("Error fetching branches:", err)
        // We'll just show an empty branches list, not critical
      }
    }
    
    fetchBranches()
  }, [])

  // Fetch fundraisers from API for all branches
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        setIsLoading(true)
        // For superadmin, fetch all fundraisers across branches
        const response = await API.get("/app/oims/events/fundraisers/centre")
        if (response.data?.data) {
          // Debug the fundraiser data to see what's coming from the API
          console.log("Fundraisers data from API:", response.data.data)
          
          // Check for imageUrl in the data
          const hasImages = response.data.data.some((fundraiser: any) => !!fundraiser.imageUrl)
          console.log(`Fundraisers with images: ${hasImages ? 'Yes' : 'No'}`)
          
          // If images exist, log their URLs to help debug
          if (hasImages) {
            const imageUrls = response.data.data
              .filter((f: any) => f.imageUrl)
              .map((f: any) => ({ id: f.publicId, url: f.imageUrl }))
            console.log("Image URLs from API:", imageUrls)
          }
          
          // Process the data - ensure imageUrl is properly formatted if it exists
          const processedFundraisers = response.data.data.map((fundraiser: any) => ({
            ...fundraiser,
            imageUrl: fundraiser.imageUrl 
              ? fundraiser.imageUrl.startsWith('http')
                ? fundraiser.imageUrl 
                : `https://oims-4510ba404e0e.herokuapp.com${fundraiser.imageUrl}`
              : null
          }))
          
          setFundraisers(processedFundraisers)
          setError(null)
        } else {
          throw new Error("No data returned from API")
        }
      } catch (err) {
        console.error("Error fetching fundraisers:", err)
        setError("Failed to load fundraisers. Please try again later.")
        setFundraisers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFundraisers()
  }, [])

  // Filter fundraisers based on search term, status, and branch
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const matchesSearch =
      fundraiser.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.coordinatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.fundraisingReason?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || fundraiser.status === statusFilter.toUpperCase()
    
    const matchesBranch = branchFilter === "all" || 
      fundraiser.branchPublicId === branchFilter ||
      fundraiser.branchName === branchFilter

    return matchesSearch && matchesStatus && matchesBranch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fundraisers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fundraiser Management</h1>
        <p className="text-muted-foreground mt-2">View fundraisers across all branches</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search fundraisers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[180px]">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.publicId} value={branch.publicId}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFundraisers.map((fundraiser) => (
          <FundraiserCard 
            key={fundraiser.publicId} 
            fundraiser={fundraiser}
            readOnly={true}  
          />
        ))}

        {filteredFundraisers.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No fundraisers found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
