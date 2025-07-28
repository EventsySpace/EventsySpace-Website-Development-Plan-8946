import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, LanguageProvider } from './contexts/CombinedContexts';
import { ProtectedRoute, LanguageToggle } from './components/Combined/CombinedComponents';
import { HomePage, AboutPage } from './pages/CombinedMainPages';
import { LoginPage, RegisterPage, ResetPasswordPage } from './pages/Auth/CombinedAuth';
import MapComponent from './components/Map/MapComponent';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiDollarSign, FiSettings, FiHeart, FiMessageCircle, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } = FiIcons;

// Debug component to show auth callbacks
const AuthCallbackHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log all URL parameters for debugging
    console.log('Auth callback detected');
    console.log('Search params:', location.search);
    console.log('Hash:', location.hash);
    
    // After a short delay, redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/dashboard/hirer');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Processing Authentication...</h2>
        <p className="text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

// Header Component
const Header = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

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
                isActive('/map-search') ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
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
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiHome} className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold">EventsySpace</span>
            </div>
            <p className="text-gray-400 text-sm">
              The premier platform for booking unique event spaces. Connect hosts with event organizers seamlessly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiFacebook} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiTwitter} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiInstagram} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiLinkedin} className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Browse Spaces
                </Link>
              </li>
              <li>
                <Link to="/map-search" className="text-gray-400 hover:text-white transition-colors">
                  Map Search
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Hosts</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard/host/my-spaces/new" className="text-gray-400 hover:text-white transition-colors">
                  List Your Space
                </Link>
              </li>
              <li>
                <Link to="/dashboard/host" className="text-gray-400 hover:text-white transition-colors">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/host/earnings" className="text-gray-400 hover:text-white transition-colors">
                  Earnings
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Host Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:support@eventsyspace.com" className="text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="tel:+1-555-0123" className="text-gray-400 hover:text-white transition-colors">
                  +1 (555) 0123
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 EventsySpace. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">Made with ❤️ for event organizers and space owners</p>
        </div>
      </div>
    </footer>
  );
};

// Import required hooks and functions
const { useAuth, useLanguage } = require('./contexts/CombinedContexts');
const { useTranslation } = require('./lib/utils');

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route
                    path="map-search"
                    element={
                      <div className="min-h-screen">
                        <div className="h-full flex flex-col">
                          <div className="flex-grow h-[calc(100vh-64px)]">
                            <MapComponent
                              spaces={[
                                {
                                  id: '1',
                                  title: 'Modern Conference Room',
                                  location: 'New York, NY',
                                  price_per_hour: 75,
                                  coordinates: { lat: 40.7128, lng: -74.006 }
                                },
                                {
                                  id: '2',
                                  title: 'Elegant Wedding Venue',
                                  location: 'Los Angeles, CA',
                                  price_per_hour: 200,
                                  coordinates: { lat: 34.0522, lng: -118.2437 }
                                },
                                {
                                  id: '3',
                                  title: 'Creative Art Studio',
                                  location: 'Chicago, IL',
                                  price_per_hour: 50,
                                  coordinates: { lat: 41.8781, lng: -87.6298 }
                                }
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <Route
                    path="terms"
                    element={
                      <div className="min-h-screen p-8">
                        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
                        <p>This page contains the terms of service.</p>
                      </div>
                    }
                  />
                  <Route
                    path="privacy"
                    element={
                      <div className="min-h-screen p-8">
                        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
                        <p>This page contains our privacy policy.</p>
                      </div>
                    }
                  />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Auth Callback Handler - IMPORTANT for OAuth */}
                <Route path="/auth/callback" element={<AuthCallbackHandler />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  {/* Dashboard routes will be added here */}
                  <Route
                    path="host/*"
                    element={
                      <div className="min-h-screen p-8">
                        <h1 className="text-2xl font-bold mb-4">Host Dashboard</h1>
                        <p>Welcome to your host dashboard.</p>
                      </div>
                    }
                  />
                  <Route
                    path="hirer/*"
                    element={
                      <div className="min-h-screen p-8">
                        <h1 className="text-2xl font-bold mb-4">Guest Dashboard</h1>
                        <p>Welcome to your guest dashboard.</p>
                      </div>
                    }
                  />
                </Route>
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;