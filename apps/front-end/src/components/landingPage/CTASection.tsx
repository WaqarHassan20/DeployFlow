"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { LoadingButton } from "../ui/LoadingButton";
import { useRouter } from "next/navigation";

export const CTASection = () => {
  const [isGetStartedLoading, setIsGetStartedLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = async () => {
    setIsGetStartedLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/auth/signup');
  };

  const benefits = [
    {
      icon: Zap,
      text: "Deploy in seconds"
    },
    {
      icon: Shield,
      text: "Enterprise security"
    },
    {
      icon: Globe,
      text: "Global CDN"
    }
  ];

  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 rounded-3xl blur-3xl" />
          
          {/* Glass Container */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-3xl" />
            
            {/* Floating Icons */}
            <motion.div
              className="absolute -top-6 left-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center"
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Rocket className="w-6 h-6 text-cyan-400" />
            </motion.div>
            
            <motion.div
              className="absolute -top-4 right-1/3 w-8 h-8 bg-gradient-to-br from-purple-400/30 to-pink-400/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center"
              animate={{ y: [10, -15, 10], rotate: [360, 180, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            >
              <Zap className="w-4 h-4 text-purple-400" />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Ready to Deploy?
                </span>
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Join thousands of developers who ship faster with CloudMorph. 
                Start your free account today and experience the future of deployment.
              </motion.p>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-6 mb-10"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                  >
                    <benefit.icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300 font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <LoadingButton
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  isLoading={isGetStartedLoading}
                  className="group min-w-[250px] h-14 text-lg font-semibold bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-purple-500/25"
                >
                  Start Free Today
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </LoadingButton>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-gray-400 text-sm mb-4">Trusted by 10,000+ developers worldwide</p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="w-20 h-8 bg-gradient-to-r from-white/20 to-white/10 rounded backdrop-blur-sm" />
                  <div className="w-24 h-8 bg-gradient-to-r from-white/10 to-white/20 rounded backdrop-blur-sm" />
                  <div className="w-20 h-8 bg-gradient-to-r from-white/20 to-white/10 rounded backdrop-blur-sm" />
                  <div className="w-22 h-8 bg-gradient-to-r from-white/10 to-white/20 rounded backdrop-blur-sm" />
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute bottom-4 left-4 w-6 h-6 border border-cyan-400/30 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-4 right-4 w-4 h-4 border border-purple-400/30 rotate-45"
                animate={{ 
                  rotate: [45, 225, 45],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};