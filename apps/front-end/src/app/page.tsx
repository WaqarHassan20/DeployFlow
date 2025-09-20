"use client";

import { useState, useEffect } from "react";
import {
  AnimatedBackground,
  Navigation,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  Footer
} from "../components/landingPage";
import { useRouter } from "next/navigation";
import { FullScreenLoading } from "../components/ui";
import { LoadingProvider, useLoading } from "../components/providers";

function LandingPageContent() {
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setGlobalLoading, isGlobalLoading, loadingMessage } = useLoading();

  // Show loading screen for initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = async () => {
    setGlobalLoading(true, "Redirecting to login...");
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push("/auth/login");
    setGlobalLoading(false);
  }

  const handleSignupClick = async () => {
    setGlobalLoading(true, "Redirecting to signup...");
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push("/auth/signup");
    setGlobalLoading(false);
  }

  return (
    <>
      {/* Global Loading State */}
      <FullScreenLoading 
        isVisible={isGlobalLoading} 
        message={loadingMessage}
        variant="minimal"
      />

      {/* Initial Loading Screen */}
      <FullScreenLoading isVisible={isInitialLoading} message="Welcome to CloudMorph" />
      
      <div className="min-h-screen bg-background overflow-x-hidden relative">
        {/* Global Animated Background */}
        <div className="fixed inset-0 z-0">
          <AnimatedBackground />
        </div>

        <Navigation
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default function LandingPage() {
  return (
    <LoadingProvider>
      <LandingPageContent />
    </LoadingProvider>
  );
}
