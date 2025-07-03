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
import { useLanguage } from "@/contexts/LanguageContext"

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
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    publicId: "",
    itemName: "",
    itemCategory: "",
    itemQuantity: "",
    itemPrice: "",
    minQuantity: "",
  })
  const [errorFields, setErrorFields] = useState<string[]>([])

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
    
    // Clear error state when field is edited
    if (errorFields.includes(name)) {
      setErrorFields(errorFields.filter(field => field !== name))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error state when field is edited
    if (errorFields.includes(name)) {
      setErrorFields(errorFields.filter(field => field !== name))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    const errors: string[] = [];
    if (!formData.itemName) errors.push('itemName');
    if (!formData.itemCategory) errors.push('itemCategory');
    if (!formData.itemQuantity) errors.push('itemQuantity');
    if (!formData.itemPrice) errors.push('itemPrice');
    if (!formData.minQuantity) errors.push('minQuantity');
    
    // If there are errors, display them and don't submit
    if (errors.length > 0) {
      setErrorFields(errors);
      return;
    }
    
    // Clear any previous errors
    setErrorFields([]);
    
    // Submit the form data
    onSubmit(formData);
    onOpenChange(false);
    
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
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          // Reset error fields when dialog closes
          setErrorFields([]);
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white animate-fadeIn rounded-xl overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        <form onSubmit={handleSubmit} className="relative z-10 pointer-events-auto">
          <DialogHeader className="bg-white border-b pb-4 relative z-10">
            <DialogTitle className="text-2xl text-blue-800">
              {initialData ? t("inventory.edit.title") : t("inventory.form.title")}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {initialData ? t("inventory.edit.description") : t("inventory.form.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 bg-white">
            {initialData && (
              <input type="hidden" name="publicId" value={formData.publicId} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-blue-800">
                  {t("inventory.edit.itemName")}
                </Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
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
                  {t("inventory.edit.category")}
                </Label>
                <Select 
                  value={formData.itemCategory} 
                  onValueChange={(value) => handleSelectChange("itemCategory", value)}
                  required
                >
                  <SelectTrigger className={`border-blue-200 bg-white rounded-xl ${
                    errorFields.includes('itemCategory') ? 'border-red-500 focus-within:ring-red-500' : ''
                  }`}>
                    <SelectValue placeholder={t("inventory.edit.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl">
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
                <Label htmlFor="itemPrice" className="text-blue-800">
                  {t("inventory.edit.price")}
                </Label>
                <Input
                  id="itemPrice"
                  name="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.itemPrice}
                  onChange={handleInputChange}
                  className={`border-blue-200 focus:border-blue-400 bg-white rounded-xl ${
                    errorFields.includes('itemPrice') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minQuantity" className="text-blue-800">
                  {t("inventory.edit.minQuantity")}
                </Label>
                <Input
                  id="minQuantity"
                  name="minQuantity"
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={handleInputChange}
                  className={`border-blue-200 focus:border-blue-400 bg-white rounded-xl ${
                    errorFields.includes('minQuantity') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="bg-blue-50 bg-opacity-50 border-t pt-4 pb-2 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl mr-2"
            >
              {t("inventory.edit.cancel")}
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {initialData ? t("inventory.edit.updateItem") : t("inventory.form.addItem")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
