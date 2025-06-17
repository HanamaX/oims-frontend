"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VolunteerCardNew from "@/components/volunteer-card-new"
import { CurrentVolunteerResponse } from "@/lib/volunteer-service"
import API from "@/lib/api-service"
import { useLanguage, T } from "@/contexts/LanguageContext"

export default function SuperAdminVolunteersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [volunteers, setVolunteers] = useState<CurrentVolunteerResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branches, setBranches] = useState<{name: string, publicId: string}[]>([])
  const { t } = useLanguage()
  // Fetch branches to populate filter
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

  // Fetch volunteers from all branches
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true)
        // Use a superadmin-specific API endpoint here
        const response = await API.get("/app/oims/events/volunteers/centre")
        if (response.data?.data) {
          setVolunteers(response.data.data)
          setError(null)        } else {
          throw new Error("No data received from API")
        }
      } catch (err) {
        console.error("Error fetching volunteers:", err)
        setError(t("volunteer.error"))
        setVolunteers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVolunteers()
  }, [])
  // Filter volunteers based on search term, status and branch
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phoneNumber?.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter
    
    const matchesBranch = branchFilter === "all" || 
      volunteer.branchPublicId === branchFilter ||
      volunteer.branchName === branchFilter

    return matchesSearch && matchesStatus && matchesBranch
  })
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground"><T k="volunteer.loading" /></p>
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
            <T k="volunteer.tryAgain" />
          </Button>
        </div>
      </div>
    )
  }

  return (    <div className="space-y-6">      
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><T k="volunteer.management" /></h1>
        <p className="text-muted-foreground mt-2"><T k="volunteers.viewAcrossBranches" /></p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("volunteer.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>        <div className="w-full md:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("volunteer.filter.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="volunteer.filter.all" /></SelectItem>
              <SelectItem value="PENDING"><T k="volunteers.status.pending" /></SelectItem>
              <SelectItem value="APPROVED"><T k="volunteers.status.approved" /></SelectItem>
              <SelectItem value="REJECTED"><T k="volunteers.status.rejected" /></SelectItem>
            </SelectContent>
          </Select>
        </div>        <div className="w-full md:w-[180px]">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("volunteers.filter.branch")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="branch.all" /></SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.publicId} value={branch.publicId}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <VolunteerCardNew
            key={volunteer.publicId}
            volunteer={volunteer}
            readOnly={true}
          />
        ))}        {filteredVolunteers.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow col-span-full">
            <p className="text-muted-foreground"><T k="volunteer.noData" /></p>
          </div>
        )}
      </div>
    </div>
  )
}
