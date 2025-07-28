import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import MapComponent from '../components/Map/MapComponent'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../lib/translations'
import { getSpaces } from '../lib/supabase'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiMapPin, FiUsers, FiStar, FiHeart, FiFilter, FiRefreshCw, FiHome } = FiIcons

const MapSearchPage = () => {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mapBounds, setMapBounds] = useState(null)
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    spaceType: '',
  })

  const spaceTypes = [
    'Conference Room',
    'Wedding Venue',
    'Party Hall',
    'Coworking Space',
    'Art Gallery',
    'Outdoor Space',
    'Restaurant',
    'Theater',
    'Warehouse',
    'Rooftop'
  ]

  // Enhanced dummy coordinates with real US cities
  const cityCoordinates = [
    { lat: 40.7128, lng: -74.0060, city: 'New York, NY' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles, CA' },
    { lat: 41.8781, lng: -87.6298, city: 'Chicago, IL' },
    { lat: 29.7604, lng: -95.3698, city: 'Houston, TX' },
    { lat: 39.9526, lng: -75.1652, city: 'Philadelphia, PA' },
    { lat: 33.4484, lng: -112.0740, city: 'Phoenix, AZ' },
    { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX' },
    { lat: 37.7749, lng: -122.4194, city: 'San Francisco, CA' },
    { lat: 30.2672, lng: -97.7431, city: 'Austin, TX' },
    { lat: 39.7392, lng: -104.9903, city: 'Denver, CO' },
    { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' },
    { lat: 25.7617, lng: -80.1918, city: 'Miami, FL' },
    { lat: 42.3601, lng: -71.0589, city: 'Boston, MA' },
    { lat: 36.1627, lng: -86.7816, city: 'Nashville, TN' },
    { lat: 39.2904, lng: -76.6122, city: 'Baltimore, MD' }
  ]

  const fetchSpaces = useCallback(async () => {
    setLoading(true)
    try {
      const searchFilters = {}
      if (filters.location) {
        searchFilters.location = filters.location
      }
      if (filters.minPrice) {
        searchFilters.minPrice = parseInt(filters.minPrice)
      }
      if (filters.maxPrice) {
        searchFilters.maxPrice = parseInt(filters.maxPrice)
      }

      const { data, error } = await getSpaces(searchFilters)
      if (data && !error) {
        // Add realistic coordinates to each space
        const spacesWithCoordinates = data.map((space, index) => {
          const cityData = cityCoordinates[index % cityCoordinates.length]
          // Add a small random offset to prevent markers from stacking exactly
          const latOffset = (Math.random() - 0.5) * 0.1
          const lngOffset = (Math.random() - 0.5) * 0.1
          
          return {
            ...space,
            coordinates: {
              lat: cityData.lat + latOffset,
              lng: cityData.lng + lngOffset
            },
            location: space.location || cityData.city
          }
        })
        
        setSpaces(spacesWithCoordinates)
      } else {
        console.error('Error fetching spaces:', error)
      }
    } catch (error) {
      console.error('Error fetching spaces:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSpaceSelect = useCallback((spaceId) => {
    setSelectedSpace(spaceId)
  }, [])

  const handleMapMove = useCallback((bounds) => {
    setMapBounds(bounds)
  }, [])

  const searchThisArea = () => {
    // In a real implementation, this would filter spaces based on map bounds
    fetchSpaces()
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      spaceType: '',
    })
  }

  return (
    <>
      <Helmet>
        <title>{t('nav.mapSearch')} - EventsySpace</title>
        <meta name="description" content="Search for event spaces on a map. Find the perfect venue based on location, price, and amenities." />
      </Helmet>
      <div className="flex flex-col h-screen">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b p-4 z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('map.searchByLocation')}
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiFilter} />
                <span>{t('search.filters')}</span>
              </button>
              <button
                onClick={searchThisArea}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>{t('search.searchThisArea')}</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">{t('search.priceRange')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t('search.minCapacity')}</label>
                  <input
                    type="number"
                    placeholder="Number of guests"
                    value={filters.capacity}
                    onChange={(e) => handleFilterChange('capacity', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('search.spaceType')}</label>
                  <select
                    value={filters.spaceType}
                    onChange={(e) => handleFilterChange('spaceType', e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Types</option>
                    {spaceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('search.clearAll')} {t('search.filters')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content: Map + List */}
        <div className="flex flex-1 overflow-hidden">
          {/* List View */}
          <div className="w-full md:w-1/3 lg:w-2/5 overflow-y-auto p-4 border-r border-gray-200 bg-white">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? t('search.searching') : `${spaces.length} ${t('search.spacesFound')}`}
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-300"></div>
                      <div className="p-4 w-full">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiSearch} className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('search.noResults')}</h3>
                <p className="text-gray-600">{t('search.adjustFilters')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedSpace === space.id ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleSpaceSelect(space.id)}
                  >
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-200 relative flex-shrink-0">
                        {space.photos && space.photos[0] ? (
                          <img
                            src={space.photos[0].url}
                            alt={space.photos[0].alt_text || space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <SafeIcon icon={FiHome} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{space.title}</h3>
                          <div className="flex items-center space-x-1 text-sm">
                            <SafeIcon icon={FiStar} className="text-yellow-400" />
                            <span>
                              {space.reviews && space.reviews.length > 0
                                ? (space.reviews.reduce((sum, review) => sum + review.rating, 0) / space.reviews.length).toFixed(1)
                                : '5.0'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <SafeIcon icon={FiMapPin} className="text-xs mr-1" />
                          {space.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 font-semibold">
                            ${space.price_per_hour}/{t('common.hour')}
                          </span>
                          <Link
                            to={`/space/${space.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t('common.viewDetails')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map View */}
          <div className="hidden md:block md:w-2/3 lg:w-3/5 relative">
            <div className="absolute inset-0">
              <MapComponent
                spaces={spaces}
                selectedSpace={selectedSpace}
                onSpaceSelect={handleSpaceSelect}
                onMapMove={handleMapMove}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MapSearchPage