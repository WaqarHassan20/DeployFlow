"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  Activity, 
  Server,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: "Active Sites",
      value: "24",
      change: "+12%",
      trend: "up" as const,
      icon: Globe,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10"
    },
    {
      title: "Total Users",
      value: "1,234",
      change: "+5.2%",
      trend: "up" as const,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10"
    },
    {
      title: "Server Uptime",
      value: "99.9%",
      change: "0%",
      trend: "stable" as const,
      icon: Server,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Active Sessions",
      value: "856",
      change: "-2.1%",
      trend: "down" as const,
      icon: Activity,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10"
    }
  ];

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border border-white/10 shadow-lg`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {/* Icon */}
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4 shadow-lg ring-1 ring-white/10`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-white/70 text-sm font-medium mb-2">{stat.title}</h3>
              
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                
                <div className="flex items-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div 
              className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.color} opacity-0`}
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;