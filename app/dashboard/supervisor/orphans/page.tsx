"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import OrphanForm from "@/components/orphan-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { T, useLanguage } from "@/contexts/LanguageContext"
import API from "@/lib/api-service"
import OrphanService, { OrphanCreateRequest } from "@/lib/orphan-service"
import { Orphan } from "@/lib/orphan-types"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

// Utility function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to format date of birth consistently
const formatDateOfBirth = (dateInput: any): string => {
  // If no date provided, use current date
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  
  // If it's a Date object, format it
  if (dateInput instanceof Date) {
    return dateInput.toISOString().split('T')[0];
  }
  
  // If it's already a string, return it as is
  return dateInput;
};

// We're using the Orphan interface from orphan-types.ts

export default function SupervisorOrphansPage() {  const router = useRouter()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  // Status filter with default to "active"
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [orphans, setOrphans] = useState<Orphan[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [orphansPerPage] = useState(5) // Show 5 orphans per page
  const [displayedOrphans, setDisplayedOrphans] = useState<Orphan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch orphans data from API
  const fetchOrphans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch orphans from the backend
      const response = await API.get("/app/oims/orphans/branch/current");
      
      if (response.data?.data) {
        console.log("Fetched orphans data:", response.data.data);
        // Transform API response to match our interface
        const formattedOrphans: Orphan[] = response.data.data.map((orphan: any) => {
          // Create fullName if not present in API
          const fullName = orphan.fullName ?? 
            `${orphan.firstName} ${orphan.middleName ? orphan.middleName + ' ' : ''}${orphan.lastName}`;
          
          // Calculate age if not present
          const age = orphan.age ?? (orphan.dateOfBirth ? calculateAge(orphan.dateOfBirth) : null);
          
          return {
            publicId: orphan.publicId,
            fullName: fullName,
            createdAt: orphan.createdAt ?? orphan.dateOfBirth ?? "No date available",
            educationLevel: orphan.educationLevel ?? "N/A",
            age: age ?? 0,
            imageUrl: orphan.imageUrl ?? null,
            branchPublicId: orphan.branchPublicId ?? '',
            branchName: orphan.branchName ?? "Unknown Branch"
          };
        });
        console.log("Formatted orphans data:", formattedOrphans);
        setOrphans(formattedOrphans);      } else {
        setError(t("orphans.noData"));
        setOrphans([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch orphans:", err);
      setError(err.message ?? t("orphans.error"));
      setOrphans([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch orphans data when component mounts
  useEffect(() => {
    fetchOrphans();
  }, []);
  // Filter orphans based on search term and status filter
  const filteredOrphans = orphans.filter((orphan) => {
    const matchesSearch =
      orphan.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphan.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphan.educationLevel.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const orphanStatus = orphan.status?.toLowerCase() || "active";
    const matchesStatus = statusFilter === "all" || orphanStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  })
  
  // Update displayed orphans when filters change or page changes
  useEffect(() => {
    // Calculate pagination values
    const indexOfLastOrphan = currentPage * orphansPerPage;
    const indexOfFirstOrphan = indexOfLastOrphan - orphansPerPage;
    
    // Create the new slice of orphans to display
    const newOrphans = filteredOrphans.slice(indexOfFirstOrphan, indexOfLastOrphan);
    
    // Use JSON stringification to compare arrays properly
    const currentOrphansStr = JSON.stringify(displayedOrphans.map(o => o.publicId || ''));
    const newOrphansStr = JSON.stringify(newOrphans.map(o => o.publicId || ''));
    
    // Only update state if the displayed orphans have actually changed
    if (currentOrphansStr !== newOrphansStr) {
      setDisplayedOrphans(newOrphans);
    }
  }, [filteredOrphans, currentPage, orphansPerPage]);
  
  // Separate effect to handle automatic page reset when filter reduces results
  useEffect(() => {
    // Only execute this effect when filteredOrphans.length changes
    // This avoids circular dependencies with the currentPage state
    if (currentPage > 1 && filteredOrphans.length <= (currentPage - 1) * orphansPerPage) {
      // The current page no longer has results, go back to page 1
      setCurrentPage(1);
    }
  }, [filteredOrphans.length, orphansPerPage]);

  // Handle edit and delete
  const handleEdit = (publicId: string) => {
    console.log(`Edit orphan with ID: ${publicId}`)
    // In a real app, this would open an edit form or modal
  }

  const handleDelete = (publicId: string) => {
    console.log(`Delete orphan with ID: ${publicId}`)
    // In a real app, this would show a confirmation dialog and then delete the orphan via API
    // For now, just update local state
    setOrphans(orphans.filter((orphan) => orphan.publicId !== publicId))
  }

  const handleAddOrphan = async (orphanData: OrphanCreateRequest, orphanImage?: File, guardianData?: any) => {
    console.log("New orphan data:", orphanData)
    console.log("Guardian data:", guardianData)
    
    try {
      // Use the new OrphanService to create orphan with guardian
      if (guardianData?.name) {
        // If guardian data is provided, use the combined method
        const result = await OrphanService.createOrphanWithGuardian(orphanData, guardianData)
        console.log('Orphan and guardian created successfully:', result)
        
        // If there's an orphan image, upload it
        if (orphanImage && result.orphan.publicId) {
          await OrphanService.uploadOrphanPhoto(result.orphan.publicId, orphanImage)
        }
      } else {
        // If no guardian data, create orphan only
        const orphan = await OrphanService.createOrphan(orphanData)
        console.log('Orphan created successfully:', orphan)
        
        // If there's an orphan image, upload it
        if (orphanImage && orphan.publicId) {
          await OrphanService.uploadOrphanPhoto(orphan.publicId, orphanImage)
        }
      }
      
      // Close the form
      setIsFormOpen(false)
      
      // Refresh the orphans list
      fetchOrphans()
    } catch (error: any) {
      console.error('Failed to add orphan:', error)
      alert(`${t("orphans.addFail")}: ${error.friendlyMessage ?? error.message}`)
    }
  }

  return (
    <div className="space-y-6">      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="supervisor.orphans.management" /></h1>
          <p className="text-muted-foreground mt-2"><T k="supervisor.orphans.description" /></p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> <T k="orphans.add" />
        </Button>
      </div><div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("orphans.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full md:w-[180px]">
            <Select 
              defaultValue="active"
              value={statusFilter} 
              onValueChange={(value) => {
                if (value !== statusFilter) {
                  setCurrentPage(1); // Reset to first page when filter changes
                  setStatusFilter(value);
                }
              }}
            >              <SelectTrigger>
                <SelectValue placeholder={t("orphans.filter.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orphans.filter.all")}</SelectItem>
                <SelectItem value="active">{t("status.active")}</SelectItem>
                <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2"><T k="orphans.loading" /></span>
        </div>
      )}      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-600"><T k="orphans.error" /></p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            <T k="orphans.tryAgain" />
          </Button>
        </div>
      )}

      {/* Orphans list */}
      <div className="space-y-4">
        {!loading && !error && displayedOrphans.map((orphan) => {
          return (
            <Card key={orphan.publicId} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{orphan.fullName}</h3>
                      <Badge className="bg-gray-100 text-gray-800">{orphan.age} {t("orphan.yearsOld")}</Badge>                      {orphan.status && (
                        <Badge 
                          className={`${orphan.status?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'}`}
                        >
                          {t(orphan.status?.toLowerCase() === 'active' ? 'status.active' : 'status.inactive')}
                        </Badge>
                      )}
                    </div>                    <p className="text-sm text-muted-foreground">{t("branch.label")}: {orphan.branchName || t("ui.notAvailable")}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-sm mt-1">
                      <span>{t("orphan.education")}: {orphan.educationLevel || t("ui.notAvailable")}</span>
                      <span>{t("orphan.dateOfBirth")}: {
                        orphan.createdAt && !orphan.createdAt.includes("No date") 
                          ? new Date(orphan.createdAt).toLocaleDateString() 
                          : t("ui.notAvailable")
                      }</span>
                      {orphan.imageUrl && <span>{t("orphan.hasProfileImage")}</span>}
                    </div>
                  </div>                  <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push(`/dashboard/supervisor/orphans/${orphan.publicId}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <T k="orphans.details" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}        {filteredOrphans.length === 0 && !loading && !error && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-muted-foreground"><T k="orphans.noData" /></p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredOrphans.length > orphansPerPage && (
          <div className="mt-6">
            <div className="flex items-center justify-between">              <p className="text-sm text-muted-foreground">
                {t("common.showing")} {displayedOrphans.length > 0 ? (currentPage - 1) * orphansPerPage + 1 : 0} 
                - {Math.min(currentPage * orphansPerPage, filteredOrphans.length)} {t("common.of")} {filteredOrphans.length} {t("orphans.orphans")}
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(filteredOrphans.length / orphansPerPage)) }, (_, i) => {
                    // Show at most 5 page numbers
                    let pageNum;
                    const totalPages = Math.ceil(filteredOrphans.length / orphansPerPage);
                    
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all page numbers
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If on pages 1-3, show pages 1-5
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If on last 3 pages, show last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Otherwise show current page and 2 pages on each side
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < Math.ceil(filteredOrphans.length / orphansPerPage) && setCurrentPage(currentPage + 1)}
                      className={currentPage >= Math.ceil(filteredOrphans.length / orphansPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      <OrphanForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddOrphan} />
    </div>
  )
}

