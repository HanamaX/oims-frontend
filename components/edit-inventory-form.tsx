"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditInventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: {
    publicId: string
    itemName: string
    itemCategory: string
    itemQuantity: string
    itemPrice: string
    minQuantity: string
  } | null
  title?: string
}

export default function EditInventoryForm({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
  title = "Edit Inventory Item",
}: EditInventoryFormProps) {
  const [formData, setFormData] = useState({
    publicId: "",
    itemName: "",
    itemCategory: "",
    itemQuantity: "",
    itemPrice: "",
    minQuantity: "",
  })

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        publicId: initialData.publicId,
        itemName: initialData.itemName,
        itemCategory: initialData.itemCategory,
        itemQuantity: initialData.itemQuantity,
        itemPrice: initialData.itemPrice,
        minQuantity: initialData.minQuantity,
      })
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
    
    // Reset form if it's not an edit (no initialData)
    if (!initialData) {
      setFormData({
        publicId: "",
        itemName: "",
        itemCategory: "",
        itemQuantity: "",
        itemPrice: "",
        minQuantity: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-2xl text-blue-800">{title}</DialogTitle>
            <DialogDescription className="text-blue-600">
              {initialData ? "Update the details of this inventory item" : "Fill in the details to add a new item to the inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 bg-white">
            {initialData && (
              <input type="hidden" name="publicId" value={formData.publicId} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-blue-800">
                  Item Name
                </Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCategory" className="text-blue-800">
                  Category
                </Label>
                <Select 
                  value={formData.itemCategory} 
                  onValueChange={(value) => handleSelectChange("itemCategory", value)}
                  required
                >
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Nutrition">Nutrition</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Hygiene">Hygiene</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemQuantity" className="text-blue-800">
                  Quantity
                </Label>
                <Input
                  id="itemQuantity"
                  name="itemQuantity"
                  type="number"
                  min="0"
                  value={formData.itemQuantity}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">                <Label htmlFor="itemPrice" className="text-blue-800">
                  Price (Tshs per unit)
                </Label>
                <Input
                  id="itemPrice"
                  name="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.itemPrice}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minQuantity" className="text-blue-800">
                  Minimum Quantity (for low stock warning)
                </Label>
                <Input
                  id="minQuantity"
                  name="minQuantity"
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
