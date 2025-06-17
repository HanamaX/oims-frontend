"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InventoryFormProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (data: any) => void
}

export default function InventoryForm({ open, onOpenChange, onSubmit }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    minQuantity: "10", // Default minimum quantity
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    // Reset form
    setFormData({
      itemName: "",
      itemCategory: "",
      itemPrice: "",
      minQuantity: "10",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-2xl text-blue-800">Add New Inventory Item</DialogTitle>
            <DialogDescription className="text-blue-600">
              Fill in the details to add a new item to the inventory. New items start with a quantity of zero. 
              After creating the item, you can use the transaction system to manage quantities through "IN" and "OUT" transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 bg-white">
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
                <Select onValueChange={(value) => handleSelectChange("itemCategory", value)} required>
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Nutrition">Nutrition</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">                <Label htmlFor="itemPrice" className="text-blue-800">
                  Price (Tshs)
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
                  Minimum Quantity
                </Label>
                <Input
                  id="minQuantity"
                  name="minQuantity"
                  type="number"
                  min="1"
                  value={formData.minQuantity}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>
            </div>



            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-800">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400 bg-white min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="bg-white border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
