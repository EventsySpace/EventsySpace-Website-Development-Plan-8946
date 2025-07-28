// This script sets up the initial database tables for the EventsySpace application
import { supabase } from './lib/supabase.js';

const createTables = async () => {
  console.log('Setting up database tables...');
  
  try {
    // Create profiles table (extends the auth.users data)
    const { error: profilesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        avatar_url TEXT,
        account_type TEXT NOT NULL CHECK (account_type IN ('host', 'guest')),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own profile" 
        ON profiles FOR SELECT 
        USING (auth.uid() = id);
        
      CREATE POLICY "Users can update their own profile" 
        ON profiles FOR UPDATE 
        USING (auth.uid() = id);
    `);
    
    if (profilesError) {
      throw profilesError;
    }
    
    // Create spaces table
    const { error: spacesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS spaces_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        price_per_hour NUMERIC(10, 2) NOT NULL CHECK (price_per_hour >= 0),
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        space_type TEXT NOT NULL,
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE spaces_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view spaces"
        ON spaces_es12345 FOR SELECT
        USING (true);
        
      CREATE POLICY "Hosts can insert their own spaces"
        ON spaces_es12345 FOR INSERT
        WITH CHECK (auth.uid() = host_id);
        
      CREATE POLICY "Hosts can update their own spaces"
        ON spaces_es12345 FOR UPDATE
        USING (auth.uid() = host_id);
        
      CREATE POLICY "Hosts can delete their own spaces"
        ON spaces_es12345 FOR DELETE
        USING (auth.uid() = host_id);
    `);
    
    if (spacesError) {
      throw spacesError;
    }
    
    // Create space_photos table
    const { error: photosError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS space_photos_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        space_id UUID NOT NULL REFERENCES spaces_es12345(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt_text TEXT,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE space_photos_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view space photos"
        ON space_photos_es12345 FOR SELECT
        USING (true);
        
      CREATE POLICY "Hosts can manage photos of their spaces"
        ON space_photos_es12345 FOR ALL
        USING ((SELECT host_id FROM spaces_es12345 WHERE id = space_id) = auth.uid());
    `);
    
    if (photosError) {
      throw photosError;
    }
    
    // Create space_amenities table
    const { error: amenitiesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS space_amenities_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        space_id UUID NOT NULL REFERENCES spaces_es12345(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        icon TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE space_amenities_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view space amenities"
        ON space_amenities_es12345 FOR SELECT
        USING (true);
        
      CREATE POLICY "Hosts can manage amenities of their spaces"
        ON space_amenities_es12345 FOR ALL
        USING ((SELECT host_id FROM spaces_es12345 WHERE id = space_id) = auth.uid());
    `);
    
    if (amenitiesError) {
      throw amenitiesError;
    }
    
    // Create bookings table
    const { error: bookingsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS bookings_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        space_id UUID NOT NULL REFERENCES spaces_es12345(id) ON DELETE CASCADE,
        guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
        status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        guest_count INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE bookings_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Guests can view their own bookings"
        ON bookings_es12345 FOR SELECT
        USING (auth.uid() = guest_id);
        
      CREATE POLICY "Hosts can view bookings for their spaces"
        ON bookings_es12345 FOR SELECT
        USING (auth.uid() = host_id);
        
      CREATE POLICY "Guests can create bookings"
        ON bookings_es12345 FOR INSERT
        WITH CHECK (auth.uid() = guest_id);
        
      CREATE POLICY "Guests can update their own bookings"
        ON bookings_es12345 FOR UPDATE
        USING (auth.uid() = guest_id);
        
      CREATE POLICY "Hosts can update bookings for their spaces"
        ON bookings_es12345 FOR UPDATE
        USING (auth.uid() = host_id);
    `);
    
    if (bookingsError) {
      throw bookingsError;
    }
    
    // Create reviews table
    const { error: reviewsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS space_reviews_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        space_id UUID NOT NULL REFERENCES spaces_es12345(id) ON DELETE CASCADE,
        reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        booking_id UUID REFERENCES bookings_es12345(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE space_reviews_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view reviews"
        ON space_reviews_es12345 FOR SELECT
        USING (true);
        
      CREATE POLICY "Users can create their own reviews"
        ON space_reviews_es12345 FOR INSERT
        WITH CHECK (auth.uid() = reviewer_id);
        
      CREATE POLICY "Users can update their own reviews"
        ON space_reviews_es12345 FOR UPDATE
        USING (auth.uid() = reviewer_id);
        
      CREATE POLICY "Users can delete their own reviews"
        ON space_reviews_es12345 FOR DELETE
        USING (auth.uid() = reviewer_id);
    `);
    
    if (reviewsError) {
      throw reviewsError;
    }
    
    // Create favorites table
    const { error: favoritesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS favorites_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        space_id UUID NOT NULL REFERENCES spaces_es12345(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, space_id)
      );
      
      ALTER TABLE favorites_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own favorites"
        ON favorites_es12345 FOR SELECT
        USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can add their own favorites"
        ON favorites_es12345 FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
      CREATE POLICY "Users can delete their own favorites"
        ON favorites_es12345 FOR DELETE
        USING (auth.uid() = user_id);
    `);
    
    if (favoritesError) {
      throw favoritesError;
    }
    
    // Create messages table
    const { error: messagesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS messages_es12345 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE messages_es12345 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own messages"
        ON messages_es12345 FOR SELECT
        USING (auth.uid() IN (sender_id, recipient_id));
        
      CREATE POLICY "Users can send messages"
        ON messages_es12345 FOR INSERT
        WITH CHECK (auth.uid() = sender_id);
        
      CREATE POLICY "Recipients can mark messages as read"
        ON messages_es12345 FOR UPDATE
        USING (auth.uid() = recipient_id);
    `);
    
    if (messagesError) {
      throw messagesError;
    }
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

// Execute the setup
createTables()
  .then(() => console.log('Setup complete'))
  .catch(err => console.error('Setup failed:', err));

export { createTables };