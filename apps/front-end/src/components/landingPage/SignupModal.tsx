"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Lock, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useLoading } from "../providers/LoadingProvider";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) => {
  const [formData, setFormData] = useState({ 
    email: "", 
    name: "", 
    password: "", 
    agreeToTerms: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { setGlobalLoading } = useLoading();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setGlobalLoading(true, "Creating your account...");

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setGlobalLoading(false);
        setIsLoading(false);
        return;
      }

      setSuccess('Account created successfully! Auto-signing you in...');
      setGlobalLoading(true, "Signing you in...");
      
      // Auto-sign in after successful registration
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          setGlobalLoading(true, "Redirecting to dashboard...");
          onClose();
          await new Promise(resolve => setTimeout(resolve, 1500));
          window.location.href = '/dashboard';
        } else {
          setError('Account created but auto-login failed. Please sign in manually.');
          setTimeout(() => {
            onSwitchToLogin();
          }, 2000);
          setGlobalLoading(false);
        }
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      setError('Network error. Please try again.');
      setGlobalLoading(false);
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError(null);
    setGlobalLoading(true, `Connecting with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);
    
    try {
      await signIn(provider, {
        callbackUrl: '/dashboard'
      });
    } catch (err) {
      setError('OAuth sign up failed');
      setGlobalLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md backdrop-blur-xl bg-gray-900/80 border border-white/20 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    <span className="text-white text-sm">Processing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1 text-white/50 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                  {success}
                </div>
              )}

              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm disabled:opacity-50"
                  required
                />
              </div>

              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm disabled:opacity-50"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm disabled:opacity-50"
                  required
                />
              </div>

              <div className="text-sm">
                <label className="flex items-start text-white/70">
                  <input 
                    type="checkbox" 
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="mr-2 mt-0.5 rounded disabled:opacity-50" 
                    required 
                  />
                  <span>I agree to the <button type="button" className="text-cyan-400 hover:text-cyan-300">Terms</button> and <button type="button" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</button></span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={!formData.agreeToTerms || isLoading}
                className={`w-full py-3 backdrop-blur-xl border font-medium rounded-lg transition-all duration-300 ${
                  formData.agreeToTerms && !isLoading
                    ? 'bg-white/10 border-white/20 hover:border-white/40 text-white' 
                    : 'bg-white/5 border-white/10 text-white/50 cursor-not-allowed'
                }`}
                whileHover={formData.agreeToTerms && !isLoading ? { scale: 1.02 } : {}}
                whileTap={formData.agreeToTerms && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-r from-slate-900/90 to-gray-900/90 text-white/50">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-6">
              <motion.button 
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 rounded-lg text-white text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button 
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 rounded-lg text-white text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </motion.button>
            </div>

            <p className="text-center mt-4 text-sm text-white/70">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};