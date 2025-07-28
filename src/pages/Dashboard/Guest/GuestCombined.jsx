import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useTranslation } from '../../../lib/translations'

// Combined Guest Dashboard components
const GuestCombined = () => {
  const { section } = useParams()
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  // Render the appropriate section based on the route parameter
  const renderSection = () => {
    switch (section) {
      case 'bookings':
        return (
          <>
            <Helmet>
              <title>{t('guest.bookings')} - EventsySpace</title>
              <meta name="description" content="View and manage your space bookings on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guest.bookings')}</h1>
              <p className="text-gray-600">{t('guest.bookingsDesc')}</p>
            </div>
          </>
        )
      case 'favorites':
        return (
          <>
            <Helmet>
              <title>{t('nav.favorites')} - EventsySpace</title>
              <meta name="description" content="View your favorite spaces on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guest.favorites')}</h1>
              <p className="text-gray-600">{t('guest.favoritesDesc')}</p>
            </div>
          </>
        )
      case 'messages':
        return (
          <>
            <Helmet>
              <title>{t('nav.messages')} - EventsySpace</title>
              <meta name="description" content="View your messages and conversations on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guest.messages')}</h1>
              <p className="text-gray-600">{t('guest.messagesDesc')}</p>
            </div>
          </>
        )
      case 'profile':
        return (
          <>
            <Helmet>
              <title>{t('guest.profile')} - EventsySpace</title>
              <meta name="description" content="Manage your profile and account settings on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guest.profile')}</h1>
              <p className="text-gray-600">{t('guest.profileDesc')}</p>
            </div>
          </>
        )
      case 'reviews':
        return (
          <>
            <Helmet>
              <title>{t('guest.reviews')} - EventsySpace</title>
              <meta name="description" content="View reviews you've written on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guest.reviews')}</h1>
              <p className="text-gray-600">{t('guest.reviewsDesc')}</p>
            </div>
          </>
        )
      default:
        return (
          <>
            <Helmet>
              <title>{t('dashboard.guestDashboard')} - EventsySpace</title>
              <meta name="description" content="View your bookings and manage your account on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.guestDashboard')}</h1>
              <p className="text-gray-600">{t('dashboard.manageBookings')}</p>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderSection()}
      </div>
    </div>
  )
}

export default GuestCombined