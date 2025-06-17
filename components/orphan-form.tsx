import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { OrphanCreateRequest } from '@/lib/orphan-service'
import { useLanguage } from '@/contexts/LanguageContext'

interface OrphanFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrphanCreateRequest) => void
}

export default function OrphanForm({ open, onOpenChange, onSubmit }: Readonly<OrphanFormProps>) {
  const { t } = useLanguage()
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
      alert(t('orphan.form.requiredFields'))
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
          <DialogTitle>{t('orphan.form.addNewOrphan')}</DialogTitle>
          <DialogDescription>
            {t('orphan.form.enterDetails')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className='space-y-4 py-2'>
          <div className='grid gap-4'>
            {/* Personal Information Section */}
            <div className="border-b pb-2 mb-2">
              <h3 className="font-medium text-sm">{t('orphan.form.personalInformation')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div>
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='fullName' className='text-right'>
                    {t('orphan.form.fullName')} *
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
                    {t('orphan.form.dateOfBirth')} *
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
                    {t('orphan.form.gender')} *
                  </Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className='col-span-2'>
                      <SelectValue placeholder={t('orphan.form.selectGender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>{t('orphan.form.male')}</SelectItem>
                      <SelectItem value='FEMALE'>{t('orphan.form.female')}</SelectItem>
                      <SelectItem value='OTHER'>{t('orphan.form.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='origin' className='text-right'>
                    {t('orphan.form.origin')}
                  </Label>
                  <Input
                    id='origin'
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={t('orphan.form.originPlaceholder')}
                    className='col-span-2'
                  />
                </div>
              </div>
              
              {/* Right column */}
              <div>
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='religion' className='text-right'>
                    {t('orphan.form.religion')}
                  </Label>
                  <Input
                    id='religion'
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder={t('orphan.form.religionPlaceholder')}
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='bloodGroup' className='text-right'>
                    {t('orphan.form.bloodGroup')}
                  </Label>
                  <Input
                    id='bloodGroup'
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder={t('orphan.form.bloodGroupPlaceholder')}
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='hobbies' className='text-right'>
                    {t('orphan.form.hobbies')}
                  </Label>
                  <Input
                    id='hobbies'
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder={t('orphan.form.hobbiesPlaceholder')}
                    className='col-span-2'
                  />
                </div>
                
                <div className='grid grid-cols-3 items-center gap-2 mb-3'>
                  <Label htmlFor='allergies' className='text-right'>
                    {t('orphan.form.allergies')}
                  </Label>
                  <Input
                    id='allergies'
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder={t('orphan.form.allergiesPlaceholder')}
                    className='col-span-2'
                  />
                </div>
              </div>
            </div>
            
            {/* Education Section */}
            <div className="border-b pb-2 mt-4 mb-2">
              <h3 className="font-medium text-sm">{t('orphan.form.education')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='grid grid-cols-3 items-center gap-2'>
                <Label htmlFor='educationLevel' className='text-right'>
                  {t('orphan.form.educationLevel')}
                </Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className='col-span-2'>
                    <SelectValue placeholder={t('orphan.form.selectEducationLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='KINDERGARTEN'>{t('orphan.form.kindergarten')}</SelectItem>
                    <SelectItem value='PRIMARY'>{t('orphan.form.primary')}</SelectItem>
                    <SelectItem value='SECONDARY'>{t('orphan.form.secondary')}</SelectItem>
                    <SelectItem value='HIGH_SCHOOL'>{t('orphan.form.highSchool')}</SelectItem>
                    <SelectItem value='COLLEGE'>{t('orphan.form.college')}</SelectItem>
                    <SelectItem value='UNIVERSITY'>{t('orphan.form.university')}</SelectItem>
                    <SelectItem value='NONE'>{t('orphan.form.none')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='grid grid-cols-3 items-center gap-2'>
                <Label htmlFor='previousSchoolName' className='text-right'>
                  {t('orphan.form.previousSchool')}
                </Label>
                <Input
                  id='previousSchoolName'
                  value={previousSchoolName}
                  onChange={(e) => setPreviousSchoolName(e.target.value)}
                  placeholder={t('orphan.form.previousSchoolPlaceholder')}
                  className='col-span-2'
                />
              </div>
            </div>
            
            {/* Medical Information & Other Details */}
            <div className="border-b pb-2 mt-4 mb-2">
              <h3 className="font-medium text-sm">{t('orphan.form.additionalInformation')}</h3>
            </div>
            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='specialNeeds' className='text-right'>
                {t('orphan.form.specialNeeds')}
              </Label>
              <Input
                id='specialNeeds'
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                placeholder={t('orphan.form.specialNeedsPlaceholder')}
                className='col-span-3'
              />
            </div>
            
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='medicalHistory' className='text-right pt-2'>
                {t('orphan.form.medicalHistory')}
              </Label>
              <Textarea
                id='medicalHistory'
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder={t('orphan.form.medicalHistoryPlaceholder')}
                className='col-span-3 h-20'
              />
            </div>
            
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='adoptionReason' className='text-right pt-2'>
                {t('orphan.form.adoptionReason')}
              </Label>
              <Textarea
                id='adoptionReason'
                value={adoptionReason}
                onChange={(e) => setAdoptionReason(e.target.value)}
                placeholder={t('orphan.form.adoptionReasonPlaceholder')}
                className='col-span-3 h-20'
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('orphan.form.cancel')}
            </Button>
            <Button type='submit'>{t('orphan.form.saveOrphan')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
