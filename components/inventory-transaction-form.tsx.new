"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  itemId: string
  initialData?: {
    publicId?: string
    transactionType: "IN" | "OUT"
    transactionQuantity: string
    transactionDescription: string
  } | null
  isEdit?: boolean
}

export default function TransactionForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  itemId,
  initialData = null,
  isEdit = false
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    transactionPublicId: initialData?.publicId || '',
    inventoryItemPublicId: itemId,
    transactionType: initialData?.transactionType || "IN",
    transactionQuantity: initialData?.transactionQuantity || "",
    transactionDescription: initialData?.transactionDescription || ""
  })
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        transactionPublicId: initialData.publicId || '',
        inventoryItemPublicId: itemId,
        transactionType: initialData.transactionType,
        transactionQuantity: initialData.transactionQuantity,
        transactionDescription: initialData.transactionDescription
      })
    }
  }, [initialData, itemId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, transactionType: value as "IN" | "OUT" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
    // Reset form if not editing
    if (!isEdit) {
      setFormData({
        transactionPublicId: '',
        inventoryItemPublicId: itemId,
        transactionType: "IN",
        transactionQuantity: "",
        transactionDescription: ""
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-xl text-blue-800">
              {isEdit ? "Edit Transaction" : "Record Inventory Transaction"}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {isEdit 
                ? "Update the details of this inventory transaction" 
                : "Record items being added to or removed from inventory"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6 bg-white">
            {isEdit && (
              <input type="hidden" name="transactionPublicId" value={formData.transactionPublicId} />
            )}
            <input type="hidden" name="inventoryItemPublicId" value={itemId} />
            
            <div className="space-y-2">
              <Label className="text-blue-800">Transaction Type</Label>
              <RadioGroup 
                defaultValue={formData.transactionType} 
                value={formData.transactionType}
                onValueChange={handleTypeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="IN" id="transaction-in" />
                  <Label htmlFor="transaction-in" className="flex-1 cursor-pointer">
                    <div className="font-medium">Incoming</div>
                    <div className="text-sm text-muted-foreground">Items received into inventory</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="OUT" id="transaction-out" />
                  <Label htmlFor="transaction-out" className="flex-1 cursor-pointer">
                    <div className="font-medium">Outgoing</div>
                    <div className="text-sm text-muted-foreground">Items distributed or used</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionQuantity" className="text-blue-800">
                Quantity
              </Label>
              <Input
                id="transactionQuantity"
                name="transactionQuantity"
                value={formData.transactionQuantity}
                onChange={handleInputChange}
                type="number"
                min="1"
                className="border-blue-200 focus:border-blue-400 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionDescription" className="text-blue-800">
                Description
              </Label>
              <Textarea
                id="transactionDescription"
                name="transactionDescription"
                value={formData.transactionDescription}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400 bg-white min-h-[80px]"
                placeholder="Briefly describe the reason for this transaction"
                required
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 p-4 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={formData.transactionType === "IN" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isEdit ? "Update Transaction" : `Record ${formData.transactionType === "IN" ? "Incoming" : "Outgoing"} Items`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
