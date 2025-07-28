import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useParams, useLocation } from 'react-router-dom'

// Combined Legal Pages (Terms and Privacy)
const LegalPages = () => {
  const { page } = useParams()
  const location = useLocation()
  
  // Determine which page to show based on URL
  const isTerms = page === 'terms' || location.pathname === '/terms'
  const isPrivacy = page === 'privacy' || location.pathname === '/privacy'
  
  const lastUpdated = 'December 15, 2024'

  const renderTermsContent = () => (
    <>
      <Helmet>
        <title>Terms of Service - EventsySpace</title>
        <meta name="description" content="Read EventsySpace's Terms of Service to understand your rights and responsibilities when using our platform." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using EventsySpace ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                EventsySpace is a platform that connects space owners ("Hosts") with individuals seeking to rent spaces for events ("Guests"). We facilitate bookings, payments, and communication between parties but are not a party to the rental agreements themselves.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  To use certain features of our Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Host Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-gray-700">As a Host, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate descriptions and photos of your space</li>
                  <li>Honor confirmed bookings</li>
                  <li>Maintain your space in safe and clean condition</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respond to booking requests and messages promptly</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Guest Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-gray-700">As a Guest, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use spaces only for their intended purpose</li>
                  <li>Treat spaces with care and respect</li>
                  <li>Follow all house rules set by the Host</li>
                  <li>Pay all fees and charges as agreed</li>
                  <li>Leave spaces in the same condition as found</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments and Fees</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  EventsySpace charges service fees for successful bookings:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Guests pay a 13% service fee on the total booking amount</li>
                  <li>Hosts pay a 3% service fee on the total booking amount</li>
                  <li>All payments are processed through secure third-party payment processors</li>
                  <li>Refunds are subject to the cancellation policy of each listing</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancellation policies are set by individual Hosts and vary by listing. Please review the specific cancellation policy before booking. EventsySpace may charge processing fees for cancellations as outlined in the booking confirmation.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Uses</h2>
              <div className="space-y-4">
                <p className="text-gray-700">You may not use our Service to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on others' intellectual property rights</li>
                  <li>Transmit harmful or malicious content</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or harm other users</li>
                  <li>Circumvent our fee structure</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                EventsySpace acts as a platform connecting Hosts and Guests. We are not responsible for the actual rental agreements, property conditions, or disputes between parties. Our liability is limited to the maximum extent permitted by law.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: legal@eventsyspace.com<br />
                  Phone: +1 (555) 0123<br />
                  Address: 123 Event Street, Suite 100, City, State 12345
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </>
  )

  const renderPrivacyContent = () => (
    <>
      <Helmet>
        <title>Privacy Policy - EventsySpace</title>
        <meta name="description" content="Learn how EventsySpace collects, uses, and protects your personal information." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
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
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
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
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "last updated" date.
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
    </>
  )

  return (
    <div className="min-h-screen bg-white">
      {isTerms ? renderTermsContent() : isPrivacy ? renderPrivacyContent() : renderTermsContent()}
    </div>
  )
}

export default LegalPages