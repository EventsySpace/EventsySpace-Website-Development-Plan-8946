import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import { USFlag, NLFlag } from './FlagIcons'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiChevronDown } = FiIcons

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English', 
      FlagComponent: USFlag
    },
    { 
      code: 'nl', 
      name: 'Dutch', 
      nativeName: 'Nederlands', 
      FlagComponent: NLFlag
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.language-toggle')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Render the appropriate flag component
  const renderFlag = (lang) => {
    // Use the FlagComponent from the language object
    const Flag = lang.FlagComponent;
    return <Flag className="w-full h-full" />;
  }

  return (
    <div className="relative language-toggle">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 min-w-[90px] justify-center bg-white shadow-sm"
      >
        {/* Flag Container */}
        <div className="w-5 h-4 flex-shrink-0 flex items-center justify-center">
          {renderFlag(currentLanguage)}
        </div>

        {/* Language Code */}
        <span className="text-sm font-medium uppercase">
          {currentLanguage.code}
        </span>

        {/* Dropdown Arrow */}
        <SafeIcon 
          icon={FiChevronDown} 
          className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 ${language === lang.code ? 'bg-gray-50' : ''}`}
              >
                {/* Flag Container */}
                <div className="w-5 h-4 flex-shrink-0 flex items-center justify-center">
                  {renderFlag(lang)}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900">{lang.name}</div>
                  <div className="text-sm text-gray-500">{lang.nativeName}</div>
                </div>

                {language === lang.code && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageToggle