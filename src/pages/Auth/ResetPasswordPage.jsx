import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation } from '../../lib/translations'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiMail, FiArrowLeft, FiHome } = FiIcons

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(t('toast.emailRequired'))
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('toast.validEmailRequired'))
      return
    }

    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        toast.error(error.message)
      } else {
        setSent(true)
        toast.success(t('toast.passwordResetSent'))
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('reset.forgotPassword')} - EventsySpace</title>
        <meta name="description" content="Reset your EventsySpace password. Enter your email to receive reset instructions." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiHome} className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EventsySpace</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {sent ? t('reset.checkEmail') : t('reset.forgotPassword')}
            </h2>
            <p className="text-gray-600">
              {sent ? t('reset.checkEmailDesc') : t('reset.enterEmailDesc')}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="form-label">
                    {t('auth.emailAddress')}
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input pl-10"
                      placeholder={t('auth.enterYourEmail')}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="loading-spinner w-5 h-5"></div>
                    ) : (
                      t('reset.sendResetLink')
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <SafeIcon icon={FiMail} className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="text-gray-700 mb-4">
                    {t('reset.sentTo')} <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('reset.didntReceive')}{' '}
                    <button
                      onClick={() => {
                        setSent(false)
                        setEmail('')
                      }}
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      {t('reset.tryAgain')}
                    </button>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                <SafeIcon icon={FiArrowLeft} />
                <span>{t('reset.backToSignIn')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage