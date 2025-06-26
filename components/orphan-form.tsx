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
      <DialogContent className='w-full max-w-[95vw] lg:max-w-[85vw] max-h-[90vh] overflow-hidden bg-white border border-blue-200 shadow-lg relative mx-auto z-[1001]'>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="font-semibold">
            {getLabel('orphan.form.addNewOrphan', 'Add New Orphan')}
          </DialogTitle>
          <DialogDescription>
            {getLabel('orphan.form.enterDetails', 'Enter the orphan\'s details below. Required fields are marked with an asterisk (*).')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 max-h-[calc(90vh-130px)] relative z-10">
          <form onSubmit={handleSubmit} className='space-y-5'>
            
            {/* Personal Information Section */}
            <div>
              <h3 className="font-medium mb-4">
                {getLabel('orphan.form.personalInformation', 'Personal Information')}
              </h3>
              
              <div className="space-y-4">
                {/* Full Name & Religion row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="fullName" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.fullName', 'Full Name')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1"
                      required
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="religion" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.religion', 'Religion')}
                    </Label>
                    <Input
                      id="religion"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.religionPlaceholder', 'Enter religion')}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Birth Date & Blood Group row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="dateOfBirth" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.birthDate', 'Birth Date')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex-1"
                      required
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="bloodGroup" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.bloodGroup', 'Blood Group')}
                    </Label>
                    <Input
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.bloodGroupPlaceholder', 'Enter blood group')}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Gender & Hobbies row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="gender" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2">
                      {getLabel('orphan.form.gender', 'Gender')} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={getPlaceholder('orphan.form.selectGender', 'Select gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">{getLabel('orphan.form.male', 'Male')}</SelectItem>
                        <SelectItem value="FEMALE">{getLabel('orphan.form.female', 'Female')}</SelectItem>
                        <SelectItem value="OTHER">{getLabel('orphan.form.other', 'Other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="hobbies" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.hobbies', 'Hobbies')}
                    </Label>
                    <Input
                      id="hobbies"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.hobbiesPlaceholder', 'Enter hobbies')}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Origin & Allergies row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="origin" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.origin', 'Origin')}
                    </Label>
                    <Input
                      id="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.originPlaceholder', 'Enter place of origin')}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="allergies" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                      {getLabel('orphan.form.allergies', 'Allergies')}
                    </Label>
                    <Input
                      id="allergies"
                      value={allergiesText}
                      onChange={(e) => setAllergiesText(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.allergiesPlaceholder', 'Enter allergies (comma separated)')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Education section */}
            <div className="mt-6">
              <h3 className="font-medium mb-4">
                {getLabel('orphan.form.education', 'Education')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                  <Label htmlFor="educationLevel" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2">
                    {getLabel('orphan.form.educationLevel', 'Education Level')}
                  </Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={getPlaceholder('orphan.form.selectEducationLevel', 'Select Education Level')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KINDERGARTEN">{getLabel('orphan.form.kindergarten', 'Kindergarten')}</SelectItem>
                      <SelectItem value="PRIMARY">{getLabel('orphan.form.primary', 'Primary')}</SelectItem>
                      <SelectItem value="SECONDARY">{getLabel('orphan.form.secondary', 'Secondary')}</SelectItem>
                      <SelectItem value="NONE">{getLabel('orphan.form.none', 'None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex">
                  <Label htmlFor="previousSchoolName" className="min-w-[120px] text-right pr-4 flex-shrink-0">
                    {getLabel('orphan.form.previousSchool', 'Previous School')}
                  </Label>
                  <Input
                    id="previousSchoolName"
                    value={previousSchoolName}
                    onChange={(e) => setPreviousSchoolName(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.previousSchoolPlaceholder', 'Enter previous school name')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Information section */}
            <div className="mt-6">
              <h3 className="font-medium mb-4">
                {getLabel('orphan.form.additionalInformation', 'Additional Information')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <Label htmlFor="specialNeeds" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2">
                    {getLabel('orphan.form.specialNeeds', 'Special Needs')}
                  </Label>
                  <Textarea
                    id="specialNeeds"
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.specialNeedsPlaceholder', 'Describe any special needs')}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                
                <div className="flex">
                  <Label htmlFor="medicalHistory" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2">
                    {getLabel('orphan.form.medicalHistory', 'Medical History')}
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.medicalHistoryPlaceholder', 'Enter medical history details')}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                
                <div className="flex">
                  <Label htmlFor="adoptionReason" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2">
                    {getLabel('orphan.form.adoptionReason', 'Adoption Reason')} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="adoptionReason"
                    value={adoptionReason}
                    onChange={(e) => setAdoptionReason(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.adoptionReasonPlaceholder', 'Enter adoption reason')}
                    className="flex-1 min-h-[80px]"
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="w-full flex justify-center gap-4 mt-4">
                <Button 
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                >
                  {getLabel('orphan.form.cancel', 'Cancel')}
                </Button>
                <Button 
                  type="submit"
                >
                  {getLabel('orphan.form.saveOrphan', 'Save Orphan')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
