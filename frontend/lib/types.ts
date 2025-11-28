// Shelter Types
export type Shelter = {
  id: string
  name: string
  address: string
  capacity: number
  occupied: number
  phone?: string
  notes?: string
  createdAt?: string
  // Backend fields (for API compatibility)
  shelter_id?: number
  available_beds?: number
  geo_lat?: number
  geo_lng?: number
  amenities?: string
}

// Job Types
export type Job = {
  id: string
  title: string
  employer: string
  location: string
  type: string
  wage: string
  description: string
  createdAt?: string
  // Backend fields (for API compatibility)
  job_id?: number
  organization?: string
  requirements?: string
  salary?: string
  skills_required?: string
  geo_lat?: number
  geo_lng?: number
}

// Medical Records Types
export type MedicalRecord = {
  id: string
  residentId: string
  residentName: string
  date: string // ISO
  diagnosis: string
  doctor?: string
  notes?: string
  followUpDate?: string | null
}

export type MedicalFollowup = {
  id: string
  recordId: string
  residentId: string
  residentName?: string
  shelterId: string
  date: string
  notes?: string
  completed: boolean
}

// Shelter Auth Types
export type ShelterSession = {
  token: string
  role: 'Shelter'
  name: string
  email: string
  shelterId: string
}

// Shelter Dashboard Types
export type BedStats = {
  shelterId: string
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
}

export type PendingRequestSummary = {
  id: string
  residentName: string
  priority: 'High' | 'Medium' | 'Low'
  requestedAt: string
}

export type AdmissionItem = {
  id: string
  residentName: string
  admittedAt: string
}

export type DischargeItem = {
  id: string
  residentName: string
  dischargeDate: string
}

// Assignment Request Types
export type AssignmentRequest = {
  id: string
  shelterId: string
  ngoProfileId: string
  residentName: string
  age: number
  gender: string
  reason: string
  priority: 'High' | 'Medium' | 'Low'
  createdAt: string
}

// Shelter Resident Types
export type ShelterResident = {
  id: string
  shelterId: string
  ngoProfileId?: string | null
  name: string
  alias?: string
  age?: number
  gender?: string
  photoUrl?: string | null  // Legacy field for URL-based photos
  photo?: string | null     // Base64 encoded image for walk-in residents
  admittedAt: string
  bedNumber?: string | null
  medicalSummary?: string
  notes?: string            // Intake notes for walk-in residents
  health?: string
  skills?: string
  needs?: string
}

export type DailyLog = {
  id: string
  residentId: string
  shelterId: string
  createdAt: string
  note: string
  createdBy?: string
  attachments?: string[]
}
