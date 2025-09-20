"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

const TrafficChart: React.FC = () => {
  // Mock data for the chart
  const trafficData = [
    { day: "Mon", visitors: 420, pageViews: 850 },
    { day: "Tue", visitors: 680, pageViews: 1200 },
    { day: "Wed", visitors: 520, pageViews: 980 },
    { day: "Thu", visitors: 890, pageViews: 1650 },
    { day: "Fri", visitors: 750, pageViews: 1420 },
    { day: "Sat", visitors: 340, pageViews: 720 },
    { day: "Sun", visitors: 290, pageViews: 580 }
  ];

  const maxValue = Math.max(...trafficData.map(d => Math.max(d.visitors, d.pageViews)));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg ring-1 ring-white/10">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Traffic Overview</h3>
            <p className="text-white/60 text-sm">Weekly visitor analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+23.5%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <span className="text-white/70 text-sm">Visitors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className="text-white/70 text-sm">Page Views</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="flex items-end justify-between h-full gap-2">
          {trafficData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              {/* Bars */}
              <div className="flex items-end gap-1 h-48 w-full justify-center">
                {/* Visitors Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.visitors / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="w-3 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm shadow-lg"
                />
                
                {/* Page Views Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.pageViews / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.8, ease: "easeOut" }}
                  className="w-3 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-sm shadow-lg"
                />
              </div>
              
              {/* Day Label */}
              <span className="text-white/50 text-xs font-medium">{data.day}</span>
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[25, 50, 75].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-white/5"
              style={{ top: `${100 - percent}%` }}
            />
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">4,380</p>
          <p className="text-white/60 text-sm">Total Visitors</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">8,400</p>
          <p className="text-white/60 text-sm">Total Page Views</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TrafficChart;