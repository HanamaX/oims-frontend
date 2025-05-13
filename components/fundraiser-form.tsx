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
export default function FundraiserForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    objective: "",
    reason: "",
    fundraisingMethod: "",
    budgetBreakdown: "",
    timeline: "",
    promotionPlan: "",
    coordinatorName: "",
    coordinatorEmail: "", // Add this line
    targetAmount: "",
  })
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    coordinatorEmail: "",
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
    })

    // Validate fields
    let hasErrors = false

    if (formData.coordinatorEmail && !isValidEmail(formData.coordinatorEmail)) {
      setErrors((prev) => ({ ...prev, coordinatorEmail: "Please enter a valid email address" }))
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    // In a real app, this would send the data to the server
    console.log("Form submitted:", { ...formData, startDate, endDate, posterFile })

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (onSubmit) {
        onSubmit({ ...formData, startDate, endDate, posterFile })
      } else {
        router.push("/thank-you?type=fundraiser")
      }
    }, 1500)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle>Start a Fundraising Campaign</CardTitle>
          <CardDescription>
            Fill in the details below to create a new fundraising campaign for the orphanage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Education for All Children"
                value={formData.title}
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
            />
            {errors.coordinatorEmail && <p className="text-sm text-red-500">{errors.coordinatorEmail}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Describe the purpose of this fundraising campaign"
              value={formData.purpose}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="objective">Objective</Label>
              <Textarea
                id="objective"
                name="objective"
                placeholder="What are the specific objectives of this campaign?"
                value={formData.objective}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Why is this campaign necessary?"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fundraisingMethod">Fundraising Method</Label>
              <Select onValueChange={(value) => handleSelectChange("fundraisingMethod", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Donations</SelectItem>
                  <SelectItem value="event">Charity Event</SelectItem>
                  <SelectItem value="corporate">Corporate Sponsorship</SelectItem>
                  <SelectItem value="community">Community Fundraising</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                placeholder="e.g., 5000"
                value={formData.targetAmount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetBreakdown">Budget Breakdown</Label>
            <Textarea
              id="budgetBreakdown"
              name="budgetBreakdown"
              placeholder="Provide a breakdown of how the funds will be used"
              value={formData.budgetBreakdown}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
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
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotionPlan">Promotion Plan</Label>
            <Textarea
              id="promotionPlan"
              name="promotionPlan"
              placeholder="How will you promote this campaign?"
              value={formData.promotionPlan}
              onChange={handleInputChange}
              required
            />
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-blue-50 mt-6">
          <Button variant="outline" type="button" onClick={() => router.push("/")}>
            Go Back Home
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
