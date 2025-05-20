import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Agent, AgentCollaboration as AgentCollaborationType, CollaborationStep } from '@/types';

interface AgentCollaborationProps {
  agents: Agent[];
  collaborations?: AgentCollaborationType[];
  onStartCollaboration?: (agentIds: string[], name: string, goal: string) => void;
  onCreateCollaboration?: (collaboration: AgentCollaborationType) => void;
  onRunCollaboration?: (collaborationId: string) => void;
  onDeleteCollaboration?: (collaborationId: string) => void;
  isRunning?: boolean;
}

export const AgentCollaboration: React.FC<AgentCollaborationProps> = ({
  agents,
  collaborations = [],
  onStartCollaboration,
  onCreateCollaboration,
  onRunCollaboration,
  onDeleteCollaboration,
  isRunning = false
}) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [collaborationName, setCollaborationName] = useState('');
  const [collaborationGoal, setCollaborationGoal] = useState('');
  const [collaborationDescription, setCollaborationDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAdvancedWorkflow, setShowAdvancedWorkflow] = useState(false);

  const [newStep, setNewStep] = useState<Partial<CollaborationStep>>({
    agentId: '',
    task: '',
    dependsOn: []
  });

  const [workflowSteps, setWorkflowSteps] = useState<CollaborationStep[]>([]);

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSimpleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgents.length >= 2 && collaborationName && collaborationGoal && onStartCollaboration) {
      onStartCollaboration(selectedAgents, collaborationName, collaborationGoal);
      // Reset form
      resetForm();
    }
  };

  const handleAdvancedSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAgents.length || !collaborationName || !collaborationGoal || !onCreateCollaboration) {
      return;
    }

    // Create a new collaboration
    const collaboration: AgentCollaborationType = {
      id: `collab-${Date.now()}`,
      name: collaborationName,
      description: collaborationDescription || '',
      agents: selectedAgents,
      goal: collaborationGoal,
      workflow: { steps: workflowSteps }
    };

    onCreateCollaboration(collaboration);

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSelectedAgents([]);
    setCollaborationName('');
    setCollaborationGoal('');
    setCollaborationDescription('');
    setWorkflowSteps([]);
    setShowCreateForm(false);
    setShowAdvancedWorkflow(false);
  };

  const addStep = () => {
    if (!newStep.agentId || !newStep.task) {
      alert('Please select an agent and provide a task description');
      return;
    }

    const step: CollaborationStep = {
      id: `step-${Date.now()}`,
      agentId: newStep.agentId,
      task: newStep.task,
      dependsOn: newStep.dependsOn || []
    };

    setWorkflowSteps(prev => [...prev, step]);

    // Reset step form
    setNewStep({
      agentId: '',
      task: '',
      dependsOn: []
    });
  };

  const removeStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== stepId));

    // Also remove this step from any dependencies
    setWorkflowSteps(prev =>
      prev.map(step => ({
        ...step,
        dependsOn: step.dependsOn.filter(id => id !== stepId)
      }))
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Agent Collaboration</h2>
        {!showCreateForm && (
          <motion.button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Workflow
          </motion.button>
        )}
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Create Collaboration</h3>
            <div className="flex items-center">
              <label className="text-sm text-gray-400 mr-2">Advanced Workflow</label>
              <div
                className={`w-10 h-5 rounded-full p-1 cursor-pointer ${showAdvancedWorkflow ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setShowAdvancedWorkflow(!showAdvancedWorkflow)}
              >
                <div
                  className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${showAdvancedWorkflow ? 'translate-x-5' : ''}`}
                />
              </div>
            </div>
          </div>

          <form onSubmit={showAdvancedWorkflow ? handleAdvancedSubmit : handleSimpleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={collaborationName}
                  onChange={(e) => setCollaborationName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Workflow name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Goal</label>
                <input
                  type="text"
                  value={collaborationGoal}
                  onChange={(e) => setCollaborationGoal(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What should this workflow accomplish?"
                  required
                />
              </div>
            </div>

            {showAdvancedWorkflow && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  value={collaborationDescription}
                  onChange={(e) => setCollaborationDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this workflow"
                  rows={2}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Select Agents {!showAdvancedWorkflow && '(minimum 2)'}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAgents.includes(agent.id)
                        ? 'bg-blue-900 border border-blue-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => handleAgentToggle(agent.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{agent.name}</div>
                        <div className="text-gray-400 text-xs">{agent.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!showAdvancedWorkflow && selectedAgents.length < 2 && (
                <p className="text-yellow-500 text-sm mt-2">Please select at least 2 agents for collaboration</p>
              )}
            </div>

            {showAdvancedWorkflow && (
              <div className="mb-4 border-t border-gray-700 pt-4">
                <h4 className="text-md font-semibold text-white mb-2">Workflow Steps</h4>

                {workflowSteps.length === 0 ? (
                  <div className="text-gray-500 text-sm mb-4">No steps added yet. Add steps below.</div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {workflowSteps.map((step, index) => {
                      const agent = agents.find(a => a.id === step.agentId);
                      return (
                        <div key={step.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full mr-2">
                                Step {index + 1}
                              </span>
                              <span className="text-white">{agent?.name}</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1">{step.task}</p>
                            {step.dependsOn.length > 0 && (
                              <div className="text-gray-400 text-xs mt-1">
                                Depends on: {step.dependsOn.map(id => {
                                  const stepIndex = workflowSteps.findIndex(s => s.id === id);
                                  return stepIndex !== undefined && stepIndex >= 0 ? `Step ${stepIndex + 1}` : '';
                                }).join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-gray-700 p-3 rounded-lg">
                  <h5 className="text-white text-sm font-medium mb-2">Add New Step</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Agent</label>
                      <select
                        value={newStep.agentId}
                        onChange={(e) => setNewStep({ ...newStep, agentId: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select an agent</option>
                        {agents.filter(agent => selectedAgents.includes(agent.id)).map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Depends On</label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            setNewStep({
                              ...newStep,
                              dependsOn: [...(newStep.dependsOn || []), e.target.value]
                            });
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Add dependency (optional)</option>
                        {workflowSteps.map((step, index) => (
                          <option key={step.id} value={step.id}>Step {index + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-400 text-xs mb-1">Task Description</label>
                    <textarea
                      value={newStep.task}
                      onChange={(e) => setNewStep({ ...newStep, task: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="What should this agent do?"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={addStep}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Step
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <motion.button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={
                  !collaborationName ||
                  !collaborationGoal ||
                  selectedAgents.length === 0 ||
                  (!showAdvancedWorkflow && selectedAgents.length < 2)
                }
                className={`px-4 py-2 rounded-lg text-white ${
                  !collaborationName ||
                  !collaborationGoal ||
                  selectedAgents.length === 0 ||
                  (!showAdvancedWorkflow && selectedAgents.length < 2)
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAdvancedWorkflow ? 'Create Workflow' : 'Start Collaboration'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {collaborations.length > 0 && (
        <div className="space-y-4">
          {collaborations.map(collab => {
            const collaboratingAgents = agents.filter(agent => collab.agents.includes(agent.id));
            return (
              <motion.div
                key={collab.id}
                className="bg-gray-800 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{collab.name}</h3>
                    <p className="text-gray-400 text-sm">{collab.description}</p>
                    <p className="text-blue-400 text-sm mt-1">Goal: {collab.goal}</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {collaboratingAgents.map(agent => (
                        <div key={agent.id} className="bg-gray-700 px-2 py-1 rounded-lg text-xs text-gray-300 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center mr-1 text-[10px]">
                            {agent.name.charAt(0)}
                          </span>
                          {agent.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {onRunCollaboration && (
                      <motion.button
                        onClick={() => onRunCollaboration(collab.id)}
                        disabled={isRunning}
                        className={`text-green-400 hover:text-green-300 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    )}
                    {onDeleteCollaboration && (
                      <motion.button
                        onClick={() => onDeleteCollaboration(collab.id)}
                        className="text-red-400 hover:text-red-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </div>

                {collab.workflow.steps.length > 0 && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Workflow Steps</h4>
                    <div className="space-y-2">
                      {collab.workflow.steps.map((step, index) => {
                        const agent = agents.find(a => a.id === step.agentId);
                        return (
                          <div key={step.id} className="bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center">
                              <span className="bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded-full mr-2">
                                {index + 1}
                              </span>
                              <span className="text-white text-sm">{agent?.name}</span>
                            </div>
                            <p className="text-gray-300 text-xs mt-1">{step.task}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {collaborations.length === 0 && !showCreateForm && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-white font-medium mb-2">No Collaborations Yet</h3>
          <p className="text-gray-400 text-sm">
            Create a workflow to enable agents to collaborate on complex tasks.
          </p>
        </div>
      )}
    </div>
  );
};
