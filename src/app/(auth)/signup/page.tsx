'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, BarChart3, CheckCircle2, Users, Loader2 } from 'lucide-react';
import { generateSlug } from '@/lib/utils';
import { pricingPlans } from '@/config/pricing';
import { RoleSelector } from '@/components/auth/role-selector';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('owner');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    organizationName: '',
    organizationSlug: '',
    acceptTerms: false,
  });

  // Get plan from URL parameter
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['standard', 'pro', 'premium'].includes(planParam)) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const handleOrganizationNameChange = (name: string) => {
    setFormData({
      ...formData,
      organizationName: name,
      organizationSlug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Check if slug is available
      const isAvailable = await AuthService.isSlugAvailable(formData.organizationSlug);
      if (!isAvailable) {
        toast.error('Organization name is already taken. Please choose another.');
        setLoading(false);
        return;
      }

      const result = await AuthService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        organizationName: formData.organizationName,
        organizationSlug: formData.organizationSlug,
        selectedPlan: selectedPlan || 'standard',
        role: selectedRole,
      });

      // Check if email verification is required
      if (result.emailVerificationRequired) {
        toast.success('Account created! Please check your email to verify your account.', {
          duration: 8000
        });
        // Redirect to a confirmation page
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      } else {
        toast.success('Account created! Welcome to FlowCoach');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">FlowCoach</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 mb-6">
              <Users className="h-3 w-3" />
              Built for teams of all sizes
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Start your 7-day trial
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-brand-primary-600 hover:text-brand-primary-500">
                Sign in
              </Link>
            </p>
          </div>

          {/* Plan Selector */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Choose Your Plan <span className="text-xs font-normal text-gray-500">(7-day free trial)</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {pricingPlans.filter(p => p.id !== 'enterprise' as any).map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-3 border-2 rounded-xl text-left transition-all ${
                    selectedPlan === plan.id
                      ? 'border-brand-primary-500 bg-brand-primary-50 ring-2 ring-brand-primary-200'
                      : 'border-gray-200 hover:border-brand-primary-300'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand-primary-500 text-white px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap">
                      Popular
                    </span>
                  )}
                  <p className="font-bold text-sm text-gray-900">{plan.name}</p>
                  <p className="text-base font-bold text-brand-primary-600 mt-0.5">
                    ₹{plan.price.toLocaleString()}
                    <span className="text-[10px] text-gray-500">/mo</span>
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1 leading-tight">
                    {typeof plan.features[0] === 'string' ? plan.features[0] : plan.features[0]?.text}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-gray-500 text-center leading-relaxed">
              Start with 7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                What's your role? <span className="text-xs font-normal text-gray-500">(You can invite team members later)</span>
              </label>
              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary-500 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary-500 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                Organization name
              </label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => handleOrganizationNameChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary-500 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                placeholder="Acme Coaching"
              />
              {formData.organizationSlug && (
                <p className="mt-1 text-xs text-gray-500">
                  Your workspace URL: coachcrm.com/{formData.organizationSlug}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-brand-primary-500 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-brand-primary-600 hover:text-brand-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-brand-primary-600 hover:text-brand-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Start free trial
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              7-day free trial • No credit card required
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Benefits with Team Focus */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-600 to-brand-primary-800">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold">Built for growing teams</h2>
              <p className="mt-4 text-lg text-brand-primary-100">
                Start solo, scale with your team. Powerful collaboration built-in.
              </p>

              {/* Team Role Showcase */}
              <div className="mt-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-lg">👑</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">You'll be the Owner</p>
                    <p className="text-xs text-brand-primary-100">Full control of your workspace</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-brand-primary-100">
                  <p>✓ Invite unlimited team members</p>
                  <p>✓ Assign roles: Admin, Manager, Coach, Support</p>
                  <p>✓ Control who sees what with permissions</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <BenefitItem
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  title="Role-Based Access"
                  description="5 roles with granular permissions - from Owner to Support staff"
                />
                <BenefitItem
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  title="Smart Automation"
                  description="Save 7-10 hours per week with automated workflows"
                />
                <BenefitItem
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  title="Secure by Default"
                  description="Database-level security ensures coaches only see assigned clients"
                />
                <BenefitItem
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  title="Real-time Collaboration"
                  description="Your team stays in sync with live updates"
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-xs text-brand-primary-100 mb-3">Trusted by coaching teams worldwide</p>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-brand-primary-100">Teams</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">10k+</p>
                    <p className="text-xs text-brand-primary-100">Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-xs text-brand-primary-100">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-secondary-500">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-brand-primary-100">{description}</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary-600" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
