/**
 * API Service Layer
 * Handles all communication between frontend and backend
 * 
 * INTEGRATION NOTE: This file connects the Next.js frontend with the Node.js backend
 * and GPU-accelerated AI service for homeless aid recommendations
 */

const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).ENV?.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  : 'http://localhost:5000'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get auth token from session
 * INTEGRATION: Uses localStorage session for authentication
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('session')
  if (!session) return null
  try {
    const user = JSON.parse(session)
    return user.token || null
  } catch {
    return null
  }
}

/**
 * Make authenticated API request
 * INTEGRATION: Adds JWT token to all requests
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Merge with any existing headers
  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============================================
// PROFILE API
// ============================================

export interface CreateProfileData {
  name: string
  alias?: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  location?: {
    lat: number
    lng: number
  }
  locationName?: string
  health?: string
  disabilities?: string
  skills?: string
  workHistory?: string
  needs: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
}

export interface Profile extends CreateProfileData {
  profile_id: number
  registered_by: number
  createdAt: string
  updatedAt: string
  // AI-enhanced fields
  geo_lat?: number
  geo_lng?: number
  employment_status?: string
  duration_homeless?: string
  current_situation?: string
}

/**
 * Create a new homeless profile
 * INTEGRATION: Saves to PostgreSQL and triggers AI analysis
 */
export async function createProfile(data: CreateProfileData): Promise<Profile> {
  return apiRequest<Profile>('/profiles', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      // Map frontend fields to backend fields
      geo_lat: data.location?.lat,
      geo_lng: data.location?.lng,
      location: data.locationName,
      health_status: data.health,
      education: 'Unknown', // Can be added to form later
    }),
  })
}

/**
 * Get all profiles
 * INTEGRATION: Fetches from PostgreSQL
 */
export async function getProfiles(): Promise<Profile[]> {
  return apiRequest<Profile[]>('/profiles')
}

/**
 * Get single profile by ID
 * INTEGRATION: Fetches from PostgreSQL with AI analysis data
 */
export async function getProfile(id: number): Promise<Profile> {
  return apiRequest<Profile>(`/profiles/${id}`)
}

// ============================================
// AI RECOMMENDATIONS API
// ============================================

export interface AIRecommendation {
  resource_id: string
  resource_name: string
  resource_type: string
  score: number
  explanation: {
    location_score: number
    skill_match_score: number
    availability_score: number
    priority_score: number
    historical_score: number
  }
  resource_details: any
}

export interface AIRecommendationsResponse {
  profile_id: number
  profile_name: string
  recommendations: AIRecommendation[]
  total_shelters_analyzed?: number
  total_jobs_analyzed?: number
}

/**
 * Get AI-powered shelter recommendations for a profile
 * INTEGRATION: Calls GPU-accelerated AI service via backend
 * Uses location-based matching, availability, and historical success rates
 */
export async function getShelterRecommendations(
  profileId: number,
  topK: number = 5
): Promise<AIRecommendationsResponse> {
  return apiRequest<AIRecommendationsResponse>(
    `/ai/recommendations/shelters/${profileId}?top_k=${topK}`
  )
}

/**
 * Get AI-powered job recommendations for a profile
 * INTEGRATION: Calls GPU-accelerated AI service via backend
 * Uses skill matching, location, and work history
 */
export async function getJobRecommendations(
  profileId: number,
  topK: number = 5
): Promise<AIRecommendationsResponse> {
  return apiRequest<AIRecommendationsResponse>(
    `/ai/recommendations/jobs/${profileId}?top_k=${topK}`
  )
}

/**
 * Analyze volunteer notes using NLP
 * INTEGRATION: Uses GPU-accelerated NLP models to extract:
 * - Skills mentioned
 * - Health concerns
 * - Urgency level
 * - Sentiment analysis
 */
export async function analyzeNotes(
  profileId: number,
  notes: string
): Promise<{
  profile_id: number
  analysis: {
    skills: string[]
    health_concerns: {
      mental?: string[]
      physical?: string[]
      substance?: string[]
    }
    urgency_level: string
    sentiment: {
      label: string
      score: number
      mental_health_risk: string
    }
    needs_categories: {
      immediate?: string[]
      short_term?: string[]
      long_term?: string[]
    }
  }
  profile_updated: boolean
}> {
  return apiRequest(`/ai/analyze/notes/${profileId}`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  })
}

/**
 * Get comprehensive risk assessment for a profile
 * INTEGRATION: Uses GPU-accelerated risk prediction models
 * Predicts:
 * - Job placement success likelihood
 * - Chronic homelessness risk
 * - Need for immediate intervention
 */
export async function getRiskAssessment(profileId: number): Promise<{
  profile_id: number
  profile_name: string
  risk_assessment: {
    job_placement: {
      probability: number
      risk_level: string
      factors: string[]
      recommendations: string[]
    }
    chronic_homelessness: {
      probability: number
      risk_level: string
      factors: string[]
      interventions: string[]
    }
    immediate_intervention: {
      requires_intervention: boolean
      urgency: string
      probability: number
      reasons: string[]
      immediate_actions: string[]
    }
    overall_risk_score: number
  }
}> {
  return apiRequest(`/ai/risk/assess/${profileId}`)
}

/**
 * Provide feedback on AI recommendations
 * INTEGRATION: Helps AI learn and improve over time
 * The MultiArmedBandit model uses this to optimize future recommendations
 */
export async function provideFeedback(data: {
  resource_type: 'shelter' | 'job' | 'training'
  resource_id: string
  success: boolean
  outcome_score?: number
}): Promise<{ message: string }> {
  return apiRequest('/ai/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get AI service statistics
 * INTEGRATION: Shows AI performance metrics and learning progress
 */
export async function getAIStatistics(): Promise<{
  ai_service: {
    bandit_stats: any
    epsilon: number
    device: string
  }
  database: {
    total_profiles: number
    total_shelters: number
    total_jobs: number
    total_recommendations: number
  }
}> {
  return apiRequest('/ai/statistics')
}

/**
 * Check AI service health
 * INTEGRATION: Verifies GPU-accelerated AI service is running
 */
export async function checkAIHealth(): Promise<{
  status: string
  service: string
}> {
  return apiRequest('/ai/health')
}

// ============================================
// SHELTERS API
// ============================================

export interface Shelter {
  shelter_id: number
  name: string
  address: string
  capacity: number
  available_beds: number
  geo_lat: number
  geo_lng: number
  amenities?: string
}

/**
 * Get all shelters
 * INTEGRATION: Fetches from PostgreSQL
 */
export async function getShelters(): Promise<Shelter[]> {
  return apiRequest<Shelter[]>('/shelters')
}

// ============================================
// JOBS API
// ============================================

export interface Job {
  job_id: number
  title: string
  skills_required: string
  location: string
  organization: string
  geo_lat?: number
  geo_lng?: number
}

/**
 * Get all jobs
 * INTEGRATION: Fetches from PostgreSQL
 */
export async function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>('/jobs')
}

// ============================================
// EXPORT ALL
// ============================================

export const api = {
  // Profiles
  createProfile,
  getProfiles,
  getProfile,
  
  // AI Recommendations
  getShelterRecommendations,
  getJobRecommendations,
  analyzeNotes,
  getRiskAssessment,
  provideFeedback,
  getAIStatistics,
  checkAIHealth,
  
  // Resources
  getShelters,
  getJobs,
}

export default api
