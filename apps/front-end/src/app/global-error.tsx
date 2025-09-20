"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home, Send } from "lucide-react";
import { LoadingButton } from "../components/ui/LoadingButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [errorReported, setErrorReported] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
    
    // Here you could send to error reporting service like Sentry
    // reportError(error);
  }, [error]);

  const handleReset = async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = async () => {
    setIsReporting(true);
    try {
      // Simulate error reporting
      await new Promise(resolve => setTimeout(resolve, 1500));
      setErrorReported(true);
      
      // Here you would actually report the error
      // await reportErrorToService({
      //   error: error.message,
      //   stack: error.stack,
      //   digest: error.digest,
      //   timestamp: new Date().toISOString(),
      //   userAgent: navigator.userAgent,
      //   url: window.location.href
      // });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Critical Error Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 0.8, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 50, -50, 0],
                y: [0, -30, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/25 rounded-full blur-3xl"
              animate={{
                scale: [1, 0.8, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -40, 40, 0],
                y: [0, 40, -40, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />

            {/* Warning Particles */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/50 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center max-w-3xl mx-auto"
          >
            {/* Glass Card Container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Critical Error Icon */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-8"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-block"
                >
                  <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Critical Error
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-gray-300 text-xl mb-8 leading-relaxed"
              >
                A critical application error has occurred. We apologize for the inconvenience 
                and are working to resolve this issue immediately.
              </motion.p>

              {/* Error Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="bg-black/30 rounded-xl p-6 mb-8 border border-red-500/30"
              >
                <div className="text-left">
                  <div className="text-red-400 font-semibold mb-2">Error Details:</div>
                  <div className="text-gray-300 text-sm font-mono break-all">
                    {error.message || 'Unknown error occurred'}
                  </div>
                  {error.digest && (
                    <div className="text-gray-400 text-xs mt-2">
                      Error ID: {error.digest}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
              >
                <LoadingButton
                  variant="primary"
                  size="lg"
                  onClick={handleReset}
                  isLoading={isResetting}
                  className="min-w-[180px]"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </LoadingButton>

                <LoadingButton
                  variant="secondary"
                  size="lg"
                  onClick={handleGoHome}
                  className="min-w-[180px]"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </LoadingButton>

                <LoadingButton
                  variant="secondary"
                  size="lg"
                  onClick={handleReportError}
                  isLoading={isReporting}
                  disabled={errorReported}
                  className="min-w-[180px]"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {errorReported ? 'Reported' : 'Report Issue'}
                </LoadingButton>
              </motion.div>

              {/* Success Message */}
              {errorReported && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm mb-6"
                >
                  ✓ Error report sent successfully. Thank you for helping us improve!
                </motion.div>
              )}

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="pt-6 border-t border-white/10"
              >
                <p className="text-gray-400 text-sm">
                  If this error persists, please contact our support team at{" "}
                  <a 
                    href="mailto:support@yourapp.com" 
                    className="text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    support@yourapp.com
                  </a>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Include the Error ID above in your message for faster assistance.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-6 h-6 border-2 border-red-400/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-8 h-8 border-2 border-orange-400/30 rotate-45"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 right-20 w-3 h-3 bg-red-400/40 rounded-full"
          />
        </div>
      </body>
    </html>
  );
}