import React from 'react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  stats: {
    totalConversations: number;
    activeAgents: number;
    apiUsage: number;
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">Total Conversations</h3>
          <p className="text-3xl font-bold text-white">{stats.totalConversations}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">Active Agents</h3>
          <p className="text-3xl font-bold text-white">{stats.activeAgents}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">API Usage</h3>
          <p className="text-3xl font-bold text-white">{stats.apiUsage}%</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-white">All systems operational</span>
          </div>
          <div className="text-gray-500 text-sm">
            Last checked: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">API Settings</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">SambaNova API Key</label>
            <div className="flex">
              <input
                type="password"
                value="••••••••••••••••••••••••••••••"
                disabled
                className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg">
                Update
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Rate Limiting</label>
            <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="low">Low (10 requests/min)</option>
              <option value="medium" selected>Medium (30 requests/min)</option>
              <option value="high">High (60 requests/min)</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Endpoints</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Chat Endpoint</span>
              <span className="px-2 py-1 bg-green-900 text-green-400 text-xs rounded-full">Active</span>
            </div>
            <code className="block bg-gray-900 p-2 rounded text-gray-300 text-sm overflow-x-auto">
              https://api.yourdomain.com/v1/chat
            </code>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Agent Management Endpoint</span>
              <span className="px-2 py-1 bg-green-900 text-green-400 text-xs rounded-full">Active</span>
            </div>
            <code className="block bg-gray-900 p-2 rounded text-gray-300 text-sm overflow-x-auto">
              https://api.yourdomain.com/v1/agents
            </code>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
