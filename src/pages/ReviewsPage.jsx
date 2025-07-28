import React from 'react'
import { Helmet } from 'react-helmet-async'

const ReviewsPage = () => {
  return (
    <>
      <Helmet>
        <title>Reviews - EventsySpace</title>
        <meta name="description" content="View user reviews and ratings on EventsySpace." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reviews</h1>
            <p className="text-gray-600">This page will display user reviews and ratings.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReviewsPage