import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Agent } from '@/types';

interface FeedbackFormProps {
  agent: Agent;
  onSubmit: (feedback: string, rating: number) => void;
  onClose: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ agent, onSubmit, onClose }) => {
  const [feedback, setFeedback] = React.useState('');
  const [rating, setRating] = React.useState(5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback, rating);
    setFeedback('');
    setRating(5);
  };
  
  return (
    <motion.div
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Provide Feedback</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">How would you rate your experience with {agent.name}?</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-8 w-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">What feedback do you have for this agent?</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts on the agent's performance, accuracy, and helpfulness..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Feedback
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export const UserFeedback: React.FC = () => {
  const { agents, selectedAgent } = useAppStore();
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  
  const handleFeedbackSubmit = (feedback: string, rating: number) => {
    // In a real app, this would send the feedback to a backend service
    console.log('Feedback submitted:', { agent: selectedAgent?.name, feedback, rating });
    setShowFeedbackForm(false);
    // Show success message or notification
  };
  
  return (
    <div>
      {!showFeedbackForm ? (
        <motion.button
          onClick={() => setShowFeedbackForm(true)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Provide Feedback
        </motion.button>
      ) : selectedAgent ? (
        <FeedbackForm 
          agent={selectedAgent} 
          onSubmit={handleFeedbackSubmit}
          onClose={() => setShowFeedbackForm(false)}
        />
      ) : null}
    </div>
  );
};
