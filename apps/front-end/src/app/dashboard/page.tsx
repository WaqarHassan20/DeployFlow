"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopbar from "./components/DashboardTopbar";
import OverviewContent from "./components/OverviewContent";
import SitesContent from "./components/SitesContent";
import UsersContent from "./components/UsersContent";
import ServersContent from "./components/ServersContent";
import ActivityContent from "./components/ActivityContent";
import SettingsContent from "./components/SettingsContent";

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { data: session, status } = useSession();

    // Show loading state
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    // Redirect to home if not authenticated (middleware should handle this, but just in case)
    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl">Access denied. Please sign in.</div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewContent />;
            case "sites":
                return <SitesContent />;
            case "users":
                return <UsersContent />;
            case "servers":
                return <ServersContent />;
            case "activity":
                return <ActivityContent />;
            case "settings":
                return <SettingsContent />;
            default:
                return <OverviewContent />;
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -inset-10 opacity-50">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            <div className="flex relative z-10">
                {/* Sidebar */}
                <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                    {/* Topbar */}
                    <DashboardTopbar activeTab={activeTab} />

                    {/* Content Area */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 overflow-auto">
                        <div className="max-w-7xl mx-auto">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

// Topbar Component
export default Dashboard;
