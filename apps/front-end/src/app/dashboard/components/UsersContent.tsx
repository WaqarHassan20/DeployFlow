"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import UsersContentClient from "./UsersContentClient";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  joinDate: string;
}

interface UserStats {
  totalUsers: number;
}

// Client-side data fetching function with better error handling
async function fetchUsersData(): Promise<{ users: UserData[]; userStats: UserStats; error?: string }> {
  try {
    // Use environment variable for API URL, with client-side fallback logic
    const baseURL = (() => {
      if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
      if (typeof window !== 'undefined') {
        const proto = window.location.protocol;
        const host = window.location.hostname;
        return `${proto}//${host}:9000`;
      }
      return 'http://localhost:9000';
    })();
    
    const response = await axios.get(`${baseURL}/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    if (response.data.message === 'success') {
      const fetchedUsers = response.data.data;
      
      // Simplify user data to include essential fields plus creation date
      const simplifiedUsers = fetchedUsers.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt || new Date().toISOString(),
        joinDate: user.joinDate || 'Recently'
      }));
      
      // Calculate only total user count
      const userStats = {
        totalUsers: simplifiedUsers.length
      };
      
      return { users: simplifiedUsers, userStats };
    }
    
    return { users: [], userStats: { totalUsers: 0 } };
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    const errorMessage = error.response?.status 
      ? `API Error: ${error.response.status} - ${error.message}`
      : 'Failed to fetch users. Please check if the API server is running.';
    
    return { 
      users: [], 
      userStats: { totalUsers: 0 },
      error: errorMessage 
    };
  }
}

const UsersContent: React.FC = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchUsersData();
      
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.users);
        setUserStats(result.userStats);
      }
    } catch (err) {
      setError('Unexpected error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-white/60">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
            <p className="text-red-400 font-medium mb-2">Failed to load users</p>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <UsersContentClient initialUsers={users} totalUsers={userStats.totalUsers} />;
};
export default UsersContent;