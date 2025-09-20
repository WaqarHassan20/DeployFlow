"use client";

import React from 'react';
import { Users, Calendar } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  joinDate: string;
}

interface UsersContentClientProps {
  initialUsers: UserData[];
  totalUsers: number;
}

const UsersContentClient: React.FC<UsersContentClientProps> = ({ 
  initialUsers, 
  totalUsers 
}) => {
  // Get first four letters of username
  const getUserLetters = (name: string, email: string) => {
    const username = name || (email ? email.split('@')[0] : 'USER');
    return username.substring(0, 4).toUpperCase();
  };

  // Format creation date and time
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      if (diffInDays === 0) return `Today at ${timeStr}`;
      if (diffInDays === 1) return `Yesterday at ${timeStr}`;
      if (diffInDays < 7) return `${diffInDays} days ago at ${timeStr}`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Recently joined';
    }
  };

  return (
    <div className="space-y-4">
      {/* Users List */}
      {initialUsers.length > 0 ? (
        <>
          {/* Compact user count */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-white/70">
                {totalUsers} member{totalUsers !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {/* Two-column grid with slimmer cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {initialUsers.map((user) => (
              <div 
                key={user.id} 
                className="group relative overflow-hidden bg-gradient-to-r from-white/5 via-white/3 to-white/5 border border-white/10 rounded-xl p-4 hover:from-white/10 hover:via-white/8 hover:to-white/10 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-500 hover:-translate-y-1"
              >
                {/* Glassy lighting effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4">
                  {/* User Letters */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border-2 border-indigo-500/20 shadow-lg group-hover:shadow-xl group-hover:border-indigo-400/40 transition-all duration-300">
                      <span className="text-xs font-bold text-indigo-300 tracking-wider group-hover:scale-110 transition-transform duration-300">
                        {getUserLetters(user.name, user.email)}
                      </span>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-300 transition-colors duration-300">
                        {user.name || 'Unknown User'}
                      </h3>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-sm shadow-green-400/50 animate-pulse" 
                           title="Online" />
                    </div>
                    
                    <p className="text-white/70 text-sm mb-2 truncate group-hover:text-white/80 transition-colors">
                      {user.email}
                    </p>

                    {/* Join Date & Time */}
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span className="text-white/60">{formatDateTime(user.createdAt)}</span>
                    </div>
                  </div>

                  {/* Compact Member Badge */}
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Enhanced hover effect line with glow */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg shadow-indigo-500/50" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-sm transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Users className="w-10 h-10 text-indigo-400/60" />
          </div>
          <h3 className="text-white/80 font-semibold text-lg mb-2">No team members yet</h3>
          <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
            Invite your first member to start collaborating!
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersContentClient;
