'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { AuthService } from '@/services/auth.service';
import { RAZORPAY_PLANS, formatAmount, TRIAL_DAYS } from '@/lib/razorpay/config';
import { Button } from '@/components/ui/button';
import { Check, Lock, CreditCard, Shield, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [signupData, setSignupData] = useState<any>(null);

  const planId = searchParams.get('plan') || 'standard';
  const plan = RAZORPAY_PLANS[planId as keyof typeof RAZORPAY_PLANS];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Get current user
    const init = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      // Get signup data from session storage
      const stored = sessionStorage.getItem('signupData');
      if (stored) {
        setSignupData(JSON.parse(stored));
      }
    };

    init();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign up first');
      router.push('/signup');
      return;
    }

    setLoading(true);

    try {
      // Create subscription via API
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planId,
          organizationId: user.organization_id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscription.id,
        name: 'FlowCoach',
        description: `${plan.name} Plan - ${TRIAL_DAYS} Day Trial`,
        image: '/logo.png',
        prefill: {
          name: user.full_name,
          email: user.email,
        },
        theme: {
          color: '#6366F1',
        },
        handler: async function (response: any) {
          // Payment successful
          toast.success(`Card added successfully! Your ${TRIAL_DAYS}-day trial has started.`);

          // Clear signup data
          sessionStorage.removeItem('signupData');

          // Redirect to dashboard
          router.push('/dashboard');
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info('Checkout cancelled');
          },
        },
        notes: {
          plan: planId,
          trial_days: TRIAL_DAYS.toString(),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid plan selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary-500">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FlowCoach</span>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your {TRIAL_DAYS}-Day Free Trial
          </h1>
          <p className="text-lg text-gray-600">
            No charge today. We'll only charge after your trial ends.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Plan Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-brand-primary-100 text-brand-primary-700 rounded-full text-sm font-semibold mb-4">
                {plan.name} Plan
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {formatAmount(plan.amount)}
                <span className="text-lg text-gray-600 font-normal">/month</span>
              </h2>
              <p className="text-gray-600">
                Trial ends in {TRIAL_DAYS} days, then {formatAmount(plan.amount)}/month
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">What's included:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {plan.features.maxClients === -1 ? 'Unlimited' : plan.features.maxClients} Clients
                    </p>
                    <p className="text-sm text-gray-600">Manage your coaching clients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Unlimited Sessions</p>
                    <p className="text-sm text-gray-600">Schedule and track all sessions</p>
                  </div>
                </div>
                {plan.features.videoCallHours > 0 && (
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {plan.features.videoCallHours} hours of video calls
                      </p>
                      <p className="text-sm text-gray-600">Built-in video conferencing</p>
                    </div>
                  </div>
                )}
                {plan.features.whatsappIntegration && (
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Integration</p>
                      <p className="text-sm text-gray-600">Communicate via WhatsApp</p>
                    </div>
                  </div>
                )}
                {plan.features.aiFeatures && (
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">AI-Powered Features</p>
                      <p className="text-sm text-gray-600">Smart insights and automation</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-secondary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{plan.features.analytics} Analytics</p>
                    <p className="text-sm text-gray-600">Track your business metrics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong className="font-semibold">Secure Payment Processing</strong>
                <br />
                Your payment information is encrypted and processed securely via Razorpay. All sales are final and non-refundable.
              </p>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Payment Method</h3>
              <p className="text-gray-600">
                Your card will be securely saved. You won't be charged during the trial.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Secure Payment</p>
                  <p className="text-sm text-green-700">256-bit SSL encryption</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Today: ₹0</p>
                  <p className="text-sm text-gray-600">
                    First charge on {new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading || !user}
              className="w-full py-6 text-lg mb-4"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Add Card & Start Trial
                </>
              )}
            </Button>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Cancel anytime during trial - no charge</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Automatic charge after {TRIAL_DAYS} days</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Card details encrypted & secure</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-brand-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
