"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Edit, Loader2, Trash2 } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

// Define the interface for our data
interface OrphanageCentre {
  publicId?: string
  name: string
  location: string
  address: string
  phoneNumber: string
  email: string
  description: string
}

// Props interface for the component
interface CenterOverviewProps {
  readonly centre: OrphanageCentre
  readonly centerExists: boolean
  readonly onCentreChange: (centre: OrphanageCentre) => void
  readonly onCenterDelete: () => void
  readonly onFetchBranches: () => Promise<void>
  readonly error: string | null
}

export default function CenterOverview({
  centre,
  centerExists,
  onCentreChange,
  onCenterDelete,
  onFetchBranches,
  error
}: CenterOverviewProps) {
  // Local state
  const [isEditingCenter, setIsEditingCenter] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Handle center form change
  const handleCenterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedCentre = { ...centre, [name]: value }
    // We don't update the parent state on every keystroke, only on submit
    // So we just update our local copy for now
    onCentreChange(updatedCentre)
  }

  // Handle center form submission
  const handleCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (centerExists) {
        // Update existing center
        const updateData = {
          centrePublicId: centre.publicId,
          name: centre.name,
          location: centre.location,
          address: centre.address,
          phoneNumber: centre.phoneNumber,
          email: centre.email,
          description: centre.description
        }
        await API.patch("/app/oims/orphanages/updateorphanage", updateData)
        toast({
          title: "Success",
          description: "Center information updated successfully",
        })
      } else {
        // Create new center
        const response = await API.post("/app/oims/orphanages/addorphanage", centre)
        if (response.data?.data) {
          const updatedCentre = {
            ...centre,
            publicId: response.data.data.publicId,
          }
          onCentreChange(updatedCentre)
        }
        
        // Update localStorage
        try {
          const userData = localStorage.getItem("user")
          if (userData) {
            const parsedUser = JSON.parse(userData)
            parsedUser.isCentreCreated = true
            localStorage.setItem("user", JSON.stringify(parsedUser))
          }
        } catch (storageErr) {
          console.error("Failed to update local storage:", storageErr)
        }
        
        toast({
          title: "Success",
          description: "Center created successfully",
        })
      }
      setIsEditingCenter(false)
      
      // Refresh branches after creating/updating center
      onFetchBranches()
    } catch (err: any) {
      console.error("Error saving center data:", err)
      toast({
        title: "Error",
        description: err.response?.data?.message ?? "Failed to save center information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle center creation form
  if (!centerExists) {
    return (
      <Card>
        <form onSubmit={handleCenterSubmit}>
          <CardHeader>
            <CardTitle>Create Orphanage Center</CardTitle>
            <CardDescription>Enter the details for your main orphanage center</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Center Name</Label>
                <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={centre.phoneNumber}
                  onChange={handleCenterChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={centre.email} onChange={handleCenterChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={centre.description}
                onChange={handleCenterChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Center</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  // Handle center overview (view and edit modes)
  return (
    <div className="space-y-4">
      {isEditingCenter ? (
        <Card>
          <form onSubmit={handleCenterSubmit}>
            <CardHeader>
              <CardTitle>Edit Orphanage Center</CardTitle>
              <CardDescription>Update the details for your orphanage center</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Center Name</Label>
                  <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={centre.phoneNumber}
                    onChange={handleCenterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={centre.email} onChange={handleCenterChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={centre.description}
                  onChange={handleCenterChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setIsEditingCenter(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Update Center</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Building className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle>{centre.name}</CardTitle>
              <CardDescription>{centre.location}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{centre.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">{centre.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{centre.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{centre.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* This space can be used for summary stats or other center info if needed */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditingCenter(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Center Details
            </Button>
            <Button 
              variant="destructive" 
              onClick={onCenterDelete}
              disabled={submitting}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Center
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
