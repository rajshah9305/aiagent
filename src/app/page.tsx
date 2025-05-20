'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { AgentCard } from '@/components/AgentCard';
import { ChatInterface } from '@/components/ChatInterface';
import { AgentSettings } from '@/components/AgentSettings';

export default function Home() {
  const {
    agents,
    selectedAgent,
    currentConversation,
    followUpSuggestions,
    isLoading,
    apiKeyConfigured,
    usingMockApi,
    error,
    selectAgent,
    sendMessage,
    sendImageMessage,
    updateAgentSettings,
    setApiKey,
    clearError
  } = useAppStore();

  const [showSettings, setShowSettings] = React.useState(false);
  const [apiKey, setApiKeyInput] = React.useState('');

  // Add effect to handle errors
  React.useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error]);

  const handleAgentSelect = (agentId: string) => {
    selectAgent(agentId);
    setShowSettings(false);
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleSendImageMessage = (text: string, imageUrl: string) => {
    sendImageMessage(text, imageUrl);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleError = () => {
    if (error) {
      setTimeout(() => clearError(), 5000); // Clear error after 5 seconds
    }
  };

  const handleSaveSettings = (updatedAgent: any) => {
    updateAgentSettings(updatedAgent.id, updatedAgent);
    setShowSettings(false);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
    }
  };

  if (!apiKeyConfigured) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full bg-gray-900 rounded-xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to AI Agents</h1>
            <p className="text-gray-400">Your personal suite of AI assistants inspired by iconic characters</p>
          </div>

          <form onSubmit={handleApiKeySubmit}>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">SambaNova API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your SambaNova API key"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-gray-400">Your personal suite of AI assistants inspired by iconic characters</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your Agents</h2>
            <div className="grid grid-cols-1 gap-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => handleAgentSelect(agent.id)}
                  isSelected={selectedAgent?.id === agent.id}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedAgent && !showSettings ? (
                <motion.div
                  key="chat"
                  className="h-[calc(100vh-12rem)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedAgent.name}
                        {usingMockApi && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-800 text-yellow-300 rounded-full">
                            MOCK MODE
                          </span>
                        )}
                      </h2>
                      <p className="text-gray-400 text-sm">{selectedAgent.role}</p>
                    </div>
                    <motion.button
                      onClick={() => setShowSettings(true)}
                      className="p-2 text-gray-400 hover:text-white rounded-full"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <ChatInterface
                    messages={currentConversation?.messages || []}
                    onSendMessage={handleSendMessage}
                    onSendImageMessage={handleSendImageMessage}
                    isLoading={isLoading}
                    followUpSuggestions={followUpSuggestions.map(s => s.text)}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </motion.div>
              ) : showSettings && selectedAgent ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AgentSettings
                    agent={selectedAgent}
                    onSave={handleSaveSettings}
                    onCancel={() => setShowSettings(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="h-[calc(100vh-12rem)] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">Select an Agent</h3>
                    <p>Choose an agent from the list to start a conversation</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
