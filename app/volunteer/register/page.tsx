"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, UserPlus, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { isValidEmail, isValidPhone } from "@/lib/validation"
import VolunteerService from "@/lib/volunteer-service"

export default function VolunteerRegistrationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    skills: "",
    availability: "",
    branchPublicId: "",
  })
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      email: "",
      phoneNumber: "",
    })

    // Validate fields
    let hasErrors = false

    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      hasErrors = true
    }

    if (!isValidPhone(formData.phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be in format: +[country code] [9 digits], e.g., +255 623302506",
      }))
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would send the data to the server
      await VolunteerService.registerVolunteer({
        ...formData,
        skills: formData.skills || "General volunteering",
        availability: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : "Flexible",
      })

      // Navigate to thank you page
      router.push("/thank-you?type=volunteer")
    } catch (error) {
      console.error("Error registering volunteer:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50/50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-200/100 border-b">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl text-blue-800">Volunteer Registration</CardTitle>
                <CardDescription>Join us in making a difference in the lives of orphaned children</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="e.g., Jane"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="e.g., Smith"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., jane.smith@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="e.g., +255 623302506"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                    required
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., Teaching, Counseling, etc."
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branchPublicId">Branch</Label>
                  <Select onValueChange={(value) => handleSelectChange("branchPublicId", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Springfield Branch</SelectItem>
                      <SelectItem value="2">Downtown Branch</SelectItem>
                      <SelectItem value="3">Riverside Branch</SelectItem>
                      <SelectItem value="4">Hillside Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-blue-200/100 p-6 border-t-blue-100">
              <Button variant="outline" type="button" onClick={() => router.push("/")}>
                Home
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
