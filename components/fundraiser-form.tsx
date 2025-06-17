"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Branch, Centre } from "@/lib/volunteer-service"
import VolunteerService from "@/lib/volunteer-service"

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
    branchPublicId: "", // Will be populated from branch selection
    centrePublicId: "" // Will be populated from centre selection
  })
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [centres, setCentres] = useState<Centre[]>([])
  const [isBranchesLoading, setIsBranchesLoading] = useState(true)
  const [isCentresLoading, setIsCentresLoading] = useState(true)
  const [errors, setErrors] = useState({
    coordinatorEmail: "",
    phoneNumber: "",
    goal: "",
    branchPublicId: "",
    centrePublicId: ""
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
      
      // Validate the file
      if (file.size === 0) {
        console.error("File has zero size")
        alert("Error: Selected file has zero size")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        console.error("File is not an image:", file.type)
        alert(`Error: File must be an image, got ${file.type}`)
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        console.error("File is too large:", file.size)
        alert(`Error: File is too large (${(file.size/1024/1024).toFixed(2)} MB). Maximum size is 5 MB.`)
        return
      }
      
      // Store the file in state
      setPosterFile(file)
      
      console.log("File selected successfully:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      })
      
      // Visual notification
      const notificationMessage = `File "${file.name}" (${(file.size/1024).toFixed(1)} KB) selected successfully!`;
      console.log(notificationMessage);
      
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      console.log("No file selected in file input")
    }
  }
  // Fetch centres when component mounts
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        setIsCentresLoading(true)
        const centreData = await VolunteerService.getCentres()
        console.log("Centres loaded:", centreData)
        
        if (Array.isArray(centreData) && centreData.length > 0) {
          setCentres(centreData)
        } else {
          console.error("Centres data is not an array or is empty:", centreData)
        }
      } catch (error) {
        console.error("Error loading centres:", error)
      } finally {
        setIsCentresLoading(false)
      }
    }

    fetchCentres()
  }, [])

  // Fetch branches when centre is selected
  useEffect(() => {
    const fetchBranches = async () => {
      if (!formData.centrePublicId) {
        setBranches([])
        setFormData(prev => ({ ...prev, branchPublicId: "" }))
        return
      }

      try {
        setIsBranchesLoading(true)
        const branchData = await VolunteerService.getBranchesByCentre(formData.centrePublicId)
        console.log("Branches loaded for centre:", branchData)
        
        if (Array.isArray(branchData) && branchData.length > 0) {
          setBranches(branchData)
          // Reset branch selection when centre changes
          setFormData(prev => ({ ...prev, branchPublicId: "" }))
        } else {
          console.error("Branches data is not an array or is empty:", branchData)
          setBranches([])
        }
      } catch (error) {
        console.error("Error loading branches:", error)
        setBranches([])
      } finally {
        setIsBranchesLoading(false)
      }
    }

    fetchBranches()
  }, [formData.centrePublicId])

  const getBranchPlaceholder = () => {
    if (!formData.centrePublicId) return "Please select a centre first"
    if (isBranchesLoading) return "Loading branches..."
    return "Select a branch"
  }

  // Update the handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()    // Reset errors
    setErrors({
      coordinatorEmail: "",
      phoneNumber: "",
      goal: "",
      branchPublicId: "",
      centrePublicId: ""
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
      if (!formData.centrePublicId) {
      setErrors((prev) => ({ ...prev, centrePublicId: "Please select a centre" }))
      hasErrors = true
    }
    
    if (!formData.branchPublicId) {
      setErrors((prev) => ({ ...prev, branchPublicId: "Please select a branch" }))
      hasErrors = true
    }
    
    if (!startDate || !endDate) {
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
    console.log("Form data formatted for API:" + fundraiserData)
    console.log("Poster file to be uploaded:", posterFile ? `${posterFile.name} (${posterFile.size} bytes)` : "No file")
    
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">            <div className="space-y-2">
              <Label htmlFor="goal">Target Amount (Tshs)</Label>
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
            </div>            <div className="space-y-2">
              <Label htmlFor="amountPayedPerIndividual">Amount Per Individual (Tshs)</Label>
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
            </div>            <div className="space-y-2">
              <Label htmlFor="orphanageAmountPerIndividual">Orphanage Amount (Tshs)</Label>
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
            <Label htmlFor="budgetBreakdown">Budget Breakdown</Label>            <Textarea
              id="budgetBreakdown"
              name="budgetBreakdown"
              placeholder="Provide a breakdown of how the funds will be used (e.g., Books: Tshs 2000, Stationery: Tshs 1500, Uniforms: Tshs 1500)"
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
                </PopoverTrigger>                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar mode="single" selected={startDate} disabled={(date) => date < new Date()} onSelect={setStartDate} initialFocus className="bg-white" />
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
                </PopoverTrigger>                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => date < new Date()} initialFocus className="bg-white" />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">Event end date (format: YYYY-MM-DD)</p>
            </div>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="centrePublicId">Centre</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("centrePublicId", value)} 
                value={formData.centrePublicId}
                disabled={isCentresLoading}
              >
                <SelectTrigger className={errors.centrePublicId ? "border-red-500" : ""}>
                  <SelectValue placeholder={isCentresLoading ? "Loading centres..." : "Select a centre"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Array.isArray(centres) && centres.length > 0 ? (
                    centres.map((centre) => (
                      <SelectItem key={centre.publicId} value={centre.publicId} className="bg-white">
                        {centre.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-centres" disabled className="bg-white">
                      No centres available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {isCentresLoading && <p className="text-sm text-muted-foreground mt-1">Loading centres...</p>}
              {errors.centrePublicId && <p className="text-sm text-red-500">{errors.centrePublicId}</p>}
              {!isCentresLoading && (!Array.isArray(centres) || centres.length === 0) && (
                <p className="text-sm text-red-500 mt-1">No centres available. Please contact support.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchPublicId">Branch</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("branchPublicId", value)} 
                value={formData.branchPublicId}
                disabled={isBranchesLoading || !formData.centrePublicId}
              >
                <SelectTrigger className={errors.branchPublicId ? "border-red-500" : ""}>                  <SelectValue 
                    placeholder={getBranchPlaceholder()} 
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Array.isArray(branches) && branches.length > 0 ? (
                    branches.map((branch) => (
                      <SelectItem key={branch.publicId} value={branch.publicId} className="bg-white">
                        {branch.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-branches" disabled className="bg-white">
                      {!formData.centrePublicId ? "Select a centre first" : "No branches available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {isBranchesLoading && formData.centrePublicId && <p className="text-sm text-muted-foreground mt-1">Loading branches...</p>}
              {errors.branchPublicId && <p className="text-sm text-red-500">{errors.branchPublicId}</p>}
              {!isBranchesLoading && formData.centrePublicId && (!Array.isArray(branches) || branches.length === 0) && (
                <p className="text-sm text-red-500 mt-1">No branches available for this centre.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="posterUpload">Campaign Poster</Label>
            <div className="flex items-center gap-4">
              <div className="border rounded-md p-4 w-full">                <label htmlFor="posterUpload" className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="h-8 w-8 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</span>
                  <Input
                    id="posterUpload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                    onClick={(e) => {
                      // Reset the file input value to ensure onChange fires even if selecting the same file again
                      const target = e.target as HTMLInputElement;
                      if (target) target.value = '';
                    }}
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
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-blue-200 border-blue-100 p-6">
          {posterFile && (
            <div className="mr-auto">
              <p className="text-sm font-medium text-green-700">
                <span className="inline-block mr-1">✓</span> 
                Image ready to upload: {posterFile.name} ({Math.round(posterFile.size/1024)} KB)
              </p>
            </div>
          )}
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
