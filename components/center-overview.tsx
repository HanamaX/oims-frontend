"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Edit, Loader2, FileX } from "lucide-react"
import API from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { T, useLanguage } from "@/contexts/LanguageContext"

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
  readonly onCenterDelete: () => void // Function to handle leave request
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
  const { t } = useLanguage()

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
          description: centre.description        }
        await API.patch("/app/oims/orphanages/updateorphanage", updateData)
        toast({
          title: t("common.success"),
          description: t("centerOverview.success.updated"),
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
          title: t("common.success"),
          description: t("centerOverview.success.created"),
        })
      }
      setIsEditingCenter(false)
      
      // Refresh branches after creating/updating center
      onFetchBranches()    } catch (err: any) {
      console.error("Error saving center data:", err)
      toast({
        title: t("common.error"),
        description: err.response?.data?.message ?? t("centerOverview.error.save"),
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
            <CardTitle><T k="centerOverview.create.title" /></CardTitle>
            <CardDescription><T k="centerOverview.create.description" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name"><T k="centerOverview.form.centerName" /></Label>
                <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location"><T k="centerOverview.form.location" /></Label>
                <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address"><T k="centerOverview.form.address" /></Label>
                <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber"><T k="centerOverview.form.phoneNumber" /></Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={centre.phoneNumber}
                  onChange={handleCenterChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email"><T k="centerOverview.form.email" /></Label>
                <Input id="email" name="email" type="email" value={centre.email} onChange={handleCenterChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description"><T k="centerOverview.form.description" /></Label>
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
                  <T k="centerOverview.form.creating" />
                </>
              ) : (
                <T k="centerOverview.form.createButton" />
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  // Handle center overview (view and edit modes)
  return (
    <div className="space-y-4">      {isEditingCenter ? (
        <Card>
          <form onSubmit={handleCenterSubmit}>
            <CardHeader>
              <CardTitle><T k="centerOverview.edit.title" /></CardTitle>
              <CardDescription><T k="centerOverview.edit.description" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name"><T k="centerOverview.form.centerName" /></Label>
                  <Input id="name" name="name" value={centre.name} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location"><T k="centerOverview.form.location" /></Label>
                  <Input id="location" name="location" value={centre.location} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address"><T k="centerOverview.form.address" /></Label>
                  <Input id="address" name="address" value={centre.address} onChange={handleCenterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber"><T k="centerOverview.form.phoneNumber" /></Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={centre.phoneNumber}
                    onChange={handleCenterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email"><T k="centerOverview.form.email" /></Label>
                  <Input id="email" name="email" type="email" value={centre.email} onChange={handleCenterChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description"><T k="centerOverview.form.description" /></Label>
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
                <T k="common.cancel" />
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <T k="centerOverview.form.updating" />
                  </>
                ) : (
                  <T k="centerOverview.form.updateButton" />
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
          </CardHeader>          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium"><T k="centerOverview.form.address" /></p>
                <p className="text-sm text-muted-foreground">{centre.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium"><T k="centerOverview.form.phoneNumber" /></p>
                <p className="text-sm text-muted-foreground">{centre.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium"><T k="centerOverview.form.email" /></p>
                <p className="text-sm text-muted-foreground">{centre.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium"><T k="centerOverview.form.description" /></p>
              <p className="text-sm text-muted-foreground">{centre.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* This space can be used for summary stats or other center info if needed */}
            </div>
          </CardContent>          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditingCenter(true)}>
              <Edit className="mr-2 h-4 w-4" /> <T k="centerOverview.actions.editDetails" />
            </Button>
            <Button 
              variant="outline" 
              onClick={onCenterDelete}
              disabled={submitting}
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <FileX className="mr-2 h-4 w-4" /> <T k="centerOverview.actions.leaveRequest" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
