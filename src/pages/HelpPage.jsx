import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMessageCircle, FiHelpCircle } = FiIcons

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    {
      title: 'Getting Started',
      icon: FiHelpCircle,
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner and fill in your details. You can sign up as either a guest (to book spaces) or a host (to list spaces).'
        },
        {
          question: 'Is EventsySpace free to use?',
          answer: 'Creating an account and browsing spaces is completely free. We only charge a small service fee when you make a booking.'
        },
        {
          question: 'How do I search for spaces?',
          answer: 'Use the search bar on our homepage or browse our map view. You can filter by location, price, capacity, and amenities to find the perfect space.'
        }
      ]
    },
    {
      title: 'Booking Spaces',
      icon: FiMessageCircle,
      faqs: [
        {
          question: 'How do I book a space?',
          answer: 'Find a space you like, select your date and time, then click "Book Space". You\'ll need to provide payment information, but you won\'t be charged until the host accepts your booking.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel bookings according to the cancellation policy set by each host. Check the space details for specific cancellation terms.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.'
        }
      ]
    },
    {
      title: 'Hosting Spaces',
      icon: FiMail,
      faqs: [
        {
          question: 'How do I list my space?',
          answer: 'Go to your host dashboard and click "Add New Space". Fill in the details, upload photos, set your pricing, and publish your listing.'
        },
        {
          question: 'How much can I earn?',
          answer: 'Earnings vary based on your location, space type, and pricing. We take a 3% host fee from successful bookings. The rest is yours!'
        },
        {
          question: 'How do I get paid?',
          answer: 'Payments are automatically transferred to your bank account 24 hours after each event concludes, minus our small service fee.'
        }
      ]
    }
  ]

  const contactOptions = [
    {
      icon: FiMail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@eventsyspace.com',
      action: 'mailto:support@eventsyspace.com'
    },
    {
      icon: FiPhone,
      title: 'Phone Support',
      description: 'Call us directly',
      contact: '+1 (555) 0123',
      action: 'tel:+15550123'
    },
    {
      icon: FiMessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available 9 AM - 6 PM EST',
      action: '#'
    }
  ]

  const filteredFaqs = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <>
      <Helmet>
        <title>Help Center - EventsySpace</title>
        <meta name="description" content="Get help with EventsySpace. Find answers to common questions about booking spaces, hosting, payments, and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How can we help you?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find answers to common questions or get in touch with our support team
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={category.title} className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={category.icon} className="text-primary-600 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {category.faqs.map((faq, faqIndex) => {
                        const faqId = `${categoryIndex}-${faqIndex}`
                        const isExpanded = expandedFaq === faqId
                        
                        return (
                          <div key={faqIndex}>
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                              className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {faq.question}
                                </span>
                                <SafeIcon 
                                  icon={isExpanded ? FiChevronUp : FiChevronDown} 
                                  className="text-gray-400 flex-shrink-0 ml-2" 
                                />
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-6 pb-4"
                              >
                                <p className="text-gray-700">{faq.answer}</p>
                              </motion.div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiSearch} className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try different keywords or contact our support team for help.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Still need help?
                </h3>
                
                <div className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <motion.a
                      key={option.title}
                      href={option.action}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <SafeIcon icon={option.icon} className="text-primary-600 text-xl mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {option.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {option.description}
                          </p>
                          <p className="text-sm font-medium text-primary-600">
                            {option.contact}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Business Hours
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Monday - Friday: 9 AM - 6 PM EST</p>
                    <p>Saturday: 10 AM - 4 PM EST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HelpPage