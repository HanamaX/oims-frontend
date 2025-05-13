"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Package, History } from "lucide-react"

// Define types for our data
interface InventoryItem {
  itemId: number
  itemName: string
  itemCategory: string
  itemQuantity: string
  itemPrice: string
  branchId: number
}

interface InventoryTransaction {
  transactionId: number
  transactionType: string
  transactionQuantity: string
  transactionDescription: string
  inventoryItemId: number
}

interface InventoryCardProps {
  item: InventoryItem
  transactions?: InventoryTransaction[]
  onEdit?: (itemId: number) => void
  onDelete?: (itemId: number) => void
}

export default function InventoryCard({ item, transactions = [], onEdit, onDelete }: InventoryCardProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.itemName}</CardTitle>
            <CardDescription>
              ID: {item.itemId} • Category: {item.itemCategory}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" size="icon" onClick={() => onEdit(item.itemId)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="icon" onClick={() => onDelete(item.itemId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Quantity</p>
                <p className="text-sm text-muted-foreground">{item.itemQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-muted-foreground">${item.itemPrice}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-sm text-muted-foreground">
                  ${(Number.parseFloat(item.itemPrice) * Number.parseInt(item.itemQuantity)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Branch ID</p>
                <p className="text-sm text-muted-foreground">{item.branchId}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            {transactions.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.transactionId}>
                        <td className="px-4 py-2 text-sm">{transaction.transactionId}</td>
                        <td className="px-4 py-2 text-sm">{transaction.transactionType}</td>
                        <td className="px-4 py-2 text-sm">{transaction.transactionQuantity}</td>
                        <td className="px-4 py-2 text-sm">{transaction.transactionDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No transaction records available.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
