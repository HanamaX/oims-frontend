"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Package, ArrowDown, ArrowUp, Calendar, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import API from "@/lib/api-service"
import { T, useLanguage } from "@/contexts/LanguageContext"
import ReportService from "@/lib/report-service"
import { useToast } from "@/hooks/use-toast"

// Types
interface InventoryItem {
  publicId: string
  itemName: string
  itemCategory: string
  itemDescription?: string
  itemQuantity: string
  itemPrice: string
  minQuantity: string
  branchName?: string
  branchPublicId?: string
  createdDate: string
  lastUpdatedDate?: string
}

interface Transaction {
  publicId: string
  transactionType: "IN" | "OUT"
  transactionQuantity: string
  transactionCreationDate: string
  transactionDescription: string
  performedBy?: string
}

export default function SuperAdminInventoryDetailsPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const itemId = params.id as string
  const { toast } = useToast()
  
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalIn, setTotalIn] = useState(0)
  const [totalOut, setTotalOut] = useState(0)
  const [isDownloadingReport, setIsDownloadingReport] = useState(false)

  // Fetch item details and transactions
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true)
        // Get the item details which includes transactions
        const response = await API.get(`/app/oims/inventory/items/item/${itemId}`)
        
        if (response.data?.data) {
          const itemData = response.data.data
          setItem(itemData)
          
          // If the API returns transactions as part of the item details
          if (itemData.inventoryTransactions) {
            setTransactions(itemData.inventoryTransactions)
            
            // Calculate totals
            let inCount = 0
            let outCount = 0
            
            itemData.inventoryTransactions.forEach((transaction: Transaction) => {
              if (transaction.transactionType === "IN") {
                inCount += parseInt(transaction.transactionQuantity)
              } else {
                outCount += parseInt(transaction.transactionQuantity)
              }
            })
            
            setTotalIn(inCount)
            setTotalOut(outCount)
          }
            setError(null)
        } else {
          throw new Error(t("inventoryDetails.noDataFound"))
        }
      } catch (err) {
        console.error("Error fetching item details:", err)
        setError(t("inventoryDetails.failedToLoad"))
      } finally {
        setLoading(false)
      }
    }

    fetchItemDetails()
  }, [itemId])

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle downloading transactions report
  const handleDownloadTransactionsReport = async () => {
    setIsDownloadingReport(true)
    try {
      await ReportService.downloadInventoryItemTransactionsReport(itemId)
      toast({
        title: t("common.success"),
        description: t("common.downloadStarted"),
      })
    } catch (error) {
      console.error("Error downloading inventory transactions report:", error)
      toast({
        title: t("common.error"),
        description: t("common.errorTryAgain"),
        variant: "destructive"
      })
    } finally {
      setIsDownloadingReport(false)
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
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p><T k="inventoryDetails.loadingDetails" /></p>
      </div>
    )
  }
  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
        <p className="text-red-600 mb-4"><T k="common.error" />: {error}</p>
        <Button variant="outline" onClick={() => router.back()}><T k="ui.goBack" /></Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">      {/* Header with back button */}
      <div>
        <Button variant="ghost" onClick={() => router.push("/dashboard/orphanage_admin/inventory")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <T k="inventoryDetails.backToInventory" />
        </Button>
        
        <div className="flex items-center">
          <Package className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold">{item?.itemName}</h1>
          {item?.itemCategory && (
            <Badge className={`ml-4 ${getCategoryColor(item.itemCategory)}`}>
              {item.itemCategory}
            </Badge>
          )}
        </div>
          {item?.branchName && (
          <div className="mt-2">
            <span className="text-muted-foreground"><T k="inventory.branch" />: </span>
            <span className="font-medium">{item.branchName}</span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div>
        <h2 className="text-xl font-bold mb-4"><T k="inventoryDetails.itemDetails" /></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1"><T k="inventoryDetails.currentQuantity" /></h3>
            <p className="text-2xl font-bold">{item?.itemQuantity}</p>
          </div>
          
          <div>            <h3 className="text-sm font-medium text-muted-foreground mb-1"><T k="inventoryDetails.unitPrice" /></h3>
            <p className="text-2xl font-bold">Tshs {parseFloat(item?.itemPrice ?? "0").toFixed(2)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1"><T k="inventoryDetails.totalValue" /></h3>
            <p className="text-2xl font-bold">
              Tshs {(parseFloat(item?.itemPrice ?? "0") * parseInt(item?.itemQuantity ?? "0")).toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <ArrowUp className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium"><T k="inventoryDetails.totalIn" /></h3>
            </div>
            <p className="text-2xl font-bold text-green-700">{totalIn} <T k="inventoryDetails.units" /></p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <ArrowDown className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-medium"><T k="inventoryDetails.totalOut" /></h3>
            </div>
            <p className="text-2xl font-bold text-red-700">{totalOut} <T k="inventoryDetails.units" /></p>
          </div>
        </div>
      </div>
      
      {/* Transaction History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold"><T k="inventoryDetails.transactionHistory" /></h2>
          
          <Button 
            onClick={handleDownloadTransactionsReport} 
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isDownloadingReport || transactions.length === 0}
          >
            {isDownloadingReport ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            <T k="inventory.downloadTransactionsReport" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-muted-foreground"><T k="inventoryDetails.noTransactions" /></p>
            </div>
          ) : (
            transactions.map(transaction => (
              <div 
                key={transaction.publicId}
                className={`p-6 rounded-lg ${
                  transaction.transactionType === "IN" 
                    ? "bg-green-50 border border-green-100" 
                    : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      {transaction.transactionType === "IN" ? (
                        <ArrowUp className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-600 mr-2" />
                      )}                      <h3 className="font-medium">
                        {transaction.transactionType === "IN" ? t("inventoryDetails.received") : t("inventoryDetails.distributed")}
                        {transaction.transactionQuantity} {t("inventoryDetails.units")}
                      </h3>
                    </div>
                      <p className="mt-1 text-sm">
                      {transaction.transactionDescription || t("inventoryDetails.noDescription")}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.transactionCreationDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
