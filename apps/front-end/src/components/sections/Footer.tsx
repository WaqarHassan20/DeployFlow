'use client'

import { Cloud, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export const Footer = () => {
  const handleSocialClick = (platform: string) => {
    // TODO: Implement social media links
    console.log(`${platform} clicked`)
  }

  const handleLinkClick = (link: string) => {
    // TODO: Implement navigation to pages
    console.log(`${link} clicked`)
  }

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup
    console.log('Newsletter signup')
  }

  return (
    <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CloudMorph</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The next-generation platform for deploying and scaling modern web applications. 
              Fast, secure, and developer-friendly.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <h4 className="text-white font-semibold mb-3">Stay updated</h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                >
                  <Mail className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Documentation', 'API Reference', 'Status'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleLinkClick(item)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleLinkClick(item)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CloudMorph. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[
              { icon: Github, platform: 'GitHub' },
              { icon: Twitter, platform: 'Twitter' },
              { icon: Linkedin, platform: 'LinkedIn' },
            ].map(({ icon: Icon, platform }) => (
              <button
                key={platform}
                onClick={() => handleSocialClick(platform)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}