import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../lib/translations'
import { getSpaces } from '../lib/supabase'
import * as FiIcons from 'react-icons/fi'

const { FiFilter, FiMapPin, FiUsers, FiStar, FiHeart, FiGrid, FiList, FiSearch } = FiIcons

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    location: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    spaceType: '',
    amenities: []
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

  const amenities = [
    'WiFi',
    'Parking',
    'AV Equipment',
    'Catering',
    'Bar',
    'Kitchen',
    'Outdoor Space',
    'Air Conditioning',
    'Wheelchair Accessible',
    'Security'
  ]

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true)
      try {
        const searchFilters = {}
        if (filters.query) {
          searchFilters.location = filters.query
        }
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
          setSpaces(data)
        }
      } catch (error) {
        console.error('Error fetching spaces:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      spaceType: '',
      amenities: []
    })
    setSearchParams({})
  }

  return (
    <>
      <Helmet>
        <title>{t('search.searchSpaces')} - EventsySpace</title>
        <meta name="description" content="Find the perfect event space for your next gathering. Filter by location, price, capacity, and amenities." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('home.searchPlaceholder')}
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiFilter} />
                  <span>{t('search.filters')}</span>
                </button>

                <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={FiGrid} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={FiList} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{t('search.filters')}</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('search.clearAll')}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="form-label">{t('search.location')}</label>
                    <input
                      type="text"
                      placeholder="Enter city or area"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Price Range */}
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

                  {/* Capacity */}
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

                  {/* Space Type */}
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

                  {/* Amenities */}
                  <div>
                    <label className="form-label">{t('search.amenities')}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {amenities.map(amenity => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? t('search.searching') : `${spaces.length} ${t('search.spacesFound')}`}
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : spaces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiSearch} className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('search.noResults')}</h3>
                  <p className="text-gray-600 mb-6">{t('search.adjustFilters')}</p>
                  <button onClick={clearFilters} className="btn-primary">
                    {t('search.clearAll')} {t('search.filters')}
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                  {spaces.map((space, index) => (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {viewMode === 'grid' ? (
                        <Link
                          to={`/space/${space.id}`}
                          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="relative h-48">
                            {space.photos && space.photos[0] ? (
                              <img
                                src={space.photos[0].url}
                                alt={space.photos[0].alt_text || space.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                                <SafeIcon icon={FiMapPin} className="text-white text-4xl" />
                              </div>
                            )}
                            <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                              <SafeIcon icon={FiHeart} className="text-gray-600" />
                            </button>
                            <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                              <SafeIcon icon={FiStar} className="text-yellow-400 text-sm" />
                              <span className="text-sm font-medium">
                                {space.reviews && space.reviews.length > 0
                                  ? (space.reviews.reduce((sum, review) => sum + review.rating, 0) / space.reviews.length).toFixed(1)
                                  : '5.0'
                                }
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{space.title}</h3>
                            <p className="text-gray-600 mb-3 flex items-center">
                              <SafeIcon icon={FiMapPin} className="text-sm mr-1" />
                              {space.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-primary-600">
                                ${space.price_per_hour}/{t('common.hour')}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <SafeIcon icon={FiUsers} className="text-sm mr-1" />
                                {space.capacity} {t('common.guests')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to={`/space/${space.id}`}
                          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="flex">
                            <div className="w-64 h-48 flex-shrink-0">
                              {space.photos && space.photos[0] ? (
                                <img
                                  src={space.photos[0].url}
                                  alt={space.photos[0].alt_text || space.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                                  <SafeIcon icon={FiMapPin} className="text-white text-4xl" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">{space.title}</h3>
                                <button className="p-2 hover:bg-gray-50 rounded-full">
                                  <SafeIcon icon={FiHeart} className="text-gray-600" />
                                </button>
                              </div>
                              <p className="text-gray-600 mb-3 flex items-center">
                                <SafeIcon icon={FiMapPin} className="text-sm mr-1" />
                                {space.location}
                              </p>
                              <p className="text-gray-700 mb-4 line-clamp-2">{space.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span className="text-2xl font-bold text-primary-600">
                                    ${space.price_per_hour}/{t('common.hour')}
                                  </span>
                                  <span className="text-gray-500 flex items-center">
                                    <SafeIcon icon={FiUsers} className="text-sm mr-1" />
                                    {space.capacity} {t('common.guests')}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <SafeIcon icon={FiStar} className="text-yellow-400" />
                                  <span className="font-medium">
                                    {space.reviews && space.reviews.length > 0
                                      ? (space.reviews.reduce((sum, review) => sum + review.rating, 0) / space.reviews.length).toFixed(1)
                                      : '5.0'
                                    }
                                  </span>
                                  <span className="text-gray-500">
                                    ({space.reviews ? space.reviews.length : 0})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchPage