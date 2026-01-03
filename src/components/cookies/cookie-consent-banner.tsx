'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allConsent));
    setShowBanner(false);
    initializeAnalytics();
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const savePreferences = () => {
    const customConsent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(customConsent));
    setShowBanner(false);
    setShowSettings(false);
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const initializeAnalytics = () => {
    // Initialize analytics tools here (Google Analytics, etc.)
    console.log('Analytics initialized');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={() => !showSettings && setShowBanner(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
            style={{ position: 'fixed' }}
          >
            <div className="mx-auto max-w-6xl">
              <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary-600 via-brand-accent-600 to-brand-secondary-600" />

                {/* Main Content */}
                <div className="p-6 md:p-8">
                  {!showSettings ? (
                    // Default View
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-brand-primary-100 rounded-xl">
                          <Cookie className="h-8 w-8 text-brand-primary-600" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                          We Value Your Privacy
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                          By clicking "Accept All", you consent to our use of cookies.{' '}
                          <Link href="/cookies" className="text-brand-primary-600 hover:text-brand-primary-700 font-medium underline">
                            Learn more
                          </Link>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button
                          onClick={() => setShowSettings(true)}
                          variant="outline"
                          className="w-full sm:w-auto border-2"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Customize
                        </Button>
                        <Button
                          onClick={acceptNecessary}
                          variant="outline"
                          className="w-full sm:w-auto border-2"
                        >
                          Necessary Only
                        </Button>
                        <Button
                          onClick={acceptAll}
                          className="w-full sm:w-auto bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 hover:shadow-lg"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept All
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Settings View
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Cookie Preferences</h3>
                        <button
                          onClick={() => setShowSettings(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>

                      <div className="space-y-4 mb-6">
                        {/* Necessary Cookies */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Necessary Cookies
                              </h4>
                              <p className="text-sm text-gray-600">
                                Essential for the website to function properly. Cannot be disabled.
                              </p>
                            </div>
                            <div className="ml-4 p-2 bg-green-100 rounded-lg">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Analytics Cookies
                              </h4>
                              <p className="text-sm text-gray-600">
                                Help us understand how visitors interact with our website.
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={preferences.analytics}
                                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary-600"></div>
                            </label>
                          </div>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Marketing Cookies
                              </h4>
                              <p className="text-sm text-gray-600">
                                Used to track visitors and display relevant ads.
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={preferences.marketing}
                                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={acceptNecessary}
                          variant="outline"
                          className="w-full sm:flex-1 border-2"
                        >
                          Reject All
                        </Button>
                        <Button
                          onClick={savePreferences}
                          className="w-full sm:flex-1 bg-gradient-to-r from-brand-primary-600 to-brand-accent-600"
                        >
                          Save Preferences
                        </Button>
                      </div>

                      <p className="mt-4 text-xs text-center text-gray-500">
                        You can change your preferences at any time in our{' '}
                        <Link href="/cookies" className="text-brand-primary-600 hover:underline">
                          Cookie Policy
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
