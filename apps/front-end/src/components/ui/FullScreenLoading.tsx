"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Rocket } from "lucide-react";

interface FullScreenLoadingProps {
  isVisible: boolean;
  message?: string;
  variant?: 'default' | 'minimal' | 'rocket';
}

export const FullScreenLoading = ({ 
  isVisible, 
  message = "Loading...",
  variant = 'default' 
}: FullScreenLoadingProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black backdrop-blur-sm"
        >
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ left: '20%', top: '20%' }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 blur-3xl"
              animate={{
                scale: [1, 0.8, 1.1, 1],
                x: [0, -40, 20, 0],
                y: [0, 40, -20, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ right: '30%', bottom: '30%' }}
            />
          </div>

          {variant === 'minimal' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10"
            >
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-white font-medium">{message}</p>
            </motion.div>
          ) : variant === 'rocket' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [-10, -20, -10],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <Rocket className="w-12 h-12 text-cyan-400" />
                </motion.div>
                
                {/* Rocket trail */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-t from-orange-400 to-yellow-400 rounded-full"
                    animate={{
                      y: [0, 30, 60],
                      opacity: [1, 0.5, 0],
                      scale: [1, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    style={{ 
                      left: `${45 + Math.sin(i) * 5}%`, 
                      top: `${60 + i * 5}%` 
                    }}
                  />
                ))}
              </div>
              
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white font-medium text-lg"
              >
                {message}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 text-center"
            >
              <motion.div className="mb-8 relative">
                <div className="w-20 h-20 mx-auto relative">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                  
                  {/* Spinning gradient ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, #06b6d4, #8b5cf6, transparent)',
                      borderRadius: '50%',
                      mask: 'radial-gradient(circle, transparent 35%, black 36%, black 64%, transparent 65%)',
                      WebkitMask: 'radial-gradient(circle, transparent 35%, black 36%, black 64%, transparent 65%)'
                    }}
                  />
                  
                  {/* Center dot */}
                  <motion.div
                    className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">{message}</h2>
                
                {/* Animated dots */}
                <motion.div className="flex items-center justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="mt-6 max-w-xs mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
