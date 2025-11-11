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
