import { createClient } from '@supabase/supabase-js';

// Use the provided credentials from your Supabase project
const supabaseUrl = 'https://avkwcudirfoztrqtdojo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a3djdWRpcmZvenRycXRkb2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTM4MjAsImV4cCI6MjA2OTI4OTgyMH0.yFMZG8DGN8GNkKsa1v7LnFEQnodDf2k1ITZ30_FKlew';

// Initialize the Supabase client with proper options
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit', // Important: Explicitly set the flow type
    debug: true // Enable debug mode to see auth-related logs
  }
});

console.log('Supabase client initialized with project credentials');

// CRITICAL FIX: Get the proper redirect URL based on the current environment
// Improved version that works with both development and production
const getRedirectUrl = () => {
  // Get base URL
  const baseUrl = window.location.origin;
  
  // For hash router, we need to include the hash in the redirect URL
  return `${baseUrl}/`;
};

// Auth helpers
export const signUp = async (email, password, userData = {}) => {
  try {
    console.log('Attempting to sign up with email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name || '',
          account_type: userData.account_type || 'guest'
        },
        // Disable email confirmation for now
        emailRedirectTo: undefined
      }
    });
    
    console.log('Sign up response:', { data, error });
    
    // If successful signup and user is confirmed, create a profile
    if (data?.user && !error) {
      // For development, we'll assume email confirmation is disabled
      // In production, you should handle email confirmation properly
      if (data.user.email_confirmed_at || data.user.confirmed_at) {
        console.log('User confirmed, creating profile...');
        await createUserProfile(data.user, userData.account_type || 'guest');
      } else {
        console.log('User created but not confirmed yet');
      }
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { data: null, error: { message: 'An unexpected error occurred during sign up' } };
  }
};

export const signIn = async (email, password) => {
  try {
    console.log('Attempting to sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Sign in response:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('Error in signIn:', error);
    return { data: null, error: { message: 'An unexpected error occurred during sign in' } };
  }
};

// Social authentication helpers
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign in process...');
    // Use the dynamic redirect URL
    const redirectTo = getRedirectUrl();
    console.log('Google redirect URL:', redirectTo);
    
    // IMPORTANT: Set scopes explicitly to fix authentication issues
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
        skipBrowserRedirect: false // Ensure browser redirect happens
      }
    });
    
    console.log('Google sign in response:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('Error in Google sign in:', error);
    return { data: null, error: { message: 'An unexpected error occurred during Google sign in' } };
  }
};

export const signInWithFacebook = async () => {
  try {
    // Use the dynamic redirect URL
    const redirectTo = getRedirectUrl();
    console.log('Facebook redirect URL:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectTo,
        scopes: 'email,public_profile',
        skipBrowserRedirect: false // Ensure browser redirect happens
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Error in Facebook sign in:', error);
    return { data: null, error: { message: 'An unexpected error occurred during Facebook sign in' } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error: { message: 'An unexpected error occurred during sign out' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return { user: null, error: { message: 'An unexpected error occurred while getting user' } };
  }
};

// Create or update user profile for social auth
export const createUserProfile = async (user, accountType = 'guest') => {
  if (!user) return { data: null, error: { message: 'No user provided' } };
  
  try {
    console.log('Creating/checking user profile for:', user.id);
    console.log('User metadata:', user.user_metadata);
    console.log('App metadata:', user.app_metadata);
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', fetchError);
      // Don't throw error, continue with profile creation
    }
    
    if (existingProfile && !fetchError) {
      console.log('Profile already exists:', existingProfile);
      return { data: existingProfile, error: null };
    }
    
    // Create new profile
    const profileData = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      account_type: accountType,
      provider: user.app_metadata?.provider || 'email',
      provider_id: user.user_metadata?.sub
    };
    
    console.log('Creating new profile with data:', profileData);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      // Don't throw error, just log it
      return { data: null, error };
    }
    
    console.log('Profile created successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return { data: null, error: { message: 'Failed to create user profile', details: error } };
  }
};

// Database helpers
export const getSpaces = async (filters = {}) => {
  try {
    let query = supabase
      .from('spaces_es12345')
      .select(`
        *,
        host:profiles(*),
        photos:space_photos_es12345(*),
        reviews:space_reviews_es12345(*)
      `);
    
    // Apply filters if specified
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.minPrice) {
      query = query.gte('price_per_hour', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.lte('price_per_hour', filters.maxPrice);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return { data: mockSpaces, error: null };
    }
    
    // Transform the data to match expected format
    const transformedData = data?.map(space => ({
      ...space,
      coordinates: space.lat && space.lng ? { lat: space.lat, lng: space.lng } : null
    })) || mockSpaces;
    
    return { data: transformedData, error };
  } catch (error) {
    console.error('Error in getSpaces:', error);
    return { data: mockSpaces, error: null };
  }
};

export const getSpace = async (id) => {
  try {
    const { data, error } = await supabase
      .from('spaces_es12345')
      .select(`
        *,
        host:profiles(*),
        photos:space_photos_es12345(*),
        reviews:space_reviews_es12345(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase query error:', error);
      const mockSpace = mockSpaces.find(s => s.id === id);
      return mockSpace ? { data: mockSpace, error: null } : { data: null, error: { message: 'Space not found' } };
    }
    
    // Transform the data
    const transformedData = {
      ...data,
      coordinates: data.lat && data.lng ? { lat: data.lat, lng: data.lng } : null
    };
    
    return { data: transformedData, error };
  } catch (error) {
    console.error('Error in getSpace:', error);
    const mockSpace = mockSpaces.find(s => s.id === id);
    return mockSpace ? { data: mockSpace, error: null } : { data: null, error: { message: 'An unexpected error occurred' } };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings_es12345')
      .insert(bookingData)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error in createBooking:', error);
    return { data: null, error: { message: 'An unexpected error occurred during booking creation' } };
  }
};

// Mock data with correct IDs from database
const mockSpaces = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Modern Conference Room',
    location: 'New York, NY',
    price_per_hour: 75,
    capacity: 20,
    description: 'A beautiful modern conference room perfect for business meetings and presentations.',
    space_type: 'Conference Room',
    photos: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt_text: 'Modern conference room' }
    ],
    reviews: [{ rating: 5 }, { rating: 4 }],
    host: { id: '11111111-1111-1111-1111-111111111111', full_name: 'John Doe', avatar_url: null },
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Elegant Wedding Venue',
    location: 'Los Angeles, CA',
    price_per_hour: 200,
    capacity: 150,
    description: 'A stunning venue perfect for weddings and special celebrations.',
    space_type: 'Wedding Venue',
    photos: [
      { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt_text: 'Elegant wedding venue' }
    ],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    host: { id: '22222222-2222-2222-2222-222222222222', full_name: 'Jane Smith', avatar_url: null },
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    title: 'Creative Art Studio',
    location: 'Chicago, IL',
    price_per_hour: 50,
    capacity: 30,
    description: 'A bright and inspiring art studio perfect for workshops and creative events.',
    space_type: 'Art Studio',
    photos: [
      { url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt_text: 'Creative art studio' }
    ],
    reviews: [{ rating: 4 }, { rating: 5 }],
    host: { id: '33333333-3333-3333-3333-333333333333', full_name: 'Mike Johnson', avatar_url: null },
    coordinates: { lat: 41.8781, lng: -87.6298 }
  }
];

// Add a listener for auth state changes to debug authentication issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  console.log('Session:', session);
});

// Debug function to check auth configuration
export const checkAuthConfig = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    console.log('Current session:', data);
    
    // Get OAuth settings
    console.log('Auth configuration:', {
      url: supabaseUrl,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    });
    
    return { success: true, message: 'Auth configuration checked' };
  } catch (error) {
    console.error('Error checking auth config:', error);
    return { success: false, error };
  }
};

// Initialize debug check
checkAuthConfig()
  .then(result => console.log('Auth config check result:', result))
  .catch(err => console.error('Auth config check failed:', err));

export { supabase };