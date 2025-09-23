"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SplineRocketProps {
  className?: string;
  splineUrl?: string;
  width?: string;
  height?: string;
}

export const SplineRocket: React.FC<SplineRocketProps> = ({ 
  className = "",
  width = "100%",
  height = "100%"
}) => {
  const [isInteracting, setIsInteracting] = useState(false);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* 3D-like Rocket with CSS */}
      <motion.div
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotateY: isInteracting ? [0, 360] : [0, 15, 0, -15, 0],
          rotateX: isInteracting ? [0, 10, 0] : [0, 5, 0],
        }}
        transition={{
          duration: isInteracting ? 2 : 8,
          repeat: isInteracting ? Infinity : Infinity,
          ease: "easeInOut"
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Rocket Body */}
        <motion.div 
          className="relative"
          animate={{ 
            y: [-5, 5, -5],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Main Rocket SVG */}
          <motion.svg
            width="300"
            height="400"
            viewBox="0 0 200 300"
            className="drop-shadow-xl"
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))",
                "drop-shadow(0 0 12px rgba(255, 255, 255, 0.15))",
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Rocket Body Gradient */}
            <defs>
              <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="50%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>
              <linearGradient id="fireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#F7931E" />
                <stop offset="100%" stopColor="#FFE66D" />
              </linearGradient>
            </defs>
            
            {/* Rocket Body */}
            <ellipse cx="100" cy="80" rx="40" ry="60" fill="url(#rocketGradient)" />
            
            {/* Rocket Nose */}
            <path d="M 100 20 L 80 80 L 120 80 Z" fill="url(#rocketGradient)" />
            
            {/* Rocket Fins */}
            <path d="M 70 120 L 60 160 L 80 140 Z" fill="#374151" />
            <path d="M 130 120 L 140 160 L 120 140 Z" fill="#374151" />
            
            {/* Window */}
            <circle cx="100" cy="60" r="15" fill="#1F2937" opacity="0.9" />
            <circle cx="100" cy="60" r="10" fill="#374151" opacity="0.7" />
            
            {/* Rocket Fire/Exhaust */}
            <motion.path
              d="M 85 140 Q 100 180 115 140 Q 100 200 85 140"
              fill="url(#fireGradient)"
              animate={{
                d: [
                  "M 85 140 Q 100 180 115 140 Q 100 200 85 140",
                  "M 85 140 Q 100 190 115 140 Q 100 220 85 140",
                  "M 85 140 Q 100 175 115 140 Q 100 195 85 140",
                  "M 85 140 Q 100 180 115 140 Q 100 200 85 140"
                ],
                opacity: [0.8, 1, 0.6, 0.8]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.svg>

          {/* Floating Particles */}
          {[
            { left: 130, top: 150 }, // 0°
            { left: 119, top: 81 },  // 60°
            { left: 89, top: 81 },   // 120°
            { left: 50, top: 150 },  // 180°
            { left: 89, top: 219 },  // 240°
            { left: 119, top: 219 }  // 300°
          ].map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gray-400 rounded-full"
              style={{
                left: `${position.left}px`,
                top: `${position.top}px`
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.8, 0.3],
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Interactive Hints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 text-xs text-center bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm"
        >
          Click and drag to interact
        </motion.p>
      </motion.div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-white/2 to-transparent rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default SplineRocket;