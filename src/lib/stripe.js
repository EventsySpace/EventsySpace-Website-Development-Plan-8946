import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key')

export const getStripe = () => stripePromise

export const createCheckoutSession = async (bookingData) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    
    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const redirectToCheckout = async (sessionId) => {
  const stripe = await getStripe()
  const { error } = await stripe.redirectToCheckout({ sessionId })
  
  if (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

export const calculateFees = (basePrice) => {
  const guestFee = basePrice * 0.13 // 13% guest fee
  const hostFee = basePrice * 0.03 // 3% host fee
  const totalGuestPay = basePrice + guestFee
  const hostReceives = basePrice - hostFee
  const platformEarns = guestFee + hostFee

  return {
    basePrice,
    guestFee,
    hostFee,
    totalGuestPay,
    hostReceives,
    platformEarns
  }
}