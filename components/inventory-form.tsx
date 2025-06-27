"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
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
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    minQuantity: "10", // Default minimum quantity
    description: "",
  })
  const [errorFields, setErrorFields] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log(`Input change: ${name} = ${value}`)
    
    // Update form data
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      console.log('Updated form data:', updated)
      return updated
    })
    
    // Clear error state when field is edited
    if (errorFields.includes(name)) {
      setErrorFields(errorFields.filter(field => field !== name))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Select change: ${name} = ${value}`)
    
    // Update form data
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      console.log('Updated form data after select:', updated)
      return updated
    })
    
    // Clear error state when field is edited
    if (errorFields.includes(name)) {
      setErrorFields(errorFields.filter(field => field !== name))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    
    // Validate form fields
    const errors: string[] = [];
    if (!formData.itemName) errors.push('itemName');
    if (!formData.itemCategory) errors.push('itemCategory');
    if (!formData.itemPrice) errors.push('itemPrice');
    if (!formData.minQuantity) errors.push('minQuantity');
    
    // If there are errors, display them and don't submit
    if (errors.length > 0) {
      console.log('Form validation errors:', errors)
      setErrorFields(errors);
      return;
    }
    
    // Clear any previous errors
    setErrorFields([]);
    
    try {
      console.log('Calling onSubmit with:', formData);
      // Submit the form data
      onSubmit(formData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        itemName: "",
        itemCategory: "",
        itemPrice: "",
        minQuantity: "10",
        description: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        console.log('Dialog open state changing to:', isOpen);
        onOpenChange(isOpen);
        if (isOpen) {
          // Reset form when dialog opens
          setFormData({
            itemName: "",
            itemCategory: "",
            itemPrice: "",
            minQuantity: "10",
            description: "",
          });
          setErrorFields([]);
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white animate-fadeIn rounded-xl overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        <form onSubmit={handleSubmit} className="relative z-10 pointer-events-auto">
          <DialogHeader className="bg-white border-b pb-4 relative z-10">
            <DialogTitle className="text-2xl text-blue-800">{t("inventory.form.title")}</DialogTitle>
            <DialogDescription className="text-blue-600">
              {t("inventory.form.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-blue-800">
                  {t("inventory.form.itemName")}
                </Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder={t("inventory.form.itemName")}
                  className={`border-blue-200 focus:border-blue-400 bg-white rounded-xl ${
                    errorFields.includes('itemName') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  autoComplete="off"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCategory" className="text-blue-800">
                  {t("inventory.form.category")}
                </Label>
                <Select 
                  value={formData.itemCategory}
                  onValueChange={(value) => handleSelectChange("itemCategory", value)} 
                  required
                >
                  <SelectTrigger className={`border-blue-200 bg-white rounded-xl ${
                    errorFields.includes('itemCategory') ? 'border-red-500 focus-within:ring-red-500' : ''
                  }`}>
                    <SelectValue placeholder={t("inventory.form.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl">
                    <SelectItem value="Education">{t("inventory.form.education")}</SelectItem>
                    <SelectItem value="Apparel">{t("inventory.form.apparel")}</SelectItem>
                    <SelectItem value="Nutrition">{t("inventory.form.nutrition")}</SelectItem>
                    <SelectItem value="Medical">{t("inventory.form.medical")}</SelectItem>
                    <SelectItem value="Furniture">{t("inventory.form.furniture")}</SelectItem>
                    <SelectItem value="Electronics">{t("inventory.form.electronics")}</SelectItem>
                    <SelectItem value="Sports">{t("inventory.form.sports")}</SelectItem>
                    <SelectItem value="Other">{t("inventory.form.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemPrice" className="text-blue-800">
                  {t("inventory.form.price")}
                </Label>
                <Input
                  id="itemPrice"
                  name="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.itemPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`border-blue-200 focus:border-blue-400 bg-white rounded-xl ${
                    errorFields.includes('itemPrice') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  autoComplete="off"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minQuantity" className="text-blue-800">
                  {t("inventory.form.minQuantity")}
                </Label>
                <Input
                  id="minQuantity"
                  name="minQuantity"
                  type="number"
                  min="1"
                  value={formData.minQuantity}
                  onChange={handleInputChange}
                  placeholder="10"
                  className={`border-blue-200 focus:border-blue-400 bg-white rounded-xl ${
                    errorFields.includes('minQuantity') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  autoComplete="off"
                  required
                />
              </div>
            </div>



            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-800">
                {t("inventory.form.description")}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("inventory.form.description")}
                className="border-blue-200 focus:border-blue-400 bg-white min-h-[100px] rounded-xl"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="bg-white border-t pt-4 pb-2 bg-blue-50 bg-opacity-50 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl"
            >
              {t("inventory.form.cancel")}
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {t("inventory.form.addItem")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
