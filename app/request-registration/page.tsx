"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Check, Upload, FileText, ClipboardList, UserCheck, Building } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import API from "@/lib/api-service"
import { useLanguage, T } from "@/contexts/LanguageContext"

export default function RequestRegistrationPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  
  // Form state
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    centerName: "",
    centerLocation: "",
    certificate: null as File | null
  })
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, certificate: e.target.files![0] }))
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.centerName || !formData.centerLocation) {
      toast({
        title: t("common.error"),
        description: t("common.fillRequiredFields"),
        variant: "destructive",
      })
      setLoading(false)
      return
    }
    
    try {
      // Create form data object
      const registrationData = new FormData()
      registrationData.append("name", formData.name)
      registrationData.append("gender", formData.gender)
      registrationData.append("email", formData.email)
      registrationData.append("phone", formData.phone)
      registrationData.append("centerName", formData.centerName)
      registrationData.append("centerLocation", formData.centerLocation)
      if (formData.certificate) {
        registrationData.append("certificate", formData.certificate)
      }
      
      // Submit registration request (commented out for now)
      // await API.post("/app/oims/registration/request", registrationData)
      
      // Show success message
      toast({
        title: t("common.success"),
        description: t("orphanage.registration.successMessage"),
      })
      
      // Redirect to thank you page or home
      setTimeout(() => {
        router.push("/thank-you?type=registration")
      }, 2000)
      
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: t("common.error"),
        description: error.message || t("orphanage.registration.errorMessage"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 md:px-6">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <T k="orphanage.registration.title" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <T k="orphanage.registration.description" />
          </p>
        </div>
        
        {/* Registration Process */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            <T k="orphanage.registration.howTo" />
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    1
                  </div>
                  <ClipboardList className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle><T k="orphanage.registration.step1.title" /></CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  <T k="orphanage.registration.step1.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    2
                  </div>
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle><T k="orphanage.registration.step2.title" /></CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  <T k="orphanage.registration.step2.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    3
                  </div>
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle><T k="orphanage.registration.step3.title" /></CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  <T k="orphanage.registration.step3.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Step 4 */}
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    4
                  </div>
                  <Check className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle><T k="orphanage.registration.step4.title" /></CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  <T k="orphanage.registration.step4.desc" />
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            <T k="orphanage.registration.whyRegister" />
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Benefit 1 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    1
                  </div>
                  <CardTitle className="text-lg"><T k="orphanage.registration.benefit1.title" /></CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <T k="orphanage.registration.benefit1.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Benefit 2 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    2
                  </div>
                  <CardTitle className="text-lg"><T k="orphanage.registration.benefit2.title" /></CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <T k="orphanage.registration.benefit2.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Benefit 3 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    3
                  </div>
                  <CardTitle className="text-lg"><T k="orphanage.registration.benefit3.title" /></CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <T k="orphanage.registration.benefit3.desc" />
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Benefit 4 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center justify-center">
                    4
                  </div>
                  <CardTitle className="text-lg"><T k="orphanage.registration.benefit4.title" /></CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <T k="orphanage.registration.benefit4.desc" />
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Registration Form */}
        <section>
          <Card className="border-blue-300 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-blue-700">
                <T k="orphanage.registration.formTitle" />
              </CardTitle>
              <CardDescription>
                <T k="orphanage.registration.formDescription" />
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-blue-600">
                      <T k="orphanage.registration.personalDetails" />
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.name" /> *
                        </Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder={t("orphanage.registration.enterName")} 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.gender" />
                        </Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                          value={formData.gender}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder={t("orphanage.registration.selectGender")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t("orphanage.registration.male")}</SelectItem>
                            <SelectItem value="female">{t("orphanage.registration.female")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.email" /> *
                        </Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder={t("orphanage.registration.emailPlaceholder")}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.phone" /> *
                        </Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder={t("orphanage.registration.phonePlaceholder")}
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          <T k="orphanage.registration.phoneFormat" />
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Center Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-blue-600">
                      <T k="orphanage.registration.centerDetails" />
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Center Name */}
                      <div className="space-y-2">
                        <Label htmlFor="centerName" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.centerName" /> *
                        </Label>
                        <Input 
                          id="centerName" 
                          name="centerName" 
                          placeholder={t("orphanage.registration.enterCenterName")}
                          value={formData.centerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="centerLocation" className="text-blue-600 font-medium">
                          <T k="orphanage.registration.location" /> *
                        </Label>
                        <Input 
                          id="centerLocation" 
                          name="centerLocation" 
                          placeholder={t("orphanage.registration.enterLocation")}
                          value={formData.centerLocation}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Certificate Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="certificate" className="text-blue-600 font-medium">
                        <T k="orphanage.registration.certificate" />
                      </Label>
                      <div className="flex items-center gap-4">
                        <Label 
                          htmlFor="certificate" 
                          className="cursor-pointer flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md border border-blue-200"
                        >
                          <Upload className="h-4 w-4" />
                          <T k="orphanage.registration.chooseFile" />
                        </Label>
                        <Input 
                          id="certificate" 
                          name="certificate" 
                          type="file" 
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {formData.certificate ? formData.certificate.name : t("orphanage.registration.noFile")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <T k="orphanage.registration.pdfOnly" />
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <T k="common.submitting" />
                      </>
                    ) : (
                      <T k="common.submit" />
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
