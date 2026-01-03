'use client';

import { motion } from 'framer-motion';
import { Book, FileText, Video, MessageCircle, Search, ArrowRight, HelpCircle, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'New to FlowCoach? Start here to learn the basics.',
    articles: [
      'How to create your account',
      'Setting up your organization',
      'Inviting team members',
      'Understanding roles and permissions',
      'Your first client setup',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Learn how to manage your coaching clients effectively.',
    articles: [
      'Adding and organizing clients',
      'Client onboarding workflow',
      'Session scheduling and tracking',
      'Client progress monitoring',
      'Managing client payments',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Features & Tools',
    description: 'Master all FlowCoach features and capabilities.',
    articles: [
      'Automation setup guide',
      'Using AI-powered insights',
      'WhatsApp integration',
      'Analytics and reporting',
      'Payment processing',
    ],
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FileText,
    title: 'Account & Billing',
    description: 'Manage your subscription and billing settings.',
    articles: [
      'Subscription plans explained',
      'Upgrading or downgrading',
      'Payment methods',
      'Invoices and receipts',
      'Cancellation policy',
    ],
    color: 'from-green-500 to-emerald-500',
  },
];

const quickLinks = [
  { icon: Video, title: 'Video Tutorials', href: '#', description: 'Watch step-by-step guides' },
  { icon: MessageCircle, title: 'Live Chat Support', href: '/contact', description: 'Chat with our team' },
  { icon: HelpCircle, title: 'FAQs', href: '#', description: 'Common questions answered' },
];

export default function HelpPage() {
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-100 border-2 border-indigo-200 mb-8"
          >
            <Book className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">
              Help Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 bg-clip-text text-transparent">
              How Can We Help?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Find answers, learn how to use FlowCoach, and get the most out of your coaching platform
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, features, or guides..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-brand-primary-500 focus:outline-none text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-brand-primary-200 hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <ul className="space-y-3">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <Link
                          href="#"
                          className="flex items-center gap-2 text-gray-700 hover:text-brand-primary-600 transition-colors group"
                        >
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-brand-primary-600 group-hover:translate-x-1 transition-all" />
                          <span>{article}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Need More Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-brand-primary-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-primary-100 rounded-lg group-hover:bg-brand-primary-200 transition-colors">
                        <Icon className="h-6 w-6 text-brand-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-white/90 mb-8">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white text-brand-primary-600 hover:bg-gray-100 border-0">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
