"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, LogIn, UserPlus, Menu } from "lucide-react";
import { LoadingButton, FullScreenLoading } from "../ui";
import { useRouter } from "next/navigation";

interface NavigationProps {
  onLoginClick: () => Promise<void> | void;
  onSignupClick: () => Promise<void> | void;
}

export const Navigation = ({ onLoginClick, onSignupClick }: NavigationProps) => {
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(false);

  const handleLogoClick = async () => {
    setIsLogoLoading(true);
    // Add delay to show the loading animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/');
    setIsLogoLoading(false);
  };

  const handleLoginClick = async () => {
    setIsLoginLoading(true);
    try {
      await onLoginClick();
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignupClick = async () => {
    setIsSignupLoading(true);
    try {
      await onSignupClick();
    } finally {
      setIsSignupLoading(false);
    }
  };
  return (
    <>
      {/* Full Screen Loading Overlay */}
      <FullScreenLoading isVisible={isLogoLoading} />
      
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/5 border-b border-white/5 shadow-2xl"
      >
      <div className="max-w-7xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleLogoClick}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">DeployFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {["Features", "Pricing","Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-white/5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                {item}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <LoadingButton
                onClick={handleLoginClick}
                isLoading={isLoginLoading}
                variant="github"
                size="sm"
                className="h-9 px-4 text-sm"
                icon={<LogIn className="w-4 h-4" />}
              >
                Sign In
              </LoadingButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <LoadingButton
                onClick={handleSignupClick}
                isLoading={isSignupLoading}
                variant="secondary"
                size="sm"
                className="h-9 px-4 text-sm"
                icon={<UserPlus className="w-4 h-4" />}
              >
                Get Started
              </LoadingButton>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden h-9 w-9 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
            onClick={() => alert("Mobile menu clicked")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Menu className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
    </>
  );
};