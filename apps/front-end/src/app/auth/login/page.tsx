"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton, GoogleButton, GithubButton } from "../../../components/ui";
import { FullPageLoading } from "../../../components/ui/FullPageLoading";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    const messageParam = searchParams?.get("message");
    if (messageParam) {
      setMessage(decodeURIComponent(messageParam));
      // Clear message from URL after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (message) setMessage(null);
  };

  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFullPageLoading(true);
    setError(null);

    // Set remember me cookie before sign in
    if (rememberMe) {
      document.cookie = "remember-me=true; path=/; max-age=7776000"; // 90 days
    } else {
      document.cookie = "remember-me=false; path=/; max-age=0"; // Remove cookie
    }

    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError(result.error);
      setIsFullPageLoading(false);
    } else if (result?.ok) {
      // Keep loading while redirecting
      router.push(result.url || callbackUrl);
    }

    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setIsFullPageLoading(true);
    setError(null);
    
    await signIn(provider, {
      callbackUrl: '/dashboard'
    });
  };

  return (
    <>
      <AnimatePresence>
        {isFullPageLoading && (
          <FullPageLoading 
            message="Signing you in..." 
            submessage="Verifying your credentials and setting up your session"
          />
        )}
      </AnimatePresence>
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md backdrop-blur-xl bg-gray-900/80 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70"
          >
            Sign in to your account
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center gap-2"
            >
              <Check size={16} />
              {message}
            </motion.div>
          )}
          
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
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 focus:border-white/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
              required
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-white/70 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 w-4 h-4 rounded border border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30" 
              />
              Remember me
            </label>
            <Link 
              href="/auth/reset-password" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              variant="secondary"
              size="lg"
              className="w-full"
              icon={<ArrowRight size={16} />}
            >
              Sign In
            </LoadingButton>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-900/80 text-white/50">or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex-1"
          >
            <GoogleButton
              onClick={() => handleOAuthSignIn('google')}
              isLoading={isLoading}
              className="w-full"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              Google
            </GoogleButton>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex-1"
          >
            <GithubButton
              onClick={() => handleOAuthSignIn('github')}
              isLoading={isLoading}
              className="w-full"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              }
            >
              GitHub
            </GithubButton>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-sm text-white/70"
        >
          Don't have an account?{" "}
          <Link 
            href="/auth/signup" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </>
  );
}