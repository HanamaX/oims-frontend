import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { OrphanCreateRequest } from '@/lib/orphan-service'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from "next/navigation"

interface OrphanFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrphanCreateRequest) => void
}

export default function OrphanForm({ open, onOpenChange, onSubmit }: Readonly<OrphanFormProps>) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isSupervisorDashboard = pathname?.includes("/dashboard/supervisor/")
  
  // Helper to get correct label key
  const getLabel = (formKey: string, fallback: string) =>
    isSupervisorDashboard ? t(formKey) : fallback
  const getPlaceholder = (formKey: string, fallback: string) =>
    isSupervisorDashboard ? t(formKey) : fallback
    
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
    if (!fullName || !dateOfBirth || !gender || !adoptionReason) {
      alert(getLabel('orphan.form.requiredFields', 'Please fill in all required fields'))
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
      <DialogContent className='w-full max-w-[95vw] lg:max-w-[85vw] h-[90vh] overflow-hidden bg-white border border-blue-200 shadow-lg relative mx-auto'>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-blue-700 text-xl font-semibold flex items-center">
            {getLabel('orphan.form.addNewOrphan', 'Add New Orphan')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getLabel('orphan.form.enterDetails', 'Enter the orphan\'s details below. Required fields are marked with an asterisk (*).')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 h-[calc(100%-130px)] relative z-10">
          <form onSubmit={handleSubmit} className='space-y-5 py-3'>
            {/* Personal Information Section */}
            <div className="border rounded-md p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.personalInformation', 'Personal Information')}
              </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div>
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='fullName' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.fullName', 'Full Name')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='dateOfBirth' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.birthDate', 'Birth Date')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='gender' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.gender', 'Gender')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className='col-span-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500'>
                      <SelectValue placeholder={getPlaceholder('orphan.form.selectGender', 'Select gender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>{getLabel('orphan.form.male', 'Male')}</SelectItem>
                      <SelectItem value='FEMALE'>{getLabel('orphan.form.female', 'Female')}</SelectItem>
                      <SelectItem value='OTHER'>{getLabel('orphan.form.other', 'Other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='origin' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.origin', 'Origin')}
                  </Label>
                  <Input
                    id='origin'
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.originPlaceholder', 'Enter place of origin')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
              
              {/* Middle column */}
              <div>
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='religion' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.religion', 'Religion')}
                  </Label>
                  <Input
                    id='religion'
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.religionPlaceholder', 'Enter religion')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='bloodGroup' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.bloodGroup', 'Blood Group')}
                  </Label>
                  <Input
                    id='bloodGroup'
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.bloodGroupPlaceholder', 'Enter blood group')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='hobbies' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.hobbies', 'Hobbies')}
                  </Label>
                  <Input
                    id='hobbies'
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.hobbiesPlaceholder', 'Enter hobbies')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='allergies' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.allergies', 'Allergies')}
                  </Label>
                  <Input
                    id='allergies'
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.allergiesPlaceholder', 'Separate with commas')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='educationLevel' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.educationLevel', 'Education Level')}
                  </Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger className='col-span-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500'>
                      <SelectValue placeholder={getPlaceholder('orphan.form.selectEducationLevel', 'Select level')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='KINDERGARTEN'>{getLabel('orphan.form.kindergarten', 'Kindergarten')}</SelectItem>
                      <SelectItem value='PRIMARY'>{getLabel('orphan.form.primary', 'Primary')}</SelectItem>
                      <SelectItem value='SECONDARY'>{getLabel('orphan.form.secondary', 'Secondary')}</SelectItem>
                      <SelectItem value='HIGH_SCHOOL'>{getLabel('orphan.form.highSchool', 'High School')}</SelectItem>
                      <SelectItem value='COLLEGE'>{getLabel('orphan.form.college', 'College')}</SelectItem>
                      <SelectItem value='UNIVERSITY'>{getLabel('orphan.form.university', 'University')}</SelectItem>
                      <SelectItem value='NONE'>{getLabel('orphan.form.none', 'None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='grid grid-cols-4 items-center gap-3 mb-4'>
                  <Label htmlFor='previousSchoolName' className='text-right text-blue-800 whitespace-nowrap'>
                    {getLabel('orphan.form.previousSchool', 'Previous School')}
                  </Label>
                  <Input
                    id='previousSchoolName'
                    value={previousSchoolName}
                    onChange={(e) => setPreviousSchoolName(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.previousSchoolPlaceholder', 'Enter previous school name')}
                    className='col-span-3 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                
                <div className='grid grid-cols-4 items-start gap-3 mb-4'>
                  <Label htmlFor='specialNeeds' className='text-right text-blue-800 whitespace-nowrap pt-2'>
                    {getLabel('orphan.form.specialNeeds', 'Special Needs')}
                  </Label>
                  <Textarea
                    id='specialNeeds'
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.specialNeedsPlaceholder', 'Describe any special needs')}
                    className='col-span-3 h-24 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Medical History & Background */}
          <div className="border rounded-md p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200 mt-5">
            <h3 className="text-blue-700 font-medium mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
              {getLabel('orphan.form.additionalInformation', 'Additional Information')}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className='grid grid-cols-4 items-start gap-3 mb-4'>
                  <Label htmlFor='medicalHistory' className='text-right text-blue-800 whitespace-nowrap pt-2'>
                    {getLabel('orphan.form.medicalHistory', 'Medical History')}
                  </Label>
                  <Textarea
                    id='medicalHistory'
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.medicalHistoryPlaceholder', 'Enter medical history details')}
                    className='col-span-3 h-32 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
              
              <div>
                <div className='grid grid-cols-4 items-start gap-3 mb-4'>
                  <Label htmlFor='adoptionReason' className='text-right text-blue-800 whitespace-nowrap pt-2'>
                    {getLabel('orphan.form.adoptionReason', 'Background')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Textarea
                    id='adoptionReason'
                    value={adoptionReason}
                    onChange={(e) => setAdoptionReason(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.adoptionReasonPlaceholder', 'Enter background information')}
                    className='col-span-3 h-32 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-3 pb-2 border-t border-blue-100 mt-2 bg-blue-50 bg-opacity-50">
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}
              className="border-blue-300 text-blue-700 hover:bg-blue-100">
              {getLabel('orphan.form.cancel', 'Cancel')}
            </Button>
            <Button type='submit' className="bg-blue-600 hover:bg-blue-700 text-white">
              {getLabel('orphan.form.saveOrphan', 'Save Orphan')}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
