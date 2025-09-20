"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="relative z-10 px-6 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">DeployFlow</span>
            </motion.div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The most advanced deployment platform for modern developers. 
              Deploy with confidence, scale with ease.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
                { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Documentation', 'API Reference', 'Integrations', 'Status Page'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Contact', 'Press Kit', 'Partners'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Community', 'Discord', 'Security', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-white/10">
          <p className="text-muted-foreground text-sm">
            © 2025 DeployFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <motion.a 
                key={item}
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                whileHover={{ y: -1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};