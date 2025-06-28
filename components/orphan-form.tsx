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
  const [arrivalDate, setArrivalDate] = useState('') // New: Date of arrival
  const [religion, setReligion] = useState('')
  const [adoptionReason, setAdoptionReason] = useState('')
  const [gender, setGender] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [allergiesText, setAllergiesText] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [hobbies, setHobbies] = useState('')
  
  // Education fields
  const [educationLevel, setEducationLevel] = useState('')
  const [previousSchoolName, setPreviousSchoolName] = useState('')
  const [educationStartDate, setEducationStartDate] = useState('') // New: Education time frame start
  const [educationEndDate, setEducationEndDate] = useState('') // New: Education time frame end
  
  // Referral information
  const [referralOfficer, setReferralOfficer] = useState('') // New: Officer name
  const [referralDepartment, setReferralDepartment] = useState('') // New: Department
  const [referralPhone, setReferralPhone] = useState('') // New: Phone
  const [referralDate, setReferralDate] = useState('') // New: Referral date
  const [referralDocument, setReferralDocument] = useState<File | null>(null) // New: Referral document
  
  // Guardian information and files
  const [guardianName, setGuardianName] = useState('') // New: Guardian name
  const [guardianPhone, setGuardianPhone] = useState('') // New: Guardian phone number
  const [guardianResidence, setGuardianResidence] = useState('') // New: Guardian place of residence
  const [relationship, setRelationship] = useState('') // New: Relationship with the child
  const [childPhoto, setChildPhoto] = useState<File | null>(null) // New: Child photo
  const [guardianPhoto, setGuardianPhoto] = useState<File | null>(null) // New: Guardian photo
  const [birthCertificate, setBirthCertificate] = useState<File | null>(null) // New: Birth certificate
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]) // New: Additional files
  
  // Function to handle file input change
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }
  
  // Function to handle multiple file input change
  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalFiles(Array.from(e.target.files))
    }
  }
  
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
      arrivalDate,
      religion,
      adoptionReason,
      gender,
      bloodGroup,
      allergies,
      medicalHistory,
      specialNeeds,
      hobbies,
      educationLevel,
      previousSchoolName,
      
      // Add new fields
      educationStartDate,
      educationEndDate,
      
      referralOfficer,
      referralDepartment,
      referralPhone,
      referralDate,
      referralDocument: referralDocument || undefined,
      
      guardianName,
      guardianPhone,
      guardianResidence,
      relationship,
      childPhoto: childPhoto || undefined,
      guardianPhoto: guardianPhoto || undefined,
      birthCertificate: birthCertificate || undefined,
      additionalFiles: additionalFiles.length > 0 ? additionalFiles : undefined
    }
    
    // Submit the data
    onSubmit(orphanData)
    
    // Reset form fields
    setOrigin('')
    setFullName('')
    setDateOfBirth('')
    setArrivalDate('')
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
    setEducationStartDate('')
    setEducationEndDate('')
    setReferralOfficer('')
    setReferralDepartment('')
    setReferralPhone('')
    setReferralDate('')
    setReferralDocument(null)
    setGuardianName('')
    setGuardianPhone('')
    setGuardianResidence('')
    setRelationship('')
    setChildPhoto(null)
    setGuardianPhoto(null)
    setBirthCertificate(null)
    setAdditionalFiles([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[95vw] lg:max-w-[85vw] max-h-[90vh] overflow-hidden bg-white border border-blue-200 shadow-lg relative mx-auto z-[1001] animate-fadeIn rounded-xl'>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="font-semibold text-blue-700 text-xl">
            {getLabel('orphan.form.addNewOrphan', 'Add New Orphan')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getLabel('orphan.form.enterDetails', 'Enter the orphan\'s details below. Required fields are marked with an asterisk (*).')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 max-h-[calc(90vh-130px)] relative z-10">
          <form onSubmit={handleSubmit} className='space-y-5'>
            
            {/* Personal Information Section */}
            <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.personalInformation', 'Personal Information')}
              </h3>
              
              <div className="space-y-4">
                {/* Full Name & Religion row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="fullName" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.fullName', 'Full Name')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="religion" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.religion', 'Religion')}
                    </Label>
                    <Input
                      id="religion"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.religionPlaceholder', 'Enter religion')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Birth Date & Blood Group row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="dateOfBirth" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.birthDate', 'Birth Date')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="bloodGroup" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.bloodGroup', 'Blood Group')}
                    </Label>
                    <Input
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.bloodGroupPlaceholder', 'Enter blood group')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Arrival Date row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="arrivalDate" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.arrivalDate', 'Date of Arrival')}
                    </Label>
                    <Input
                      id="arrivalDate"
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Gender & Hobbies row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="gender" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                      {getLabel('orphan.form.gender', 'Gender')} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                        <SelectValue placeholder={getPlaceholder('orphan.form.selectGender', 'Select gender')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="MALE">{getLabel('orphan.form.male', 'Male')}</SelectItem>
                        <SelectItem value="FEMALE">{getLabel('orphan.form.female', 'Female')}</SelectItem>
                        <SelectItem value="OTHER">{getLabel('orphan.form.other', 'Other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="hobbies" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.hobbies', 'Hobbies')}
                    </Label>
                    <Input
                      id="hobbies"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.hobbiesPlaceholder', 'Enter hobbies')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
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
            <div className="mt-6 border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.education', 'Education')}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="educationLevel" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                      {getLabel('orphan.form.educationLevel', 'Education Level')}
                    </Label>
                    <Select value={educationLevel} onValueChange={setEducationLevel}>
                      <SelectTrigger className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                        <SelectValue placeholder={getPlaceholder('orphan.form.selectEducationLevel', 'Select Education Level')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="KINDERGARTEN">{getLabel('orphan.form.kindergarten', 'Kindergarten')}</SelectItem>
                        <SelectItem value="PRIMARY">{getLabel('orphan.form.primary', 'Primary')}</SelectItem>
                        <SelectItem value="SECONDARY">{getLabel('orphan.form.secondary', 'Secondary')}</SelectItem>
                        <SelectItem value="NONE">{getLabel('orphan.form.none', 'None')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="previousSchoolName" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.previousSchool', 'Previous School')}
                    </Label>
                    <Input
                      id="previousSchoolName"
                      value={previousSchoolName}
                      onChange={(e) => setPreviousSchoolName(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.previousSchoolPlaceholder', 'Enter previous school name')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Education Time Frame */}
                <div className="mt-2">
                  <h4 className="text-blue-700 font-medium mb-2 ml-2">
                    {getLabel('orphan.form.educationTimeFrame', 'Education Time Frame')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <Label htmlFor="educationStartDate" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                        {getLabel('orphan.form.educationStartDate', 'Start Date')}
                      </Label>
                      <Input
                        id="educationStartDate"
                        type="date"
                        value={educationStartDate}
                        onChange={(e) => setEducationStartDate(e.target.value)}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    
                    <div className="flex">
                      <Label htmlFor="educationEndDate" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                        {getLabel('orphan.form.educationEndDate', 'End Date')}
                      </Label>
                      <Input
                        id="educationEndDate"
                        type="date"
                        value={educationEndDate}
                        onChange={(e) => setEducationEndDate(e.target.value)}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
                

              </div>
            </div>
            
            {/* Referral Information section */}
            <div className="mt-6 border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.referralSection', 'Referral Information')}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="referralOfficer" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.referralOfficer', 'Referring Officer')}
                    </Label>
                    <Input
                      id="referralOfficer"
                      value={referralOfficer}
                      onChange={(e) => setReferralOfficer(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.referralOfficerPlaceholder', 'Enter name of referring officer')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="referralDepartment" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.referralDepartment', 'Department')}
                    </Label>
                    <Input
                      id="referralDepartment"
                      value={referralDepartment}
                      onChange={(e) => setReferralDepartment(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.referralDepartmentPlaceholder', 'Enter referring department')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="referralPhone" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.referralPhone', 'Officer Phone')}
                    </Label>
                    <Input
                      id="referralPhone"
                      value={referralPhone}
                      onChange={(e) => setReferralPhone(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.referralPhonePlaceholder', 'Enter referring officer\'s phone number')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="referralDate" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.referralDate', 'Referral Date')}
                    </Label>
                    <Input
                      id="referralDate"
                      type="date"
                      value={referralDate}
                      onChange={(e) => setReferralDate(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div className="flex">
                  <Label htmlFor="referralDocument" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                    {getLabel('orphan.form.referralDocument', 'Referral Document')}
                  </Label>
                  <div className="flex-1">
                    <Input
                      id="referralDocument"
                      type="file"
                      onChange={(e) => handleFileChange(e, setReferralDocument)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">{getLabel('orphan.form.uploadDocument', 'Upload Document')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information section */}
            <div className="mt-6 border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.additionalInformation', 'Additional Information')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <Label htmlFor="specialNeeds" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                    {getLabel('orphan.form.specialNeeds', 'Special Needs')}
                  </Label>
                  <Textarea
                    id="specialNeeds"
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.specialNeedsPlaceholder', 'Describe any special needs')}
                    className="flex-1 min-h-[80px] rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
                
                <div className="flex">
                  <Label htmlFor="medicalHistory" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                    {getLabel('orphan.form.medicalHistory', 'Medical History')}
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.medicalHistoryPlaceholder', 'Enter medical history details')}
                    className="flex-1 min-h-[80px] rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
                
                <div className="flex">
                  <Label htmlFor="adoptionReason" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                    {getLabel('orphan.form.adoptionReason', 'Adoption Reason')} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="adoptionReason"
                    value={adoptionReason}
                    onChange={(e) => setAdoptionReason(e.target.value)}
                    placeholder={getPlaceholder('orphan.form.adoptionReasonPlaceholder', 'Enter adoption reason')}
                    className="flex-1 min-h-[80px] rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Guardian Information section */}
            <div className="mt-6 border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.guardianSection', 'Guardian Information')}
              </h3>
              
              <div className="space-y-4">
                {/* Guardian Name & Phone Number row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="guardianName" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianName', 'Guardian Name')}
                    </Label>
                    <Input
                      id="guardianName"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianNamePlaceholder', 'Enter guardian\'s full name')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="guardianPhone" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianPhone', 'Guardian Phone')}
                    </Label>
                    <Input
                      id="guardianPhone"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianPhonePlaceholder', 'Enter guardian\'s phone number')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Residence & Relationship row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="guardianResidence" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianResidence', 'Place of Residence')}
                    </Label>
                    <Input
                      id="guardianResidence"
                      value={guardianResidence}
                      onChange={(e) => setGuardianResidence(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianResidencePlaceholder', 'Enter guardian\'s place of residence')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="relationship" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.relationship', 'Relationship with Child')}
                    </Label>
                    <Input
                      id="relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.relationshipPlaceholder', 'Enter relationship (e.g. uncle, none)')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Photos row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="childPhoto" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.childPhoto', 'Child Photo')}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="childPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setChildPhoto)}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">{getLabel('orphan.form.uploadChildPhoto', 'Upload Child Photo')}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="guardianPhoto" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianPhoto', 'Guardian Photo')}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="guardianPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setGuardianPhoto)}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">{getLabel('orphan.form.uploadGuardianPhoto', 'Upload Guardian Photo')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Documents row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="birthCertificate" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.birthCertificate', 'Birth Certificate')}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="birthCertificate"
                        type="file"
                        onChange={(e) => handleFileChange(e, setBirthCertificate)}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">{getLabel('orphan.form.uploadBirthCertificate', 'Upload Birth Certificate')}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="additionalFiles" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.additionalFiles', 'Additional Files')}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="additionalFiles"
                        type="file"
                        multiple
                        onChange={handleMultipleFileChange}
                        className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">{getLabel('orphan.form.uploadAdditionalFiles', 'Upload Additional Files')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 pb-2 border-t border-blue-100 mt-4 bg-blue-50 bg-opacity-50 rounded-b-xl">
              <div className="w-full flex justify-end gap-4">
                <Button 
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl"
                >
                  {getLabel('orphan.form.cancel', 'Cancel')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
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
