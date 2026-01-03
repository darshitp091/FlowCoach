'use client';

import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50 -z-10" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-20 -z-10 animate-gradient" style={{ backgroundSize: '400% 400%' }} />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-100 border-2 border-purple-200 mb-8"
          >
            <Scale className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">
              Legal Agreement
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using FlowCoach
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500"
          >
            Last Updated: January 2, 2026 • Effective Date: January 2, 2026
          </motion.p>
        </div>
      </section>

      {/* Agreement Notice */}
      <section className="py-12 bg-yellow-50 border-y-2 border-yellow-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Binding Agreement</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using FlowCoach, you agree to be bound by these Terms of Service and our Privacy Policy.
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Section 1 */}
          <TermsSection
            icon={FileText}
            title="1. Acceptance of Terms"
            content={[
              'These Terms of Service ("Terms") govern your use of FlowCoach ("Service", "Platform", "we", "us", or "our").',
              'By creating an account, you represent that you are at least 18 years old and have the legal capacity to enter into this agreement.',
              'We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance of the new Terms.',
            ]}
          />

          {/* Section 2 */}
          <TermsSection
            icon={CheckCircle}
            title="2. Account Registration & Subscription"
            content={[
              {
                subtitle: '2.1 Account Creation',
                text: 'You must provide accurate, complete information when creating your account. You are responsible for maintaining the confidentiality of your account credentials.',
              },
              {
                subtitle: '2.2 Trial Period',
                text: 'FlowCoach offers a 7-day free trial. No credit card is required for the trial. After the trial ends, you must subscribe to continue using the service.',
              },
              {
                subtitle: '2.3 Subscription Plans',
                list: [
                  'Standard Plan: ₹1,499/month - Up to 25 clients',
                  'Pro Plan: ₹2,999/month - Up to 100 clients',
                  'Premium Plan: ₹4,999/month - Unlimited clients',
                  'All prices are in Indian Rupees (INR) and exclude applicable taxes',
                ],
              },
              {
                subtitle: '2.4 Payment Terms',
                list: [
                  'Subscriptions are billed monthly or annually in advance',
                  'Payments are processed via Razorpay',
                  'Failed payments may result in service suspension',
                  'All fees are non-refundable - see No Refunds Policy in Section 3',
                ],
              },
            ]}
          />

          {/* Section 3 */}
          <TermsSection
            icon={Shield}
            title="3. Cancellation & No Refunds Policy"
            content={[
              {
                subtitle: '3.1 No Refunds',
                text: 'All payments are final and non-refundable. Once you purchase a subscription plan, we do not offer refunds under any circumstances, including but not limited to early cancellation, non-usage, or dissatisfaction with the service.',
              },
              {
                subtitle: '3.2 Cancellation',
                list: [
                  'You can cancel your subscription at any time from your account settings',
                  'Cancellation takes effect at the end of your current billing period',
                  'No refunds will be provided for unused time in your billing cycle',
                  'You retain access to your data for 30 days after cancellation',
                  'After 30 days, your data will be permanently deleted',
                ],
              },
            ]}
          />

          {/* Section 4 */}
          <TermsSection
            icon={AlertCircle}
            title="4. Acceptable Use Policy"
            content={[
              {
                text: 'You agree NOT to:',
                list: [
                  'Violate any laws or regulations',
                  'Infringe on intellectual property rights',
                  'Upload malicious code, viruses, or harmful content',
                  'Attempt to gain unauthorized access to our systems',
                  'Use the service for illegal activities or fraud',
                  'Reverse engineer, decompile, or disassemble the platform',
                  'Resell or redistribute our services without permission',
                  'Send spam or unsolicited communications through our platform',
                ],
              },
            ]}
          />

          {/* Section 5 */}
          <TermsSection
            icon={XCircle}
            title="5. Termination"
            content={[
              'We reserve the right to suspend or terminate your account if you violate these Terms.',
              'Grounds for immediate termination include fraud, illegal activity, or severe policy violations.',
              'Upon termination, your access to the service will cease immediately.',
              'We will provide 30 days notice for termination due to non-payment (unless fraud is suspected).',
            ]}
          />

          {/* Additional Sections */}
          <TermsSection
            title="6. Intellectual Property"
            content={[
              'FlowCoach and all related trademarks, logos, and content are owned by us or our licensors.',
              'You retain all rights to the data you input into the platform.',
              'We grant you a limited, non-exclusive, non-transferable license to use our service.',
            ]}
          />

          <TermsSection
            title="7. Data & Privacy"
            content={[
              'Your use of FlowCoach is governed by our Privacy Policy.',
              'You are responsible for the accuracy and legality of data you input.',
              'We implement industry-standard security measures but cannot guarantee absolute security.',
              'See our Privacy Policy for detailed information on data handling.',
            ]}
          />

          <TermsSection
            title="8. Limitation of Liability"
            content={[
              'FlowCoach is provided "AS IS" without warranties of any kind.',
              'We are not liable for indirect, incidental, or consequential damages.',
              'Our total liability shall not exceed the amount you paid in the last 12 months.',
              'Some jurisdictions do not allow liability limitations, so these may not apply to you.',
            ]}
          />

          <TermsSection
            title="9. Indemnification"
            content={[
              'You agree to indemnify and hold FlowCoach harmless from any claims arising from:',
              '• Your use of the service',
              '• Your violation of these Terms',
              '• Your violation of any rights of another party',
              '• Your data or content uploaded to the platform',
            ]}
          />

          <TermsSection
            title="10. Governing Law & Dispute Resolution"
            content={[
              'These Terms are governed by the laws of India.',
              'Any disputes will be resolved in the courts of Mumbai, Maharashtra.',
              'You agree to attempt good-faith resolution before initiating legal proceedings.',
            ]}
          />

          <TermsSection
            title="11. Changes to Terms"
            content={[
              'We may update these Terms from time to time.',
              'Material changes will be communicated via email or platform notification.',
              'Continued use after changes constitutes acceptance.',
              'You can always view the current Terms at flowcoach.com/terms',
            ]}
          />

          <TermsSection
            title="12. Contact Us"
            content={[
              'For questions about these Terms:',
              '• Email: legal@flowcoach.com',
              '• Mail: FlowCoach Legal Team, Mumbai, Maharashtra, India',
              '• Response time: Within 5 business days',
            ]}
          />
        </div>
      </section>

      {/* Final Notice */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Choosing FlowCoach
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We're committed to providing a transparent, fair service. If you have any questions about these Terms,
              please don't hesitate to contact our team.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

interface TermsSectionProps {
  icon?: any;
  title: string;
  content: (string | { subtitle?: string; text?: string; list?: string[] })[];
}

function TermsSection({ icon: Icon, title, content }: TermsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-brand-primary-200 transition-colors"
    >
      <div className="flex items-start gap-4 mb-6">
        {Icon && (
          <div className="p-3 bg-brand-primary-100 rounded-xl">
            <Icon className="h-6 w-6 text-brand-primary-600" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 pt-2">{title}</h2>
      </div>

      <div className="space-y-4">
        {content.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <p key={idx} className="text-gray-700 leading-relaxed">
                {item}
              </p>
            );
          }

          return (
            <div key={idx}>
              {item.subtitle && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.subtitle}</h3>
              )}
              {item.text && (
                <p className="text-gray-700 leading-relaxed mb-3">{item.text}</p>
              )}
              {item.list && (
                <ul className="space-y-2 ml-6">
                  {item.list.map((listItem, listIdx) => (
                    <li key={listIdx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-brand-primary-600 mt-1.5">•</span>
                      <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
