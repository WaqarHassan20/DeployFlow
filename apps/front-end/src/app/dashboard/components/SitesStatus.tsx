"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  ExternalLink
} from "lucide-react";

const SitesStatus: React.FC = () => {
  const sites = [
    {
      name: "Production API",
      url: "api.deployflow.com",
      status: "online",
      uptime: "99.9%",
      responseTime: "45ms",
      lastChecked: "2 min ago"
    },
    {
      name: "Frontend App",
      url: "app.deployflow.com",
      status: "online",
      uptime: "99.8%",
      responseTime: "120ms",
      lastChecked: "1 min ago"
    },
    {
      name: "Documentation",
      url: "docs.deployflow.com",
      status: "warning",
      uptime: "97.2%",
      responseTime: "890ms",
      lastChecked: "3 min ago"
    },
    {
      name: "Analytics Service",
      url: "analytics.deployflow.com",
      status: "offline",
      uptime: "95.1%",
      responseTime: "N/A",
      lastChecked: "5 min ago"
    },
    {
      name: "CDN Gateway",
      url: "cdn.deployflow.com",
      status: "online",
      uptime: "99.9%",
      responseTime: "12ms",
      lastChecked: "30 sec ago"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "offline":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "warning":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "offline":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "warning":
        return "Slow";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg ring-1 ring-white/10">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Site Status</h3>
            <p className="text-white/60 text-sm">Monitor your deployments</p>
          </div>
        </div>
        
        {/* Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">3 Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white/70 text-sm">1 Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-white/70 text-sm">1 Offline</span>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="space-y-4">
        {sites.map((site, index) => (
          <motion.div
            key={site.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Site Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(site.status)}
                  <div>
                    <h4 className="text-white font-medium">{site.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/50 text-sm">{site.url}</span>
                      <button className="p-1 rounded hover:bg-white/10 transition-colors">
                        <ExternalLink className="w-3 h-3 text-white/40" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Metrics */}
              <div className="flex items-center gap-6">
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(site.status)}`}>
                  {getStatusText(site.status)}
                </span>

                {/* Metrics */}
                <div className="text-right">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-white/50">Uptime: </span>
                      <span className="text-white font-medium">{site.uptime}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Response: </span>
                      <span className="text-white font-medium">{site.responseTime}</span>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mt-1">{site.lastChecked}</p>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-3">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: site.uptime }}
                  transition={{ delay: 1 + index * 0.1, duration: 1 }}
                  className={`h-full rounded-full ${
                    site.status === 'online' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : site.status === 'warning'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-white/50 text-sm">Last updated: Just now</span>
        <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
          View All Sites →
        </button>
      </div>
    </motion.div>
  );
};

export default SitesStatus;