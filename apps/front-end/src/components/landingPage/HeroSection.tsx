"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Zap, ArrowRight } from "lucide-react";
import { LoadingButton } from "../ui/LoadingButton";
import { SplineRocket } from "../ui";
import { useRouter } from "next/navigation";
import { useLoading } from "../providers/LoadingProvider";

export const HeroSection = () => {
  const [isGetStartedLoading, setIsGetStartedLoading] = useState(false);
  const [isWatchDemoLoading, setIsWatchDemoLoading] = useState(false);
  const { setGlobalLoading } = useLoading();
  const router = useRouter();

  const handleGetStarted = async () => {
    setIsGetStartedLoading(true);
    setGlobalLoading(true, "Getting started...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      router.push('/auth/signup');
    } finally {
      setIsGetStartedLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleWatchDemo = async () => {
    setIsWatchDemoLoading(true);
    setGlobalLoading(true, "Loading demo...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Demo functionality would go here
      window.open('https://demo.cloudmorph.dev', '_blank');
    } finally {
      setIsWatchDemoLoading(false);
      setGlobalLoading(false);
    }
  };

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "50ms", label: "Response Time" },
    { value: "150+", label: "Countries" },
    { value: "10M+", label: "Deployments" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Heading */}
                            {/* Main Heading - Smaller and Side Positioned */}
              <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-foreground">
                    Deploy with{" "}
                  </span>
                  <motion.span
                    className="bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent"
                    animate={{ backgroundPosition: "200% 0%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      backgroundSize: "200% 200%"
                    }}
                  >
                    Confidence
                  </motion.span>
                </motion.h1>
                
                {/* Beautiful accent element */}
                <motion.div
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-purple-300">Live Platform</span>
                </motion.div>
              </motion.div>

              {/* Subtitle */}
              <motion.p 
                className="text-lg md:text-xl font-semibold text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                The most advanced deployment platform for modern developers. 
                Build, deploy, and scale your applications with unparalleled speed.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center lg:text-left"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - 3D Rocket */}
          <div className="relative h-[600px] lg:h-[700px] xl:h-[800px]">
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.0 }}
              className="w-full h-full relative"
            >
              <SplineRocket 
                className="w-full h-full"
                splineUrl="https://prod.spline.design/6Wq1Q9EYClGTqhZf/scene.splinecode"
              />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-1/4 -left-8 text-gray-400/30"
                animate={{ 
                  y: [-15, 15, -15],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Rocket className="w-8 h-8" />
              </motion.div>
              <motion.div
                className="absolute bottom-1/4 -right-4 text-gray-500/30"
                animate={{ 
                  y: [15, -15, 15],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
