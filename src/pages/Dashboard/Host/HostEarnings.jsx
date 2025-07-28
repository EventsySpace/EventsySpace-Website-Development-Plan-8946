import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useTranslation } from '../../../lib/translations'

const HostEarnings = () => {
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  return (
    <>
      <Helmet>
        <title>{t('nav.earnings')} - EventsySpace</title>
        <meta name="description" content="View your earnings and payout history on EventsySpace." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.earnings')}</h1>
            <p className="text-gray-600">{t('host.earningsDesc')}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default HostEarnings