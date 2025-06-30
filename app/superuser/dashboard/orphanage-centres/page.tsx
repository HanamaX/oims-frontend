"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrphanageCentreService, { OrphanageCentre } from "@/lib/orphanage-centre-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  Search, 
  Info, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Loader2
} from "lucide-react"
import { useLanguage, T } from "@/contexts/LanguageContext"

export default function OrphanageCentresPage() {
  const [centres, setCentres] = useState<OrphanageCentre[]>([])
  const [filteredCentres, setFilteredCentres] = useState<OrphanageCentre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const router = useRouter()
  const { t } = useLanguage()

  // Fetch centres on component mount
  useEffect(() => {
    const loadCentres = async () => {
      try {
        setIsLoading(true)
        const data = await OrphanageCentreService.getAllCentres()
        setCentres(data)
        setFilteredCentres(data)
      } catch (error) {
        console.error("Failed to load orphanage centres:", error)
        setError("Failed to load orphanage centres. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCentres()
  }, [])

  // Filter centres when filter or search changes
  useEffect(() => {
    let result = [...centres]
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      result = result.filter(centre => centre.isActive === isActive)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(centre => 
        centre.name.toLowerCase().includes(query) || 
        centre.location.toLowerCase().includes(query) ||
        centre.email.toLowerCase().includes(query)
      )
    }
    
    setFilteredCentres(result)
  }, [centres, statusFilter, searchQuery])

  // Handle view details
  const handleViewDetails = (centreId: string) => {
    router.push(`/superuser/dashboard/orphanage-centres/${centreId}`)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2"><T k="orphanageCentres.loading" /></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2"><T k="orphanageCentres.errorTitle" /></h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}><T k="orphanageCentres.tryAgain" /></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="orphanageCentres.title" /></h1>
          <p className="text-muted-foreground">
            <T k="orphanageCentres.subtitle" />
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("orphanageCentres.search")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={<T k="orphanageCentres.filterByStatus" />} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel><T k="orphanageCentres.status" /></SelectLabel>
              <SelectItem value="all"><T k="orphanageCentres.allCentres" /></SelectItem>
              <SelectItem value="active"><T k="orphanageCentres.active" /></SelectItem>
              <SelectItem value="inactive"><T k="orphanageCentres.inactive" /></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Centres Table */}
      {filteredCentres.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium"><T k="orphanageCentres.noCentresFound" /></h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "all" 
              ? <T k="orphanageCentres.adjustFilters" />
              : <T k="orphanageCentres.noCentresYet" />}
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle><T k="orphanageCentres.title" /></CardTitle>
            <CardDescription>
              <T k="orphanageCentres.showing" /> {filteredCentres.length} <T k="orphanageCentres.of" /> {centres.length} <T k="orphanageCentres.centres" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T k="orphanageCentres.name" /></TableHead>
                  <TableHead><T k="orphanageCentres.location" /></TableHead>
                  <TableHead><T k="orphanageCentres.contact" /></TableHead>
                  <TableHead><T k="orphanageCentres.createdDate" /></TableHead>
                  <TableHead><T k="orphanageCentres.status" /></TableHead>
                  <TableHead className="text-right"><T k="orphanageCentres.actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCentres.map((centre) => (
                  <TableRow key={centre.publicId}>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {centre.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {centre.phoneNumber}
                        </div>
                        <div className="flex items-center text-xs">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {centre.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(centre.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {centre.isActive ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(centre.publicId)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
