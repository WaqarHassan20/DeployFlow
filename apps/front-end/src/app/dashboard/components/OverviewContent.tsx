"use client";

import React from "react";
import { motion } from "framer-motion";
import StatsCards from "./StatsCards";
import TrafficChart from "./TrafficChart";
import PerformanceChart from "./PerformanceChart";
import SitesStatus from "./SitesStatus";
import RecentActivity from "./RecentActivity";

const OverviewContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
     
      <div>
      <StatsCards />
      </div>


      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart />
          <PerformanceChart />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SitesStatus />
          <RecentActivity />
        </div> */}
      </div>
    </motion.div>
  );
};

export default OverviewContent;