"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Search, Package } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import InventoryCard from "@/components/inventory-card"
import { T, useLanguage } from "@/contexts/LanguageContext"

// Sample data - same as in admin view
const sampleInventoryItems = [
  {
    itemId: 1,
    itemName: "School Supplies",
    itemCategory: "Education",
    itemQuantity: "100",
    itemPrice: "500.00",
    branchId: 1,
  },
  {
    itemId: 2,
    itemName: "Clothing",
    itemCategory: "Apparel",
    itemQuantity: "50",
    itemPrice: "1000.00",
    branchId: 1,
  },
  {
    itemId: 3,
    itemName: "Food Supplies",
    itemCategory: "Nutrition",
    itemQuantity: "200",
    itemPrice: "1500.00",
    branchId: 1,
  },
]

// We'll implement API calls for transactions later
// For now, this is a placeholder for sample data
const emptyTransactions: any[] = []

export default function BranchInventoryPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const branchId = Number(params.branchId)
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure superadmin access only
  useEffect(() => {
    if (user?.role !== "super_admin") {
      router.push("/login")
    }
  }, [user, router])

  // Filter inventory items based on search term
  const filteredItems = sampleInventoryItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><T k="branch.inventory.management" /></h1>
          <p className="text-muted-foreground">
            <T k="branch.inventory.description" />
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/branch/${branchId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <T k="branch.backToBranch" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t("inventory.searchItems")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredItems.map((item) => {
          // Until we implement API calls for transactions, we'll use an empty array
          const transactions = emptyTransactions

          return (
            <Card key={item.itemId}>
              <CardContent className="p-4">
                <InventoryCard item={item} transactions={transactions} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-10">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground"><T k="inventory.noItemsFound" /></p>
        </div>
      )}
    </div>
  )
}
