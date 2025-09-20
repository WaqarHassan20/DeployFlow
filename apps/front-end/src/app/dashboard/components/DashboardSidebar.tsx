'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { 
  BarChart3, 
  Globe, 
  Users, 
  Server, 
  Activity, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  Rocket
} from 'lucide-react';
import { FullScreenLoading } from '../../../components/ui/FullScreenLoading';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sites", label: "Sites", icon: Globe },
    { id: "users", label: "Users", icon: Users },
    { id: "servers", label: "Servers", icon: Server },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Shield },
  ];

  const handleNavClick = (tab: string) => {
    if (isLoggingOut) return;
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      document.cookie = "remember-me=false; path=/; max-age=0";
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signOut({ 
        callbackUrl: "/auth/login",
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    }
  };

  return (
    <>
      {/* Desktop Sidebar - No animations to prevent refresh */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 lg:p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
                <Rocket className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                <p className="text-sm text-gray-400">Manage your projects</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${isLoggingOut ? 'bg-red-500/20 text-red-300 cursor-not-allowed' : 'text-gray-300 hover:bg-red-500/10 hover:text-red-400'}`}
            >
              {isLoggingOut ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-medium">Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-white/10 text-white rounded-lg shadow-lg backdrop-blur-xl"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 z-50 w-64 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Logo Section */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                      <p className="text-sm text-gray-400">Manage your projects</p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${isLoggingOut ? 'bg-red-500/20 text-red-300 cursor-not-allowed' : 'text-gray-300 hover:bg-red-500/10 hover:text-red-400'}`}
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-medium">Signing out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign out</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <FullScreenLoading isVisible={isLoggingOut} variant="rocket" />
    </>
  );
};

export default DashboardSidebar;
