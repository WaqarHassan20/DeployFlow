"use client";

import React from "react";
import { motion } from "framer-motion";
import RecentActivity from "./RecentActivity";

const ActivityContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Activity</h2>
        <p className="text-white/60">Monitor all system activity and events</p>
      </div>

      {/* Enhanced Activity Component */}
      <RecentActivity />
    </motion.div>
  );
};

export default ActivityContent;