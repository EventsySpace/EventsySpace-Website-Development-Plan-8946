import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useLocation } from 'react-router-dom'

// Combined auxiliary pages (Reviews, Checkout, Messages)
const OtherPages = () => {
  const { page } = useParams()
  const location = useLocation()
  
  // Determine which page to show based on URL
  const isCheckout = page === 'checkout' || location.pathname.includes('/checkout/')
  const isMessages = page === 'messages' || location.pathname.includes('/messages')
  const isReviews = page === 'reviews'

  // Render the appropriate content based on the route parameter
  const renderPageContent = () => {
    if (isCheckout) {
      return (
        <>
          <Helmet>
            <title>Checkout - EventsySpace</title>
            <meta name="description" content="Complete your booking payment on EventsySpace." />
          </Helmet>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600">Complete your booking payment here.</p>
          </div>
        </>
      )
    }

    if (isMessages) {
      return (
        <>
          <Helmet>
            <title>Messages - EventsySpace</title>
            <meta name="description" content="View and manage your messages on EventsySpace." />
          </Helmet>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
            <p className="text-gray-600">Your messages and conversations will appear here.</p>
          </div>
        </>
      )
    }

    if (isReviews) {
      return (
        <>
          <Helmet>
            <title>Reviews - EventsySpace</title>
            <meta name="description" content="View user reviews and ratings on EventsySpace." />
          </Helmet>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reviews</h1>
            <p className="text-gray-600">This page will display user reviews and ratings.</p>
          </div>
        </>
      )
    }

    return (
      <>
        <Helmet>
          <title>Page Not Found - EventsySpace</title>
          <meta name="description" content="The requested page could not be found." />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderPageContent()}
      </div>
    </div>
  )
}

export default OtherPages