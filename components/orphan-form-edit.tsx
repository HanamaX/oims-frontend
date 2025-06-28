"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { OrphanUpdateRequest } from '@/lib/orphan-service'
import { OrphanDetails, Orphan } from '@/lib/orphan-types'
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

// Extending types to handle the fields we need for editing
type EditableOrphan = {
  publicId: string;
  fullName: string;
  educationLevel?: string;
} & (
  // Either it has these fields directly
  { 
    gender: string;
    background: string;
    dateOfBirth?: string; 
    createdAt?: string;
  } | 
  // Or it has the adoption reason as background
  { 
    gender: string;
    adoptionReason: string;
    dateOfBirth: string;
    createdAt?: string;
  } |
  // Or we'll access them with type assertion
  Orphan | 
  OrphanDetails
);

interface OrphanFormEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrphanUpdateRequest) => void
  orphan: EditableOrphan | null
}

export default function OrphanFormEdit({ open, onOpenChange, onSubmit, orphan }: Readonly<OrphanFormEditProps>) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isSupervisorDashboard = pathname?.includes("/dashboard/supervisor/");
  
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [background, setBackground] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [origin, setOrigin] = useState('')
  const [religion, setReligion] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [allergies, setAllergies] = useState('')
  
  // Helper functions to extract data from orphan object
  const extractDateString = (orphan: EditableOrphan): string => {
    if (!orphan) return '';
    
    let dateStr = '';
    if ('dateOfBirth' in orphan && orphan.dateOfBirth) {
      dateStr = orphan.dateOfBirth;
    } else if ('createdAt' in orphan && orphan.createdAt) {
      dateStr = orphan.createdAt;
    }
    
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    } catch (e) {
      console.error('Error parsing date:', e)
      return ''
    }
  }
  
  const extractGender = (orphan: EditableOrphan): string => {
    if (!orphan) return '';
    return 'gender' in orphan ? orphan.gender : ((orphan as any).gender ?? '')
  }
  
  const extractBackground = (orphan: EditableOrphan): string => {
    if (!orphan) return '';
    
    if ('background' in orphan) {
      return orphan.background;
    } 
    
    if ('adoptionReason' in orphan) {
      return orphan.adoptionReason;
    } 
    
    return (orphan as any).background ?? '';
  }
  
  // Load orphan data when the component opens or orphan data changes
  useEffect(() => {
    if (!orphan) return;
    
    // Set basic details
    setFullName(orphan.fullName || '')
    setDateOfBirth(extractDateString(orphan))
    setGender(extractGender(orphan))
    setBackground(extractBackground(orphan))
    setEducationLevel(orphan.educationLevel ?? '')
    
    // Set optional details
    if ('origin' in orphan) setOrigin(orphan.origin ?? '')
    if ('religion' in orphan) setReligion(orphan.religion ?? '')
    if ('bloodGroup' in orphan) setBloodGroup(orphan.bloodGroup ?? '')
    if ('specialNeeds' in orphan) setSpecialNeeds(orphan.specialNeeds ?? '')
    if ('hobbies' in orphan) setHobbies(orphan.hobbies ?? '')
    if ('allergies' in orphan && orphan.allergies) {
      setAllergies(orphan.allergies.join(', '))
    }
  }, [orphan])
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orphan?.publicId) {
      alert('Error: Orphan ID is missing')
      return
    }
    
    // Validate required fields
    if (!fullName || !dateOfBirth || !gender || !background) {
      alert('Please fill in all required fields')
      return
    }
    
    // Create orphan update data object
    const orphanData: OrphanUpdateRequest = {
      orphanPublicId: orphan.publicId,
      fullName,
      dateOfBirth,
      gender,
      background,
      educationLevel: educationLevel || undefined,
      origin: origin || undefined,
      religion: religion || undefined,
      bloodGroup: bloodGroup || undefined,
      specialNeeds: specialNeeds || undefined,
      hobbies: hobbies || undefined,
      allergies: allergies ? allergies.split(',').map(item => item.trim()) : undefined
    }
    
    // Submit the data
    onSubmit(orphanData)
  }

  // Helper to get correct label key
  const getLabel = (formKey: string, fallback: string) =>
    isSupervisorDashboard ? t(formKey) : fallback;
  const getPlaceholder = (formKey: string, fallback: string) =>
    isSupervisorDashboard ? t(formKey) : fallback;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[95vw] lg:max-w-[85vw] h-[90vh] overflow-hidden bg-white border border-blue-200 shadow-lg relative mx-auto rounded-xl animate-fadeIn'>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-blue-700 text-xl font-semibold flex items-center">
            {getLabel("orphan.form.editTitle", "Edit Orphan")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getLabel("orphan.form.editDescription", "Update the orphan's details below. Required fields are marked with an asterisk (*).")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 h-[calc(100%-130px)] relative z-10">
          <form onSubmit={handleSubmit} className='space-y-6 py-4'>
          {/* Basic Information Section */}
          <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200 transition-all duration-300 hover:shadow-md">
            <h3 className="text-blue-700 font-medium mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
              {getLabel("orphan.form.basicInfoTitle", "Basic Information")}
            </h3>
            <div className='grid md:grid-cols-2 gap-5'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='fullName' className='text-right col-span-1 text-blue-800'>
                  {getLabel("orphan.form.fullName", "Full Name *")}
                </Label>
                <Input
                  id='fullName'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                  required
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='dateOfBirth' className='text-right col-span-1'>
                  {getLabel("orphan.form.birthDate", "Birth Date *")}
                </Label>
                <Input
                  id='dateOfBirth'
                  type='date'
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                  required
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='gender' className='text-right col-span-1'>
                  {getLabel("orphan.form.gender", "Gender *")}
                </Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'>
                    <SelectValue placeholder={getPlaceholder("orphan.form.selectGender", "Select gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MALE'>Male</SelectItem>
                    <SelectItem value='FEMALE'>Female</SelectItem>
                    <SelectItem value='OTHER'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='origin' className='text-right col-span-1'>
                  {getLabel("orphan.form.origin", "Origin")}
                </Label>
                <Input
                  id='origin'
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                />
              </div>
            </div>
          </div>
          
          {/* Medical Information Section */}
          <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200 transition-all duration-300 hover:shadow-md">
            <h3 className="text-blue-700 font-medium mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
              {getLabel("orphan.form.medicalInfoTitle", "Medical Information")}
            </h3>
            <div className='grid md:grid-cols-2 gap-5'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='bloodGroup' className='text-right col-span-1'>
                  {getLabel("orphan.form.bloodGroup", "Blood Group")}
                </Label>
                <Input
                  id='bloodGroup'
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='allergies' className='text-right col-span-1'>
                  {getLabel("orphan.form.allergies", "Allergies")}
                </Label>
                <Input
                  id='allergies'
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder={getPlaceholder("orphan.form.allergiesPlaceholder", "Separate with commas")}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2 md:col-span-2'>
                <Label htmlFor='specialNeeds' className='text-right col-span-1'>
                  {getLabel("orphan.form.specialNeeds", "Special Needs")}
                </Label>
                <Textarea
                  id='specialNeeds'
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  className='col-span-3 h-20 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                  placeholder={getPlaceholder("orphan.form.specialNeedsPlaceholder", "Describe any special needs")}
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200 transition-all duration-300 hover:shadow-md">
            <h3 className="text-blue-700 font-medium mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
              {getLabel("orphan.form.additionalInfoTitle", "Additional Information")}
            </h3>
            <div className='grid md:grid-cols-2 gap-5'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='religion' className='text-right col-span-1'>
                  {getLabel("orphan.form.religion", "Religion")}
                </Label>
                <Input
                  id='religion'
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='educationLevel' className='text-right col-span-1'>
                  {getLabel("orphan.form.educationLevel", "Education")}
                </Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className='col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'>
                    <SelectValue placeholder={getPlaceholder("orphan.form.selectEducationLevel", "Select level")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Kindergarten'>Kindergarten</SelectItem>
                    <SelectItem value='Primary'>Primary</SelectItem>
                    <SelectItem value='Secondary'>Secondary</SelectItem>
                    <SelectItem value='High School'>High School</SelectItem>
                    <SelectItem value='College'>College</SelectItem>
                    <SelectItem value='University'>University</SelectItem>
                    <SelectItem value='None'>None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='hobbies' className='text-right col-span-1'>
                  {getLabel("orphan.form.hobbies", "Hobbies")}
                </Label>
                <Textarea
                  id='hobbies'
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className='col-span-3 h-20 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                  placeholder={getPlaceholder("orphan.form.hobbiesPlaceholder", "List hobbies and interests")}
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='background' className='text-right col-span-1 text-blue-800'>
                  {getLabel("orphan.form.adoptionReason", "Background *")}<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Textarea
                  id='background'
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder={getPlaceholder("orphan.form.adoptionReasonPlaceholder", "Background information")}
                  className='col-span-3 h-20 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl'
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4 pb-2 border-t border-blue-100 mt-4 bg-blue-50 bg-opacity-50 rounded-b-xl">
            <div className="w-full flex justify-end gap-4">
              <Button 
                type='button' 
                variant='outline' 
                onClick={() => onOpenChange(false)} 
                className="border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200">
                {getLabel("orphan.form.cancel", "Cancel")}
              </Button>
              <Button 
                type='submit' 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200">
                {getLabel("orphan.form.saveOrphan", "Update Orphan")}
              </Button>
            </div>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
