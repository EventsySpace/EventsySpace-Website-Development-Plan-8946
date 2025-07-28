import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const PrivacyPage = () => {
  const lastUpdated = 'December 15, 2024'

  return (
    <>
      <Helmet>
        <title>Privacy Policy - EventsySpace</title>
        <meta name="description" content="Learn how EventsySpace collects, uses, and protects your personal information." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">We collect information you provide directly to us, such as:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Account information (name, email, phone number)</li>
                    <li>Profile information and photos</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                    <li>Communication content (messages, reviews)</li>
                    <li>Space listings and booking details</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Communicate with you about products, services, and events</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect and prevent fraudulent activities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">We may share your information in the following situations:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>With other users as necessary to facilitate bookings</li>
                    <li>With service providers who perform services on our behalf</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our services, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. When we 
                  no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">You have the right to:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Object to processing of your information</li>
                    <li>Request data portability</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to collect information about your 
                  browsing activities. You can control cookies through your browser settings, but 
                  disabling cookies may affect your ability to use certain features of our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  Our service may contain links to third-party websites or integrate with third-party 
                  services. We are not responsible for the privacy practices of these third parties. 
                  We encourage you to read their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If we become aware that we have 
                  collected such information, we will take steps to delete it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your information in accordance 
                  with this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "last 
                  updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: privacy@eventsyspace.com<br />
                    Phone: +1 (555) 0123<br />
                    Address: 123 Event Street, Suite 100, City, State 12345
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPage