import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, createUserProfile } from '../lib/supabase';

// Auth Context
const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const fetchInitialUser = async () => {
      try {
        const { user } = await getCurrentUser();
        console.log('Initial user:', user);
        setUser(user);
        
        // Create profile for users if it doesn't exist
        if (user) {
          console.log('User found, creating/checking profile');
          await createUserProfile(user, 'guest');
        }
      } catch (error) {
        console.error('Error getting initial user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUser();

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user);
          const newUser = session?.user ?? null;
          setUser(newUser);
          
          // Create profile for new users
          if (event === 'SIGNED_IN' && newUser) {
            console.log('User signed in, creating/checking profile');
            try {
              await createUserProfile(newUser, 'guest');
            } catch (error) {
              console.error('Error creating profile for user:', error);
            }
          }
          
          setLoading(false);
        }
      );
      
      return () => subscription?.unsubscribe?.();
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  // CRITICAL FIX: Get the proper redirect URL based on the current environment
  const getRedirectUrl = () => {
    // Get base URL
    const baseUrl = window.location.origin;
    
    // Get path without hash
    const path = '/dashboard/hirer';
    
    // For hash router, we need to include the hash in the redirect URL
    return `${baseUrl}/#${path}`;
  };

  const signInWithGoogle = async () => {
    try {
      console.log('CombinedContexts: Starting Google sign-in process');
      const redirectTo = getRedirectUrl();
      console.log('CombinedContexts: Redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile'
        }
      });
      
      console.log('CombinedContexts: Google sign-in response:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('CombinedContexts: Error in Google sign in:', error);
      return { data: null, error: { message: 'An unexpected error occurred during Google sign in' } };
    }
  };

  const value = {
    user,
    loading,
    signUp: async (email, password, userData) => {
      console.log('CombinedContexts: Starting sign up process');
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: userData?.full_name || '',
              account_type: userData?.account_type || 'guest'
            }
          }
        });
        console.log('CombinedContexts: Sign up result:', { data, error });
        return { data, error };
      } catch (error) {
        console.error('CombinedContexts: Sign up error:', error);
        return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
      }
    },
    signIn: async (email, password) => {
      console.log('CombinedContexts: Starting sign in process');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        console.log('CombinedContexts: Sign in result:', { data, error });
        return { data, error };
      } catch (error) {
        console.error('CombinedContexts: Sign in error:', error);
        return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
      }
    },
    signInWithGoogle,
    signInWithFacebook: async () => {
      try {
        const redirectTo = getRedirectUrl();
        console.log('CombinedContexts: Facebook redirect URL:', redirectTo);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: redirectTo,
            scopes: 'email,public_profile'
          }
        });
        return { data, error };
      } catch (error) {
        return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
      }
    },
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Language Context
const LanguageContext = createContext({});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    try {
      const savedLanguage = localStorage.getItem('eventsyspace-language');
      console.log(`LanguageProvider: Initial language from localStorage: ${savedLanguage || 'not found, using en'}`);
      return savedLanguage || 'en';
    } catch (error) {
      console.warn('LanguageProvider: Error accessing localStorage:', error);
      return 'en';
    }
  });

  useEffect(() => {
    // Save language preference to localStorage with error handling
    try {
      console.log(`LanguageProvider: Saving language to localStorage: ${language}`);
      localStorage.setItem('eventsyspace-language', language);
      
      // Add html lang attribute for accessibility
      document.documentElement.lang = language;
      
      // Add meta tag for better SEO
      let metaLang = document.querySelector('meta[name="language"]');
      if (!metaLang) {
        metaLang = document.createElement('meta');
        metaLang.name = 'language';
        document.head.appendChild(metaLang);
      }
      metaLang.content = language;
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language, previousLanguage: language } }));
    } catch (error) {
      console.warn('LanguageProvider: Error saving to localStorage:', error);
    }
  }, [language]);

  const setLanguageWithCallback = (newLanguage) => {
    console.log(`LanguageProvider: Language changing from ${language} to ${newLanguage}`);
    setLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'nl' : 'en';
      console.log(`LanguageProvider: Toggling language from ${prev} to ${newLang}`);
      return newLang;
    });
  };

  const value = {
    language,
    setLanguage: setLanguageWithCallback,
    toggleLanguage,
    isEnglish: language === 'en',
    isDutch: language === 'nl'
  };

  // Debug current state
  console.log('LanguageProvider: Rendering with language:', language);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};