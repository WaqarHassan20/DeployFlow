"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Server, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Cpu,
  HardDrive,
  Wifi,
  Power,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const ServersContent: React.FC = () => {
  const servers = [
    {
      id: 1,
      name: "Production Server 1",
      region: "US East (N. Virginia)",
      status: "online",
      cpu: 23,
      memory: 67,
      storage: 45,
      uptime: "99.9%",
      ip: "54.123.45.67"
    },
    {
      id: 2,
      name: "Production Server 2",
      region: "Europe (Frankfurt)",
      status: "online",
      cpu: 45,
      memory: 78,
      storage: 62,
      uptime: "99.8%",
      ip: "52.234.56.78"
    },
    // {
    //   id: 3,
    //   name: "Staging Server",
    //   region: "Asia Pacific (Tokyo)",
    //   status: "warning",
    //   cpu: 89,
    //   memory: 94,
    //   storage: 87,
    //   uptime: "98.5%",
    //   ip: "13.345.67.89"
    // },
    // {
    //   id: 4,
    //   name: "Development Server",
    //   region: "US West (Oregon)",
    //   status: "offline",
    //   cpu: 0,
    //   memory: 0,
    //   storage: 34,
    //   uptime: "95.2%",
    //   ip: "35.456.78.90"
    // }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "offline":
        return <Power className="w-4 h-4 text-red-400" />;
      default:
        return <Power className="w-4 h-4 text-gray-400" />;
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

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "from-red-500 to-pink-500";
    if (usage >= 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Servers</h2>
          <p className="text-white/60">Monitor and manage your server infrastructure</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Server
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search servers..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Filter className="w-4 h-4" />
          Filter
        </motion.button>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servers.map((server, index) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{server.name}</h3>
                  <p className="text-white/60 text-sm">{server.region}</p>
                  <p className="text-white/40 text-xs mt-1">{server.ip}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                  {getStatusIcon(server.status)}
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </span>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <MoreVertical className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="space-y-4 mb-6">
              {/* CPU */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-white/70 text-sm">CPU Usage</span>
                  </div>
                  <span className="text-white font-medium">{server.cpu}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${server.cpu}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${getUsageColor(server.cpu)}`}
                  />
                </div>
              </div>

              {/* Memory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70 text-sm">Memory</span>
                  </div>
                  <span className="text-white font-medium">{server.memory}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${server.memory}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${getUsageColor(server.memory)}`}
                  />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-green-400" />
                    <span className="text-white/70 text-sm">Storage</span>
                  </div>
                  <span className="text-white font-medium">{server.storage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${server.storage}%` }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${getUsageColor(server.storage)}`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-sm">Uptime: {server.uptime}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-md text-xs font-medium transition-colors">
                  Connect
                </button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded-md text-xs font-medium transition-colors">
                  Logs
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <p className="text-green-400 text-2xl font-bold">2</p>
          <p className="text-white/60 text-sm">Online Servers</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
        >
          <p className="text-yellow-400 text-2xl font-bold">1</p>
          <p className="text-white/60 text-sm">Warning</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-2xl font-bold">1</p>
          <p className="text-white/60 text-sm">Offline</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
        >
          <p className="text-cyan-400 text-2xl font-bold">98.6%</p>
          <p className="text-white/60 text-sm">Avg Uptime</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServersContent;