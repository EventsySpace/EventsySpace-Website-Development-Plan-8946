import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../lib/translations'
import { getSpaces } from '../lib/supabase'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiMapPin, FiUsers, FiCalendar, FiStar, FiArrowRight, FiCheckCircle, FiTrendingUp, FiShield, FiClock, FiHome } = FiIcons

const HomePage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredSpaces, setFeaturedSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('HomePage: Starting to fetch featured spaces...')
    console.log('Current language in HomePage:', language)
    const fetchFeaturedSpaces = async () => {
      try {
        const { data, error } = await getSpaces({ limit: 6 })
        console.log('HomePage: Fetched spaces:', data)
        if (data && !error) {
          setFeaturedSpaces(data.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching featured spaces:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedSpaces()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const features = [
    {
      icon: FiSearch,
      title: t('features.easyDiscovery'),
      description: t('features.easyDiscoveryDesc')
    },
    {
      icon: FiShield,
      title: t('features.secureBooking'),
      description: t('features.secureBookingDesc')
    },
    {
      icon: FiClock,
      title: t('features.instantConfirmation'),
      description: t('features.instantConfirmationDesc')
    },
    {
      icon: FiTrendingUp,
      title: t('features.hostSuccess'),
      description: t('features.hostSuccessDesc')
    }
  ]

  const stats = [
    { number: '10,000+', label: t('stats.spacesListed') },
    { number: '50,000+', label: t('stats.eventsHosted') },
    { number: '500+', label: t('stats.citiesCovered') },
    { number: '4.9★', label: t('stats.avgRating') }
  ]

  console.log('HomePage: Rendering with', featuredSpaces.length, 'featured spaces, loading:', loading)
  console.log('Translation for home.simplePlatformText:', t('home.simplePlatformText'))

  return (
    <>
      <Helmet>
        <title>EventsySpace - Find Perfect Event Spaces</title>
        <meta name="description" content="Discover and book unique event spaces for your next gathering. From corporate meetings to birthday parties, find the perfect venue on EventsySpace." />
        <meta name="keywords" content="event spaces, venue rental, party venues, meeting rooms, event planning" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                {t('home.title').split(' ').slice(0, -2).join(' ')}{' '}
                <br />
                <span className="text-yellow-300">{t('home.title').split(' ').slice(-2).join(' ')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto"
              >
                {t('home.subtitle')}
              </motion.p>

              {/* Search Form */}
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-2xl shadow-2xl">
                  <div className="flex-1 relative">
                    <SafeIcon
                      icon={FiSearch}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
                    />
                    <input
                      type="text"
                      placeholder={t('home.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 bg-transparent focus:outline-none text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{t('common.search')}</span>
                    <SafeIcon icon={FiArrowRight} />
                  </button>
                </div>
              </motion.form>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                <Link
                  to="/map-search"
                  className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all backdrop-blur-sm"
                >
                  <SafeIcon icon={FiMapPin} />
                  <span>{t('home.browseMap')}</span>
                </Link>
                <Link
                  to="/dashboard/host/my-spaces/new"
                  className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <SafeIcon icon={FiUsers} />
                  <span>{t('home.listSpace')}</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.whyChoose')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.simplePlatformText')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={feature.icon} className="text-2xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Spaces */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.featuredSpaces')}
              </h2>
              <p className="text-xl text-gray-600">
                Discover some of our most popular and unique venues
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredSpaces.map((space, index) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/space/${space.id}`}
                      className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        {space.photos && space.photos[0] ? (
                          <img
                            src={space.photos[0].url}
                            alt={space.photos[0].alt_text || space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <SafeIcon icon={FiHome} className="text-white text-4xl" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {space.title}
                        </h3>
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
                            Up to {space.capacity} {t('common.guests')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/search"
                className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <span>{t('home.viewAllSpaces')}</span>
                <SafeIcon icon={FiArrowRight} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('home.readyToHost')}
              </h2>
              <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
                {t('home.joinHosts')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard/host/my-spaces/new"
                  className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiUsers} />
                  <span>{t('home.listSpace')}</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiCheckCircle} />
                  <span>{t('home.learnMore')}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage