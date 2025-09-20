'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { useState } from 'react'

export const HeroSection = () => {
  const [isGetStartedLoading, setIsGetStartedLoading] = useState(false);
  const [isWatchDemoLoading, setIsWatchDemoLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsGetStartedLoading(true);
    try {
      // TODO: Implement get started functionality
      console.log('Get started clicked');
      // Simulate navigation to signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = '/auth/signup';
    } finally {
      setIsGetStartedLoading(false);
    }
  }

  const handleWatchDemo = async () => {
    setIsWatchDemoLoading(true);
    try {
      // TODO: Implement demo video/tour
      console.log('Watch demo clicked');
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      setIsWatchDemoLoading(false);
    }
  }

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-gray-300">Now with enhanced AI-powered deployments</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Deploy with
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            CloudMorph
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Transform your ideas into reality with lightning-fast deployments, 
          seamless scaling, and enterprise-grade reliability.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleGetStarted}
            isLoading={isGetStartedLoading}
            className="group"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="glass" 
            size="lg"
            onClick={handleWatchDemo}
            isLoading={isWatchDemoLoading}
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { stat: '99.9%', label: 'Uptime' },
            { stat: '<30s', label: 'Deploy Time' },
            { stat: '150+', label: 'Countries' },
            { stat: '1M+', label: 'Deployments' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{item.stat}</div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}