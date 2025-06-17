"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Phone, Users } from "lucide-react"
import { T, useLanguage } from "@/contexts/LanguageContext"

// Define types for our data
interface Branch {
  publicId?: string
  name: string
  location: string
  phoneNumber: string
  isHQ?: boolean
  createdDate?: string
  staffCount?: number
  orphanCount?: number
  orphanageCentrePublicId?: string
}

interface Staff {
  publicId?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email: string
  phoneNumber?: string
  branchPublicId?: string
  branchName?: string
  role?: string
  suspended?: boolean
  imageUrl?: string
}

// Props interface for the component
interface BranchDetailsProps {
  readonly branch: Branch | null
  readonly branchStaff: Staff[]
  readonly onBackClick: () => void
}

export default function BranchDetails({
  branch,
  branchStaff,
  onBackClick
}: BranchDetailsProps) {
  const { language } = useLanguage()
  
  if (!branch) {
    return null
  }

  return (    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBackClick}>
          &larr; <T k="branch.backToBranches" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle>{branch.name}</CardTitle>              {branch.isHQ && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  <T k="branch.headquarters" />
                </span>
              )}
            </div>
            <CardDescription>{branch.location}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium"><T k="branch.phoneNumber" /></p>
                <p className="text-sm text-muted-foreground">{branch.phoneNumber}</p>
              </div>
              {branch.createdDate && (
                <div>
                  <p className="text-sm font-medium"><T k="branch.createdDate" /></p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(branch.createdDate.replace(' ', 'T')).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium"><T k="branch.orphans" /></p>
                <p className="text-sm text-muted-foreground">{branch.orphanCount ?? 0} <T k="branch.orphansInBranch" /></p>
              </div>
              <div>
                <p className="text-sm font-medium"><T k="staff.staff" /></p>
                <p className="text-sm text-muted-foreground">{branch.staffCount ?? 0} <T k="staff.staffMembers" /></p>
              </div>
            </div>
            
            {/* Branch Staff Section */}
            <div className="mt-6">              <h3 className="text-lg font-medium mb-4"><T k="staff.branchStaff" /></h3>
              {branchStaff.length > 0 ? (
                <div className="space-y-4">
                  {branchStaff.map((staff) => (
                    <Card 
                      key={staff.publicId} 
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium text-base">{staff.fullName ?? <T k="staff.noName" />}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-500" /> {staff.email}
                                </span>
                                {staff.phoneNumber && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-gray-500" /> {staff.phoneNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              staff.role === 'ROLE_SUPER_ADMIN' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {staff.role === 'ROLE_SUPER_ADMIN' ? <T k="staff.superAdmin" /> : <T k="staff.admin" />}
                            </span>
                            {staff.suspended ? (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                <T k="staff.suspended" />
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                <T k="staff.active" />
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground"><T k="staff.noStaffAssigned" /></p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
