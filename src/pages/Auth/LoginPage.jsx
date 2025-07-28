import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../lib/translations';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiEye, FiEyeOff, FiHome, FiAlertCircle } = FiIcons;

const LoginPage = () => {
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  
  // Debug URL parameters
  useEffect(() => {
    // Check if there are any parameters that might indicate an auth redirect
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    console.log("URL Search params:", window.location.search);
    console.log("URL Hash:", hash);
    
    // If we have auth-related parameters, log them
    if (params.has('error') || params.has('code') || hash.includes('access_token')) {
      console.log("Auth redirect detected, parameters:", {
        search: Object.fromEntries(params.entries()),
        hash: hash
      });
      
      // If there's an error, show it
      if (params.has('error')) {
        setAuthError(params.get('error_description') || params.get('error'));
      }
    }
  }, []);
  
  const from = location.state?.from?.pathname || '/dashboard/hirer';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t('toast.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('toast.validEmailRequired');
    }
    if (!formData.password) {
      newErrors.password = t('auth.password') + ' is required';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setAuthError(null);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('toast.invalidCredentials'));
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(t('toast.welcomeBack'));
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setAuthError(null);
    
    try {
      console.log('Starting Google sign-in process');
      
      // Log the current URL to debug the redirect issue
      console.log('Current URL before Google auth:', window.location.href);
      console.log('Is hash in URL:', window.location.href.includes('#'));
      console.log('Current origin:', window.location.origin);
      
      const { data, error } = await signInWithGoogle();
      console.log('Google sign-in response:', { data, error });
      
      if (error) {
        console.error('Google sign-in error:', error);
        setAuthError(error.message || 'Failed to sign in with Google');
        toast.error(error.message || 'Failed to sign in with Google. Please make sure Google OAuth is configured in your Supabase dashboard.');
      } else if (data?.url) {
        // This is the expected flow - user will be redirected to OAuth provider
        console.log('Redirecting to OAuth provider URL:', data.url);
        toast.info('Redirecting to Google authentication...');
        
        // Force a redirect in case the SDK doesn't do it automatically
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        toast.info('Authenticating with Google...');
      }
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      setAuthError(error.message || 'An unexpected error occurred');
      toast.error('An unexpected error occurred with Google sign in');
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };
  
  const handleFacebookLogin = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    setAuthError(null);
    
    try {
      console.log('Starting Facebook sign-in process');
      
      // Log the current URL to debug the redirect issue
      console.log('Current URL before Facebook auth:', window.location.href);
      
      const { data, error } = await signInWithFacebook();
      console.log('Facebook sign-in response:', { data, error });
      
      if (error) {
        setAuthError(error.message || 'Failed to sign in with Facebook');
        toast.error(error.message || 'Failed to sign in with Facebook. Please make sure Facebook OAuth is configured in your Supabase dashboard.');
      } else if (data?.url) {
        // This is the expected flow - user will be redirected to OAuth provider
        console.log('Redirecting to OAuth provider URL:', data.url);
        toast.info('Redirecting to Facebook authentication...');
        
        // Force a redirect in case the SDK doesn't do it automatically
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        toast.info('Authenticating with Facebook...');
      }
    } catch (error) {
      console.error('Exception during Facebook sign in:', error);
      setAuthError(error.message || 'An unexpected error occurred');
      toast.error('An unexpected error occurred with Facebook sign in');
    } finally {
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{t('nav.login')} - EventsySpace</title>
        <meta name="description" content="Log in to your EventsySpace account to manage bookings and spaces." />
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
              {t('auth.welcomeBack')}
            </h2>
            <p className="text-gray-600">
              {t('auth.signInToContinue')}
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
            {/* Auth Error Banner */}
            {authError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <SafeIcon icon={FiAlertCircle} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Authentication Error</p>
                  <p className="text-sm">{authError}</p>
                </div>
              </div>
            )}
            
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={socialLoading.google || socialLoading.facebook}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="google-login-button"
              >
                {socialLoading.google ? (
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>
              
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={socialLoading.google || socialLoading.facebook}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {socialLoading.facebook ? (
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                Continue with Facebook
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.email ? 'border-red-300' : ''}`}
                    placeholder={t('auth.enterYourEmail')}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="form-label">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                    placeholder={t('auth.enterYourPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t('auth.rememberMe')}
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/reset-password" className="font-medium text-primary-600 hover:text-primary-500">
                    {t('auth.forgotPassword')}
                  </Link>
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
                    t('auth.signIn')
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {t('auth.dontHaveAccount')}{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    {t('nav.signup')}
                  </Link>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;