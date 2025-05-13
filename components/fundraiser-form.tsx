"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { isValidEmail } from "@/lib/validation"

// Update the component to include onSubmit prop
export default function FundraiserForm({ onSubmit, isSubmitting: externalIsSubmitting }: { onSubmit?: (data: any) => void, isSubmitting?: boolean }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    eventName: "",
    purpose: "",
    fundraisingReason: "",
    budgetBreakdown: "",
    coordinatorName: "",
    coordinatorEmail: "",
    phoneNumber: "",
    goal: "",
    amountPayedPerIndividual: "100", // Default value
    orphanageAmountPerIndividual: "80", // Default value
    branchPublicId: "default" // Typically would come from context or props
  })
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    coordinatorEmail: "",
    phoneNumber: "",
    goal: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPosterFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Update the handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      coordinatorEmail: "",
      phoneNumber: "",
      goal: ""
    })

    // Validate fields
    let hasErrors = false

    if (!formData.coordinatorEmail || !isValidEmail(formData.coordinatorEmail)) {
      setErrors((prev) => ({ ...prev, coordinatorEmail: "Please enter a valid email address" }))
      hasErrors = true
    }

    if (!formData.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "Phone number is required" }))
      hasErrors = true
    }
    
    if (!formData.goal || isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
      setErrors((prev) => ({ ...prev, goal: "Please enter a valid fundraising goal amount" }))
      hasErrors = true
    }

    if (!startDate || !endDate) {
      hasErrors = true
      alert("Please select both start and end dates")
      return
    }

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    // Format data according to backend API requirements
    const fundraiserData = {
      eventName: formData.eventName,
      purpose: formData.purpose,
      fundraisingReason: formData.fundraisingReason,
      goal: Number(formData.goal),
      amountPayedPerIndividual: Number(formData.amountPayedPerIndividual),
      orphanageAmountPerIndividual: Number(formData.orphanageAmountPerIndividual),
      budgetBreakdown: formData.budgetBreakdown,
      eventStartDate: startDate ? startDate.toISOString().split('T')[0] : '',
      eventEndDate: endDate ? endDate.toISOString().split('T')[0] : '',
      coordinatorName: formData.coordinatorName,
      coordinatorEmail: formData.coordinatorEmail,
      phoneNumber: formData.phoneNumber,
      branchPublicId: formData.branchPublicId
    }

    console.log("Form data formatted for API:", fundraiserData)
    
    if (onSubmit) {
      // Include the posterFile separately as it needs to be uploaded in a separate request
      onSubmit({ ...fundraiserData, posterFile })
    } else {
      // For development/testing
      setTimeout(() => {
        setIsSubmitting(false)
        router.push("/thank-you?type=fundraiser")
      }, 1500)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className=" border-b bg-blue-200 border-blue-100">
          <CardTitle>Start a Fundraising Campaign</CardTitle>
          <CardDescription>
            Fill in the details below to create a new fundraising campaign for the orphanage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Campaign Title</Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="e.g., Back to School Drive"
                value={formData.eventName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinatorName">Coordinator Name</Label>
              <Input
                id="coordinatorName"
                name="coordinatorName"
                placeholder="e.g., John Smith"
                value={formData.coordinatorName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coordinatorEmail">Coordinator Email</Label>
              <Input
                id="coordinatorEmail"
                name="coordinatorEmail"
                type="email"
                placeholder="e.g., coordinator@example.com"
                value={formData.coordinatorEmail}
                onChange={handleInputChange}
                className={errors.coordinatorEmail ? "border-red-500" : ""}
                required
              />
              {errors.coordinatorEmail && <p className="text-sm text-red-500">{errors.coordinatorEmail}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="e.g., 1234567890"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
                required
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Describe the purpose of this fundraising campaign (e.g., School supplies for orphans)"
              value={formData.purpose}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundraisingReason">Reason</Label>
            <Textarea
              id="fundraisingReason"
              name="fundraisingReason"
              placeholder="Why is this campaign necessary? (e.g., Educational Support)"
              value={formData.fundraisingReason}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="goal">Target Amount ($)</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                placeholder="e.g., 5000"
                value={formData.goal}
                onChange={handleInputChange}
                className={errors.goal ? "border-red-500" : ""}
                required
              />
              {errors.goal && <p className="text-sm text-red-500">{errors.goal}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountPayedPerIndividual">Amount Per Individual ($)</Label>
              <Input
                id="amountPayedPerIndividual"
                name="amountPayedPerIndividual"
                type="number"
                placeholder="e.g., 100"
                value={formData.amountPayedPerIndividual}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500">Suggested contribution per individual</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orphanageAmountPerIndividual">Orphanage Amount ($)</Label>
              <Input
                id="orphanageAmountPerIndividual"
                name="orphanageAmountPerIndividual"
                type="number"
                placeholder="e.g., 80"
                value={formData.orphanageAmountPerIndividual}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500">Amount going directly to orphanage per individual</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetBreakdown">Budget Breakdown</Label>
            <Textarea
              id="budgetBreakdown"
              name="budgetBreakdown"
              placeholder="Provide a breakdown of how the funds will be used (e.g., Books: $2000, Stationery: $1500, Uniforms: $1500)"
              value={formData.budgetBreakdown}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Event Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">Event start date (format: YYYY-MM-DD)</p>
            </div>
            <div className="space-y-2">
              <Label>Event End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">Event end date (format: YYYY-MM-DD)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="posterUpload">Campaign Poster</Label>
            <div className="flex items-center gap-4">
              <div className="border rounded-md p-4 w-full">
                <label htmlFor="posterUpload" className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="h-8 w-8 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</span>
                  <Input
                    id="posterUpload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {posterPreview && (
                <div className="w-24 h-24 relative">
                  <img
                    src={posterPreview || "/placeholder.svg"}
                    alt="Poster preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-amber-600">Note: The image will be uploaded after the fundraiser is created.</p>
          </div>
          
          {/* Hidden branch ID field - typically would come from context or user selection */}
          <Input
            type="hidden"
            name="branchPublicId"
            value={formData.branchPublicId}
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-blue-200
        border-blue-100 p-6">
          <Button variant="outline" type="button" onClick={() => router.push("/")}>
            Go Back Home
          </Button>
          <Button type="submit" disabled={isSubmitting || externalIsSubmitting}>
            {isSubmitting || externalIsSubmitting ? "Submitting..." : "Submit Fundraiser"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
