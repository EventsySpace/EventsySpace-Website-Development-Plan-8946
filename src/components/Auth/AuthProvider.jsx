import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, createUserProfile } from '../../lib/supabase';

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

  const value = {
    user,
    loading,
    signUp: (email, password, userData) => 
      supabase.auth.signUp({ email, password, options: { data: userData } }),
    signIn: (email, password) => 
      supabase.auth.signInWithPassword({ email, password }),
    signInWithGoogle: () => 
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard/hirer`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      }),
    signInWithFacebook: () => 
      supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard/hirer`,
          scopes: 'email'
        }
      }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};