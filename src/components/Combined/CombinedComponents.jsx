import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useAuth, useLanguage } from '../../contexts/CombinedContexts';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown } = FiIcons;

// Re-export the SafeIcon component
export { default as SafeIcon } from '../../common/SafeIcon';

// Export MapComponent
export { default as MapComponent } from '../Map/MapComponent';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Language Toggle Component with WORKING FLAGS
export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // US Flag Component (WORKING SVG)
  const USFlag = ({ className = "w-5 h-4" }) => (
    <div className={`${className} flex items-center justify-center`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-full h-full">
        <path fill="#bd3d44" d="M0 0h640v480H0"/>
        <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
        <path fill="#192f5d" d="M0 0h364.8v258.5H0"/>
        <path fill="#fff" d="m30.4 11 3.4 10.3h10.6l-8.6 6.3 3.3 10.3-8.7-6.4-8.6 6.3L25 27.6l-8.7-6.3h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.3 3.3 10.3-8.7-6.4-8.7 6.3 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.3H166l-8.6 6.3 3.3 10.3-8.7-6.4-8.7 6.3 3.3-10.2-8.7-6.3h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.3 3.3 10.3-8.7-6.4-8.7 6.3 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.3 3.4 10.3-8.8-6.4-8.7 6.3 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.3 3.4 10.3-8.8-6.4-8.6 6.3 3.3-10.2-8.7-6.3h10.9zM60.8 37l3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8L249 53.4l3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.6 6.3 3.3-10.3-8.7-6.2h10.9zM30.4 62.8l3.4 10.3h10.6l-8.6 6.2 3.3 10.3-8.7-6.3-8.6 6.3L25 79.3l-8.7-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.3H166l-8.6 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.7-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.6 6.3 3.3-10.3-8.7-6.2h10.9zM60.8 88.6l3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.2-8.7 6.2 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.2-8.7 6.2 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.2-8.7 6.2 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.2-8.7 6.2 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.2-8.6 6.2 3.3-10.2-8.7-6.3h10.9zM30.4 114.5l3.4 10.2h10.6l-8.6 6.3 3.3 10.2-8.7-6.2-8.6 6.2 3.2-10.2-8.7-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.2-8.7 6.2 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.2H166l-8.6 6.3 3.3 10.2-8.7-6.2-8.7 6.2 3.3-10.2-8.7-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.2-8.7 6.2 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.2-8.7 6.2 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.2-8.6 6.2 3.3-10.2-8.7-6.3h10.9zM60.8 140.3l3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.3-8.7 6.3 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.3 10.2-8.7-6.3-8.7 6.3 3.3-10.2-8.6-6.3h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.3-8.7 6.3 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.3-8.7 6.3 3.4-10.2-8.8-6.3h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.3 3.4 10.2-8.8-6.3-8.6 6.3 3.3-10.2-8.7-6.3h10.9zM30.4 166.1l3.4 10.3h10.6l-8.6 6.2 3.3 10.3-8.7-6.3-8.6 6.3 3.2-10.3-8.7-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.3H166l-8.6 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.7-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.3h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.6 6.3 3.3-10.3-8.7-6.2h10.9zM60.8 192l3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.6 6.3 3.3-10.3-8.7-6.2h10.9zM30.4 217.9l3.4 10.2h10.6l-8.6 6.2 3.3 10.3-8.7-6.3-8.6 6.3 3.2-10.3-8.7-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.6-6.2h10.7zm60.8 0 3.3 10.2H166l-8.6 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.3-10.3-8.7-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.3 10.3-8.7-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.7 6.3 3.4-10.3-8.8-6.2h10.9zm60.8 0 3.3 10.2h10.8l-8.7 6.2 3.4 10.3-8.8-6.3-8.6 6.3 3.3-10.3-8.7-6.2h10.9z"/>
      </svg>
    </div>
  );

  // NL Flag Component (WORKING SVG)
  const NLFlag = ({ className = "w-5 h-4" }) => (
    <div className={`${className} flex items-center justify-center`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-full h-full">
        <path fill="#21468b" d="M0 0h640v480H0z"/>
        <path fill="#fff" d="M0 0h640v320H0z"/>
        <path fill="#ae1c28" d="M0 0h640v160H0z"/>
      </svg>
    </div>
  );

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', FlagComponent: USFlag },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', FlagComponent: NLFlag }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.language-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Render the appropriate flag component
  const renderFlag = (lang) => {
    // Use the FlagComponent from the language object
    const Flag = lang.FlagComponent;
    return <Flag className="w-full h-full" />;
  };

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
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 ${
                  language === lang.code ? 'bg-gray-50' : ''
                }`}
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
  );
};