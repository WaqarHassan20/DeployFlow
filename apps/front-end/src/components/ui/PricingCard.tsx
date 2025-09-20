'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from './Button'
import { PricingPlanProps } from '@/types'

export const PricingCard: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  buttonText,
  highlighted = false
}) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
        highlighted
          ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30 shadow-2xl shadow-cyan-500/20'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          {price !== 'Free' && price !== 'Custom' && (
            <span className="text-gray-400 ml-2">/month</span>
          )}
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      
      <Button 
        variant={highlighted ? 'primary' : 'glass'} 
        className="w-full"
        onClick={() => {
          // TODO: Implement pricing plan selection
          console.log(`Selected ${name} plan`)
        }}
      >
        {buttonText}
      </Button>
      
      {highlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl -z-10" />
      )}
    </motion.div>
  )
}