import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types';

interface AgentCollaborationProps {
  agents: Agent[];
  onStartCollaboration: (agentIds: string[]) => void;
}

export const AgentCollaboration: React.FC<AgentCollaborationProps> = ({ 
  agents, 
  onStartCollaboration 
}) => {
  const [selectedAgents, setSelectedAgents] = React.useState<string[]>([]);
  const [collaborationName, setCollaborationName] = React.useState('');
  const [collaborationGoal, setCollaborationGoal] = React.useState('');
  
  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgents.length >= 2 && collaborationName && collaborationGoal) {
      onStartCollaboration(selectedAgents);
      // Reset form
      setSelectedAgents([]);
      setCollaborationName('');
      setCollaborationGoal('');
    }
  };
  
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Agent Collaboration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Collaboration Name</label>
          <input
            type="text"
            value={collaborationName}
            onChange={(e) => setCollaborationName(e.target.value)}
            placeholder="Enter a name for this collaboration"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Collaboration Goal</label>
          <textarea
            value={collaborationGoal}
            onChange={(e) => setCollaborationGoal(e.target.value)}
            placeholder="Describe what you want the agents to accomplish together"
            rows={3}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Select Agents (minimum 2)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.map(agent => (
              <div 
                key={agent.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAgents.includes(agent.id) 
                    ? 'bg-blue-900 border border-blue-500' 
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => handleAgentToggle(agent.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{agent.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{agent.name}</h4>
                    <p className="text-gray-400 text-sm">{agent.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedAgents.length < 2 && (
            <p className="text-yellow-500 text-sm mt-2">Please select at least 2 agents for collaboration</p>
          )}
        </div>
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={selectedAgents.length < 2 || !collaborationName || !collaborationGoal}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedAgents.length < 2 || !collaborationName || !collaborationGoal
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            whileHover={selectedAgents.length >= 2 && collaborationName && collaborationGoal ? { scale: 1.05 } : {}}
            whileTap={selectedAgents.length >= 2 && collaborationName && collaborationGoal ? { scale: 0.95 } : {}}
          >
            Start Collaboration
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
