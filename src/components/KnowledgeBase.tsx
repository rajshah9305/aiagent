import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { KnowledgeSource } from '@/types';

interface KnowledgeBaseProps {
  onSearch?: (query: string) => void;
  searchResults?: any[];
  isSearching?: boolean;
  sources?: KnowledgeSource[];
  onAddSource?: (source: KnowledgeSource) => void;
  onRemoveSource?: (sourceId: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  onSearch,
  searchResults = [],
  isSearching = false,
  sources = [],
  onAddSource,
  onRemoveSource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState<Partial<KnowledgeSource>>({
    name: '',
    description: '',
    type: 'document',
    url: '',
    content: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSource.name || !newSource.type || !onAddSource) {
      return;
    }

    // Create a new knowledge source
    const source: KnowledgeSource = {
      id: `source-${Date.now()}`,
      name: newSource.name,
      description: newSource.description || '',
      type: newSource.type as 'document' | 'website' | 'database' | 'api',
      url: newSource.url,
      content: newSource.content
    };

    onAddSource(source);

    // Reset form
    setNewSource({
      name: '',
      description: '',
      type: 'document',
      url: '',
      content: ''
    });

    setShowAddForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNewSource(prev => ({
        ...prev,
        name: file.name,
        content
      }));
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
        {onAddSource && (
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAddForm ? 'Cancel' : 'Add Source'}
          </motion.button>
        )}
      </div>

      {onSearch && (
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white"
              disabled={isSearching}
            >
              {isSearching ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </form>
      )}

      {showAddForm && onAddSource && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 bg-gray-800 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Add Knowledge Source</h3>
          <form onSubmit={handleAddSourceSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Source name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Type</label>
                <select
                  value={newSource.type}
                  onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="document">Document</option>
                  <option value="website">Website</option>
                  <option value="database">Database</option>
                  <option value="api">API</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Description</label>
              <textarea
                value={newSource.description}
                onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of this knowledge source"
                rows={2}
              />
            </div>

            {(newSource.type === 'website' || newSource.type === 'api') && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">URL</label>
                <input
                  type="text"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {newSource.type === 'document' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Upload Document</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.pdf,.json"
                />
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  >
                    Choose File
                  </button>
                  <span className="ml-2 text-gray-400">
                    {newSource.content ? 'File loaded' : 'No file chosen'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Source
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">{result.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{result.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">{result.source}</span>
                <motion.button
                  className="text-blue-400 text-sm hover:text-blue-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Full
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery && onSearch ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-white font-medium mb-2">No Results Found</h3>
          <p className="text-gray-400 text-sm">
            Try a different search term or browse categories below.
          </p>
        </div>
      ) : null}

      {/* Knowledge Sources */}
      {sources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Knowledge Sources</h3>
          <div className="space-y-4">
            {sources.map(source => (
              <motion.div
                key={source.id}
                className="bg-gray-800 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                    <p className="text-gray-400 text-sm">{source.description}</p>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                        {source.type}
                      </span>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                        >
                          {source.url}
                        </a>
                      )}
                    </div>
                  </div>
                  {onRemoveSource && (
                    <button
                      onClick={() => onRemoveSource(source.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Browse Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Legal', 'Research', 'Sales', 'Admin', 'Technology', 'Finance'].map((category) => (
            <motion.div
              key={category}
              className="bg-gray-800 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-750"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-white">{category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
