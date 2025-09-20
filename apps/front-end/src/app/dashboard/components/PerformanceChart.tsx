"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";

const PerformanceChart: React.FC = () => {
  // Mock performance data
  const performanceData = [
    { time: "00:00", responseTime: 45, cpu: 12, memory: 28 },
    { time: "04:00", responseTime: 38, cpu: 8, memory: 24 },
    { time: "08:00", responseTime: 92, cpu: 35, memory: 56 },
    { time: "12:00", responseTime: 125, cpu: 58, memory: 72 },
    { time: "16:00", responseTime: 87, cpu: 42, memory: 68 },
    { time: "20:00", responseTime: 67, cpu: 28, memory: 45 },
    { time: "24:00", responseTime: 52, cpu: 15, memory: 32 }
  ];

  const maxResponseTime = Math.max(...performanceData.map(d => d.responseTime));
  const maxCpu = Math.max(...performanceData.map(d => d.cpu));
  const maxMemory = Math.max(...performanceData.map(d => d.memory));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg ring-1 ring-white/10">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Performance</h3>
            <p className="text-white/60 text-sm">Server metrics over 24h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-green-400">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Optimal</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <span className="text-white/70 text-sm">Response Time (ms)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          <span className="text-white/70 text-sm">CPU Usage (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className="text-white/70 text-sm">Memory (%)</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64 mb-6">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {[0, 100, 200, 300, 400].map((x) => (
            <line
              key={x}
              x1={x}
              y1="0"
              x2={x}
              y2="200"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Response Time Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            d={`M ${performanceData.map((d, i) => 
              `${(i / (performanceData.length - 1)) * 400},${200 - (d.responseTime / maxResponseTime) * 180}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* CPU Usage Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
            d={`M ${performanceData.map((d, i) => 
              `${(i / (performanceData.length - 1)) * 400},${200 - (d.cpu / maxCpu) * 180}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Memory Usage Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.9 }}
            d={`M ${performanceData.map((d, i) => 
              `${(i / (performanceData.length - 1)) * 400},${200 - (d.memory / maxMemory) * 180}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#gradient3)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {performanceData.map((d, i) => (
            <g key={i}>
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                cx={(i / (performanceData.length - 1)) * 400}
                cy={200 - (d.responseTime / maxResponseTime) * 180}
                r="4"
                fill="#06b6d4"
                className="drop-shadow-lg"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                cx={(i / (performanceData.length - 1)) * 400}
                cy={200 - (d.cpu / maxCpu) * 180}
                r="4"
                fill="#f59e0b"
                className="drop-shadow-lg"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                cx={(i / (performanceData.length - 1)) * 400}
                cy={200 - (d.memory / maxMemory) * 180}
                r="4"
                fill="#a855f7"
                className="drop-shadow-lg"
              />
            </g>
          ))}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time Labels */}
        <div className="flex justify-between mt-2">
          {performanceData.map((d, i) => (
            <span key={i} className="text-white/50 text-xs">
              {d.time}
            </span>
          ))}
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xl font-bold text-cyan-400">52ms</p>
          <p className="text-white/60 text-sm">Response Time</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-yellow-400">15%</p>
          <p className="text-white/60 text-sm">CPU Usage</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-purple-400">32%</p>
          <p className="text-white/60 text-sm">Memory</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;