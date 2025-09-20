"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import axios from "axios";
import { 
  Globe, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Users,
  Loader2
} from "lucide-react";
import { LoadingButton } from "../../../components/ui";

// Extend the session type to include user id
interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const SitesContent: React.FC = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [projects, setProjects] = useState<any[]>([]);
  const [deploymentStats, setDeploymentStats] = useState({
    total: 0,
    ready: 0,
    failed: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', gitUrl: '', description: '' });

  // Configure axios base URL (browser-aware fallback)
  // Prefer NEXT_PUBLIC_API_URL; if not set in the browser, use current host with port 9000
  const resolvedBaseURL = (() => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') {
      // If the frontend is served from the same host but different port for API
      const proto = window.location.protocol;
      const host = window.location.hostname;
      return `${proto}//${host}:9000`;
    }
    // Server-side fallback
    return 'http://localhost:9000';
  })();

  const apiClient = axios.create({
    baseURL: resolvedBaseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // Debug: print resolved API base URL so it's easy to see in browser console
  if (typeof window !== 'undefined') {
    console.log('Resolved API base URL:', resolvedBaseURL);
  }

  // Health check with fallback URLs to find a working API endpoint
  const [workingApiUrl, setWorkingApiUrl] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkApi = async () => {
      const urlsToTry = [
        resolvedBaseURL,
        'http://localhost:9000',
        'http://127.0.0.1:9000',
        ...(process.env.NEXT_PUBLIC_API_URL ? [process.env.NEXT_PUBLIC_API_URL] : [])
      ];

      for (const baseUrl of urlsToTry) {
        const healthUrl = `${baseUrl.replace(/\/$/, '')}/health`;
        try {
          console.log('[health-check] Trying API:', healthUrl);
          const resp = await fetch(healthUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          });
          console.log('[health-check] Response status:', resp.status);
          if (resp.ok) {
            try {
              const body = await resp.json();
              console.log('[health-check] Success! JSON body:', body);
              setWorkingApiUrl(baseUrl);
              return; // Found working URL
            } catch (e) {
              console.warn('[health-check] Response not JSON but status OK');
              setWorkingApiUrl(baseUrl);
              return;
            }
          }
        } catch (err: any) {
          console.warn(`[health-check] Failed ${healthUrl}:`, err.message || err);
        }
      }
      
      console.error('[health-check] All API URLs failed', {
        triedUrls: urlsToTry,
        online: navigator.onLine,
      });
    };

    checkApi();
  }, [resolvedBaseURL]);

  // Update apiClient when we find a working URL
  React.useEffect(() => {
    if (workingApiUrl) {
      apiClient.defaults.baseURL = workingApiUrl;
      console.log('Updated API client baseURL to:', workingApiUrl);
    }
  }, [workingApiUrl]);

  // Fetch projects and stats from API
  useEffect(() => {
    if (session?.user) {
      fetchProjects();
      fetchDeploymentStats();
    }
  }, [session]);

  const fetchProjects = async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/project');
      if (response.data.message === 'success') {
        // Filter projects for current user using email as identifier
        const userProjects = response.data.data?.filter(
          (project: any) => session?.user?.email && project.user?.email === session.user.email
        ) || [];
        setProjects(userProjects);
      }
    } catch (error: any) {
      // Retry once if we haven't tried yet and have a working URL
      if (retryCount === 0 && workingApiUrl && workingApiUrl !== apiClient.defaults.baseURL) {
        console.log('Retrying fetchProjects with working API URL:', workingApiUrl);
        apiClient.defaults.baseURL = workingApiUrl;
        return fetchProjects(1);
      }
      
      // Improve Axios error logging
      if (error.isAxiosError) {
        console.error('Failed to fetch projects (axios):', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          baseURL: apiClient.defaults.baseURL,
          code: error.code,
          online: navigator.onLine
        });
      } else {
        console.error('Failed to fetch projects (non-axios):', error, {
          baseURL: apiClient.defaults.baseURL
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDeploymentStats = async () => {
    try {
      const userProjects = projects.length > 0 ? projects : await getUserProjects();
      let totalDeployments = 0;
      let readyDeployments = 0;
      let failedDeployments = 0;
      let inProgressDeployments = 0;

      // Fetch deployments for each project
      for (const project of userProjects) {
        try {
          // The API exposes deployments via the project endpoint which includes the 'deployment' relation
          const response = await apiClient.get(`/project/${project.id}`);
          if (response.data.message === 'success') {
            // project endpoint returns the project including its deployments under `deployment`
            const deployments = response.data.data?.deployment || [];
            totalDeployments += deployments.length;
            
            deployments.forEach((deployment: any) => {
              switch (deployment.status) {
                case 'READY':
                  readyDeployments++;
                  break;
                case 'FAIL':
                  failedDeployments++;
                  break;
                case 'IN_PROGRESS':
                case 'QUEUED':
                  inProgressDeployments++;
                  break;
              }
            });
          }
        } catch (err) {
            const e: any = err;
            if (e.isAxiosError) {
              console.error(`Failed to fetch deployments for project ${project.id} (axios):`, e.message, e.toJSON ? e.toJSON() : e);
            } else {
              console.error(`Failed to fetch deployments for project ${project.id}:`, err);
            }
        }
      }

      setDeploymentStats({
        total: totalDeployments,
        ready: readyDeployments,
        failed: failedDeployments,
        inProgress: inProgressDeployments
      });
    } catch (error) {
      console.error('Failed to fetch deployment stats:', error);
    }
  };

  const getUserProjects = async () => {
    try {
      const response = await apiClient.get('/project');
      if (response.data.message === 'success') {
        return response.data.data?.filter(
          (project: any) => session?.user?.email && project.user?.email === session.user.email
        ) || [];
      }
    } catch (error) {
      const e: any = error;
      if (e.isAxiosError) {
        console.error('Failed to fetch user projects (axios):', e.message, e.toJSON ? e.toJSON() : e);
      } else {
        console.error('Failed to fetch user projects:', error);
      }
    }
    return [];
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !newProject.name || !newProject.gitUrl) return;
    
    // Get user ID from database based on email
    try {
      // First, find the user by email to get the ID
      const userResponse = await apiClient.get(`/user/email/${encodeURIComponent(session.user.email)}`);
      const userId = userResponse?.data?.data?.id;

      if (!userId) {
        console.error('User ID not found - server returned no user for email');
        alert('User not found. Please ensure you are signed in correctly.');
        return;
      }

      const response = await apiClient.post('/project', {
        userId: userId,
        ...newProject 
      });
      
      if (response.status === 201 || response.status === 200) {
        setNewProject({ name: '', gitUrl: '', description: '' });
        setShowCreateModal(false);
        await fetchProjects(); // Refresh the list
        await fetchDeploymentStats(); // Refresh stats
        alert('Project created successfully!');
      }
    } catch (error) {
      const e: any = error;
      if (e.isAxiosError) {
        if (e.response && e.response.status === 404) {
          console.error('User not found when creating project:', e.response.data);
          alert('User not found in database. Please contact support.');
        } else {
          const errorMsg = `Failed to create project: ${e.response?.data?.message || e.message}`;
          console.error('Failed to create project (axios):', {
            message: e.message,
            status: e.response?.status,
            data: e.response?.data,
            baseURL: apiClient.defaults.baseURL
          });
          alert(errorMsg);
        }
      } else {
        console.error('Failed to create project (non-axios):', error);
        alert('Failed to create project due to network error.');
      }
    }
  };

  const handleDeploy = async (projectId: string) => {
    try {
      setDeploying(projectId);
      const response = await apiClient.post('/deploy', { projectId });

      if (response.status === 200) {
        console.log('Deployment started:', response.data);
        alert('Deployment started successfully!');
        // Refresh deployment stats after successful deployment
        setTimeout(() => {
          fetchDeploymentStats();
        }, 1000);
      }
    } catch (error) {
      const e: any = error;
      if (e.isAxiosError) {
        const errorMsg = `Failed to deploy: ${e.response?.data?.message || e.message}`;
        console.error('Failed to deploy (axios):', {
          message: e.message,
          status: e.response?.status,
          data: e.response?.data,
          baseURL: apiClient.defaults.baseURL,
          online: navigator.onLine
        });
        alert(errorMsg);
      } else {
        console.error('Failed to deploy (non-axios):', error);
        alert('Failed to deploy due to network error.');
      }
    } finally {
      setDeploying(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "offline":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Sites</h2>
          <p className="text-white/60">Manage and monitor your deployed sites</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search sites..."
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            // whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl cursor-pointer hover:border-[1px] hover:border-gray-400 bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-black/20 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm">{project.gitUrl}</span>
                    <button className="p-1 rounded hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-3 h-3 text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                  <MoreVertical className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="mb-4">
                <p className="text-white/70 text-sm">{project.description}</p>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <button 
                onClick={() => handleDeploy(project.id)}
                disabled={deploying === project.id}
                className="flex-1 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deploying === project.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Deploy
              </button>
              <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm font-medium transition-colors">
                Logs
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <p className="text-green-400 text-xl sm:text-2xl font-bold">{projects.length}</p>
          <p className="text-white/60 text-sm">Total Projects</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
        >
          <p className="text-blue-400 text-xl sm:text-2xl font-bold">{deploymentStats.total}</p>
          <p className="text-white/60 text-sm">Total Deployments</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-xl sm:text-2xl font-bold">{deploymentStats.failed}</p>
          <p className="text-white/60 text-sm">Failed Deployments</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <p className="text-green-400 text-xl sm:text-2xl font-bold">{deploymentStats.ready}</p>
          <p className="text-white/60 text-sm">Successful Deployments</p>
        </motion.div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 rounded-xl border border-white/10 w-full max-w-md"
          >
            <h3 className="text-white text-xl font-bold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Git URL</label>
                <input
                  type="url"
                  value={newProject.gitUrl}
                  onChange={(e) => setNewProject({...newProject, gitUrl: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="https://github.com/username/repo"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Description (Optional)</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  placeholder="Brief description of your project"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SitesContent;