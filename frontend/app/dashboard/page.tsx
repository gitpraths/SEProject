'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      // Check for shelter session first
      const shelterSession = localStorage.getItem('shelter_session')
      if (shelterSession) {
        const session = JSON.parse(shelterSession)
        if (session.role === 'Shelter') {
          window.location.href = '/dashboard/shelter'
          return
        }
      }

      // Check regular session
      const session = JSON.parse(localStorage.getItem('session') || '{}')
      const role = session?.role || 'Volunteer'
      
      if (role === 'NGO') {
        window.location.href = '/dashboard/ngo'
      } else if (role === 'Admin') {
        window.location.href = '/dashboard/admin'
      } else if (role === 'Shelter') {
        window.location.href = '/dashboard/shelter'
      } else {
        window.location.href = '/dashboard/volunteer'
      }
    } catch (error) {
      console.error('Error reading session:', error)
      window.location.href = '/auth/login'
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber mx-auto mb-4"></div>
        <p className="text-brown dark:text-dark-muted">Loading dashboard...</p>
      </div>
    </div>
  )
}
