import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  isSelected: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, isSelected }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-102'
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 mr-4">
            <motion.div
              className="w-full h-full bg-blue-500/20 absolute"
              animate={{ 
                boxShadow: ['0px 0px 0px 0px rgba(59, 130, 246, 0)', '0px 0px 20px 5px rgba(59, 130, 246, 0.3)', '0px 0px 0px 0px rgba(59, 130, 246, 0)']
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              {agent.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            <p className="text-blue-400 text-sm">{agent.role}</p>
          </div>
        </div>
        
        <p className="text-gray-300 italic mb-4">"{agent.tagline}"</p>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{agent.description}</p>
        
        <div className="text-xs text-gray-500 mb-3">Based on: {agent.tvReference}</div>
        
        <div className="flex justify-between items-center">
          <motion.button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Chat
          </motion.button>
          
          <motion.button
            className="p-2 text-gray-400 hover:text-white rounded-full"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
