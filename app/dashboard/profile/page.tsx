"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, User, Upload, Eye, EyeOff } from "lucide-react"
import AuthService, { type UpdatePasswordRequest, type UpdateProfileRequest } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import API from "@/lib/api-service"
import Image from "next/image"
import { T, useLanguage } from "@/contexts/LanguageContext"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()  
  // Profile state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("");  const [profileImage, setProfileImage] = useState<string>("")
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);  const [imageError, setImageError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [gender, setGender] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")
  const [accountCreated, setAccountCreated] = useState("")
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [isProfileUpdating, setIsProfileUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)
  
  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Helper function to get image URL
  const getImageUrl = useCallback((imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === "") return ""
    return imageUrl.startsWith('http') ? imageUrl : `${API.defaults.baseURL}${imageUrl}`
  }, [])

  // Memoized image URL to prevent unnecessary recalculations
  const profileImageUrl = useMemo(() => getImageUrl(profileImage), [profileImage, getImageUrl])

  // Handle profile image error
  const handleProfileImageError = useCallback(() => {
    setProfileImageError(true)
  }, [])

    // Helper functions for formatting display values
  const formatGenderDisplay = (genderValue: string): string => {
    if (!genderValue) return t("profile.notSpecified");
    
    switch (genderValue) {
      case "MALE": return t("profile.gender.male");
      case "FEMALE": return t("profile.gender.female");
      case "OTHER": return t("profile.gender.other");
      case "PREFER_NOT_TO_SAY": return t("profile.gender.preferNot");
      default: return genderValue;
    }
  };
    const formatRoleDisplay = (roleValue: string): string => {
    if (!roleValue) return t("profile.notSpecified");
    if (roleValue === "orphanage_admin") return t("profile.role.orphanageAdmin");
    
    switch (roleValue) {
      case "supervisor": return t("profile.role.supervisor");
      case "volunteer": return t("profile.role.volunteer");
      case "donor": return t("profile.role.donor");
      default: return roleValue.charAt(0).toUpperCase() + roleValue.slice(1);    }
  };

    // Load user data
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFullName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
      setEmail(user.email ?? "")
      setUsername(user.username ?? "")
      setRole(user.role ?? "")
      // Handle additional data from local storage as it's not directly in the user context
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          
          setPhone(userData.phoneNumber ?? userData.phone ?? "")
          
          // Ensure we have a valid image URL by checking if it's a non-empty string
          const imageUrl = userData.imageUrl && typeof userData.imageUrl === 'string' && userData.imageUrl.trim() !== "" 
            ? userData.imageUrl 
            : ""
          console.log("Loading profile image from localStorage:", imageUrl)
          setProfileImage(imageUrl)
          
          // Reset image error states based on whether we have a valid image URL
          if (!imageUrl) {
            setImageError(true)
            setProfileImageError(true)
          } else {
            setImageError(false)
            setProfileImageError(false)
          }
          
          setGender(userData.sex ?? userData.gender ?? "")
          setBranch(userData.branchName ?? "")
          
          // Format creation date if available
          if (userData.createdDate) {
            try {
              const date = new Date(userData.createdDate.replace(' ', 'T'))
              setAccountCreated(date.toLocaleDateString())
            } catch (error) {
              console.error("Error parsing date:", error);
              setAccountCreated(userData.createdDate)
            }
          }
        } catch (err) {
          console.error("Error parsing user data from localStorage", err)
        }
      }
    }
  }, [user, isAuthenticated, isLoading, router])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      setImageError(false)
      setProfileImageError(false)
      
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileSuccess(false);
      if (!fullName) {
      setProfileError(t("profile.error.name"))
      return
    }
    
    if (!email) {
      setProfileError(t("profile.error.email"))
      return
    }

    if (!gender) {
      setProfileError(t("profile.error.gender"))
      return
    }

    setIsProfileUpdating(true)

    try {
      // If there's a new image file selected, upload it first
      let imageUrl = profileImage
      if (profileImageFile) {
        // Check file size (4MB limit)
        const fileSizeInMB = profileImageFile.size / (1024 * 1024);
        if (fileSizeInMB > 4) {
          setProfileError(t("profile.image.error.size"))
          setIsProfileUpdating(false)
          return
        }
        
      try {          const response = await AuthService.uploadProfileImage(profileImageFile)
          imageUrl = response.imageUrl
          console.log("Successfully uploaded image, received URL:", imageUrl)
          // Reset image error state since we have a new image
          setImageError(false)
          setProfileImageError(false)
        } catch (err) {
          console.error("Profile image upload error:", err)
          setProfileError(t("profile.image.error.upload"))
          setIsProfileUpdating(false)
          return
        }
      }        const profileData: UpdateProfileRequest = {
        fullName,
        username,
        email,
        phone: phone ?? undefined,
        phoneNumber: phone ?? undefined, // Send both variants in case backend expects phoneNumber
        imageUrl: imageUrl ?? undefined,
        gender: gender ?? undefined,
        sex: gender ?? undefined, // Send the same value to both fields for compatibility
      }
      
      // Remove any undefined fields to ensure they're not sent as null
      Object.keys(profileData).forEach(key => {
        if (profileData[key as keyof UpdateProfileRequest] === undefined) {
          delete profileData[key as keyof UpdateProfileRequest];
        }
      });
      
      console.log("ProfileUpdate - form values:", {
        fullName,
        username,
        email,
        phone,
        gender
      });

      await AuthService.updateProfile(profileData)
      console.log("Profile updated with image URL:", imageUrl)      // Update local storage with new profile data
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const nameParts = fullName.split(" ")
        userData.firstName = nameParts[0]
        userData.lastName = nameParts.slice(1).join(" ")
        userData.username = username
        userData.email = email
        userData.phoneNumber = phone
        userData.phone = phone // Store both ways for compatibility
        userData.imageUrl = imageUrl // Use the updated imageUrl instead of profileImage
        userData.sex = gender // Store as sex for compatibility
        userData.gender = gender // Store as gender for compatibility
        localStorage.setItem("user", JSON.stringify(userData))
      }

      setProfileSuccess(true)
      setProfileImage(imageUrl) // Update state with new image URL
      
      // Reset file state after successful upload
      setProfileImageFile(null)
      setImagePreview(null)
      
      // Switch back to view mode on successful update
      setIsEditing(false)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Profile update error:", err)
      setProfileError("Failed to update profile. Please try again.")
    } finally {
      setIsProfileUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false);
    
    if (!currentPassword) {
      setPasswordError(t("profile.password.error.current"))
      return
    }

    if (!newPassword) {
      setPasswordError(t("profile.password.error.new"))
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("profile.password.error.match"))
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(t("profile.password.error.length"))
      return
    }

    setIsPasswordUpdating(true)

    try {
      const passwordData: UpdatePasswordRequest = {
        oldPassword: currentPassword,
        newPassword,
        // Include any additional fields if required by the API
      }

      await AuthService.updatePassword(passwordData)
      setPasswordSuccess(true)

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Password update error:", err);          setPasswordError(t("profile.password.error.update"))
    } finally {
      setIsPasswordUpdating(false)
    }  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p><T k="profile.loading" /></p>
      </div>
    )
  }  return (
    <div className="bg-blue-50 min-h-screen py-8 px-2 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-blue-800"><T k="profile.title" /></h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 bg-blue-100 rounded-lg p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-800 px-4 py-2 rounded transition-all"> <T k="profile.tab.info" /></TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-800 px-4 py-2 rounded transition-all"> <T k="profile.tab.password" /></TabsTrigger>
        </TabsList>
        <TabsContent value="profile">          <Card className="shadow-lg border-blue-200">
            <CardHeader className="flex justify-between items-start bg-blue-100 rounded-t-lg">
              <div>
                <CardTitle className="text-blue-800"><T k="profile.view.title" /></CardTitle>
                <CardDescription className="text-blue-700"><T k="profile.view.description" /></CardDescription>
              </div>
              {!isEditing && (                <Button 
                  onClick={() => {
                    setIsEditing(true);
                    setImageError(false); // Reset image error when entering edit mode
                    setProfileImageError(false); // Reset profile image error when entering edit mode
                  }} 
                  variant="outline"
                  className="border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                >
                  <T k="profile.button.edit" />
                </Button>
              )}
            </CardHeader>
            <CardContent>              {profileError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              {profileSuccess && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <Check className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-600"><T k="profile.success.update" /></AlertDescription>
                </Alert>
              )}

              {/* Profile View Mode */}
              {!isEditing ? (                <div className="space-y-6">                  <div className="flex justify-center mb-6">
                    <Avatar className="h-32 w-32 border-2 border-gray-200 relative">
                      {profileImageUrl && !profileImageError ? (
                        <Image 
                          src={profileImageUrl}
                          alt={`${fullName || "Admin"} Profile`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-full"
                          onError={handleProfileImageError}
                          unoptimized
                          priority
                        />
                      ) : (
                        <AvatarFallback className="text-blue-500 bg-gray-100">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.fullName" /></p>
                      <p className="font-medium">{fullName || t("profile.notSpecified")}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.username" /></p>
                      <p className="font-medium">{username || t("profile.notSpecified")}</p>
                    </div>
                      <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.email" /></p>
                      <p className="font-medium">{email || t("profile.notSpecified")}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.phone" /></p>
                      <p className="font-medium">{phone || t("profile.notSpecified")}</p>
                    </div>                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.gender" /></p>
                      <p className="font-medium">{formatGenderDisplay(gender)}</p>
                    </div>
                      <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.role" /></p>
                      <p className="font-medium">{formatRoleDisplay(role)}</p>
                    </div>
                    {role === "supervisor" && branch && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.branch" /></p>
                        <p className="font-medium">{branch}</p>
                      </div>
                    )}
                      {accountCreated && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground"><T k="profile.label.created" /></p>
                        <p className="font-medium">{accountCreated}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Profile Edit Mode */
                <form onSubmit={handleProfileUpdate} className="bg-white">
                  <div className="space-y-4">                    <div className="space-y-2">
                      <Label htmlFor="fullName"><T k="profile.label.fullName" /></Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("profile.label.fullName")}
                        className="bg-white"
                      />
                    </div>
                    
                    {/* Username field for editing */}                    <div className="space-y-2">
                      <Label htmlFor="username"><T k="profile.label.username" /></Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t("profile.label.username")}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email"><T k="profile.label.email" /></Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("profile.label.email")}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone"><T k="profile.label.phoneOptional" /></Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("profile.label.phone")}
                        className="bg-white"
                      />
                    </div>                    <div className="space-y-2">
                      <Label htmlFor="gender"><T k="profile.label.gender" /></Label>
                      <Select
                        value={gender}
                        onValueChange={setGender}
                        defaultValue=""                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={t("profile.label.gender")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">{t("profile.gender.male")}</SelectItem>
                          <SelectItem value="FEMALE">{t("profile.gender.female")}</SelectItem>
                          <SelectItem value="OTHER">{t("profile.gender.other")}</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">{t("profile.gender.preferNot")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role"><T k="profile.label.role" /></Label>
                      <Input
                        id="role"
                        value={formatRoleDisplay(role)}
                        readOnly
                        disabled
                        className="bg-gray-50"
                      />                    </div>

                    {role === "supervisor" && branch && (
                      <div className="space-y-2">
                        <Label htmlFor="branch"><T k="profile.label.branch" /></Label>
                        <Input
                          id="branch"
                          value={branch}
                          readOnly
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    )}

                    {/* Cancel and Save buttons */}
                    <div className="flex gap-3 pt-2">                      <Button 
                        type="button" 
                        onClick={() => {
                          setIsEditing(false);
                          setImagePreview(null);
                          setProfileImageFile(null);
                          setImageError(false);
                          setProfileImageError(false);
                        }} 
                        variant="outline" 
                        className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                      >
                        <T k="profile.button.cancel" />
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isProfileUpdating}
                      >
                        {isProfileUpdating ? <T k="profile.button.updating" /> : <T k="profile.button.save" />}
                      </Button>
                    </div>

                    {/* Profile Image Upload Section */}
                    <div className="space-y-2">
                      <Label htmlFor="profileImage"><T k="profile.label.profileImage" /></Label>                      <div className="flex gap-4 items-start">
                        <div className="flex-1 border rounded-md p-4 bg-white">
                          <label htmlFor="profileImage" className="flex flex-col items-center gap-2 cursor-pointer">
                            {imagePreview ? (
                              <div className="relative w-32 h-32 mx-auto mb-2">
                                <img 
                                  src={imagePreview} 
                                  alt="Profile Preview" 
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                            ) : (
                              <Upload className="h-8 w-8 text-blue-500" />
                            )}
                            <span className="text-sm text-muted-foreground"><T k="profile.image.upload.click" /></span>
                            <span className="text-xs text-muted-foreground"><T k="profile.image.upload.formats" /></span>
                            <Input
                              id="profileImage"
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                          {imageError && (
                            <p className="text-xs text-red-500 mt-1 text-center">
                              <T k="profile.image.error.invalid" />
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-blue-100 rounded-t-lg">
              <CardTitle className="text-blue-800"><T k="profile.password.title" /></CardTitle>
              <CardDescription className="text-blue-700"><T k="profile.password.description" /></CardDescription>
            </CardHeader>
            <CardContent>              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription></AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <Check className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-600"><T k="profile.password.success" /></AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-blue-900"><T k="profile.password.label.current" /></Label>
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("profile.password.placeholder.current")}
                    className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowCurrentPassword(prev => !prev)}
                    className="absolute right-3 top-10 text-blue-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-blue-900"><T k="profile.password.label.new" /></Label>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("profile.password.placeholder.new")}
                    className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute right-3 top-10 text-blue-600"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-900"><T k="profile.password.label.confirm" /></Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("profile.password.placeholder.confirm")}
                    className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-10 text-blue-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    onClick={() => router.back()} 
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                  >
                    <T k="profile.button.cancel" />
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isPasswordUpdating}
                  >
                    <T k="profile.button.save" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

