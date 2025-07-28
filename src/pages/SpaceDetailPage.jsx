import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../contexts/AuthContext'
import { getSpace, createBooking } from '../lib/supabase'
import { calculateFees } from '../lib/stripe'
import * as FiIcons from 'react-icons/fi'

const { 
  FiMapPin, 
  FiUsers, 
  FiDollarSign, 
  FiStar, 
  FiHeart, 
  FiShare2, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiChevronLeft, 
  FiChevronRight, 
  FiMessageCircle,
  FiInfo,
  FiUser,
  FiChevronUp,
  FiChevronDown
} = FiIcons

const SpaceDetailPage = () => {
  const { spaceId } = useParams()
  const { user } = useAuth()
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const { data, error } = await getSpace(spaceId)
        if (data && !error) {
          setSpace(data)
        } else {
          toast.error('Failed to load space details')
        }
      } catch (error) {
        console.error('Error fetching space:', error)
        toast.error('An error occurred while fetching space details')
      } finally {
        setLoading(false)
      }
    }

    if (spaceId) {
      fetchSpace()
    }
  }, [spaceId])

  const nextImage = () => {
    if (space?.photos?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === space.photos.length - 1 ? 0 : prevIndex + 1
      )
    }
  }

  const prevImage = () => {
    if (space?.photos?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? space.photos.length - 1 : prevIndex - 1
      )
    }
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  const handleBooking = async () => {
    if (!user) {
      toast.info('Please log in to book this space')
      return
    }

    if (!selectedDate || !startTime || !endTime) {
      toast.warning('Please select a date and time for your booking')
      return
    }

    try {
      const bookingData = {
        space_id: spaceId,
        guest_id: user.id,
        host_id: space.host.id,
        booking_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        total_price: calculateTotalPrice(),
        status: 'pending'
      }

      const { data, error } = await createBooking(bookingData)
      
      if (error) {
        toast.error('Failed to create booking')
        return
      }

      toast.success('Booking request sent successfully!')
      // Here you would typically redirect to checkout page
      // navigate(`/checkout/${data.id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('An error occurred while creating your booking')
    }
  }

  const calculateHours = () => {
    if (!startTime || !endTime) return 0
    
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    // Handle bookings that go past midnight
    let diffMs = end - start
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000
    }
    
    return diffMs / (1000 * 60 * 60)
  }

  const calculateTotalPrice = () => {
    const hours = calculateHours()
    return hours * (space?.price_per_hour || 0)
  }

  const getPriceBreakdown = () => {
    const basePrice = calculateTotalPrice()
    return calculateFees(basePrice)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Space not found</h2>
          <p className="text-gray-600 mb-6">The space you're looking for doesn't exist or has been removed.</p>
          <Link to="/search" className="btn-primary">
            Browse Other Spaces
          </Link>
        </div>
      </div>
    )
  }

  const { photos = [], amenities = [], reviews = [] } = space
  
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <>
      <Helmet>
        <title>{`${space.title} - EventsySpace`}</title>
        <meta name="description" content={`${space.description?.substring(0, 160) || 'Book this amazing event space'}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Photo Gallery */}
        <div className="bg-gray-900 relative">
          <div className="max-w-7xl mx-auto">
            <div className="h-96 md:h-[500px] relative flex items-center justify-center overflow-hidden">
              {photos.length > 0 ? (
                <img
                  src={photos[currentImageIndex]?.url || 'https://via.placeholder.com/800x500?text=No+Image'}
                  alt={photos[currentImageIndex]?.alt_text || space.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                  <SafeIcon icon={FiMapPin} className="text-white text-6xl" />
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-gray-800 hover:text-gray-900 focus:outline-none transition-all"
                  >
                    <SafeIcon icon={FiChevronLeft} className="text-xl" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-gray-800 hover:text-gray-900 focus:outline-none transition-all"
                  >
                    <SafeIcon icon={FiChevronRight} className="text-xl" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{space.title}</h1>
                    <p className="text-gray-600 flex items-center mb-4">
                      <SafeIcon icon={FiMapPin} className="mr-1" />
                      {space.location}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                      <SafeIcon icon={FiHeart} />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                      <SafeIcon icon={FiShare2} />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                    <SafeIcon icon={FiUsers} className="text-gray-600 mr-2" />
                    <span>Up to {space.capacity} guests</span>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                    <SafeIcon icon={FiDollarSign} className="text-gray-600 mr-2" />
                    <span>${space.price_per_hour}/hour</span>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                    <SafeIcon icon={FiStar} className="text-yellow-400 mr-2" />
                    <span>{averageRating} ({reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About this space</h2>
                  <p className="text-gray-700 whitespace-pre-line mb-6">{space.description}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Space type</h3>
                  <p className="text-gray-700 mb-6">{space.space_type || 'Not specified'}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  {amenities.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-6">
                      {amenities.map(amenity => (
                        <li key={amenity.name} className="flex items-center">
                          <SafeIcon icon={FiCheckCircle} className="text-green-500 mr-2" />
                          <span className="text-gray-700">{amenity.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic mb-6">No amenities listed</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-8 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Reviews
                    </h2>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="text-yellow-400" />
                      <span className="font-semibold">{averageRating}</span>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start mb-3">
                            <div className="mr-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {review.reviewer?.avatar_url ? (
                                  <img src={review.reviewer.avatar_url} alt={review.reviewer.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  <SafeIcon icon={FiUser} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.reviewer?.full_name || 'Anonymous'}</h4>
                              <p className="text-sm text-gray-500">
                                {review.created_at ? format(new Date(review.created_at), 'MMMM yyyy') : 'No date'}
                              </p>
                            </div>
                            <div className="ml-auto flex items-center">
                              <SafeIcon icon={FiStar} className="text-yellow-400 mr-1" />
                              <span>{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet</p>
                  )}

                  {reviews.length > 3 && (
                    <div className="mt-6 text-center">
                      <Link to={`/space/${spaceId}/reviews`} className="btn-outline">
                        View all {reviews.length} reviews
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Hosted by {space.host?.full_name || 'Host'}</h2>
                  <div className="flex items-start">
                    <div className="mr-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {space.host?.avatar_url ? (
                          <img src={space.host.avatar_url} alt={space.host.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <SafeIcon icon={FiUser} className="text-gray-400 text-2xl" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-2">
                        Member since {space.host?.created_at ? format(new Date(space.host.created_at), 'MMMM yyyy') : 'N/A'}
                      </p>
                      <button 
                        onClick={() => {
                          if (user) {
                            // Navigate to messages or open message modal
                            toast.info('Messaging functionality will be implemented soon!')
                          } else {
                            toast.info('Please log in to contact the host')
                          }
                        }}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                      >
                        <SafeIcon icon={FiMessageCircle} />
                        <span>Contact Host</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">${space.price_per_hour}/hour</h2>
                <div className="flex items-center mb-6">
                  <SafeIcon icon={FiStar} className="text-yellow-400 mr-1" />
                  <span className="mr-1">{averageRating}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="form-label">Date</label>
                    <div className="relative">
                      <SafeIcon icon={FiCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="form-input pl-10"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Start Time</label>
                      <div className="relative">
                        <SafeIcon icon={FiClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="time"
                          className="form-input pl-10"
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">End Time</label>
                      <div className="relative">
                        <SafeIcon icon={FiClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="time"
                          className="form-input pl-10"
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {startTime && endTime && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Total Hours:</span>
                      <span className="font-medium">{calculateHours()} hours</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">${calculateTotalPrice().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-primary-600 cursor-pointer" onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}>
                      <span className="flex items-center">
                        <SafeIcon icon={FiInfo} className="mr-1" />
                        <span>Price details</span>
                      </span>
                      <SafeIcon icon={showPriceBreakdown ? FiChevronUp : FiChevronDown} />
                    </div>

                    {showPriceBreakdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <div className="space-y-1">
                          {(() => {
                            const { basePrice, guestFee, totalGuestPay } = getPriceBreakdown()
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Base price</span>
                                  <span>${basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Service fee (13%)</span>
                                  <span>${guestFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium border-t border-gray-200 pt-1 mt-1">
                                  <span>Total</span>
                                  <span>${totalGuestPay.toFixed(2)}</span>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !startTime || !endTime}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Space
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  You won't be charged yet. Payment will be processed after the host accepts your booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SpaceDetailPage