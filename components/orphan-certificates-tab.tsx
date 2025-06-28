"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"
import { Certificate } from '@/lib/orphan-types'

interface CertificateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (certificate: Certificate) => void
  orphanId: string
}

export default function CertificateForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  orphanId 
}: CertificateFormProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isSupervisorDashboard = pathname?.includes("/dashboard/supervisor/")
  
  // Certificate form state
  const [certificateType, setCertificateType] = useState('')
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueDate, setIssueDate] = useState('')
  const [description, setDescription] = useState('')
  
  // Function to handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0])
    }
  }
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!certificateType || !certificateFile) {
      alert(t('orphan.certificates.requiredFields'))
      return
    }
    
    setIsSubmitting(true)
    
    // Create certificate object
    const certificate: Certificate = {
      type: certificateType,
      fileUrl: '', // This will be filled by the backend
      filename: certificateFile.name,
      issueDate: issueDate || new Date().toISOString(),
      description: description || '',
    }
    
    // Call onSubmit with the certificate and file
    try {
      onSubmit(certificate)
      // Reset form after successful submission
      setCertificateType('')
      setCertificateFile(null)
      setIssueDate('')
      setDescription('')
    } catch (error) {
      console.error('Error adding certificate:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] lg:max-w-[85vw] md:max-w-[65vw] h-auto max-h-[90vh] overflow-hidden bg-white border border-blue-200 shadow-lg relative mx-auto rounded-xl animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 z-0 rounded-xl"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-blue-700 text-xl font-semibold flex items-center">
            {t('orphan.certificates.addTitle')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t('orphan.certificates.addDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Certificate Details Section */}
            <div className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-slate-50 shadow-sm border-blue-200 transition-all duration-300 hover:shadow-md">
              <h3 className="text-blue-700 font-medium mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block mr-2"></span>
                {t('orphan.certificates.detailsTitle')}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                {/* Certificate Type */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certificateType" className="text-right col-span-1 text-blue-800">
                    {t('orphan.certificates.type')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Select value={certificateType} onValueChange={setCertificateType} required>
                      <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl">
                        <SelectValue placeholder={t('orphan.certificates.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIRTH_CERTIFICATE">{t('orphan.certificates.birthCertificate')}</SelectItem>
                        <SelectItem value="EDUCATION_CERTIFICATE">{t('orphan.certificates.educationCertificate')}</SelectItem>
                        <SelectItem value="MEDICAL_CERTIFICATE">{t('orphan.certificates.medicalCertificate')}</SelectItem>
                        <SelectItem value="OTHER">{t('orphan.certificates.otherCertificate')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Issue Date */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="issueDate" className="text-right col-span-1 text-blue-800">
                    {t('orphan.certificates.issueDate')}
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                {/* Certificate File */}
                <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
                  <Label htmlFor="certificateFile" className="text-right col-span-1 text-blue-800">
                    {t('orphan.certificates.file')} <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="certificateFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('orphan.certificates.fileDescription')}</p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="grid grid-cols-4 items-center gap-4 md:col-span-2">
                  <Label htmlFor="description" className="text-right col-span-1 text-blue-800">
                    {t('orphan.certificates.description')}
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                    placeholder={t('orphan.certificates.descriptionPlaceholder')}
                  />
                </div>
              </div>
            </div>
            
            {/* Footer with action buttons */}
            <DialogFooter className="pt-4 pb-2 border-t border-blue-100 mt-4 bg-blue-50 bg-opacity-50 rounded-b-xl">
              <div className="w-full flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {t('orphan.certificates.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('orphan.certificates.saving') : t('orphan.certificates.save')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
