"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Eye } from "lucide-react"
import MedicalRecordForm from "@/components/medical-record-form"
import MedicalRecordDetails from "@/components/medical-record-details"
import { MedicalRecord, MedicalRecordDetail } from "@/lib/orphan-types"
import Image from "next/image"
import API from "@/lib/api-service"
import { useLanguage } from "@/contexts/LanguageContext"

interface MedicalTabProps {
  readonly orphanId: string
  readonly records: MedicalRecord[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly onRetry: () => void
  readonly fetchRecords: () => void
  readonly readOnly?: boolean
}

export default function OrphanMedicalTab({
  orphanId,
  records,
  isLoading,
  error,
  onRetry,
  fetchRecords,
  readOnly = false
}: Readonly<MedicalTabProps>) {
  const { t } = useLanguage()
  
  // UI state
  const [showForm, setShowForm] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  
  // Data state
  const [orphanImage, setOrphanImage] = useState<string | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [recordDetail, setRecordDetail] = useState<MedicalRecordDetail | null>(null)

  // Fetch orphan image when component mounts
  useEffect(() => {
    const fetchOrphanDetails = async () => {
      try {
        const response = await API.get(`/app/oims/orphans/orphan/${orphanId}`)
        if (response.data?.data?.imageUrl) {
          setOrphanImage(response.data.data.imageUrl)
        }
      } catch (err) {
        console.error("Failed to fetch orphan image:", err)
      }
    }
    
    fetchOrphanDetails()
  }, [orphanId])

  // Fetch medical record details when editing record changes
  useEffect(() => {
    if (!editingRecord?.publicId) {
      setRecordDetail(null)
      return
    }

    const fetchRecordDetail = async () => {
      setLoadingDetail(true)
      try {
        const response = await API.get(`/app/oims/orphans/medical/records/${editingRecord.publicId}`)
        if (response.data?.data) {
          setRecordDetail(response.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch medical record details:", err)
      } finally {
        setLoadingDetail(false)
      }
    }
    
    fetchRecordDetail()
  }, [editingRecord])

  // Reset form handlers
  const handleFormClose = () => {
    setShowForm(false)
    setEditingRecord(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchRecords()
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>{t('orphan.medical.loadingRecords')}</p>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
        >
          {t('orphan.medical.tryAgain')}
        </Button>
      </div>
    )
  }

  // Render loading state when fetching record details for editing
  if (editingRecord && !recordDetail && loadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>{t('orphan.medical.loadingDetails')}</p>
      </div>
    )
  }
  
  // Render form for adding or editing record
  if (showForm || editingRecord) {
    return (
      <MedicalRecordForm 
        orphanId={orphanId}
        record={recordDetail ?? undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormClose}
      />
    )
  }

  // Render empty state
  if (records.length === 0) {
    return (
      <Card className="border-blue-100 dark:border-blue-800 shadow-sm">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <CardTitle className="text-blue-700 dark:text-blue-300">{t('orphan.medical.records')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="mb-2">
            <span className="text-blue-600 font-medium dark:text-blue-300 px-2 py-1 mr-2 inline-block min-w-[120px]">{t('orphan.medical.status')}</span>
            <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{t('orphan.medical.noRecords')}</span>
          </div>
          {!readOnly && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 mt-4" 
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('orphan.medical.addRecord')}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Render list of records
  return (
    <div className="space-y-6">
      {selectedRecordId && (
        <MedicalRecordDetails
          recordId={selectedRecordId}
          isOpen={!!selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
          onRecordUpdated={fetchRecords}
          readOnly={readOnly}
        />
      )}
      
      {!readOnly && (
        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            {t('orphan.medical.addNewRecord')}
          </Button>
        </div>
      )}
      
      {records.map((record) => (
        <Card key={record.publicId || `medical-${record.diagnosis}`} className="mb-4 border-blue-100 dark:border-blue-800 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Image column - only shown on medium screens and above */}
            {orphanImage && (
              <div className="hidden md:block w-[100px] h-[100px] overflow-hidden relative m-4">
                <Image 
                  src={orphanImage}
                  alt="Orphan"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-700 dark:text-blue-300">{record.diagnosis}</CardTitle>
                  <Badge variant="outline" className="ml-2 bg-blue-100 dark:bg-blue-800/50 border-blue-200 dark:border-blue-700">
                    {record.createdAt ? new Date(record.createdAt.replace(" ", "T")).toLocaleDateString() : "No date"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center mt-2">
                  <span className="text-blue-600 font-medium dark:text-blue-300 px-2 py-1 min-w-[120px] mr-2">{t('orphan.medical.hospital')}</span>
                  <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1">{record.hospitalName}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                {/* On mobile, show the image at the top of content area */}
                {orphanImage && (
                  <div className="md:hidden w-full h-[120px] overflow-hidden relative mb-4">
                    <Image 
                      src={orphanImage}
                      alt="Orphan"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    {record.treatment && (
                      <div className="mb-2">
                        <span className="text-blue-600 font-medium dark:text-blue-300 px-2 py-1 mr-2 inline-block min-w-[120px]">{t('orphan.medical.treatment')}</span>
                        <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.treatment}</span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="mb-2">
                        <span className="text-blue-600 font-medium dark:text-blue-300 px-2 py-1 mr-2 inline-block min-w-[120px]">{t('orphan.medical.notes')}</span>
                        <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{record.notes}</span>
                      </div>
                    )}
                    
                    {record.followUpDate && (
                      <div className="mb-2">
                        <span className="text-blue-600 font-medium dark:text-blue-300 px-2 py-1 mr-2 inline-block min-w-[120px]">{t('orphan.medical.followUpDate')}</span>
                        <span className="bg-gray-50 dark:bg-gray-800/30 px-3 py-1 inline-block">{new Date(record.followUpDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="sm:self-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                      onClick={() => setSelectedRecordId(record.publicId)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {t('orphan.medical.viewDetails')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
