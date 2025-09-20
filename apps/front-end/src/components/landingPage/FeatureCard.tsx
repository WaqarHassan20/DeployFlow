"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="rounded-xl glass-card p-8 h-full hover:glow-purple transition-all duration-500 backdrop-blur-xl bg-white/3 border border-white/8 hover:border-white/15">
      <Icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
      <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);