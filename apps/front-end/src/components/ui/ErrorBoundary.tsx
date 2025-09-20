"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { LoadingButton } from "./LoadingButton"

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isReloading: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isReloading: false 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      isReloading: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Here you could send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = async () => {
    this.setState({ isReloading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Warning Orbs */}
            <motion.div
              className="absolute top-20 left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 0.9, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 0.9, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />

            {/* Error Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
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
            className="relative z-10 text-center max-w-2xl mx-auto"
          >
            {/* Glass Card Container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-4" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Oops! Something went wrong
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-gray-300 text-lg mb-6 leading-relaxed"
              >
                We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
              </motion.p>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-left mb-6 bg-black/30 rounded-lg p-4 border border-red-500/30"
                >
                  <summary className="cursor-pointer text-red-400 mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development)
                  </summary>
                  <div className="text-sm text-gray-300 font-mono">
                    <p className="text-red-300 mb-2">{this.state.error.message}</p>
                    <pre className="whitespace-pre-wrap text-xs text-gray-400 overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </motion.details>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <LoadingButton
                  variant="primary"
                  size="lg"
                  onClick={this.handleReload}
                  isLoading={this.state.isReloading}
                  className="min-w-[160px]"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
                </LoadingButton>

                <LoadingButton
                  variant="secondary"
                  size="lg"
                  onClick={this.handleGoHome}
                  className="min-w-[160px]"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </LoadingButton>

                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Try Again
                </button>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-gray-400 text-sm">
                  If the problem persists, please contact our{" "}
                  <a 
                    href="mailto:support@yourapp.com" 
                    className="text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    support team
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-4 h-4 border-2 border-red-400/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-6 h-6 border-2 border-orange-400/30 rotate-45"
          />
        </div>
      );
    }

    return this.props.children;
  }
}