"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, UserPlus, Loader2, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { isValidEmail, isValidPhone, isValidName, isValidJobRole, isNotEmpty } from "@/lib/validation"
import VolunteerService, { Branch } from "@/lib/volunteer-service"
import { toast } from "@/hooks/use-toast"

export default function VolunteerRegistrationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobRole: "",
    branchPublicId: "",
  })
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobRole: "",
    branchPublicId: "",
    scheduledDate: ""
  })
  // Fetch branches on component mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchData = await VolunteerService.getBranches()
        console.log("Branches loaded:", branchData)
        // Make sure branchData is an array
        if (Array.isArray(branchData)) {
          setBranches(branchData)
        } else {
          console.error("Branches data is not an array:", branchData)
          setBranches([])
          toast({
            title: "Warning",
            description: "Branch data format is unexpected. Some features may not work correctly.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading branches:", error)
        setBranches([]) // Ensure it's always an array
        toast({
          title: "Error",
          description: "Failed to load branches. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBranches()
  }, [])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for the field being changed
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for the field being selected
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }
  
  // Clear scheduled date error when user selects a date
  useEffect(() => {
    if (scheduledDate && errors.scheduledDate) {
      setErrors(prev => ({
        ...prev,
        scheduledDate: ""
      }))
    }
  }, [scheduledDate, errors.scheduledDate])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      jobRole: "",
      branchPublicId: "",
      scheduledDate: ""
    })

    // Validate fields
    let hasErrors = false

    // Validate first name
    if (!isValidName(formData.firstName)) {
      setErrors((prev) => ({ 
        ...prev, 
        firstName: "First name should be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes" 
      }))
      hasErrors = true
    }

    // Validate last name
    if (!isValidName(formData.lastName)) {
      setErrors((prev) => ({ 
        ...prev, 
        lastName: "Last name should be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes" 
      }))
      hasErrors = true
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      hasErrors = true
    }

    // Validate phone number
    if (!isValidPhone(formData.phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be in format: +[country code] [9 digits], e.g., +255 623302506",
      }))
      hasErrors = true
    }

    // Validate job role if provided
    if (formData.jobRole && !isValidJobRole(formData.jobRole)) {
      setErrors((prev) => ({
        ...prev,
        jobRole: "Role description should be between 3 and 100 characters",
      }))
      hasErrors = true
    }

    // Validate branch selection
    if (!isNotEmpty(formData.branchPublicId)) {
      setErrors((prev) => ({
        ...prev,
        branchPublicId: "Please select a branch",
      }))
      hasErrors = true
    }

    // Validate scheduled date (not required, but nice to have)
    if (!scheduledDate) {
      setErrors((prev) => ({
        ...prev,
        scheduledDate: "Please select a date for your volunteer work",
      }))
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create the volunteer with the required format
      await VolunteerService.registerVolunteer({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        scheduledDate: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : undefined,
        jobRole: formData.jobRole || "General volunteering",
        branchPublicId: formData.branchPublicId,
      })

      // Show success toast
      toast({
        title: "Success",
        description: "Volunteer registered successfully!",
        duration: 5000,
      })

      // Navigate to thank you page
      router.push("/thank-you?type=volunteer")
    } catch (error) {
      console.error("Error registering volunteer:", error)
      toast({
        title: "Error",
        description: "Failed to register volunteer. Please try again.",
        variant: "destructive",
      })
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
          </CardHeader>          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {Object.values(errors).some(error => error !== "") && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                    <ul className="mt-1 text-xs text-red-700 list-disc pl-5">
                      {Object.values(errors).filter(error => error !== "").map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="e.g., Jane"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-red-500" : ""}
                    required
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="e.g., Smith"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-red-500" : ""}
                    required
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground",
                          errors.scheduledDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>                    
                    <PopoverContent className="w-auto p-0 bg-white">                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="bg-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.scheduledDate && <p className="text-sm text-red-500">{errors.scheduledDate}</p>}
                </div><div className="space-y-2">
                  <Label htmlFor="jobRole">Role / Skills</Label>
                  <Input
                    id="jobRole"
                    name="jobRole"
                    placeholder="e.g., Teaching Assistant, Counselor, etc."
                    value={formData.jobRole}
                    onChange={handleInputChange}
                    className={errors.jobRole ? "border-red-500" : ""}
                  />
                  {errors.jobRole && <p className="text-sm text-red-500">{errors.jobRole}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <div className="space-y-2">
                  <Label htmlFor="branchPublicId">Branch</Label>                  <Select 
                    onValueChange={(value) => handleSelectChange("branchPublicId", value)} 
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.branchPublicId ? "border-red-500" : ""}>
                      <SelectValue placeholder={isLoading ? "Loading branches..." : "Select a branch"} />
                    </SelectTrigger>                    <SelectContent className="bg-white">
                      {Array.isArray(branches) && branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem key={branch.publicId} value={branch.publicId} className="bg-white">
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-branches" disabled className="bg-white">
                          No branches available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {isLoading && <p className="text-sm text-muted-foreground mt-1">Loading branches...</p>}
                  {!isLoading && (!Array.isArray(branches) || branches.length === 0) && (
                    <p className="text-sm text-red-500 mt-1">No branches available. Please contact support.</p>
                  )}
                  {errors.branchPublicId && <p className="text-sm text-red-500">{errors.branchPublicId}</p>}
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
