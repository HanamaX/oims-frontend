"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, User, Upload } from "lucide-react"
import AuthService, { type UpdatePasswordRequest, type UpdateProfileRequest } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import API from "@/lib/api-service"
import axios from "axios"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()  
  // Profile state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string>("")
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBlob, setImageBlob] = useState<string | null>(null)
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
  
  // Helper functions for formatting display values
  const formatGenderDisplay = (genderValue: string): string => {
    if (!genderValue) return "Not Specified";
    
    switch (genderValue) {
      case "MALE": return "Male";
      case "FEMALE": return "Female";
      case "OTHER": return "Other";
      case "PREFER_NOT_TO_SAY": return "Prefer not to say";
      default: return genderValue;
    }
  };
  
  const formatRoleDisplay = (roleValue: string): string => {
    if (!roleValue) return "Not Specified";
    if (roleValue === "superadmin") return "Super Admin";
    return roleValue.charAt(0).toUpperCase() + roleValue.slice(1);
  };

  // This function loads the profile image as a blob with proper authorization
  const fetchProfileImage = async (imagePath: string) => {
    if (!imagePath) return;
    
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setImageError(true);
        return;
      }
        // Check if the image path is already a complete URL (starts with http:// or https://)
      const imageUrl = imagePath.startsWith('http') ? imagePath : `${API.defaults.baseURL}${imagePath}`;
      console.log("Fetching image from:", imageUrl);
      
      const response = await axios.get(imageUrl, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        const blobUrl = URL.createObjectURL(response.data);
      console.log("Successfully loaded profile image as blob");
      setImageBlob(blobUrl);
      setImageError(false);
    } catch (error) {
      console.error("Failed to load profile image:", error);
      setImageError(true);
    }  }
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
          
          // If we have an image path, fetch the image as blob
          if (imageUrl) {
            fetchProfileImage(imageUrl)
          } else {
            setImageError(true)
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
    setProfileSuccess(false)

    if (!fullName) {
      setProfileError("Name is required")
      return
    }

    if (!email) {
      setProfileError("Email is required")
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
          setProfileError("Image file size must be less than 4MB")
          setIsProfileUpdating(false)
          return
        }
        
      try {
          const response = await AuthService.uploadProfileImage(profileImageFile)
          imageUrl = response.imageUrl
          console.log("Successfully uploaded image, received URL:", imageUrl)
          // Reset image error state since we have a new image
          setImageError(false)
          
          // Fetch the newly uploaded image
          if (imageUrl) {
            fetchProfileImage(imageUrl)
          }
        } catch (err) {
          console.error("Profile image upload error:", err)
          setProfileError("Failed to upload profile image. Please try again.")
          setIsProfileUpdating(false)
          return
        }
      }
      
      const profileData: UpdateProfileRequest = {
        fullName,
        email,
        phone: phone ?? undefined,
        imageUrl: imageUrl ?? undefined,
        gender: gender ?? undefined,
        sex: gender ?? undefined, // Send the same value to both fields for compatibility
      }

      await AuthService.updateProfile(profileData)
      console.log("Profile updated with image URL:", imageUrl)

      // Update local storage with new profile data
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const nameParts = fullName.split(" ")
        userData.firstName = nameParts[0]
        userData.lastName = nameParts.slice(1).join(" ")
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
    setPasswordSuccess(false)

    if (!currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (!newPassword) {
      setPasswordError("New password is required")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
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
      console.error("Password update error:", err)
      setPasswordError("Failed to update password. Please ensure your current password is correct.")
    } finally {
      setIsPasswordUpdating(false)
    }
  }
  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, [imageBlob]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your personal information</CardDescription>
              </div>
              {!isEditing && (
                <Button 
                  onClick={() => {
                    setIsEditing(true);
                    setImageError(false); // Reset image error when entering edit mode
                  }} 
                  variant="outline"
                >
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {profileError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              {profileSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">Profile updated successfully!</AlertDescription>
                </Alert>
              )}

              {/* Profile View Mode */}
              {!isEditing ? (
                <div className="space-y-6">                  <div className="flex justify-center mb-6">
                    <Avatar className="h-32 w-32 border-2 border-gray-200">
                      {imageBlob ? (
                        <img
                          src={imageBlob}
                          alt={fullName || "User"}
                          className="h-full w-full object-cover rounded-full"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <AvatarFallback className="text-blue-500 bg-gray-100">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="font-medium">{fullName || "Not Specified"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Username</p>
                      <p className="font-medium">{username || "Not Specified"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-medium">{email || "Not Specified"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="font-medium">{phone || "Not Specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="font-medium">{formatGenderDisplay(gender)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <p className="font-medium">{formatRoleDisplay(role)}</p>
                    </div>
                    {role === "admin" && branch && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Branch</p>
                        <p className="font-medium">{branch}</p>
                      </div>
                    )}
                    
                    {accountCreated && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                        <p className="font-medium">{accountCreated}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Profile Edit Mode */
                <form onSubmit={handleProfileUpdate} className="bg-white">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (optional)</Label>
                      <Select
                        value={gender}
                        onValueChange={(value) => setGender(value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>                      <Input
                        id="role"
                        value={formatRoleDisplay(role)}
                        readOnly
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    {role === "admin" && branch && (
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                          id="branch"
                          value={branch}
                          readOnly
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 border rounded-md p-4 bg-white">
                          <label htmlFor="profileImage" className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="h-8 w-8 text-blue-500" />
                            <span className="text-sm text-muted-foreground">Click to upload profile image</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 4MB)</span>
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
                              Image is invalid or too large. Maximum size is 4MB.
                            </p>
                          )}
                        </div>                        <Avatar className="h-20 w-20 border-2 border-gray-200 flex-shrink-0">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Profile Preview"
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : imageBlob ? (
                            <img
                              src={imageBlob}
                              alt="Current Profile"
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="text-blue-500 bg-gray-100">
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="button" 
                        onClick={() => {
                          setIsEditing(false);
                          setImagePreview(null);
                          setProfileImageFile(null);
                          setImageError(false); // Reset image error when canceling edit
                        }} 
                        variant="outline" 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={isProfileUpdating}
                      >
                        {isProfileUpdating ? "Updating..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">Password updated successfully!</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Your current password"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Your new password"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="bg-white"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isPasswordUpdating}>
                    {isPasswordUpdating ? "Updating..." : "Change Password"}
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
