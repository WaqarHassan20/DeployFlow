"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      
      setScrollProgress(Math.min(Math.max(currentProgress, 0), 100));
      setIsVisible(window.scrollY > 100); // Show after scrolling 100px
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-6 top-0 bottom-0 z-50 flex items-center"
    >
      {/* Progress Bar Container */}
      <div className="relative h-full py-20">
        {/* Background Track */}
        <div className="w-1 h-full bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
          {/* Progress Fill */}
          <motion.div
            className="w-full bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-600 rounded-full relative overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${scrollProgress}%` }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {/* Animated Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Progress Indicator Dot */}
        <motion.div
          className="absolute -left-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg border-2 border-white/30"
          style={{ top: `${scrollProgress}%` }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 10px rgba(168, 85, 247, 0.5)",
              "0 0 20px rgba(168, 85, 247, 0.8)",
              "0 0 10px rgba(168, 85, 247, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Side Navigation Dots */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-6">
        {[
          { id: "hero", label: "Hero" },
          { id: "features", label: "Features" },
          { id: "pricing", label: "Pricing" },
          { id: "cta", label: "Contact" }
        ].map((section) => (
          <motion.button
            key={section.id}
            className="group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const sectionElement = document.getElementById(section.id);
              if (sectionElement) {
                sectionElement.scrollIntoView({ 
                  behavior: "smooth",
                  block: "start"
                });
              }
            }}
          >
            <div className="w-3 h-3 bg-white/30 rounded-full border border-white/50 group-hover:bg-purple-500 group-hover:border-purple-400 group-hover:scale-125 transition-all duration-300" />
            
            {/* Section Label on Hover */}
            <motion.div
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              {section.label}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};