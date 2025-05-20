import React from 'react';
import { motion } from 'framer-motion';

interface NSFWHandlingProps {
  onAllowContent: () => void;
  onBlockContent: () => void;
  contentPreview: string;
}

export const NSFWHandling: React.FC<NSFWHandlingProps> = ({ 
  onAllowContent, 
  onBlockContent,
  contentPreview
}) => {
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl border border-yellow-600"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex items-center mb-4 text-yellow-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-bold">Content Warning</h2>
      </div>
      
      <p className="text-gray-300 mb-4">
        The system has detected potentially inappropriate content. Please review the content before proceeding.
      </p>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6 max-h-40 overflow-y-auto">
        <p className="text-gray-400 text-sm italic">Content preview:</p>
        <p className="text-white mt-2">{contentPreview}</p>
      </div>
      
      <div className="flex justify-end space-x-4">
        <motion.button
          onClick={onBlockContent}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Block Content
        </motion.button>
        <motion.button
          onClick={onAllowContent}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Allow Content
        </motion.button>
      </div>
    </motion.div>
  );
};
