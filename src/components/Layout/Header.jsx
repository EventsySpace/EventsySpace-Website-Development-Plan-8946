import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation } from '../../lib/translations'
import SafeIcon from '../../common/SafeIcon'
import LanguageToggle from '../Language/LanguageToggle'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiDollarSign, FiSettings, FiStar, FiMessageCircle, FiHeart, FiMapPin } = FiIcons

const Header = () => {
  const { user, signOut } = useAuth()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  console.log('Header: Rendering with language:', language)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiHome} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">EventsySpace</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/map-search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/map-search')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiMapPin} className="text-sm" />
              <span>{t('nav.mapSearch')}</span>
            </Link>

            {/* Language Toggle - Enhanced visibility */}
            <div className="flex items-center pl-2">
              <LanguageToggle />
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="text-white text-sm" />
                  </div>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      </div>

                      <div className="py-2">
                        <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">{t('nav.hostDashboard')}</h3>
                        <Link
                          to="/dashboard/host"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiHome} className="text-sm" />
                          <span>{t('nav.overview')}</span>
                        </Link>
                        <Link
                          to="/dashboard/host/my-spaces"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiHome} className="text-sm" />
                          <span>{t('nav.mySpaces')}</span>
                        </Link>
                        <Link
                          to="/dashboard/host/calendar"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiCalendar} className="text-sm" />
                          <span>{t('nav.calendar')}</span>
                        </Link>
                        <Link
                          to="/dashboard/host/earnings"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiDollarSign} className="text-sm" />
                          <span>{t('nav.earnings')}</span>
                        </Link>
                      </div>

                      <div className="py-2 border-t border-gray-100">
                        <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">{t('nav.guestDashboard')}</h3>
                        <Link
                          to="/dashboard/hirer"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiUser} className="text-sm" />
                          <span>{t('nav.overview')}</span>
                        </Link>
                        <Link
                          to="/dashboard/hirer/bookings"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiCalendar} className="text-sm" />
                          <span>{t('nav.bookings')}</span>
                        </Link>
                        <Link
                          to="/dashboard/hirer/favorites"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiHeart} className="text-sm" />
                          <span>{t('nav.favorites')}</span>
                        </Link>
                        <Link
                          to="/messages"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiMessageCircle} className="text-sm" />
                          <span>{t('nav.messages')}</span>
                        </Link>
                      </div>

                      <div className="py-2 border-t border-gray-100">
                        <Link
                          to="/dashboard/hirer/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiSettings} className="text-sm" />
                          <span>{t('nav.settings')}</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <SafeIcon icon={FiLogOut} className="text-sm" />
                          <span>{t('nav.signOut')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="text-xl" />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/map-search"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <SafeIcon icon={FiMapPin} className="text-sm" />
                <span>{t('nav.mapSearch')}</span>
              </Link>

              {/* Mobile Language Toggle - Enhanced */}
              <div className="px-3 py-2 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-medium text-gray-700">Language:</span>
                <LanguageToggle />
              </div>

              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="px-3 py-1 text-sm font-medium text-gray-900">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">{t('nav.hostDashboard')}</h3>
                    <Link
                      to="/dashboard/host"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <SafeIcon icon={FiHome} className="text-sm" />
                      <span>{t('nav.overview')}</span>
                    </Link>
                    <Link
                      to="/dashboard/host/my-spaces"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <SafeIcon icon={FiHome} className="text-sm" />
                      <span>{t('nav.mySpaces')}</span>
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">{t('nav.guestDashboard')}</h3>
                    <Link
                      to="/dashboard/hirer/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <SafeIcon icon={FiCalendar} className="text-sm" />
                      <span>{t('nav.bookings')}</span>
                    </Link>
                    <Link
                      to="/dashboard/hirer/favorites"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <SafeIcon icon={FiHeart} className="text-sm" />
                      <span>{t('nav.favorites')}</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <SafeIcon icon={FiLogOut} className="text-sm" />
                      <span>{t('nav.signOut')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600"
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header