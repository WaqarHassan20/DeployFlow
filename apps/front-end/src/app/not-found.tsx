"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, RefreshCw, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "../components/ui/LoadingButton";

export default function NotFound() {
  const [isGoingHome, setIsGoingHome] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [particles, setParticles] = useState<
    { left: string; top: string; duration: number; delay: number; opacity: number }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setParticles(newParticles);
  }, []);

  const handleGoHome = async () => {
    setIsGoingHome(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      router.push("/");
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsGoingHome(false);
    }
  };

  const handleGoBack = async () => {
    setIsGoingBack(true);
    try {
      await new Promise(res => setTimeout(res, 600));
      router.back();
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsGoingBack(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      window.location.reload();
    } catch (error) {
      console.error("Refresh error:", error);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-background">
      {/* Enhanced Background matching globals.css */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% -20%, rgba(59, 130, 246, 0.15), transparent),
            radial-gradient(ellipse 100% 80% at 80% 120%, rgba(147, 51, 234, 0.15), transparent),
            linear-gradient(180deg, rgb(15, 23, 42), rgb(2, 6, 23))
          `
        }}
      />

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {/* Enhanced Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -50, 100, 0], 
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 60, 0], 
            y: [0, 80, -40, 0], 
            scale: [1, 0.8, 1.4, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.5, 1.2, 1],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Enhanced Floating Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ left: p.left, top: p.top }}
            animate={{ 
              y: [0, -40, 0], 
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, p.opacity, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              delay: p.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-slate-900/30 border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Glass Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-3xl" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* 404 Text with Enhanced Animation */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent mb-4 relative">
                    404
                    {/* Glow Effect */}
                    <div className="absolute inset-0 text-6xl md:text-7xl font-bold text-white/10 blur-2xl">
                      404
                    </div>
                  </div>
                </div>

                {/* Enhanced Icon Animation */}
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: 2,
                    ease: "easeInOut"
                  }}
                  className="inline-block relative"
                >
                  <div className="relative">
                    <AlertTriangle className="w-16 h-16 text-slate-400/80 mx-auto" />
                    <div className="absolute inset-0 w-16 h-16 text-blue-400/20 blur-lg mx-auto">
                      <AlertTriangle className="w-16 h-16" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Page Not Found
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md mx-auto"
              >
                The page you're looking for has disappeared into the digital abyss. Let's get you back on track.
              </motion.p>

              {/* Enhanced Buttons with LoadingButton */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <LoadingButton
                  onClick={handleGoHome}
                  isLoading={isGoingHome}
                  variant="primary"
                  size="sm"
                  icon={<Home className="w-3 h-3" />}
                  className="w-full sm:w-auto backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                >
                  Go Home
                </LoadingButton>

                <LoadingButton
                  onClick={handleGoBack}
                  isLoading={isGoingBack}
                  variant="secondary"
                  size="sm"
                  icon={<ArrowLeft className="w-3 h-3" />}
                  className="w-full sm:w-auto backdrop-blur-md bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20"
                >
                  Go Back
                </LoadingButton>

                <LoadingButton
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  variant="secondary"
                  size="sm"
                  icon={<RefreshCw className="w-3 h-3" />}
                  className="w-full sm:w-auto backdrop-blur-md bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20"
                >
                  Refresh
                </LoadingButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
