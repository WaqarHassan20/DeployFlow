"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Shield, Zap, Globe } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Deploy your applications in seconds with our optimized build pipeline and global CDN network."
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade security with SSL certificates, DDoS protection, and compliance standards."
    },
    {
      icon: Zap,
      title: "Auto-Scaling",
      description: "Handle any traffic spike automatically with intelligent scaling and load balancing."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "50+ edge locations worldwide ensure your users get the fastest possible experience."
    }
  ];

  return (
    <section id="features" className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">Why Choose DeployFlow?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for developers who demand excellence. Every feature designed 
            to make your deployment experience seamless and powerful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};