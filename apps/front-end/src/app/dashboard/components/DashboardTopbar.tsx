"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Activity, Wifi, WifiOff } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface TopbarProps {
  activeTab: string;
}

const DashboardTopbar: React.FC<TopbarProps> = ({ activeTab }) => {
  const { data: session } = useSession();
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendHealth = async () => {
    try {
      let baseURL = 'http://localhost:9000';
      if (process.env.NEXT_PUBLIC_API_URL) {
        baseURL = process.env.NEXT_PUBLIC_API_URL;
      } else if (typeof window !== 'undefined') {
        const proto = window.location.protocol;
        const host = window.location.hostname;
        baseURL = `${proto}//${host}:9000`;
      }
      
      const response = await axios.get(`${baseURL}/health`, {
        timeout: 1000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200) {
        setHealthStatus('online');
      } else {
        setHealthStatus('offline');
      }
      setLastChecked(new Date());
    } catch (error) {
      setHealthStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 1000);
    return () => clearInterval(interval);
  }, []);

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-900/50 via-gray-900/50 to-black/50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="flex items-center gap-6">
        <motion.div 
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-300 min-w-[200px]"
          whileHover={{ scale: 1.02 }}
        >
          {healthStatus === 'checking' && (
            <>
              <Activity className="w-5 h-5 text-yellow-400 animate-spin" />
              <div className="flex flex-col">
                <span className="text-sm text-yellow-400 font-semibold">Checking API...</span>
                <span className="text-xs text-white/50">Real-time monitoring</span>
              </div>
            </>
          )}
          {healthStatus === 'online' && (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <div className="flex flex-col">
                <span className="text-sm text-green-400 font-semibold">API Online</span>
                <span className="text-xs text-white/60">
                  {lastChecked ? `Live • ${lastChecked.toLocaleTimeString()}` : 'Connected'}
                </span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
            </>
          )}
          {healthStatus === 'offline' && (
            <>
              <WifiOff className="w-5 h-5 text-red-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-sm text-red-400 font-semibold">API Offline</span>
                <span className="text-xs text-white/50">
                  {lastChecked ? `Failed • ${lastChecked.toLocaleTimeString()}` : 'Connection lost'}
                </span>
              </div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce ml-auto" />
            </>
          )}
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {getUserInitials(session?.user?.name)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white font-medium text-sm">
                {session?.user?.name || "User"}
              </p>
              <p className="text-white/50 text-xs">
                {session?.user?.email || "user@example.com"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default DashboardTopbar;
