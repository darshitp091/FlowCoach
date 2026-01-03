'use client';

import { motion } from 'framer-motion';
import { Users, MessageSquare, Lightbulb, Trophy, Heart, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';

export default function CommunityPage() {
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
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">
              Join Our Community
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-brand-primary-600 to-brand-accent-600 bg-clip-text text-transparent">
              FlowCoach Community
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Connect with 50,000+ coaches worldwide. Share insights, learn best practices, and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8">
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
              Browse Discussions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50,000+', label: 'Active Members' },
              { number: '1,200+', label: 'Daily Discussions' },
              { number: '95%', label: 'Satisfaction Rate' },
              { number: '24/7', label: 'Peer Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-brand-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What You'll Find in Our Community
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Expert Discussions',
                description: 'Engage in meaningful conversations with experienced coaches from around the world.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Lightbulb,
                title: 'Best Practices',
                description: 'Learn proven strategies and techniques shared by successful coaching professionals.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Trophy,
                title: 'Success Stories',
                description: 'Get inspired by real stories from coaches who transformed their business with FlowCoach.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Sparkles,
                title: 'Feature Requests',
                description: 'Shape the future of FlowCoach by sharing your ideas and voting on new features.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Heart,
                title: 'Peer Support',
                description: 'Get help from fellow coaches who understand your challenges and celebrate your wins.',
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: Users,
                title: 'Networking Events',
                description: 'Join virtual meetups, webinars, and workshops to expand your professional network.',
                color: 'from-indigo-500 to-purple-500',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-brand-primary-200 hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-16 bg-gradient-to-r from-brand-primary-600 to-brand-accent-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Community Platform Coming Soon!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We're building an amazing community platform for FlowCoach users. Sign up to be notified when we launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button size="lg" variant="outline" className="bg-white text-brand-primary-600 hover:bg-gray-100 border-0 whitespace-nowrap">
                Notify Me
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meanwhile Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Meanwhile, Connect With Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                platform: 'LinkedIn',
                description: 'Professional insights and industry updates',
                link: '#',
                color: 'bg-blue-600',
              },
              {
                platform: 'Twitter',
                description: 'Real-time updates and quick tips',
                link: '#',
                color: 'bg-sky-500',
              },
              {
                platform: 'Facebook',
                description: 'Community discussions and events',
                link: '#',
                color: 'bg-blue-500',
              },
            ].map((social, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={social.link}
                  className="block p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-primary-300 hover:shadow-lg transition-all group"
                >
                  <div className={`inline-flex p-3 rounded-lg ${social.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <ExternalLink className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{social.platform}</h3>
                  <p className="text-gray-600">{social.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
