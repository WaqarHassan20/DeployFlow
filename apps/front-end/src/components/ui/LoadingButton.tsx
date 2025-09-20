"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "google" | "github" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

export const LoadingButton = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  icon,
}: LoadingButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-purple-500/30 hover:border-purple-500/50";
      case "secondary":
        return "backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 text-white";
      case "google":
        return "backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white";
      case "github":
        return "backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white";
      case "success":
        return "backdrop-blur-xl bg-green-500/20 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/30 text-green-300";
      case "danger":
        return "backdrop-blur-xl bg-red-500/20 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/30 text-red-300";
      default:
        return "backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 text-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  };

  const dotVariants = {
    bounce: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-medium rounded-xl border transition-all duration-300 group
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      animate={isLoading ? { scale: [1, 1.02, 1] } : {}}
      transition={isLoading ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      {/* Button Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            {/* Animated Loading Spinner */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Primary Spinner */}
              <motion.div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Bouncing Dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-current rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {icon && (
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {icon}
              </motion.div>
            )}
            <span>{children}</span>
          </motion.div>
        )}
      </div>
      
      {/* Glow Effect for Primary Buttons */}
      {variant === "primary" && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300 -z-10" />
      )}
    </motion.button>
  );
};

// Predefined button styles for common use cases
export const PrimaryButton = (props: Omit<LoadingButtonProps, "variant">) => (
  <LoadingButton {...props} variant="primary" />
);

export const GoogleButton = (props: Omit<LoadingButtonProps, "variant">) => (
  <LoadingButton {...props} variant="google" />
);

export const GithubButton = (props: Omit<LoadingButtonProps, "variant">) => (
  <LoadingButton {...props} variant="github" />
);

export const SecondaryButton = (props: Omit<LoadingButtonProps, "variant">) => (
  <LoadingButton {...props} variant="secondary" />
);