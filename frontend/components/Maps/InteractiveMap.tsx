'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer, MarkerClusterer } from '@react-google-maps/api'
import { Filter, Navigation, Layers, Route as RouteIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface MapLocation {
  id: string
  type: 'individual' | 'shelter' | 'job' | 'training'
  name: string
  position: { lat: number; lng: number }
  priority?: 'low' | 'medium' | 'high' | 'critical'
  capacity?: { available: number; total: number }
  details: any
}

interface Props {
  center?: { lat: number; lng: number }
  zoom?: number
  locations: MapLocation[]
  onLocationClick?: (location: MapLocation) => void
  showRouting?: boolean
  volunteerLocation?: { lat: number; lng: number }
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
}

// Custom marker icons
const markerIcons = {
  individual: {
    low: '/markers/person-blue.png',
    medium: '/markers/person-yellow.png',
    high: '/markers/person-orange.png',
    critical: '/markers/person-red.png',
  },
  shelter: '/markers/shelter-blue.png',
  job: '/markers/job-green.png',
  training: '/markers/training-yellow.png',
}

export default function InteractiveMap({
  center = defaultCenter,
  zoom = 12,
  locations,
  onLocationClick,
  showRouting = false,
  volunteerLocation,
}: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry'],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [filters, setFilters] = useState({
    individuals: true,
    shelters: true,
    jobs: true,
    training: true,
  })
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null)
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Filter locations based on active filters
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      if (location.type === 'individual' && !filters.individuals) return false
      if (location.type === 'shelter' && !filters.shelters) return false
      if (location.type === 'job' && !filters.jobs) return false
      if (location.type === 'training' && !filters.training) return false
      return true
    })
  }, [locations, filters])

  // Get marker icon based on type and priority
  const getMarkerIcon = (location: MapLocation) => {
    if (location.type === 'individual' && location.priority) {
      return {
        url: markerIcons.individual[location.priority],
        scaledSize: new google.maps.Size(32, 32),
      }
    }
    
    const iconUrl = markerIcons[location.type]
    return {
      url: iconUrl,
      scaledSize: new google.maps.Size(32, 32),
    }
  }

  // Calculate route
  const calculateRoute = useCallback(async (destination: MapLocation) => {
    if (!volunteerLocation || !window.google) return

    const directionsService = new google.maps.DirectionsService()

    try {
      const result = await directionsService.route({
        origin: volunteerLocation,
        destination: destination.position,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: showAlternativeRoutes,
      })

      setDirections(result)
      
      const route = result.routes[0]
      const leg = route.legs[0]
      setRouteInfo({
        distance: leg.distance?.text || '',
        duration: leg.duration?.text || '',
      })

      toast.success('Route calculated')
    } catch (error) {
      toast.error('Failed to calculate route')
      console.error(error)
    }
  }, [volunteerLocation, showAlternativeRoutes])

  // Handle marker click
  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location)
    if (onLocationClick) {
      onLocationClick(location)
    }
  }

  // Handle search
  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref)
  }

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces()
      if (places && places.length > 0) {
        const place = places[0]
        if (place.geometry?.location && map) {
          map.panTo(place.geometry.location)
          map.setZoom(15)
        }
      }
    }
  }

  // Get marker label for capacity
  const getMarkerLabel = (location: MapLocation): google.maps.MarkerLabel | undefined => {
    if (location.type === 'shelter' && location.capacity) {
      return {
        text: location.capacity.available.toString(),
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
      }
    }
    return undefined
  }

  if (loadError) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">Error loading maps</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="card text-center py-12">
        <div className="spinner mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Filter Toggles */}
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-md">
          <Filter className="w-4 h-4 text-gray-600" />
          <button
            onClick={() => setFilters({ ...filters, individuals: !filters.individuals })}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filters.individuals
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Individuals
          </button>
          <button
            onClick={() => setFilters({ ...filters, shelters: !filters.shelters })}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filters.shelters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setFilters({ ...filters, jobs: !filters.jobs })}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filters.jobs
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setFilters({ ...filters, training: !filters.training })}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filters.training
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Training
          </button>
        </div>

        {/* Routing Controls */}
        {showRouting && volunteerLocation && (
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-md">
            <RouteIcon className="w-4 h-4 text-gray-600" />
            <button
              onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showAlternativeRoutes
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Alternative Routes
            </button>
            {directions && (
              <button
                onClick={() => {
                  setDirections(null)
                  setRouteInfo(null)
                }}
                className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-700"
              >
                Clear Route
              </button>
            )}
          </div>
        )}

        {/* Route Info */}
        {routeInfo && (
          <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {routeInfo.distance} • {routeInfo.duration}
            </span>
          </div>
        )}

        {/* Legend */}
        <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
          <Layers className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Volunteer Location */}
          {volunteerLocation && (
            <Marker
              position={volunteerLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#2563eb',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
              title="Your Location"
            />
          )}

          {/* Clustered Markers */}
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.position}
                    onClick={() => handleMarkerClick(location)}
                    icon={getMarkerIcon(location)}
                    label={getMarkerLabel(location)}
                    clusterer={clusterer}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>

          {/* Info Window */}
          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.position}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">
                  {selectedLocation.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {selectedLocation.type}
                </p>
                
                {selectedLocation.capacity && (
                  <p className="text-sm mb-3">
                    <span className="font-medium">Available:</span>{' '}
                    <span className={selectedLocation.capacity.available > 10 ? 'text-green-600' : 'text-red-600'}>
                      {selectedLocation.capacity.available} / {selectedLocation.capacity.total}
                    </span>
                  </p>
                )}

                {selectedLocation.priority && (
                  <p className="text-sm mb-3">
                    <span className="font-medium">Priority:</span>{' '}
                    <span className={`capitalize ${
                      selectedLocation.priority === 'critical' ? 'text-red-600' :
                      selectedLocation.priority === 'high' ? 'text-orange-600' :
                      selectedLocation.priority === 'medium' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {selectedLocation.priority}
                    </span>
                  </p>
                )}

                <div className="flex gap-2">
                  {showRouting && volunteerLocation && (
                    <button
                      onClick={() => calculateRoute(selectedLocation)}
                      className="btn btn-primary text-xs py-1 px-3 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.position.lat},${selectedLocation.position.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs py-1 px-3"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#2563eb',
                  strokeWeight: 5,
                  strokeOpacity: 0.7,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">
            {locations.filter(l => l.type === 'individual').length}
          </p>
          <p className="text-sm text-gray-600">Individuals</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">
            {locations.filter(l => l.type === 'shelter').length}
          </p>
          <p className="text-sm text-gray-600">Shelters</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {locations.filter(l => l.type === 'job').length}
          </p>
          <p className="text-sm text-gray-600">Jobs</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {locations.filter(l => l.type === 'training').length}
          </p>
          <p className="text-sm text-gray-600">Training</p>
        </div>
      </div>
    </div>
  )
}
