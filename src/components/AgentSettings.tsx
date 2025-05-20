import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types';

interface AgentSettingsProps {
  agent: Agent;
  onSave: (updatedAgent: Agent) => void;
  onCancel: () => void;
}

export const AgentSettings: React.FC<AgentSettingsProps> = ({ agent, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Agent>({ ...agent });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('modelConfig.')) {
      const configField = name.split('.')[1];
      setFormData({
        ...formData,
        modelConfig: {
          ...formData.modelConfig,
          [configField]: configField === 'temperature' ? parseFloat(value) : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleToolToggle = (toolId: string) => {
    setFormData({
      ...formData,
      tools: formData.tools.map(tool =>
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
      )
    });
  };

  const handleWebAccessToggle = () => {
    setFormData({
      ...formData,
      webAccess: !formData.webAccess
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Agent Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">TV/Movie Reference</label>
            <input
              type="text"
              name="tvReference"
              value={formData.tvReference}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">AI Model</label>
            <select
              name="modelConfig.model"
              value={formData.modelConfig.model}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Llama-4-Maverick-17B-128E-Instruct">Llama 4 Maverick 17B</option>
              <option value="Llama-3-70B-Instruct">Llama 3 70B</option>
              <option value="Llama-3-8B-Instruct">Llama 3 8B</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Temperature: {formData.modelConfig.temperature}
            </label>
            <input
              type="range"
              name="modelConfig.temperature"
              min="0"
              max="1"
              step="0.1"
              value={formData.modelConfig.temperature}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
          <div className="space-y-3">
            {formData.tools.map(tool => (
              <div key={tool.id} className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={tool.enabled}
                      onChange={() => handleToolToggle(tool.id)}
                    />
                    <div className={`block w-14 h-8 rounded-full ${tool.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${tool.enabled ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3">
                    <div className="text-white">{tool.name}</div>
                    <div className="text-gray-500 text-xs">{tool.description}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Web Access</h3>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.webAccess}
                  onChange={handleWebAccessToggle}
                />
                <div className={`block w-14 h-8 rounded-full ${formData.webAccess ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.webAccess ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3">
                <div className="text-white">Allow web access</div>
                <div className="text-gray-500 text-xs">Enable agent to search and retrieve information from the web</div>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
