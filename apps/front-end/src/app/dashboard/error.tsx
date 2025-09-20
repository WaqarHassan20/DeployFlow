"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Settings } from "lucide-react";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { useRouter } from "next/navigation";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          
          {/* Dashboard Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-18 h-18 text-yellow-400 mx-auto" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Dashboard Error
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-300 mb-6 leading-relaxed"
          >
            We encountered an issue loading your dashboard. This might be a temporary problem with your projects or deployments.
          </motion.p>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-black/30 rounded-lg p-4 mb-6 border border-yellow-500/30"
          >
            <div className="text-left">
              <p className="text-yellow-300 text-sm font-mono mb-2">
                {error.message || 'Dashboard loading failed'}
              </p>
              {error.digest && (
                <p className="text-gray-400 text-xs">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <LoadingButton
              variant="primary"
              size="lg"
              onClick={handleReset}
              isLoading={isResetting}
              className="w-full"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reload Dashboard
            </LoadingButton>

            <div className="flex gap-3">
              <LoadingButton
                variant="secondary"
                size="md"
                onClick={handleGoToDashboard}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </LoadingButton>

              <LoadingButton
                variant="secondary"
                size="md"
                onClick={handleGoHome}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </LoadingButton>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-6 pt-4 border-t border-white/10"
          >
            <p className="text-gray-400 text-sm">
              If this error continues, try clearing your browser cache or 
              contact support with the Error ID above.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}