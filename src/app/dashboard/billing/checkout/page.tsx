'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Lock, CreditCard, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from '@/config/pricing';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, loading: subscriptionLoading } = useSubscriptionStatus();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const planId = searchParams.get('plan') as 'standard' | 'pro' | 'premium';
  const cycle = searchParams.get('cycle') as 'monthly' | 'yearly' || 'monthly';

  const selectedPlan = pricingPlans.find(p => p.id === planId);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Plan Selected</h2>
          <Button onClick={() => router.push('/dashboard/billing')}>
            Back to Billing
          </Button>
        </div>
      </div>
    );
  }

  const amount = cycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.price;
  const displayAmount = cycle === 'yearly' ? Math.round(selectedPlan.yearlyPrice / 12) : selectedPlan.price;

  const handleCheckout = async () => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Call your backend to create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          cycle,
          amount: amount * 100, // Razorpay expects amount in paise
        }),
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'FlowCoach',
        description: `${selectedPlan.name} Plan - ${cycle === 'yearly' ? 'Yearly' : 'Monthly'}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
              cycle,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success('Payment successful! Your plan has been upgraded.');
            router.push('/dashboard/billing?success=true');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: subscription?.plan ? '' : '', // You can prefill user email here
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedPlan.name} Plan</h3>
                  <p className="text-sm text-gray-600">{cycle === 'yearly' ? 'Billed Yearly' : 'Billed Monthly'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{displayAmount}</p>
                  <p className="text-sm text-gray-600">/month</p>
                </div>
              </div>

              {cycle === 'yearly' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700 font-medium">
                    Save ₹{(selectedPlan.price * 12 - selectedPlan.yearlyPrice).toLocaleString('en-IN')} with yearly billing
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">Included</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                {cycle === 'yearly' && (
                  <p className="text-xs text-gray-500 mt-1 text-right">Billed once per year</p>
                )}
              </div>
            </div>

            {/* Features Included */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {selectedPlan.features.filter(f => f.included).slice(0, 8).map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-1 rounded-full bg-brand-primary-100">
                      <Check className="h-4 w-4 text-brand-primary-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>

            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Secure payment powered by Razorpay. We accept:
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                  Credit Card
                </div>
                <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                  Debit Card
                </div>
                <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                  UPI
                </div>
                <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                  Net Banking
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading || !scriptLoaded}
                className="w-full py-6 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Pay ₹{amount.toLocaleString('en-IN')}
                  </>
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secured by Razorpay</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>Secure Payment Processing</strong><br />
                Your payment information is encrypted and processed securely via Razorpay. All sales are final and non-refundable.
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
