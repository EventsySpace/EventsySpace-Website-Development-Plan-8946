import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useTranslation } from '../../../lib/translations'

// Combined Host Dashboard components
const HostCombined = () => {
  const { section } = useParams()
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  // Render the appropriate section based on the route parameter
  const renderSection = () => {
    switch (section) {
      case 'my-spaces':
        return (
          <>
            <Helmet>
              <title>{t('host.mySpaces')} - EventsySpace</title>
              <meta name="description" content="View and manage your listed spaces on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.mySpaces')}</h1>
              <p className="text-gray-600">{t('host.mySpacesDesc')}</p>
            </div>
          </>
        )
      case 'my-spaces/new':
        return (
          <>
            <Helmet>
              <title>{t('host.addNewSpace')} - EventsySpace</title>
              <meta name="description" content="List your space on EventsySpace and start earning money." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.addNewSpace')}</h1>
              <p className="text-gray-600">{t('host.addNewSpaceDesc')}</p>
            </div>
          </>
        )
      case 'calendar':
        return (
          <>
            <Helmet>
              <title>{t('nav.calendar')} - EventsySpace</title>
              <meta name="description" content="View your booking calendar and manage availability." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.calendar')}</h1>
              <p className="text-gray-600">{t('host.calendarDesc')}</p>
            </div>
          </>
        )
      case 'earnings':
        return (
          <>
            <Helmet>
              <title>{t('nav.earnings')} - EventsySpace</title>
              <meta name="description" content="View your earnings and payout history on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.earnings')}</h1>
              <p className="text-gray-600">{t('host.earningsDesc')}</p>
            </div>
          </>
        )
      case 'settings':
        return (
          <>
            <Helmet>
              <title>{t('host.settings')} - EventsySpace</title>
              <meta name="description" content="Manage your host account settings and preferences." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.settings')}</h1>
              <p className="text-gray-600">{t('host.settingsDesc')}</p>
            </div>
          </>
        )
      case 'reviews':
        return (
          <>
            <Helmet>
              <title>{t('space.reviews')} - EventsySpace</title>
              <meta name="description" content="View reviews for your spaces on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.reviews')}</h1>
              <p className="text-gray-600">{t('host.reviewsDesc')}</p>
            </div>
          </>
        )
      default:
        return (
          <>
            <Helmet>
              <title>{t('dashboard.hostDashboard')} - EventsySpace</title>
              <meta name="description" content="Manage your event spaces and bookings on EventsySpace." />
            </Helmet>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.hostDashboard')}</h1>
              <p className="text-gray-600">{t('dashboard.manageSpaces')}</p>
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

export default HostCombined