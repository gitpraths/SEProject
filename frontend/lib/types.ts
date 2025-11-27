/**
 * Type Definitions
 * INTEGRATION: Types for frontend-backend communication
 */

export interface Match {
  id: number
  profileId: number
  profileName: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  recommendations: Recommendation[]
}

export interface Recommendation {
  id: string
  type: 'Shelter' | 'Job' | 'Medical' | 'Training'
  name: string
  score: number
  reason: string
}

export interface Shelter {
  id: string
  shelter_id?: number
  name: string
  address: string
  capacity: number
  occupied: number
  phone?: string
  notes?: string
  geo_lat?: number
  geo_lng?: number
  amenities?: string
  available_beds?: number
}

export interface Job {
  id: string
  job_id?: number
  title: string
  organization: string
  location: string
  skills_required?: string
  salary?: string
  type?: string
  description?: string
  geo_lat?: number
  geo_lng?: number
}
