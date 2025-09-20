"use client";

import React from "react";
import { Navigation } from "./landingPage/Navigation";
import { AnimatedBackground } from "./landingPage/AnimatedBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  // Dummy handlers for navigation buttons since they're not needed in auth context
  const handleLoginClick = () => {
    window.location.href = '/auth/login';
  };

  const handleSignupClick = () => {
    window.location.href = '/auth/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      
      {/* Main Content Area */}
      <main className="relative z-10 pt-20 pb-16">
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
          {children}
        </div>
      </main>
    </div>
  );
};