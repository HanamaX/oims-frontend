"use client"

import { useState, useEffect } from "react"
import API from "@/lib/api-service"
import { OrphanDetails, AcademicRecord, MedicalRecord } from "@/lib/orphan-types"

export function useOrphanData(orphanId: string) {
  const [orphan, setOrphan] = useState<OrphanDetails | null>(null)
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState({
    details: true,
    academic: false,
    medical: false
  })
  const [error, setError] = useState({
    details: null as string | null,
    academic: null as string | null,
    medical: null as string | null
  })

  // Fetch orphan details
  useEffect(() => {
    const fetchOrphanDetails = async () => {
      setLoading(prev => ({ ...prev, details: true }))
      try {
        const response = await API.get(`/app/oims/orphans/orphan/${orphanId}`)
        if (response.data?.data) {
          setOrphan(response.data.data)
        } else {
          setError(prev => ({ ...prev, details: "No orphan details found" }))
        }
      } catch (err: any) {
        console.error("Failed to fetch orphan details:", err)
        setError(prev => ({ ...prev, details: err.message ?? "Failed to fetch orphan details" }))
      } finally {
        setLoading(prev => ({ ...prev, details: false }))
      }
    }

    fetchOrphanDetails()
  }, [orphanId])

  // Fetch academic records
  const fetchAcademicRecords = async () => {
    if (academicRecords.length > 0) return // Don't fetch if already loaded
    
    setLoading(prev => ({ ...prev, academic: true }))
    try {
      const response = await API.get(`/app/oims/orphans/academic/records/summary/${orphanId}`)
      if (response.data?.data) {
        setAcademicRecords(response.data.data)
      } else {
        setError(prev => ({ ...prev, academic: "No academic records found" }))
        setAcademicRecords([])
      }
    } catch (err: any) {
      console.error("Failed to fetch academic records:", err)
      setError(prev => ({ ...prev, academic: err.message ?? "Failed to fetch academic records" }))
      setAcademicRecords([])
    } finally {
      setLoading(prev => ({ ...prev, academic: false }))
    }
  }

  // Fetch medical records
  const fetchMedicalRecords = async () => {
    if (medicalRecords.length > 0) return // Don't fetch if already loaded
    
    setLoading(prev => ({ ...prev, medical: true }))
    try {
      const response = await API.get(`/app/oims/orphans/medical/records/summary/${orphanId}`)
      if (response.data?.data) {
        setMedicalRecords(response.data.data)
      } else {
        setError(prev => ({ ...prev, medical: "No medical records found" }))
        setMedicalRecords([])
      }
    } catch (err: any) {
      console.error("Failed to fetch medical records:", err)
      setError(prev => ({ ...prev, medical: err.message ?? "Failed to fetch medical records" }))
      setMedicalRecords([])
    } finally {
      setLoading(prev => ({ ...prev, medical: false }))
    }
  }

  // Reset error states
  const retryAcademic = () => {
    setError(prev => ({ ...prev, academic: null }))
    fetchAcademicRecords()
  }

  const retryMedical = () => {
    setError(prev => ({ ...prev, medical: null }))
    fetchMedicalRecords()
  }

  return {
    orphan,
    academicRecords,
    medicalRecords,
    loading,
    error,
    fetchAcademicRecords,
    fetchMedicalRecords,
    retryAcademic,
    retryMedical
  }
}