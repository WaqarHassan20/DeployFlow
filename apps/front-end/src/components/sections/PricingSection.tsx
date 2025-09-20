'use client'

import { motion } from 'framer-motion'
import { PricingCard } from '../ui/PricingCard'

export const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Hobby",
      price: "Free",
      description: "Perfect for personal projects and learning",
      features: [
        "100GB bandwidth",
        "Unlimited static sites",
        "SSL certificates",
        "GitHub integration",
        "Community support"
      ],
      buttonText: "Start Free"
    },
    {
      name: "Pro",
      price: "$20",
      description: "For professionals and growing businesses",
      features: [
        "1TB bandwidth",
        "Custom domains",
        "Advanced analytics",
        "Priority support",
        "Team collaboration",
        "Preview deployments"
      ],
      buttonText: "Start Pro Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited bandwidth",
        "SLA guarantees",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
        "On-premise options"
      ],
      buttonText: "Contact Sales"
    }
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple,
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            All plans include our core features. No hidden fees.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 99.9% uptime SLA</span>
            <span>✓ 24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}