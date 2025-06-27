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
import { useLanguage } from "@/contexts/LanguageContext"

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
  const { t } = useLanguage()
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white animate-fadeIn rounded-xl overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        <form onSubmit={handleSubmit} className="relative z-10 pointer-events-auto">
          <DialogHeader className="bg-white border-b pb-4 relative z-10">
            <DialogTitle className="text-xl text-blue-800">
              {isEdit ? t("inventory.transaction.form.editTitle") : t("inventory.transaction.form.title")}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {isEdit 
                ? t("inventory.transaction.form.editDescription")
                : t("inventory.transaction.form.description")
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6 bg-white">
            {isEdit && (
              <input type="hidden" name="transactionPublicId" value={formData.transactionPublicId} />
            )}
            <input type="hidden" name="inventoryItemPublicId" value={itemId} />
            
            <div className="space-y-2">
              <Label className="text-blue-800">{t("inventory.transaction.form.type")}</Label>
              <RadioGroup 
                defaultValue={formData.transactionType} 
                value={formData.transactionType}
                onValueChange={handleTypeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 rounded-xl border border-blue-200 p-2 cursor-pointer hover:bg-blue-50">
                  <RadioGroupItem value="IN" id="transaction-in" className="text-green-600 border-green-500" />
                  <Label htmlFor="transaction-in" className="flex-1 cursor-pointer">
                    <div className="font-medium text-green-700">{t("inventory.transaction.form.incoming")}</div>
                    <div className="text-sm text-green-600">{t("inventory.transaction.form.incomingDesc")}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-xl border border-blue-200 p-2 cursor-pointer hover:bg-blue-50">
                  <RadioGroupItem value="OUT" id="transaction-out" className="text-red-600 border-red-500" />
                  <Label htmlFor="transaction-out" className="flex-1 cursor-pointer">
                    <div className="font-medium text-red-700">{t("inventory.transaction.form.outgoing")}</div>
                    <div className="text-sm text-red-600">{t("inventory.transaction.form.outgoingDesc")}</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionQuantity" className="text-blue-800">
                {t("inventory.transaction.form.quantity")}
              </Label>
              <Input
                id="transactionQuantity"
                name="transactionQuantity"
                value={formData.transactionQuantity}
                onChange={handleInputChange}
                type="number"
                min="1"
                className="border-blue-200 focus:border-blue-400 bg-white rounded-xl"
                placeholder="1"
                autoComplete="off"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionDescription" className="text-blue-800">
                {t("inventory.transaction.form.descriptionLabel")}
              </Label>
              <Textarea
                id="transactionDescription"
                name="transactionDescription"
                value={formData.transactionDescription}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400 bg-white min-h-[80px] rounded-xl"
                placeholder={t("inventory.transaction.form.descPlaceholder")}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <DialogFooter className="bg-blue-50 bg-opacity-50 border-t pt-4 pb-2 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl mr-2"
            >
              {t("inventory.transaction.form.cancel")}
            </Button>
            <Button 
              type="submit" 
              className={`${
                formData.transactionType === "IN" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              } text-white rounded-xl`}
            >
              {isEdit 
                ? t("inventory.transaction.form.updateTransaction") 
                : formData.transactionType === "IN" 
                  ? t("inventory.transaction.form.recordIncoming") 
                  : t("inventory.transaction.form.recordOutgoing")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
