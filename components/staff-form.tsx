"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { isValidEmail, isValidPhone } from "@/lib/validation"

interface StaffFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export default function StaffForm({ open, onOpenChange, onSubmit }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    branchId: "1", // Default to branch 1
  })
  const [joinDate, setJoinDate] = useState<Date>()
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
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

    // Reset errors
    setErrors({
      email: "",
      phone: "",
    })

    // Validate fields
    let hasErrors = false

    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      hasErrors = true
    }

    if (!isValidPhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be in format: +[country code] [9 digits], e.g., +255 623302506",
      }))
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    onSubmit({ ...formData, joinDate })
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      address: "",
      branchId: "1",
    })
    setJoinDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-2xl text-blue-800">Add New Staff Member</DialogTitle>
            <DialogDescription className="text-blue-600">
              Fill in the details to register a new staff member in the system
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-800">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-blue-800">
                  Role
                </Label>
                <Select onValueChange={(value) => handleSelectChange("role", value)} required>
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Caretaker">Caretaker</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Cook">Cook</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn("border-blue-200 focus:border-blue-400 bg-white", errors.email ? "border-red-500" : "")}
                  placeholder="example@domain.com"
                  required
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-blue-800">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={cn("border-blue-200 focus:border-blue-400 bg-white", errors.phone ? "border-red-500" : "")}
                  placeholder="+255 623302506"
                  required
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-800">Join Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-blue-200 bg-white hover:bg-blue-50",
                        !joinDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {joinDate ? format(joinDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={joinDate}
                      onSelect={setJoinDate}
                      initialFocus
                      className="rounded-md border border-blue-200 bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchId" className="text-blue-800">
                  Branch
                </Label>
                <Select defaultValue="1" onValueChange={(value) => handleSelectChange("branchId", value)} required>
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">Springfield Branch</SelectItem>
                    <SelectItem value="2">Downtown Branch</SelectItem>
                    <SelectItem value="3">Riverside Branch</SelectItem>
                    <SelectItem value="4">Hillside Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-blue-800">
                Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400 bg-white min-h-[100px]"
                required
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
              Add Staff Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
