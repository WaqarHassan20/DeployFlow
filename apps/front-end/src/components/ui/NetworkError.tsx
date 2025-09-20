"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { LoadingButton } from "./LoadingButton";

interface NetworkErrorProps {
  onRetry?: () => void;
  showOfflineMessage?: boolean;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ 
  onRetry, 
  showOfflineMessage = true,
  className = "" 
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Default retry: reload the page
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Don't show if online and no offline message needed
  if (isOnline && !showOfflineMessage) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Network Status Orbs */}
        <motion.div
          className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl ${
            isOnline ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: isOnline ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl ${
            isOnline ? 'bg-blue-500/20' : 'bg-orange-500/20'
          }`}
          animate={{
            scale: [1, 0.8, 1.3, 1],
            opacity: isOnline ? [0.2, 0.4, 0.2] : [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />

        {/* Status Particles */}
        {[...Array(isOnline ? 15 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isOnline ? 'bg-green-400/40' : 'bg-red-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, isOnline ? -15 : -25, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {/* Glass Card Container */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
          
          {/* Network Status Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.div
              animate={isOnline ? {} : { 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              {isOnline ? (
                <Wifi className="w-16 h-16 text-green-400 mx-auto" />
              ) : (
                <WifiOff className="w-16 h-16 text-red-400 mx-auto" />
              )}
            </motion.div>
          </motion.div>

          {/* Status Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            {isOnline ? "Connection Restored!" : "Connection Lost"}
          </motion.h1>

          {/* Status Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-300 mb-6 leading-relaxed"
          >
            {isOnline ? (
              "Great! Your internet connection is back online. You can continue using the application."
            ) : (
              "It looks like you've lost your internet connection. Please check your network settings and try again."
            )}
          </motion.p>

          {/* Connection Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${
              isOnline 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            <motion.div
              animate={isOnline ? {} : { scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-300' : 'text-red-300'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <LoadingButton
              variant={isOnline ? "primary" : "secondary"}
              size="lg"
              onClick={handleRetry}
              isLoading={isRetrying}
              className="min-w-[160px]"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              {isOnline ? 'Continue' : 'Try Again'}
            </LoadingButton>

            {!isOnline && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                Reload Page
              </button>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-6 pt-4 border-t border-white/10"
          >
            {!isOnline && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Connection troubleshooting:
                </p>
                <ul className="text-gray-500 text-xs space-y-1 text-left">
                  <li>• Check your WiFi or ethernet connection</li>
                  <li>• Verify your router is working properly</li>
                  <li>• Try refreshing the page</li>
                  <li>• Contact your internet service provider</li>
                </ul>
              </div>
            )}
            {isOnline && (
              <p className="text-gray-400 text-sm">
                Your connection is stable and ready to use.
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isOnline ? 15 : 10, repeat: Infinity, ease: "linear" }}
        className={`absolute top-10 right-10 w-4 h-4 border-2 rounded-full ${
          isOnline ? 'border-green-400/30' : 'border-red-400/30'
        }`}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: isOnline ? 20 : 15, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-10 left-10 w-6 h-6 border-2 rotate-45 ${
          isOnline ? 'border-blue-400/30' : 'border-orange-400/30'
        }`}
      />
    </div>
  );
};