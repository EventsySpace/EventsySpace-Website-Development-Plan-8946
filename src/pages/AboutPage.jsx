import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiUsers, FiTarget, FiHeart, FiAward, FiTrendingUp, FiShield } = FiIcons

const AboutPage = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '10,000+', label: 'Spaces Listed' },
    { number: '500+', label: 'Cities Covered' },
    { number: '4.9/5', label: 'Average Rating' }
  ]

  const values = [
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'We continuously improve our platform to provide the best experience for hosts and guests.'
    },
    {
      icon: FiShield,
      title: 'Trust & Safety',
      description: 'Your security is our priority. We ensure safe transactions and verified listings.'
    },
    {
      icon: FiHeart,
      title: 'Community',
      description: 'Building connections between space owners and event organizers worldwide.'
    },
    {
      icon: FiTarget,
      title: 'Excellence',
      description: 'We strive for excellence in every interaction and service we provide.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Us - EventsySpace</title>
        <meta name="description" content="Learn about EventsySpace's mission to connect space owners with event organizers worldwide." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About EventsySpace
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                We're revolutionizing how people find and book event spaces, 
                connecting amazing venues with unforgettable experiences.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  EventsySpace was founded with a simple yet powerful vision: to make finding 
                  and booking the perfect event space effortless for everyone. Whether you're 
                  planning an intimate gathering or a grand celebration, we believe everyone 
                  deserves access to amazing spaces.
                </p>
                <p className="text-lg text-gray-700">
                  We empower space owners to monetize their unique venues while helping event 
                  organizers discover spaces they never knew existed. It's about creating 
                  connections, fostering community, and making every event memorable.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and help us build a platform 
                that truly serves our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={value.icon} className="text-2xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built by Event Enthusiasts
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our team combines expertise in technology, hospitality, and event planning 
                to create the best possible experience for our users.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-4 bg-white rounded-lg p-8 shadow-sm">
                <SafeIcon icon={FiUsers} className="text-4xl text-primary-600" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900">Join Our Team</h3>
                  <p className="text-gray-600">We're always looking for passionate people to join our mission.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage