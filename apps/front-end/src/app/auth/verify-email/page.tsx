"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setVerificationStatus('verifying');
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('Your email has been successfully verified! You can now sign in to your account.');
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
      } else {
        setResendMessage({ type: 'error', text: data.message || 'Failed to resend verification email.' });
      }
    } catch (error) {
      setResendMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verifying':
        return <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />;
      case 'success':
        return <Check size={32} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={32} className="text-red-400" />;
      default:
        return <Mail size={32} className="text-cyan-400" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'Verifying Email...';
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Verify Your Email';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <>
      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-xl bg-gray-900/80 border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          {getStatusIcon()}
        </motion.div>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold mb-2 ${getStatusColor()}`}
          >
            {getStatusTitle()}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70"
          >
            {message || (!token ? 
              "We've sent a verification email to your address. Please click the link in the email to verify your account." :
              "Please wait while we verify your email address..."
            )}
          </motion.p>
        </div>

        {/* Email Display */}
        {email && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-center"
          >
            <p className="text-white/70 text-sm mb-1">Email sent to:</p>
            <p className="text-white font-medium">{email}</p>
          </motion.div>
        )}

        {/* Resend Section */}
        {(verificationStatus === 'error' || (!token && email)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            {resendMessage && (
              <div className={`p-3 border rounded-xl text-sm mb-4 flex items-center gap-2 ${
                resendMessage.type === 'error' 
                  ? 'bg-red-500/20 border-red-500/30 text-red-300'
                  : 'bg-green-500/20 border-green-500/30 text-green-300'
              }`}>
                {resendMessage.type === 'success' && <Check size={16} />}
                {resendMessage.text}
              </div>
            )}
            
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full py-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  Resend Verification Email
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          {verificationStatus === 'success' ? (
            <Link
              href="/auth/login"
              className="w-full py-4 backdrop-blur-xl bg-green-500/20 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/30 text-green-300 font-medium rounded-xl transition-all duration-300 group flex items-center justify-center gap-2"
            >
              Continue to Sign In
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="w-full py-4 backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 text-white font-medium rounded-xl transition-all duration-300 group flex items-center justify-center gap-2"
            >
              Go to Sign In
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Help Section
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl"
        >
          <h3 className="text-white font-medium mb-2">Didn't receive the email?</h3>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes and try again</li>
          </ul>
          <Link 
            href="/contact" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium mt-3 inline-block"
          >
            Still need help? Contact Support →
          </Link>
        </motion.div> */}
      </motion.div>
    </>
  );
}
