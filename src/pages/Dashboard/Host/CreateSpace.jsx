import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useTranslation } from '../../../lib/translations'

const CreateSpace = () => {
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  return (
    <>
      <Helmet>
        <title>{t('host.addNewSpace')} - EventsySpace</title>
        <meta name="description" content="List your space on EventsySpace and start earning money." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('host.addNewSpace')}</h1>
            <p className="text-gray-600">{t('host.addNewSpaceDesc')}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateSpace