# EventsySpace - Event Space Booking Platform

A modern event space booking platform built with React, Supabase, and Tailwind CSS.

## Features

- **Authentication**: Email/password and social login (Google, Facebook)
- **Space Discovery**: Browse and search event spaces with advanced filters
- **Interactive Map**: View spaces on an interactive map with Mapbox
- **Booking System**: Book spaces with secure payment processing
- **Multi-language Support**: English and Dutch language support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Real-time notifications and updates with Supabase

## Social Authentication Setup

To enable Google and Facebook authentication, you need to configure OAuth providers in your Supabase dashboard:

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-domain.com` (for production)
6. Add redirect URIs:
   - `https://avkwcudirfoztrqtdojo.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase Dashboard > Authentication > Providers:
   - Enable Google provider
   - Add Client ID and Client Secret

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add Facebook Login product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   - `https://avkwcudirfoztrqtdojo.supabase.co/auth/v1/callback`
5. Copy App ID and App Secret
6. In Supabase Dashboard > Authentication > Providers:
   - Enable Facebook provider
   - Add App ID and App Secret

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Mapbox GL JS
- **Payments**: Stripe
- **Icons**: React Icons (Feather)
- **Routing**: React Router DOM

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Configure OAuth providers in Supabase dashboard
5. Run development server: `npm run dev`

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles
- `spaces_es12345` - Event spaces
- `bookings_es12345` - Booking records
- `space_photos_es12345` - Space images
- `space_reviews_es12345` - Reviews and ratings
- `favorites_es12345` - User favorites
- `messages_es12345` - User messaging

## Deployment

The app is configured for deployment on Netlify with:
- Automatic builds from main branch
- Redirect rules for SPA routing
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.