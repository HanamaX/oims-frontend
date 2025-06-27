"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Guardian } from '@/lib/orphan-types'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from "next/navigation"

interface GuardianFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Guardian) => void
  guardian: Guardian | null
}

export default function GuardianForm({ open, onOpenChange, onSubmit, guardian }: GuardianFormProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isSupervisorDashboard = pathname?.includes("/dashboard/supervisor/")
  
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [sex, setSex] = useState('Male')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [occupation, setOccupation] = useState('')
  
  // Load guardian data when the component opens or guardian data changes
  useEffect(() => {
    if (guardian) {
      setName(guardian.name || '')
      setRelationship(guardian.relationship || '')
      setContactNumber(guardian.contactNumber || '')
      setSex(guardian.sex || 'Male')
      setEmail(guardian.email || '')
      setAddress(guardian.address || '')
      setOccupation(guardian.occupation || '')
    }
  }, [guardian])
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name || !relationship || !contactNumber) {
      alert('Please fill in all required fields')
      return
    }
    
    // Create guardian data object
    const guardianData: Guardian = {
      name,
      relationship,
      contactNumber,
      sex,
      email,
      address,
      occupation
    }
    
    // Submit the data
    onSubmit(guardianData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] ${isSupervisorDashboard ? 'sm:max-w-[85vw] md:max-w-[80vw]' : ''} bg-white animate-fadeIn rounded-xl overflow-hidden`}>
        <div className="shadow-lg rounded-xl p-4">
          <DialogHeader className={`${isSupervisorDashboard ? 'text-blue-600' : ''}`}>
            <DialogTitle className="text-2xl font-semibold text-blue-700 mb-2">
              {guardian ? t('guardian.form.editGuardian') : t('guardian.form.addGuardian')}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-4">
              {guardian ? t('guardian.form.editDescription') : t('guardian.form.addDescription')} {t('guardian.form.requiredFields')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className='space-y-4 py-4'>
            <div className={`grid gap-4 ${isSupervisorDashboard ? 'md:grid-cols-3 gap-6' : ''}`}>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.fullName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl p-2 transition duration-200'
                placeholder={t('guardian.form.fullName')}
                required
              />
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='relationship' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.relationship')} <span className="text-red-500">*</span>
              </Label>              
              <Select value={relationship} onValueChange={setRelationship} required>
                <SelectTrigger className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl transition duration-200'>
                  <SelectValue placeholder={t('guardian.form.selectRelationship')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Parent'>{t('guardian.form.parent')}</SelectItem>
                  <SelectItem value='Grandparent'>{t('guardian.form.grandparent')}</SelectItem>
                  <SelectItem value='Sibling'>{t('guardian.form.sibling')}</SelectItem>
                  <SelectItem value='Uncle'>{t('guardian.form.uncle')}</SelectItem>
                  <SelectItem value='Aunt'>{t('guardian.form.aunt')}</SelectItem>
                  <SelectItem value='Cousin'>{t('guardian.form.cousin')}</SelectItem>
                  <SelectItem value='Guardian'>{t('guardian.form.guardian')}</SelectItem>
                  <SelectItem value='Family Friend'>{t('guardian.form.familyFriend')}</SelectItem>
                  <SelectItem value='Other'>{t('guardian.form.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='contactNumber' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.phoneNumber')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id='contactNumber'
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl p-2 transition duration-200'
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='sex' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.sex')}
              </Label>
              <div className="col-span-3">
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger className='w-full border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl transition duration-200'>
                    <SelectValue placeholder={t('guardian.form.selectSex')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Male'>{t('guardian.form.male')}</SelectItem>
                    <SelectItem value='Female'>{t('guardian.form.female')}</SelectItem>
                    <SelectItem value='Other'>{t('guardian.form.other')}</SelectItem>
                  </SelectContent>
                </Select>
                {/* Alternative radio buttons as per the design
                <div className="flex items-center gap-4 mt-1">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="sex" 
                      value="Male"
                      checked={sex === 'Male'} 
                      onChange={() => setSex('Male')}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-700">{t('guardian.form.male')}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="sex" 
                      value="Female"
                      checked={sex === 'Female'} 
                      onChange={() => setSex('Female')}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-700">{t('guardian.form.female')}</span>
                  </label>
                </div>
                */}
              </div>
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.email')}
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl p-2 transition duration-200'
                placeholder="Enter email"
              />
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='address' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.address')}
              </Label>
              <Textarea
                id='address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl p-2 transition duration-200'
                placeholder="Enter address"
              />
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='occupation' className='text-right block text-gray-700 font-medium'>
                {t('guardian.form.occupation')}
              </Label>
              <Input
                id='occupation'
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className='col-span-3 border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl p-2 transition duration-200'
                placeholder="Enter occupation"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button 
              type='button' 
              variant='outline' 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200"
            >
              {t('guardian.form.cancel')}
            </Button>
            <Button 
              type='submit' 
              className={`px-4 py-2 text-white rounded-xl transition duration-200 ${
                isSupervisorDashboard ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
            >
              {guardian ? t('guardian.form.update') : t('guardian.form.add')}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
