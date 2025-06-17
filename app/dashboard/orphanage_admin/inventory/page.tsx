"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, AlertTriangle, Package, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import API from "@/lib/api-service"
import { T, useLanguage } from "@/contexts/LanguageContext"

// Define types for inventory items
interface InventoryItem {
  publicId: string
  itemName: string
  itemCategory: string
  itemQuantity: string
  itemPrice: string
  minQuantity: string
  branchName?: string
  branchPublicId?: string
  lowStock?: boolean
  createdDate?: string
}

export default function OrphanageAdminInventoryPage() {
  const router = useRouter()
  const { t } = useLanguage()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
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

  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setIsLoading(true)
        // For orphanage_admin, fetch all inventory items
        const response = await API.get("/app/oims/inventory/items/centre")
        if (response.data?.data) {
          setInventoryItems(response.data.data)
          setError(null)        } else {
          throw new Error(t("inventory.noDataFound"))
        }
      } catch (err) {
        console.error("Error fetching inventory items:", err)
        setError(t("inventory.failedToLoad"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventoryItems()
  }, [])

  // Filter inventory items based on search term, category, and branch
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.itemCategory === categoryFilter
    
    const matchesBranch = branchFilter === "all" || 
      item.branchPublicId === branchFilter ||
      item.branchName === branchFilter

    return matchesSearch && matchesCategory && matchesBranch
  })

  // Function to get unique categories from inventory items
  const getUniqueCategories = () => {
    const categories = new Set<string>()
    inventoryItems.forEach(item => categories.add(item.itemCategory))
    return Array.from(categories)
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Education":
      case "Educational":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Apparel":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Nutrition":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medical":
        return "bg-red-100 text-red-800 border-red-200"
      case "Creative":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground"><T k="inventory.loadingItems" /></p>
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><T k="inventory.management" /></h1>
        <p className="text-muted-foreground mt-2"><T k="inventory.viewItemsAllBranches" /></p>
      </div>      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("inventory.searchItems")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[180px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filterByCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="inventory.allCategories" /></SelectItem>
              {getUniqueCategories().map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[180px]">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filterByBranch")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T k="inventory.allBranches" /></SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.publicId} value={branch.publicId}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.publicId} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">{item.itemName}</h3>
                    <Badge className={getCategoryColor(item.itemCategory)}>{item.itemCategory}</Badge>                    {item.lowStock || (parseInt(item.itemQuantity) < parseInt(item.minQuantity)) ? (
                      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                        <T k="inventory.lowStock" />
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-sm mt-1">
                    <span>
                      <T k="inventory.quantity" />: <span className="font-medium">{item.itemQuantity}</span>
                    </span>                    <span>
                      <T k="inventory.price" />: <span className="font-medium">Tshs {parseFloat(item.itemPrice).toFixed(2)}</span>
                    </span>
                    <span>
                      <T k="inventory.minQuantity" />: <span className="font-medium">{item.minQuantity}</span>
                    </span>
                    {item.branchName && (
                      <span>
                        <T k="inventory.branch" />: <span className="font-medium">{item.branchName}</span>
                      </span>
                    )}
                    {item.createdDate && (
                      <span>
                        <T k="inventory.created" />: <span className="font-medium">{new Date(item.createdDate).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>                <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/orphanage_admin/inventory/${item.publicId}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <T k="inventory.viewDetailsTransactions" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow col-span-full">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground"><T k="inventory.noItemsFound" /></p>
          </div>
        )}
      </div>
    </div>
  )
}
