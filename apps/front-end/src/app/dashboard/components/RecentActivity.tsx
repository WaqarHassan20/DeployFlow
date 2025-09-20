"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  GitCommit, 
  Upload, 
  AlertCircle,
  CheckCircle,
  Users,
  Clock
} from "lucide-react";

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: "deployment",
      title: "Deployed to production",
      description: "Frontend app v2.1.0 deployed successfully",
      user: "John Doe",
      timestamp: "2 minutes ago",
      status: "success",
      icon: Upload
    },
    {
      id: 2,
      type: "commit",
      title: "New commit pushed",
      description: "Fix authentication bug in login flow",
      user: "Sarah Chen",
      timestamp: "5 minutes ago",
      status: "info",
      icon: GitCommit
    },
    {
      id: 3,
      type: "alert",
      title: "High response time detected",
      description: "API response time exceeded 500ms threshold",
      user: "System",
      timestamp: "12 minutes ago",
      status: "warning",
      icon: AlertCircle
    },
    {
      id: 4,
      type: "user",
      title: "New user registered",
      description: "alex.smith@example.com joined the platform",
      user: "System",
      timestamp: "18 minutes ago",
      status: "success",
      icon: Users
    },
    {
      id: 5,
      type: "deployment",
      title: "Build completed",
      description: "API server build #245 finished successfully",
      user: "CI/CD Pipeline",
      timestamp: "23 minutes ago",
      status: "success",
      icon: CheckCircle
    },
    {
      id: 6,
      type: "commit",
      title: "Feature branch merged",
      description: "Merged feature/user-dashboard into main",
      user: "Mike Johnson",
      timestamp: "34 minutes ago",
      status: "info",
      icon: GitCommit
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400 bg-green-400/10";
      case "warning":
        return "text-yellow-400 bg-yellow-400/10";
      case "error":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-blue-400 bg-blue-400/10";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deployment":
        return "from-cyan-500 to-blue-500";
      case "commit":
        return "from-purple-500 to-pink-500";
      case "alert":
        return "from-yellow-500 to-orange-500";
      case "user":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 shadow-lg ring-1 ring-white/10">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-white/60 text-sm">Latest updates and events</p>
          </div>
        </div>
        
        <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
          View All →
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(activity.type)} shadow-lg ring-1 ring-white/10 flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{activity.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{activity.description}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white/50 text-xs">{activity.user}</span>
                      <span className="text-white/30 text-xs">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white/40" />
                        <span className="text-white/50 text-xs">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex-shrink-0`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-400">12</p>
            <p className="text-white/60 text-xs">Successful</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">3</p>
            <p className="text-white/60 text-xs">Warnings</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-400">1</p>
            <p className="text-white/60 text-xs">Errors</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default RecentActivity;