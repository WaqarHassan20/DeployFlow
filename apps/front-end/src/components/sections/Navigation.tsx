'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Cloud } from 'lucide-react'
import { Button } from '../ui/Button'
import { NavigationProps } from '@/types'

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleNavigation = (section: string) => {
    // TODO: Implement smooth scrolling to sections
    console.log(`Navigate to ${section}`)
    setIsMenuOpen(false)
  }

  const handleAuth = (action: 'login' | 'signup') => {
    // TODO: Implement authentication
    console.log(`${action} clicked`)
  }

  return (
    <nav className={`relative z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CloudMorph</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(item.toLowerCase())}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="glass" 
              size="sm"
              onClick={() => handleAuth('login')}
            >
              Log In
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => handleAuth('signup')}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
              {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(item.toLowerCase())}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                >
                  {item}
                </button>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <Button 
                  variant="glass" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleAuth('login')}
                >
                  Log In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleAuth('signup')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}