import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle Flask response format
    this.client.interceptors.response.use(
      (response) => {
        // Flask returns data in response.data format
        return response.data
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          const { status, data } = error.response

          if (status === 401) {
            // Unauthorized - redirect to login
            this.clearToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          } else if (status === 403) {
            // Forbidden
            console.error('Access denied:', data?.message)
          } else if (status === 422) {
            // Validation error (Flask-specific)
            console.error('Validation error:', data?.errors)
          } else if (status >= 500) {
            // Server error
            console.error('Server error:', data?.message)
          }

          return Promise.reject({
            message: data?.message || 'An error occurred',
            errors: data?.errors,
            status,
          } as ApiError)
        } else if (error.request) {
          // Network error
          console.error('Network error - backend not reachable')
          return Promise.reject({
            message: 'Network error. Please check your connection.',
            status: 0,
          } as ApiError)
        } else {
          return Promise.reject({
            message: error.message || 'An error occurred',
          } as ApiError)
        }
      }
    )
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  // Retry logic for failed requests
  async retryRequest<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0) throw error
      await new Promise((resolve) => setTimeout(resolve, delay))
      return this.retryRequest(fn, retries - 1, delay * 2)
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async login(credentials: { email: string; password: string }) {
    return this.client.post<ApiResponse>('/auth/login', credentials)
  }

  async register(userData: any) {
    return this.client.post<ApiResponse>('/auth/register', userData)
  }

  async logout() {
    return this.client.post<ApiResponse>('/auth/logout')
  }

  async getCurrentUser() {
    return this.client.get<ApiResponse>('/auth/me')
  }

  // ==========================================
  // INDIVIDUALS
  // ==========================================
  async getAllIndividuals(params?: { page?: number; limit?: number; search?: string }) {
    return this.client.get<ApiResponse<PaginatedResponse<any>>>('/individuals', { params })
  }

  async getIndividualById(id: string | number) {
    return this.client.get<ApiResponse>(`/individuals/${id}`)
  }

  async createIndividual(data: any) {
    return this.client.post<ApiResponse>('/individuals', data)
  }

  async updateIndividual(id: string | number, data: any) {
    return this.client.put<ApiResponse>(`/individuals/${id}`, data)
  }

  async deleteIndividual(id: string | number) {
    return this.client.delete<ApiResponse>(`/individuals/${id}`)
  }

  async searchIndividuals(query: string) {
    return this.client.get<ApiResponse>('/individuals/search', { params: { q: query } })
  }

  // ==========================================
  // SHELTERS
  // ==========================================
  async getAllShelters() {
    return this.client.get<ApiResponse>('/shelters')
  }

  async getAvailableShelters() {
    return this.client.get<ApiResponse>('/shelters/available')
  }

  async getShelterById(id: string | number) {
    return this.client.get<ApiResponse>(`/shelters/${id}`)
  }

  async updateShelterCapacity(id: string | number, data: { available_beds: number }) {
    return this.client.patch<ApiResponse>(`/shelters/${id}/capacity`, data)
  }

  // ==========================================
  // JOBS
  // ==========================================
  async getAllJobs(params?: { page?: number; limit?: number; category?: string }) {
    return this.client.get<ApiResponse<PaginatedResponse<any>>>('/jobs', { params })
  }

  async getJobById(id: string | number) {
    return this.client.get<ApiResponse>(`/jobs/${id}`)
  }

  async createJob(data: any) {
    return this.client.post<ApiResponse>('/jobs', data)
  }

  async applyForJob(jobId: string | number, individualId: string | number) {
    return this.client.post<ApiResponse>(`/jobs/${jobId}/apply`, { individual_id: individualId })
  }

  // ==========================================
  // AI RECOMMENDATIONS
  // ==========================================
  async getShelterRecommendations(individualId: string | number) {
    return this.client.post<ApiResponse>('/ai/recommend/shelter', { individual_id: individualId })
  }

  async getJobRecommendations(individualId: string | number) {
    return this.client.post<ApiResponse>('/ai/recommend/jobs', { individual_id: individualId })
  }

  async getTrainingRecommendations(individualId: string | number) {
    return this.client.post<ApiResponse>('/ai/recommend/training', { individual_id: individualId })
  }

  async analyzeNotes(text: string) {
    return this.client.post<ApiResponse>('/ai/analyze-notes', { text })
  }

  async getRiskScore(individualId: string | number) {
    return this.client.get<ApiResponse>(`/ai/risk-score/${individualId}`)
  }

  async chatWithBot(message: string, conversationId?: string | null) {
    return this.client.post<ApiResponse>('/ai/chatbot', { message, conversation_id: conversationId })
  }

  // ==========================================
  // ROUTE OPTIMIZATION
  // ==========================================
  async optimizeRoute(data: any) {
    return this.client.post<ApiResponse>('/routes/optimize', data)
  }

  async optimizeVolunteerRoutes(data: any) {
    return this.client.post<ApiResponse>('/routes/volunteer-optimization', data)
  }

  async scoreAccessibility(data: any) {
    return this.client.post<ApiResponse>('/routes/accessibility-score', data)
  }

  async suggestVisitTimes(data: any) {
    return this.client.post<ApiResponse>('/routes/visit-times', data)
  }

  async identifyServiceGaps(data: any) {
    return this.client.post<ApiResponse>('/routes/service-gaps', data)
  }

  // ==========================================
  // DOCUMENTS
  // ==========================================
  async uploadDocument(
    file: File,
    individualId: string | number,
    documentType: string = 'id_proof',
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('individual_id', String(individualId))
    formData.append('document_type', documentType)

    return this.client.post<ApiResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
  }

  async getDocumentsByIndividual(individualId: string | number) {
    return this.client.get<ApiResponse>(`/documents/individual/${individualId}`)
  }

  async deleteDocument(documentId: string | number) {
    return this.client.delete<ApiResponse>(`/documents/${documentId}`)
  }

  // ==========================================
  // ANALYTICS
  // ==========================================
  async getDashboardStats() {
    return this.client.get<ApiResponse>('/analytics/dashboard')
  }

  async getIndividualProgress(individualId: string | number) {
    return this.client.get<ApiResponse>(`/analytics/progress/${individualId}`)
  }

  async getSuccessMetrics(params?: any) {
    return this.client.get<ApiResponse>('/analytics/success-metrics', { params })
  }

  async exportReport(format: 'pdf' | 'csv' | 'excel' = 'pdf') {
    return this.client.get(`/analytics/export`, {
      params: { format },
      responseType: 'blob',
    })
  }

  // ==========================================
  // NEEDS ASSESSMENT
  // ==========================================
  async startQuestionnaire(data: any) {
    return this.client.post<ApiResponse>('/questionnaire/start', data)
  }

  async getNextQuestions(data: any) {
    return this.client.post<ApiResponse>('/questionnaire/next', data)
  }

  async getRiskAssessment(data: any) {
    return this.client.post<ApiResponse>('/risk-assessment', data)
  }

  // ==========================================
  // FEEDBACK
  // ==========================================
  async provideFeedback(data: any) {
    return this.client.post<ApiResponse>('/feedback', data)
  }

  async getStatistics() {
    return this.client.get<ApiResponse>('/statistics')
  }

  // ==========================================
  // GENERIC METHODS
  // ==========================================
  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config)
  }
}

export const api = new ApiClient()
export default api
