import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    try {
      const savedLanguage = localStorage.getItem('eventsyspace-language')
      console.log(`LanguageProvider: Initial language from localStorage: ${savedLanguage || 'not found, using en'}`)
      return savedLanguage || 'en'
    } catch (error) {
      console.warn('LanguageProvider: Error accessing localStorage:', error)
      return 'en'
    }
  })

  useEffect(() => {
    // Save language preference to localStorage with error handling
    try {
      console.log(`LanguageProvider: Saving language to localStorage: ${language}`)
      localStorage.setItem('eventsyspace-language', language)
      
      // Add html lang attribute for accessibility
      document.documentElement.lang = language
      
      // Add meta tag for better SEO
      let metaLang = document.querySelector('meta[name="language"]')
      if (!metaLang) {
        metaLang = document.createElement('meta')
        metaLang.name = 'language'
        document.head.appendChild(metaLang)
      }
      metaLang.content = language
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language, previousLanguage: language } 
      }))
      
    } catch (error) {
      console.warn('LanguageProvider: Error saving to localStorage:', error)
    }
  }, [language])

  const setLanguageWithCallback = (newLanguage) => {
    console.log(`LanguageProvider: Language changing from ${language} to ${newLanguage}`)
    setLanguage(newLanguage)
  }

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'nl' : 'en'
      console.log(`LanguageProvider: Toggling language from ${prev} to ${newLang}`)
      return newLang
    })
  }

  const value = {
    language,
    setLanguage: setLanguageWithCallback,
    toggleLanguage,
    isEnglish: language === 'en',
    isDutch: language === 'nl'
  }

  // Debug current state
  console.log('LanguageProvider: Rendering with language:', language)

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}