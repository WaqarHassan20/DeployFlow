"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-white/5 to-white/3 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ scale: { duration: 4, repeat: Infinity } }}
        style={{ left: '10%', top: '20%' }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-white/3 to-white/4 blur-3xl"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{ scale: { duration: 3, repeat: Infinity } }}
        style={{ right: '10%', bottom: '20%' }}
      />

      {/* Floating Elements */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
};