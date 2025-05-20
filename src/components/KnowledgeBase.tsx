import React from 'react';
import { motion } from 'framer-motion';

interface KnowledgeBaseProps {
  onSearch: (query: string) => void;
  searchResults: any[];
  isSearching: boolean;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ 
  onSearch, 
  searchResults, 
  isSearching 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };
  
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Knowledge Base</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
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
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-white font-medium mb-2">No Results Found</h3>
          <p className="text-gray-400 text-sm">
            {searchQuery ? 'Try a different search term or browse categories below.' : 'Search for information or browse categories below.'}
          </p>
        </div>
      )}
      
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
