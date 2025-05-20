import React from 'react';
import { motion } from 'framer-motion';

interface ApiDocsProps {
  endpoints: {
    name: string;
    method: string;
    url: string;
    description: string;
    parameters?: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
  }[];
}

export const ApiDocs: React.FC<ApiDocsProps> = ({ endpoints }) => {
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">API Documentation</h2>
      
      <div className="space-y-8">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
            <div className={`px-4 py-3 flex items-center justify-between ${
              endpoint.method === 'GET' ? 'bg-blue-900/30' : 
              endpoint.method === 'POST' ? 'bg-green-900/30' : 
              endpoint.method === 'PUT' ? 'bg-yellow-900/30' : 
              endpoint.method === 'DELETE' ? 'bg-red-900/30' : 'bg-gray-800'
            }`}>
              <div className="flex items-center">
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded mr-3 ${
                  endpoint.method === 'GET' ? 'bg-blue-700 text-white' : 
                  endpoint.method === 'POST' ? 'bg-green-700 text-white' : 
                  endpoint.method === 'PUT' ? 'bg-yellow-700 text-white' : 
                  endpoint.method === 'DELETE' ? 'bg-red-700 text-white' : 'bg-gray-700 text-white'
                }`}>
                  {endpoint.method}
                </span>
                <span className="text-white font-medium">{endpoint.name}</span>
              </div>
              <code className="text-gray-400 text-sm">{endpoint.url}</code>
            </div>
            
            <div className="p-4 bg-gray-800">
              <p className="text-gray-300 mb-4">{endpoint.description}</p>
              
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Parameters</h4>
                  <div className="bg-gray-900 rounded overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <tr key={paramIndex}>
                            <td className="px-4 py-2 text-sm text-white">{param.name}</td>
                            <td className="px-4 py-2 text-sm text-blue-400">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              {param.required ? (
                                <span className="text-green-500">Yes</span>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-300">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  View Example
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
