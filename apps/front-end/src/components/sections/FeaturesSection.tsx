'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Code, GitBranch, BarChart } from 'lucide-react'
import { FeatureCard } from '../ui/FeatureCard'

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Deploy your applications in seconds with our optimized build pipeline and global edge network."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with automatic SSL, DDoS protection, and compliance certifications."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global CDN",
      description: "Deliver content at lightning speed with our worldwide network of edge servers."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Any Framework",
      description: "Support for React, Vue, Angular, Svelte, and more. Deploy any static or serverless app."
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Git Integration",
      description: "Seamless integration with GitHub, GitLab, and Bitbucket for automatic deployments."
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Analytics & Insights",
      description: "Real-time performance monitoring, visitor analytics, and deployment insights."
    }
  ]

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black opacity-60" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: '-10%', top: '20%' }}
        />
        
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/15 to-teal-500/15 blur-3xl"
          animate={{
            scale: [1, 0.8, 1.1, 1],
            x: [0, -80, 40, 0],
            y: [0, 60, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ right: '-5%', bottom: '10%' }}
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm">
              <span className="text-cyan-300 text-sm font-medium tracking-wide uppercase">
                ✨ Enterprise-Grade Platform
              </span>
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Everything you need to
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                deploy with confidence
              </span>
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            From development to production, CloudMorph provides all the tools and infrastructure 
            you need to build, deploy, and scale your applications with enterprise-level reliability.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">&lt; 100ms</div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">200+</div>
              <div className="text-gray-400 text-sm">Global Edges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400">50M+</div>
              <div className="text-gray-400 text-sm">Deployments</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="group relative"
            >
              {/* Enhanced Feature Card */}
              <div className="relative h-full">
                {/* Background gradient that animates on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                
                {/* Card content */}
                <div className="relative h-full p-8 lg:p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                  {/* Icon with enhanced styling */}
                  <div className="relative mb-6">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-cyan-50 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-400 mb-8">
            Ready to experience the future of deployment?
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}