"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2, Settings, Mail, Phone } from "lucide-react"
import StaffForm from "@/components/staff-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const sampleStaff = [
  {
    id: 1,
    name: "Robert Johnson",
    role: "Administrator",
    email: "robert.johnson@example.com",
    phone: "+255 623302506",
    address: "123 Main St, Springfield",
    branchId: 1,
    joinDate: "2023-01-15",
    department: "Administration",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Caretaker",
    email: "sarah.williams@example.com",
    phone: "+255 723456789",
    address: "456 Elm St, Springfield",
    branchId: 1,
    joinDate: "2023-02-20",
    department: "Childcare",
    status: "Active",
  },
  {
    id: 3,
    name: "David Brown",
    role: "Teacher",
    email: "david.brown@example.com",
    phone: "+255 789012345",
    address: "789 Oak St, Springfield",
    branchId: 1,
    joinDate: "2023-03-10",
    department: "Education",
    status: "Active",
  },
  {
    id: 4,
    name: "Jennifer Davis",
    role: "Nurse",
    email: "jennifer.davis@example.com",
    phone: "+255 654321098",
    address: "101 Pine St, Springfield",
    branchId: 1,
    joinDate: "2023-04-05",
    department: "Healthcare",
    status: "On Leave",
  },
]

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [staff, setStaff] = useState(sampleStaff)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filter staff based on search term and role
  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || staffMember.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Handle edit and delete
  const handleEdit = (id: number) => {
    console.log(`Edit staff with ID: ${id}`)
    // In a real app, this would open an edit form or modal
  }

  const handleDelete = (id: number) => {
    console.log(`Delete staff with ID: ${id}`)
    // In a real app, this would show a confirmation dialog and then delete
    setStaff(staff.filter((staffMember) => staffMember.id !== id))
  }

  const handleAddStaff = (data: any) => {
    console.log("New staff data:", data)
    // In a real app, this would send the data to the server
    // For now, we'll just add it to our local state
    const newStaff = {
      id: staff.length + 1,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      address: data.address,
      branchId: Number.parseInt(data.branchId),
      joinDate: data.joinDate ? data.joinDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      department: "General", // Default value
      status: "Active", // Default value
    }
    setStaff([...staff, newStaff])
  }

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Caretaker":
        return "bg-green-100 text-green-800 border-green-200"
      case "Teacher":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Nurse":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground mt-2">View and manage all staff members in the system</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Caretaker">Caretaker</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStaff.map((staffMember) => (
          <Card key={staffMember.id} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{staffMember.name}</h3>
                    <Badge className={getRoleColor(staffMember.role)}>{staffMember.role}</Badge>
                    <Badge className={getStatusColor(staffMember.status)}>{staffMember.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Department: {staffMember.department}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-sm mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {staffMember.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {staffMember.phone}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="text-muted-foreground">Joined:</span> {staffMember.joinDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                  <Button onClick={() => handleEdit(staffMember.id)} variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Change Department</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Deactivate Account</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    onClick={() => handleDelete(staffMember.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStaff.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-muted-foreground">No staff found matching your criteria.</p>
          </div>
        )}
      </div>

      <StaffForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddStaff} />
    </div>
  )
}
