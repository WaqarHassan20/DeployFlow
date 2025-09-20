"use client";

import React from "react";
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";
import { 
  Settings, 
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Key,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const SettingsContent: React.FC = () => {
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { data: session } = useSession();

  const settingsCategories = [
    {
      title: "Profile Settings",
      icon: User,
      items: [
        { label: "Full Name", value: session?.user?.name ?? "Unknown Person", type: "input" },
        { label: "Email", value: session?.user?.email ?? "unknown@deployflow.com", type: "input" },
      ]
    },
  ];

  const renderSettingItem = (item: any, categoryIndex: number, itemIndex: number) => {
    switch (item.type) {
      case "input":
        return (
          <input
            type="text"
            defaultValue={item.value}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          />
        );
      case "select":
        return (
          <select className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50">
            <option value={item.value}>{item.value}</option>
          </select>
        );
      case "toggle":
        return (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              item.value ? 'bg-cyan-500' : 'bg-white/20'
            }`}
          >
            <motion.div
              animate={{ x: item.value ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        );
      case "password":
        return (
          <div className="flex-1 flex gap-2">
            <input
              type="password"
              defaultValue={item.value}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            />
            <button className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors">
              Change
            </button>
          </div>
        );
      case "api-key":
        return (
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? "text" : "password"}
                defaultValue={item.value}
                readOnly
                className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors">
              Regenerate
            </button>
          </div>
        );
      default:
        return null;
    }
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
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-white/60">Manage your account and application preferences</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>

      {/* Settings Categories */}
      <div className="space-y-8">
        {settingsCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="rounded-xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                </div>
              </div>

              {/* Category Items */}
              <div className="p-6 space-y-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <label className="text-white font-medium">{item.label}</label>
                      <p className="text-white/60 text-sm mt-1">
                        {item.type === "toggle" 
                          ? `${item.label} is ${item.value ? 'enabled' : 'disabled'}`
                          : `Configure your ${item.label.toLowerCase()}`
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {renderSettingItem(item, categoryIndex, itemIndex)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl bg-gradient-to-br from-red-900/20 via-red-800/10 to-red-900/20 backdrop-blur-xl border border-red-500/20 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Delete Account</h4>
              <p className="text-white/60 text-sm">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
              className={`px-4 py-2 ${isDeleting ? 'bg-red-700/20 text-red-300 cursor-not-allowed' : 'bg-red-500/20 hover:bg-red-500/30'} border border-red-500/30 text-red-400 rounded-lg font-medium transition-colors`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setConfirmOpen(false)} />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 border border-white/10 shadow-2xl p-6 backdrop-blur-xl">
              {/* Decorative orbs */}
              <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-purple-400/20 rounded-full blur-3xl opacity-60" />
              <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-red-400/10 rounded-full blur-2xl opacity-40" />

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 shadow-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-white">Confirm account deletion</h4>
                  <p className="text-sm text-white/70 mt-1">This will permanently delete your account and everything related to it: projects, deployments, logs, and settings. This action cannot be undone.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div className="text-sm text-white/70">Please type <span className="font-semibold text-white">DELETE</span> to confirm.</div>
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  id="delete-confirm-input"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  disabled={isDeleting}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => !isDeleting && setConfirmOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (isDeleting) return;
                    const input = (document.getElementById('delete-confirm-input') as HTMLInputElement)?.value || '';
                    if (input.trim().toUpperCase() !== 'DELETE') {
                      alert('Please type DELETE to confirm account deletion.');
                      return;
                    }

                    setIsDeleting(true);
                    try {
                      const res = await fetch('/api/delete-account', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ confirm: true })
                      });

                      if (!res.ok) {
                        const err = await res.text();
                        throw new Error(err || 'Failed to delete account');
                      }

                      // Redirect to login (server removed account)
                        window.location.href = '/auth/signup';
                    } catch (error) {
                      console.error('Delete account error:', error);
                      alert('Failed to delete account. Check console for details.');
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDeleting ? 'bg-red-700/70 text-white cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-pink-500 text-white shadow-lg hover:shadow-xl'}`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsContent;