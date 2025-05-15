import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { OrphanCreateRequest } from '@/lib/orphan-service'

interface OrphanFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrphanCreateRequest) => void
}

export default function OrphanForm({ open, onOpenChange, onSubmit }: Readonly<OrphanFormProps>) {
  const [origin, setOrigin] = useState('')
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [religion, setReligion] = useState('')
  const [adoptionReason, setAdoptionReason] = useState('')
  const [gender, setGender] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [allergiesText, setAllergiesText] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [previousSchoolName, setPreviousSchoolName] = useState('')
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!fullName || !dateOfBirth || !gender) {
      alert('Please fill in all required fields')
      return
    }
    
    // Process allergies from comma-separated text to array
    const allergies = allergiesText ? allergiesText.split(',').map(item => item.trim()) : []
    
    // Create orphan data object
    const orphanData: OrphanCreateRequest = {
      origin,
      fullName,
      dateOfBirth,
      religion,
      adoptionReason,
      gender,
      bloodGroup,
      allergies,
      medicalHistory,
      specialNeeds,
      hobbies,
      educationLevel,
      previousSchoolName
    }
    
    // Submit the data
    onSubmit(orphanData)
    
    // Reset form fields
    setOrigin('')
    setFullName('')
    setDateOfBirth('')
    setReligion('')
    setAdoptionReason('')
    setGender('')
    setBloodGroup('')
    setAllergiesText('')
    setMedicalHistory('')
    setSpecialNeeds('')
    setHobbies('')
    setEducationLevel('')
    setPreviousSchoolName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Orphan</DialogTitle>
          <DialogDescription>
            Enter the orphan's details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className='space-y-4 py-2'>
          <div className='grid gap-4'>
            {/* Personal Information Section */}
            <div className="border-b pb-2 mb-2">
              <h3 className="font-medium text-sm">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div>
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='fullName' className='text-right'>
                    Full Name *
                  </Label>
                  <Input
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='col-span-2'
                    required
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='dateOfBirth' className='text-right'>
                    Date of Birth *
                  </Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className='col-span-2'
                    required
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='gender' className='text-right'>
                    Gender *
                  </Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className='col-span-2'>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>Male</SelectItem>
                      <SelectItem value='FEMALE'>Female</SelectItem>
                      <SelectItem value='OTHER'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='origin' className='text-right'>
                    Origin
                  </Label>
                  <Input
                    id='origin'
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder='City or region of origin'
                    className='col-span-2'
                  />
                </div>
              </div>
              
              {/* Right column */}
              <div>
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='religion' className='text-right'>
                    Religion
                  </Label>
                  <Input
                    id='religion'
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder='Religion'
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='bloodGroup' className='text-right'>
                    Blood Group
                  </Label>
                  <Input
                    id='bloodGroup'
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder='E.g., O+, A-, etc.'
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='hobbies' className='text-right'>
                    Hobbies
                  </Label>
                  <Input
                    id='hobbies'
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder='Hobbies'
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='allergies' className='text-right'>
                    Allergies
                  </Label>
                  <Input
                    id='allergies'
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder='Comma-separated list'
                    className='col-span-2'
                  />
                </div>
              </div>
            </div>
            
            {/* Education Section */}
            <div className="border-b pb-2 mt-4 mb-2">
              <h3 className="font-medium text-sm">Education</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='grid grid-cols-3 items-center gap-2'>
                <Label htmlFor='educationLevel' className='text-right'>
                  Education Level
                </Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className='col-span-2'>
                    <SelectValue placeholder='Select education level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='KINDERGARTEN'>Kindergarten</SelectItem>
                    <SelectItem value='PRIMARY'>Primary</SelectItem>
                    <SelectItem value='SECONDARY'>Secondary</SelectItem>
                    <SelectItem value='HIGH_SCHOOL'>High School</SelectItem>
                    <SelectItem value='COLLEGE'>College</SelectItem>
                    <SelectItem value='UNIVERSITY'>University</SelectItem>
                    <SelectItem value='NONE'>None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='grid grid-cols-3 items-center gap-2'>
                <Label htmlFor='previousSchoolName' className='text-right'>
                  Previous School
                </Label>
                <Input
                  id='previousSchoolName'
                  value={previousSchoolName}
                  onChange={(e) => setPreviousSchoolName(e.target.value)}
                  placeholder='Previous school name'
                  className='col-span-2'
                />
              </div>
            </div>
            
            {/* Medical Information & Other Details */}
            <div className="border-b pb-2 mt-4 mb-2">
              <h3 className="font-medium text-sm">Additional Information</h3>
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='specialNeeds' className='text-right'>
                Special Needs
              </Label>
              <Input
                id='specialNeeds'
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                placeholder='Any special needs'
                className='col-span-3'
              />
            </div>
            
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='medicalHistory' className='text-right pt-2'>
                Medical History
              </Label>
              <Textarea
                id='medicalHistory'
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder='Medical history'
                className='col-span-3 h-20'
              />
            </div>
            
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='adoptionReason' className='text-right pt-2'>
                Adoption Reason
              </Label>
              <Textarea
                id='adoptionReason'
                value={adoptionReason}
                onChange={(e) => setAdoptionReason(e.target.value)}
                placeholder='Reason for adoption'
                className='col-span-3 h-20'
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Save Orphan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
