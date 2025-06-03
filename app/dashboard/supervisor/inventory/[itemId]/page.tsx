"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CalendarIcon, 
  ClipboardList,
  Loader2,
  PlusCircle,
  Edit,
  Trash2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import InventoryService, { 
  InventoryItemDetailsResponse, 
  InventoryTransactionResponse,
  AddInventoryTransactionRequest,
  UpdateInventoryTransactionRequest
} from "@/lib/inventory-service"
import EditInventoryForm from "@/components/edit-inventory-form"
import TransactionForm from "@/components/inventory-transaction-form"

export default function InventoryItemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // State variables
  const [itemDetails, setItemDetails] = useState<InventoryItemDetailsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false)
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false)
  const [isDeleteTransactionDialogOpen, setIsDeleteTransactionDialogOpen] = useState(false)
  
  // Selected transaction for editing/deleting
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransactionResponse | null>(null)

  // Get the item ID from the URL
  const itemId = params.itemId as string

  // Fetch item details with transactions
  const fetchItemDetails = async () => {
    if (!itemId) return
    
    try {
      setIsLoading(true)
      const data = await InventoryService.getInventoryItemDetails(itemId)
      setItemDetails(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching inventory item details:", err)
      setError("Failed to load inventory item details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItemDetails()
  }, [itemId])
  // Handle updating inventory item
  const handleUpdateItem = async (data: any) => {
    try {
      setIsSubmitting(true)
      await InventoryService.updateInventoryItem({
        itemPublicId: data.publicId,
        itemName: data.itemName,
        itemCategory: data.itemCategory,
        itemQuantity: data.itemQuantity,
        itemPrice: data.itemPrice,
        minQuantity: data.minQuantity
      })
      
      toast({
        title: "Item Updated",
        description: "The inventory item has been successfully updated.",
        variant: "default"
      })
      
      fetchItemDetails()
    } catch (err) {
      console.error("Error updating inventory item:", err)
      toast({
        title: "Update Failed",
        description: "There was a problem updating the inventory item.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle deleting inventory item
  const handleDeleteItem = async () => {
    try {
      setIsSubmitting(true)
      await InventoryService.deleteInventoryItem(itemId)
      
      toast({
        title: "Item Deleted",
        description: "The inventory item has been successfully deleted.",
        variant: "default"
      })
        // Navigate back to inventory list
      router.push('/dashboard/supervisor/inventory')
    } catch (err) {
      console.error("Error deleting inventory item:", err)
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the inventory item.",
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }
    // Handle adding inventory transaction
  const handleAddTransaction = async (data: any) => {
    try {
      setIsSubmitting(true)
      // Convert from form field names to API expected field names
      const apiData: AddInventoryTransactionRequest = {
        inventoryItemPublicId: data.inventoryItemPublicId,
        transactionType: data.transactionType,
        transactionQuantity: data.transactionQuantity,
        transactionDescription: data.transactionDescription
      }
      await InventoryService.addInventoryTransaction(apiData)
      
      toast({
        title: "Transaction Added",
        description: "The inventory transaction has been successfully recorded.",
        variant: "default"
      })
      
      fetchItemDetails()
    } catch (err) {
      console.error("Error adding inventory transaction:", err)
      toast({
        title: "Transaction Failed",
        description: "There was a problem recording the inventory transaction.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }  // Handle updating inventory transaction
  const handleUpdateTransaction = async (data: any) => {
    try {
      setIsSubmitting(true)
      // Convert from form field names to API expected field names
      const apiData: UpdateInventoryTransactionRequest = {
        transactionPublicId: data.transactionPublicId,
        transactionType: data.transactionType,
        transactionQuantity: data.transactionQuantity,
        transactionDescription: data.transactionDescription,
        inventoryItemPublicId: data.inventoryItemPublicId ?? itemId
      }
      await InventoryService.updateInventoryTransaction(apiData)
      
      toast({
        title: "Transaction Updated",
        description: "The inventory transaction has been successfully updated.",
        variant: "default"
      })
      
      fetchItemDetails()
    } catch (err) {
      console.error("Error updating inventory transaction:", err)
      toast({
        title: "Update Failed",
        description: "There was a problem updating the inventory transaction.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle deleting inventory transaction
  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      setIsSubmitting(true)
      await InventoryService.deleteInventoryTransaction(transactionId)
      
      toast({
        title: "Transaction Deleted",
        description: "The inventory transaction has been successfully deleted.",
        variant: "default"
      })
      
      fetchItemDetails()
    } catch (err) {
      console.error("Error deleting inventory transaction:", err)
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the inventory transaction.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
      setSelectedTransaction(null)
      setIsDeleteTransactionDialogOpen(false)
    }
  }
  
  // Helper to open transaction edit modal
  const openEditTransaction = (transaction: InventoryTransactionResponse) => {
    setSelectedTransaction(transaction)
    setIsEditTransactionOpen(true)
  }
  
  // Helper to open transaction delete dialog
  const openDeleteTransaction = (transaction: InventoryTransactionResponse) => {
    setSelectedTransaction(transaction)
    setIsDeleteTransactionDialogOpen(true)
  }

  // Calculate totals
  const calculateTotals = () => {
    if (!itemDetails?.inventoryTransactions) return { totalIn: 0, totalOut: 0 }
    
    const totalIn = itemDetails.inventoryTransactions
      .filter(t => t.transactionType === "IN")
      .reduce((sum, t) => sum + parseInt(t.transactionQuantity), 0)
    
    const totalOut = itemDetails.inventoryTransactions
      .filter(t => t.transactionType === "OUT")
      .reduce((sum, t) => sum + parseInt(t.transactionQuantity), 0)
    
    return { totalIn, totalOut }
  }

  const { totalIn, totalOut } = calculateTotals()

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

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (error || !itemDetails) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error ?? "Item not found"}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddTransactionOpen(true)} 
            variant="outline" 
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            disabled={isSubmitting}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button 
            onClick={() => setIsEditItemOpen(true)}
            variant="outline"
            disabled={isSubmitting}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Item
          </Button>
          <Button 
            onClick={() => setIsDeleteItemDialogOpen(true)}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            disabled={isSubmitting}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Item
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            {itemDetails.itemName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className={getCategoryColor(itemDetails.itemCategory)}>
              {itemDetails.itemCategory}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Branch: {itemDetails.branchName}
            </span>
          </div>
        </div>
      </div>
        {/* Edit Item Form Dialog */}      <EditInventoryForm
        open={isEditItemOpen}
        onOpenChange={setIsEditItemOpen}
        onSubmit={handleUpdateItem}
        initialData={itemDetails ? {
          publicId: itemDetails.publicId,
          itemName: itemDetails.itemName,
          itemCategory: itemDetails.itemCategory,
          itemQuantity: itemDetails.itemQuantity, 
          itemPrice: itemDetails.itemPrice,
          minQuantity: itemDetails.minQuantity || "10" // Use actual min quantity if available
        } : null}
      />
      
      {/* Add Transaction Dialog */}
      <TransactionForm
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={handleAddTransaction}
        itemId={itemId}
      />
      
      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <TransactionForm
          open={isEditTransactionOpen}
          onOpenChange={setIsEditTransactionOpen}
          onSubmit={handleUpdateTransaction}
          itemId={itemId}
          initialData={selectedTransaction}
          isEdit={true}
        />
      )}
      
      {/* Delete Item Confirmation Dialog */}
      <AlertDialog open={isDeleteItemDialogOpen} onOpenChange={setIsDeleteItemDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this inventory item
              and all associated transaction history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteItem()
              }}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Item"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Transaction Confirmation Dialog */}
      <AlertDialog open={isDeleteTransactionDialogOpen} onOpenChange={setIsDeleteTransactionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction              onClick={(e) => {
                e.preventDefault()
                if (selectedTransaction) {
                  // Make sure we're using the correct publicId field
                  handleDeleteTransaction(selectedTransaction.publicId)
                }
              }}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Transaction"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Item Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground mb-1">Current Quantity</span>
              <span className="text-2xl font-bold">{itemDetails.itemQuantity}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground mb-1">Unit Price</span>
              <span className="text-2xl font-bold">${itemDetails.itemPrice}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground mb-1">Total Value</span>
              <span className="text-2xl font-bold">
                ${(parseFloat(itemDetails.itemPrice) * parseFloat(itemDetails.itemQuantity)).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center p-4 rounded-lg bg-green-50">
              <div className="rounded-full bg-green-100 p-2 mr-4">
                <ArrowDownCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total In</p>
                <p className="text-xl font-bold text-green-600">{totalIn} units</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-lg bg-red-50">
              <div className="rounded-full bg-red-100 p-2 mr-4">
                <ArrowUpCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Out</p>
                <p className="text-xl font-bold text-red-600">{totalOut} units</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {itemDetails.inventoryTransactions && itemDetails.inventoryTransactions.length > 0 ? (
            <div className="space-y-4">
              {itemDetails.inventoryTransactions.map((transaction) => (
                <div 
                  key={transaction.publicId}
                  className={`border rounded-lg p-4 ${
                    transaction.transactionType === "IN" 
                      ? "border-green-200 bg-green-50" 
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {transaction.transactionType === "IN" ? (
                        <ArrowDownCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <ArrowUpCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">
                          {transaction.transactionType === "IN" ? "Received" : "Distributed"}{" "}
                          <span className="font-bold">{transaction.transactionQuantity}</span> units
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {transaction.transactionDescription}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {formatDate(transaction.transactionCreationDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEditTransaction(transaction)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteTransaction(transaction)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No transaction history available for this item.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddTransactionOpen(true)} 
                className="mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Record First Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
