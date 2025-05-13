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

export default function OrphanForm({ open, onOpenChange, onSubmit }: OrphanFormProps) {
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [background, setBackground] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!fullName || !dateOfBirth || !gender || !background) {
      alert('Please fill in all required fields')
      return
    }
    
    // Create orphan data object
    const orphanData: OrphanCreateRequest = {
      fullName,
      dateOfBirth,
      gender,
      background,
      educationLevel: educationLevel || undefined
    }
    
    // Submit the data
    onSubmit(orphanData)
    
    // Reset form fields
    setFullName('')
    setDateOfBirth('')
    setGender('')
    setBackground('')
    setEducationLevel('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add New Orphan</DialogTitle>
          <DialogDescription>
            Enter the orphan's details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='grid gap-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='fullName' className='text-right'>
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
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='dateOfBirth' className='text-right'>
                Date of Birth *
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
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='gender' className='text-right'>
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
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='educationLevel' className='text-right'>
                Education Level
              </Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger className='col-span-3'>
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
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='background' className='text-right'>
                Background *
              </Label>
              <Textarea
                id='background'
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder='Enter information about the orphans background and history'
                className='col-span-3'
                required
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
