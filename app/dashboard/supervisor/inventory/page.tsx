"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Eye, Package, AlertTriangle } from "lucide-react"
import InventoryForm from "@/components/inventory-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InventoryService, { CurrentInventoryItemResponse } from "@/lib/inventory-service"
import { T, useLanguage } from "@/contexts/LanguageContext"

export default function InventoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [inventoryItems, setInventoryItems] = useState<CurrentInventoryItemResponse[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Debug form open/close
  useEffect(() => {
    console.log('Form open state changed:', isFormOpen);
  }, [isFormOpen]);
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  } | null>(null)
  const { t } = useLanguage()

  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryItems = async () => {      try {
        setIsLoading(true)
        const data = await InventoryService.getCurrentBranchInventoryItems()
        setInventoryItems(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching inventory items:", err)
        setError(t("inventory.failedToLoad"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventoryItems()
  }, [])

  // Filter inventory items based on search term and category
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.itemCategory === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Function to get unique categories from inventory items
  const getUniqueCategories = () => {
    const categories = new Set<string>()
    inventoryItems.forEach(item => categories.add(item.itemCategory))
    return Array.from(categories)
  }

  // Function to handle item deletion will be implemented when needed

  const handleAddItem = async (data: any) => {
    try {
      setIsSubmitting(true)
      console.log("New inventory item data:", data)
      
      // Call the API service to add the item
      const newItem = await InventoryService.addInventoryItem({
        itemName: data.itemName,
        itemCategory: data.itemCategory,
        itemQuantity: "0", // Start with zero quantity, will be incremented via transactions
        itemPrice: data.itemPrice,
        minQuantity: data.minQuantity
      })
      
      // Add the new item to the current state
      setInventoryItems([...inventoryItems, newItem])
        // Show success notification
      setNotification({
        message: t("inventory.addSuccess").replace("{0}", data.itemName),
        type: "success",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to add inventory item:", error)
      
      // Show error notification
      setNotification({
        message: t("inventory.addFail"),
        type: "error",
        visible: true
      })
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
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
          <p className="text-muted-foreground"><T k="inventory.loading" /></p>
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
            <T k="inventory.tryAgain" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {notification && notification.visible && (
        <div className={`p-4 rounded-md ${
          notification.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  aria-label="Close notification"                  title={t("inventory.close")}
                  className={`inline-flex rounded-md p-1.5 ${
                    notification.type === "success"
                      ? "bg-green-100 text-green-500 hover:bg-green-200"
                      : "bg-red-100 text-red-500 hover:bg-red-200"
                  }`}
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="inventory.management" /></h1>
          <p className="text-muted-foreground mt-2"><T k="supervisor.inventory.viewManage" /></p>
        </div>
        <Button 
          onClick={() => {
            console.log('Add item button clicked')
            setIsFormOpen(true)
          }} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> <T k="inventory.addItem" />
        </Button>
      </div>      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("inventory.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filterByCategory")} />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="all"><T k="inventory.allCategories" /></SelectItem>
              {getUniqueCategories().map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => {

          return (
            <Card key={item.publicId} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">{item.itemName}</h3>
                      <Badge className={getCategoryColor(item.itemCategory)}>{item.itemCategory}</Badge>
                      {item.lowStock && (
                        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                          <T k="inventory.lowStock" />
                        </Badge>
                      )}
                    </div>                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-sm mt-1">
                      <span>
                        <T k="inventory.quantity" />: <span className="font-medium">{item.itemQuantity}</span>
                      </span>                      <span>
                        <T k="inventory.price" />: <span className="font-medium">Tshs {item.itemPrice}</span>
                      </span>
                      <span>
                        <T k="inventory.minQuantity" />: <span className="font-medium">{item.minQuantity}</span>
                      </span>
                      <span><T k="inventory.created" />: {new Date(item.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>                  <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/supervisor/inventory/${item.publicId}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <T k="inventory.viewDetails" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground"><T k="inventory.noItemsFound" /></p>
          </div>
        )}
      </div>

      <InventoryForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddItem} />
    </div>
  )
}

