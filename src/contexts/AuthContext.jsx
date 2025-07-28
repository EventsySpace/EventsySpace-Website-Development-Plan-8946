import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, createUserProfile, checkAuthConfig } from '../lib/supabase';

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
        
        // Create profile for social auth users if it doesn't exist
        if (user && (user.app_metadata?.provider === 'google' || user.app_metadata?.provider === 'facebook')) {
          console.log('Initial user is from a social provider, creating/checking profile');
          await createUserProfile(user);
        }
      } catch (error) {
        console.error('Error getting initial user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUser();
    
    // Check auth configuration
    checkAuthConfig()
      .then(result => console.log('Auth config check from AuthContext:', result))
      .catch(err => console.error('Auth config check failed:', err));

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user);
          const newUser = session?.user ?? null;
          setUser(newUser);
          
          // Create profile for new social auth users
          if (event === 'SIGNED_IN' && newUser && (newUser.app_metadata?.provider === 'google' || newUser.app_metadata?.provider === 'facebook')) {
            console.log('User signed in via social provider, creating/checking profile');
            try {
              await createUserProfile(newUser);
            } catch (error) {
              console.error('Error creating profile for social user:', error);
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
    
    // For hash router, we need to include the hash in the redirect URL
    return `${baseUrl}/`;
  };

  // Modified to use the dynamic redirect URL function
  const signInWithGoogle = async () => {
    try {
      console.log('AuthContext: Starting Google sign-in process');
      const redirectTo = getRedirectUrl();
      console.log('AuthContext: Redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
          skipBrowserRedirect: false
        }
      });
      
      console.log('AuthContext: Google sign-in response:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('AuthContext: Error in Google sign in:', error);
      return { data: null, error: { message: 'An unexpected error occurred during Google sign in' } };
    }
  };

  const value = {
    user,
    loading,
    signUp: async (email, password, userData) => {
      console.log('AuthContext: Starting sign up process');
      const result = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });
      console.log('AuthContext: Sign up result:', result);
      return result;
    },
    signIn: async (email, password) => {
      console.log('AuthContext: Starting sign in process');
      const result = await supabase.auth.signInWithPassword({ email, password });
      console.log('AuthContext: Sign in result:', result);
      return result;
    },
    signInWithGoogle,
    signInWithFacebook: async () => {
      const redirectTo = getRedirectUrl();
      console.log('AuthContext: Facebook redirect URL:', redirectTo);
      
      return supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectTo,
          scopes: 'email,public_profile',
          skipBrowserRedirect: false
        }
      });
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