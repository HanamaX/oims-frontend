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
  onSubmit: (data: OrphanCreateRequest, orphanImage?: File | undefined, guardianData?: any) => void
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
  const [arrivalDate, setArrivalDate] = useState('') // Match the API field name
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
  
  // Social Welfare Officer information
  const [socialWelfareOfficerName, setSocialWelfareOfficerName] = useState('')
  const [socialWelfareOfficerWorkPlace, setSocialWelfareOfficerWorkPlace] = useState('')
  const [socialWelfareOfficerPhoneNumber, setSocialWelfareOfficerPhoneNumber] = useState('')
  const [socialWelfareOfficerEmail, setSocialWelfareOfficerEmail] = useState('')
  const [socialWelfareOfficerNotes, setSocialWelfareOfficerNotes] = useState('')
  
  // Guardian information
  const [guardianName, setGuardianName] = useState('')
  const [guardianSex, setGuardianSex] = useState('')
  const [guardianRelationship, setGuardianRelationship] = useState('')
  const [guardianContactNumber, setGuardianContactNumber] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [guardianAddress, setGuardianAddress] = useState('')
  const [guardianOccupation, setGuardianOccupation] = useState('')
  
  // Guardian data state only - no image handling in the form
  
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
    
    // Create orphan data object matching the backend API endpoint
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
      
      // Map social welfare officer data to the API fields
      referralOfficer: socialWelfareOfficerName,
      referralDepartment: socialWelfareOfficerWorkPlace,
      referralPhone: socialWelfareOfficerPhoneNumber,
      // Use referral fields for the email and notes as well
      referralDate: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    }
    
    // Guardian data to be submitted after orphan creation
    const guardianData = {
      name: guardianName,
      sex: guardianSex,
      relationship: guardianRelationship,
      contactNumber: guardianContactNumber,
      email: guardianEmail,
      address: guardianAddress,
      occupation: guardianOccupation
    }
    
    // Submit the data to parent component which should:
    // 1. Create orphan and get orphanPublicId from response
    // 2. Create guardian using orphanPublicId
    // 3. Guardian image upload will be handled in the orphan details view
    onSubmit(orphanData, undefined, guardianData)
    
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
    setSocialWelfareOfficerName('')
    setSocialWelfareOfficerWorkPlace('')
    setSocialWelfareOfficerPhoneNumber('')
    setSocialWelfareOfficerEmail('')
    setSocialWelfareOfficerNotes('')
    setGuardianName('')
    setGuardianSex('')
    setGuardianRelationship('')
    setGuardianContactNumber('')
    setGuardianEmail('')
    setGuardianAddress('')
    setGuardianOccupation('')
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
              </div>
            </div>
            
            {/* Social Welfare Officer Information section */}
            <div className="mt-6 border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {getLabel('orphan.form.socialWelfareSection', 'Social Welfare Officer Information')}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="socialWelfareOfficerName" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.socialWelfareOfficerName', 'Officer Name')}
                    </Label>
                    <Input
                      id="socialWelfareOfficerName"
                      value={socialWelfareOfficerName}
                      onChange={(e) => setSocialWelfareOfficerName(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.socialWelfareOfficerNamePlaceholder', 'Enter name of social welfare officer')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="socialWelfareOfficerWorkPlace" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.socialWelfareOfficerWorkPlace', 'Work Place')}
                    </Label>
                    <Input
                      id="socialWelfareOfficerWorkPlace"
                      value={socialWelfareOfficerWorkPlace}
                      onChange={(e) => setSocialWelfareOfficerWorkPlace(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.socialWelfareOfficerWorkPlacePlaceholder', 'Enter work place')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="socialWelfareOfficerPhoneNumber" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.socialWelfareOfficerPhoneNumber', 'Phone Number')}
                    </Label>
                    <Input
                      id="socialWelfareOfficerPhoneNumber"
                      value={socialWelfareOfficerPhoneNumber}
                      onChange={(e) => setSocialWelfareOfficerPhoneNumber(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.socialWelfareOfficerPhoneNumberPlaceholder', 'Enter phone number')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="socialWelfareOfficerEmail" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.socialWelfareOfficerEmail', 'Email')}
                    </Label>
                    <Input
                      id="socialWelfareOfficerEmail"
                      type="email"
                      value={socialWelfareOfficerEmail}
                      onChange={(e) => setSocialWelfareOfficerEmail(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div className="flex">
                  <Label htmlFor="socialWelfareOfficerNotes" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                    {getLabel('orphan.form.socialWelfareOfficerNotes', 'Notes')}
                  </Label>
                  <div className="flex-1">
                    <Textarea
                      id="socialWelfareOfficerNotes"
                      value={socialWelfareOfficerNotes}
                      onChange={(e) => setSocialWelfareOfficerNotes(e.target.value)}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
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
                {/* Guardian Name & Sex row */}
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
                    <Label htmlFor="guardianSex" className="min-w-[120px] text-right pr-4 flex-shrink-0 pt-2 text-blue-800">
                      {getLabel('orphan.form.guardianSex', 'Gender')}
                    </Label>
                    <Select value={guardianSex} onValueChange={setGuardianSex}>
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
                </div>
                
                {/* Contact Number & Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="guardianContactNumber" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianContactNumber', 'Contact Number')}
                    </Label>
                    <Input
                      id="guardianContactNumber"
                      value={guardianContactNumber}
                      onChange={(e) => setGuardianContactNumber(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianContactNumberPlaceholder', 'Enter contact number')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="guardianEmail" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianEmail', 'Email')}
                    </Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianEmailPlaceholder', 'Enter email address')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Address & Occupation row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="guardianAddress" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianAddress', 'Address')}
                    </Label>
                    <Input
                      id="guardianAddress"
                      value={guardianAddress}
                      onChange={(e) => setGuardianAddress(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianAddressPlaceholder', 'Enter address')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  
                  <div className="flex">
                    <Label htmlFor="guardianOccupation" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianOccupation', 'Occupation')}
                    </Label>
                    <Input
                      id="guardianOccupation"
                      value={guardianOccupation}
                      onChange={(e) => setGuardianOccupation(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianOccupationPlaceholder', 'Enter occupation')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                {/* Relationship & Photos row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <Label htmlFor="guardianRelationship" className="min-w-[120px] text-right pr-4 flex-shrink-0 text-blue-800">
                      {getLabel('orphan.form.guardianRelationship', 'Relationship')}
                    </Label>
                    <Input
                      id="guardianRelationship"
                      value={guardianRelationship}
                      onChange={(e) => setGuardianRelationship(e.target.value)}
                      placeholder={getPlaceholder('orphan.form.guardianRelationshipPlaceholder', 'Enter relationship (e.g. uncle, aunt)')}
                      className="flex-1 rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
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
