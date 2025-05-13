import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { OrphanUpdateRequest } from '@/lib/orphan-service'
import { OrphanDetails, Orphan } from '@/lib/orphan-types'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white'>
        <DialogHeader>
          <DialogTitle>Edit Orphan</DialogTitle>
          <DialogDescription>
            Update the orphan's details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className='space-y-4 py-2'>
          {/* Basic Information Section */}
          <div className="border rounded-md p-3 bg-slate-50">
            <h3 className="font-medium mb-2">Basic Information</h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='fullName' className='text-right col-span-1'>
                  Full Name *
                </Label>
                <Input
                  id='fullName'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='col-span-3'
                  required
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='dateOfBirth' className='text-right col-span-1'>
                  Birth Date *
                </Label>
                <Input
                  id='dateOfBirth'
                  type='date'
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className='col-span-3'
                  required
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='gender' className='text-right col-span-1'>
                  Gender *
                </Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select gender' />
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
                  Origin
                </Label>
                <Input
                  id='origin'
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className='col-span-3'
                />
              </div>
            </div>
          </div>
          
          {/* Medical Information Section */}
          <div className="border rounded-md p-3 bg-slate-50">
            <h3 className="font-medium mb-2">Medical Information</h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='bloodGroup' className='text-right col-span-1'>
                  Blood Group
                </Label>
                <Input
                  id='bloodGroup'
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className='col-span-3'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='allergies' className='text-right col-span-1'>
                  Allergies
                </Label>
                <Input
                  id='allergies'
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder='Separate with commas'
                  className='col-span-3'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2 md:col-span-2'>
                <Label htmlFor='specialNeeds' className='text-right col-span-1'>
                  Special Needs
                </Label>
                <Textarea
                  id='specialNeeds'
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  className='col-span-3 h-20'
                  placeholder='Describe any special needs'
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="border rounded-md p-3 bg-slate-50">
            <h3 className="font-medium mb-2">Additional Information</h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='religion' className='text-right col-span-1'>
                  Religion
                </Label>
                <Input
                  id='religion'
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className='col-span-3'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='educationLevel' className='text-right col-span-1'>
                  Education
                </Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select level' />
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
                  Hobbies
                </Label>
                <Textarea
                  id='hobbies'
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className='col-span-3 h-20'
                  placeholder='List hobbies and interests'
                />
              </div>
              
              <div className='grid grid-cols-4 items-center gap-2'>
                <Label htmlFor='background' className='text-right col-span-1'>
                  Background *
                </Label>
                <Textarea
                  id='background'
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder='Background information'
                  className='col-span-3 h-20'
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Update Orphan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
