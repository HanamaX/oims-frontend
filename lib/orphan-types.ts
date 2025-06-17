// Define shared types for orphan-related components

export interface Guardian {
  publicId?: string
  name: string
  relationship: string
  contactNumber: string
  sex?: string
  email: string
  address: string
  occupation: string
  orphanPublicId?: string
  imageUrl?: string | null
}

export interface OrphanDetails {
  publicId: string
  fullName: string
  imageUrl: string | null
  dateOfBirth: string
  origin: string
  adoptionReason: string
  religion: string
  gender: string
  bloodGroup: string
  allergies: string[]
  medicalHistory: string
  specialNeeds: string
  hobbies: string
  educationLevel: string
  previousSchoolName: string | null
  currentSchoolName: string | null
  age: number
  branchPublicId: string
  branchName: string
  guardian: Guardian | null
  status?: string
}

export interface AcademicSubject {
  publicId?: string
  name: string
  code?: string
  grade: string
  remarks?: string
}

export interface AcademicRecord {
  publicId: string
  schoolName: string
  gradeLevel: string
  semester: string
  grade?: string
  year?: string
  subjects?: AcademicSubject[]
  createdAt?: string
}

export interface AcademicRecordDetail {
  publicId: string
  schoolName: string
  gradeLevel: string
  semester: string
  subjects: AcademicSubject[]
}

export interface MedicalRecord {
  publicId: string
  diagnosis: string
  hospitalName: string
  treatment?: string
  visitDate?: string
  followUpDate?: string | null
  notes?: string
  createdAt: string
}

export interface MedicalRecordDetail {
  publicId: string
  diagnosis: string
  treatment: string
  description?: string
  doctorName?: string
  hospitalName: string
  hospitalAddress?: string
  hospitalPhoneNumber?: string
  createdAt: string
}

// For the list view
export interface Orphan {
  publicId: string
  fullName: string
  createdAt: string
  educationLevel: string
  age: number
  imageUrl: string | null
  branchPublicId: string
  branchName: string
  status?: string
}