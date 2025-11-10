'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Layout/Navbar'
import Sidebar from '@/components/Layout/Sidebar'
import InteractiveMap from '@/components/Maps/InteractiveMap'
import { MapPin, RefreshCw } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

export default function MapPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [locations, setLocations] = useState<any[]>([])
  const [volunteerLocation, setVolunteerLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Get volunteer's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setVolunteerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    // Fetch initial data
    fetchLocations()

    // Setup WebSocket for real-time updates
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'
    const newSocket = io(WS_URL)

    newSocket.on('connect', () => {
      console.log('Connected to real-time updates')
    })

    newSocket.on('location_update', (data: any) => {
      handleLocationUpdate(data)
    })

    newSocket.on('capacity_update', (data: any) => {
      handleCapacityUpdate(data)
    })

    newSocket.on('new_individual', (data: any) => {
      handleNewIndividual(data)
      toast.success(`New individual registered: ${data.name}`)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const fetchLocations = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLocations(mockLocations)
    } catch (error) {
      toast.error('Failed to load locations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationUpdate = (data: any) => {
    setLocations(prev => {
      const index = prev.findIndex(l => l.id === data.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...updated[index], ...data }
        return updated
      }
      return prev
    })
  }

  const handleCapacityUpdate = (data: any) => {
    setLocations(prev => {
      const index = prev.findIndex(l => l.id === data.shelter_id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          capacity: data.capacity
        }
        return updated
      }
      return prev
    })
    toast.info(`Shelter capacity updated`)
  }

  const handleNewIndividual = (data: any) => {
    const newLocation = {
      id: data.id,
      type: 'individual',
      name: data.name,
      position: { lat: data.location.lat, lng: data.location.lon },
      priority: data.priority || 'medium',
      details: data,
    }
    setLocations(prev => [...prev, newLocation])
  }

  const handleLocationClick = (location: any) => {
    console.log('Location clicked:', location)
    // Handle location click - could open details panel, etc.
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64">
          <Navbar />
          <main className="p-4 md:p-6 lg:p-8">
            <div className="card text-center py-12">
              <div className="spinner mx-auto mb-4" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar />
        
        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Interactive Map
                </h1>
                <p className="text-gray-600">
                  Real-time view of individuals, shelters, and resources
                </p>
              </div>
            </div>

            <button
              onClick={fetchLocations}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Map */}
          <InteractiveMap
            locations={locations}
            onLocationClick={handleLocationClick}
            showRouting={true}
            volunteerLocation={volunteerLocation || undefined}
          />

          {/* Legend */}
          <div className="card mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Map Legend</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Individuals</p>
                  <p className="text-xs text-gray-600">Color by priority</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Shelters</p>
                  <p className="text-xs text-gray-600">Number shows capacity</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Job Centers</p>
                  <p className="text-xs text-gray-600">Employment opportunities</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Training</p>
                  <p className="text-xs text-gray-600">Skills development</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Mock data
const mockLocations = [
  {
    id: 'ind_1',
    type: 'individual',
    name: 'John Doe',
    position: { lat: 40.7580, lng: -73.9855 },
    priority: 'high',
    details: { age: 35, needs: ['shelter', 'medical'] },
  },
  {
    id: 'ind_2',
    type: 'individual',
    name: 'Jane Smith',
    position: { lat: 40.7489, lng: -73.9680 },
    priority: 'critical',
    details: { age: 28, needs: ['shelter', 'food'] },
  },
  {
    id: 'shelter_1',
    type: 'shelter',
    name: 'Hope Shelter',
    position: { lat: 40.7614, lng: -73.9776 },
    capacity: { available: 15, total: 50 },
    details: { amenities: ['meals', 'medical', 'showers'] },
  },
  {
    id: 'shelter_2',
    type: 'shelter',
    name: 'Community Haven',
    position: { lat: 40.7282, lng: -73.9942 },
    capacity: { available: 8, total: 30 },
    details: { amenities: ['meals', 'counseling'] },
  },
  {
    id: 'job_1',
    type: 'job',
    name: 'Employment Center',
    position: { lat: 40.7350, lng: -74.0020 },
    details: { openings: 12 },
  },
  {
    id: 'training_1',
    type: 'training',
    name: 'Skills Training Center',
    position: { lat: 40.7450, lng: -73.9800 },
    details: { programs: ['IT', 'Construction', 'Culinary'] },
  },
]
