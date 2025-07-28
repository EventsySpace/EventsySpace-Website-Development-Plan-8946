import React from 'react'
import { Helmet } from 'react-helmet-async'

const CheckoutPage = () => {
  return (
    <>
      <Helmet>
        <title>Checkout - EventsySpace</title>
        <meta name="description" content="Complete your booking payment on EventsySpace." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600">Complete your booking payment here.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage