'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Star,
  ArrowRight,
  Clock,
  X,
  Zap,
  Info,
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { pricingPlans, Currency, convertPrice, formatPrice } from '@/config/pricing';
import { CurrencySelector } from '@/components/pricing/currency-selector';
import { supabase } from '@/lib/supabase/client';

const faqs = [
  {
    question: 'How does the 7-day trial work?',
    answer: 'Sign up and get full access to all features for 7 days. No credit card required. After the trial, choose a plan to continue using FlowCoach.',
  },
  {
    question: 'Can I upgrade or downgrade anytime?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate the billing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets via Razorpay.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use bank-level encryption and are fully GDPR compliant. Your data is backed up daily and stored securely.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'All payments are final and non-refundable. We recommend starting with our 7-day free trial to ensure FlowCoach is the right fit for your needs before subscribing.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription anytime. No cancellation fees, and you\'ll retain access until the end of your billing period. However, please note that no refunds will be provided for unused time.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handlePlanClick = async (planId: string) => {
    if (loading) return;

    if (!isAuthenticated) {
      // Not logged in - redirect to signup
      router.push(`/signup?plan=${planId}&currency=${currency}`);
    } else {
      // Logged in - redirect to checkout
      router.push(`/dashboard/billing/checkout?plan=${planId}&cycle=${billingCycle}&currency=${currency}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50 -z-10" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-20 -z-10 animate-gradient" style={{ backgroundSize: '400% 400%' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 border-2 border-green-200 mb-8"
          >
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              7-Day Free Trial • No Credit Card Required
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            Pricing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Choose the perfect plan for your coaching business.
            <br />
            Start with a 7-day trial, upgrade as you grow.
          </motion.p>

          {/* Currency & Billing Controls */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            {/* Currency Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <CurrencySelector selected={currency} onSelect={setCurrency} />
            </motion.div>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-4 p-2 bg-gray-100 rounded-full"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-brand-primary-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-brand-primary-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Save 20%
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -10 }}
                className={`relative p-8 rounded-3xl transition-all duration-500 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-brand-primary-600 via-brand-accent-600 to-brand-secondary-600 text-white shadow-2xl scale-105 border-4 border-white'
                    : 'bg-white text-gray-900 shadow-xl border-2 border-gray-200 hover:border-brand-primary-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400 text-yellow-900 text-sm font-bold shadow-lg">
                      <Star className="h-5 w-5 fill-yellow-900" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold">
                      {formatPrice(
                        convertPrice(
                          billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.price,
                          currency
                        ),
                        currency
                      )}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>

                  {billingCycle === 'yearly' && (
                    <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                      Billed {formatPrice(convertPrice(plan.yearlyPrice, currency), currency)} yearly
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className={`flex-shrink-0 p-1 rounded-full ${plan.popular ? 'bg-white/20' : 'bg-brand-primary-100'}`}>
                          <Check className={`h-4 w-4 ${plan.popular ? 'text-white' : 'text-brand-primary-600'}`} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 p-1 rounded-full bg-gray-100">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <span className={`text-sm ${plan.popular ? 'text-white/95' : feature.included ? 'text-gray-700' : 'text-gray-400'} flex items-center gap-2`}>
                        {feature.text}
                        {feature.tooltip && (
                          <span title={feature.tooltip}>
                            <Info className="h-3 w-3 opacity-50" />
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanClick(plan.id)}
                  size="lg"
                  className={`w-full text-lg py-6 ${
                    plan.popular
                      ? 'bg-white text-brand-primary-600 hover:bg-gray-100 shadow-2xl'
                      : 'bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 text-white hover:shadow-xl'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-brand-primary-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2">
                Contact Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-600 via-brand-accent-600 to-brand-secondary-600" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 animate-gradient" style={{ backgroundSize: '400% 400%' }} />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your Free Trial Today
            </h2>
            <p className="text-xl text-white/90 mb-10">
              No credit card required. 7-day trial. 7-day money-back guarantee.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-brand-primary-600 hover:bg-gray-100 px-12 py-8 text-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
