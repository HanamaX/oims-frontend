"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, AlertTriangle } from "lucide-react"
import FundraiserCard from "@/components/fundraiser-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import API from "@/lib/api-service"
import { Fundraiser } from "@/lib/fundraiser-service"
import { T, useLanguage } from "@/contexts/LanguageContext"

export default function SuperAdminFundraisersPage() {
  const { t } = useLanguage()
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
        if (response.data?.data) {          // Process the data - ensure imageUrl is properly formatted if it exists
          const processedFundraisers = response.data.data.map((fundraiser: any) => {
            let formattedImageUrl = null
            if (fundraiser.imageUrl) {
              formattedImageUrl = fundraiser.imageUrl.startsWith('http')
                ? fundraiser.imageUrl 
                : `https://oims-4510ba404e0e.herokuapp.com${fundraiser.imageUrl}`
            }
            
            return {
              ...fundraiser,
              imageUrl: formattedImageUrl
            }
          })
          
          setFundraisers(processedFundraisers)
          setError(null)        } else {
          throw new Error(t("fundraisers.noDataFound"))
        }
      } catch (err) {
        console.error("Error fetching fundraisers:", err)
        setError(t("fundraisers.failedToLoad"))
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
          <p className="text-muted-foreground"><T k="fundraisers.loadingFundraisers" /></p>
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
            <T k="common.tryAgain" />
          </Button>
        </div>
      </div>
    )
  }

  return (    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><T k="fundraisers.management" /></h1>
        <p className="text-muted-foreground mt-2"><T k="fundraisers.viewAllBranches" /></p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("fundraisers.searchFundraisers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>        <div className="w-full md:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("fundraisers.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="fundraisers.allStatuses" /></SelectItem>
              <SelectItem value="pending"><T k="fundraisers.pending" /></SelectItem>
              <SelectItem value="approved"><T k="fundraisers.approved" /></SelectItem>
              <SelectItem value="rejected"><T k="fundraisers.rejected" /></SelectItem>
              <SelectItem value="completed"><T k="fundraisers.completed" /></SelectItem>
            </SelectContent>
          </Select>
        </div>        <div className="w-full md:w-[180px]">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("fundraisers.filterByBranch")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="fundraisers.allBranches" /></SelectItem>
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
        ))}        {filteredFundraisers.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground"><T k="fundraisers.noFundraisersFound" /></p>
          </Card>
        )}
      </div>
    </div>
  )
}