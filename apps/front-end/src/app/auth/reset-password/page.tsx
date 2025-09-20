"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Check, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  // Check token validity when component mounts
  useEffect(() => {
    if (token) {
      checkTokenValidity();
    }
  }, [token]);

  const checkTokenValidity = async () => {
    setIsCheckingToken(true);
    try {
      const response = await fetch(`/api/auth/reset-password?token=${token}`);
      const data = await response.json();
      setIsValidToken(data.valid);
      if (!data.valid) {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setIsValidToken(false);
      setMessage({ type: 'error', text: 'Failed to validate reset token' });
    } finally {
      setIsCheckingToken(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to send reset email' });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'If an account with that email exists, we\'ve sent you a password reset link.' 
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password' });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password reset successfully! You can now sign in with your new password.' 
        });
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking token
  if (token && isCheckingToken) {
    return (
      <div className="backdrop-blur-xl bg-gray-900/80 border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10 text-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Validating reset token...</p>
      </div>
    );
  }

  return (
    <>
      {/* Reset Password Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-xl bg-gray-900/80 border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {token && isValidToken ? 'Set New Password' : 'Reset Password'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70"
          >
            {token && isValidToken 
              ? 'Enter your new password below.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={token && isValidToken ? handlePasswordResetSubmit : handleForgotPasswordSubmit} className="space-y-6">
          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 border rounded-xl text-sm flex items-start gap-3 ${
                message.type === 'error' 
                  ? 'bg-red-500/20 border-red-500/30 text-red-300'
                  : 'bg-green-500/20 border-green-500/30 text-green-300'
              }`}
            >
              {message.type === 'success' && <Check size={18} className="mt-0.5 flex-shrink-0" />}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Show password reset form if valid token */}
          {token && isValidToken ? (
            <>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (message) setMessage(null);
                  }}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (message) setMessage(null);
                  }}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            </>
          ) : (
            /* Show email input for forgot password */
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (message) setMessage(null);
                }}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                required
              />
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {token && isValidToken ? 'Resetting Password...' : 'Sending Reset Link...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {token && isValidToken ? 'Reset Password' : 'Send Reset Link'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </motion.button>
        </form>

        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </motion.div>

        {/* Additional Help
        {(!token || !isValidToken) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl"
          >
            <h3 className="text-white font-medium mb-2">Need help?</h3>
            <p className="text-white/70 text-sm mb-3">
              If you're having trouble resetting your password, please contact our support team.
            </p>
            <Link 
              href="/contact" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              Contact Support →
            </Link>
          </motion.div>
        )} */}

        {/* Success action for password reset */}
        {token && isValidToken && message?.type === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <Link
              href="/auth/login"
              className="w-full py-4 backdrop-blur-xl bg-green-500/20 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/30 text-green-300 font-medium rounded-xl transition-all duration-300 group flex items-center justify-center gap-2"
            >
              Sign In Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
