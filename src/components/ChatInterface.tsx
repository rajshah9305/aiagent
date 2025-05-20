import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message, MessageContent, TextContent, ImageContent } from '@/types';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

// Helper function to determine if content is multimodal
const isMultimodalContent = (content: any): content is MessageContent[] => {
  return Array.isArray(content) && content.length > 0 && 'type' in content[0];
};

// Helper function to render message content based on type
const renderMessageContent = (content: string | MessageContent[]) => {
  if (typeof content === 'string') {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  if (isMultimodalContent(content)) {
    return (
      <div className="space-y-2">
        {content.map((item, index) => {
          if (item.type === 'text') {
            const textItem = item as TextContent;
            return <div key={index} className="whitespace-pre-wrap">{textItem.text}</div>;
          } else if (item.type === 'image_url') {
            const imageItem = item as ImageContent;
            return (
              <div key={index} className="mt-2">
                <img
                  src={imageItem.image_url.url}
                  alt="User uploaded image"
                  className="max-w-full rounded-lg max-h-64 object-contain"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return <div>Unsupported content format</div>;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-800 text-gray-100 rounded-tl-none'
        }`}
      >
        {renderMessageContent(message.content)}
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSendImageMessage?: (text: string, imageUrl: string) => void;
  isLoading: boolean;
  followUpSuggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onSendImageMessage,
  isLoading,
  followUpSuggestions,
  onSuggestionClick
}) => {
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !imageFile) return;
    if (isLoading) return;

    if (imageFile && imagePreview && onSendImageMessage) {
      // Send message with image
      onSendImageMessage(inputValue, imagePreview);
      setInputValue('');
      setImageFile(null);
      setImagePreview(null);
    } else {
      // Send text-only message
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachImage = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>Start a conversation with this agent</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {followUpSuggestions.length > 0 && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Suggested follow-ups:</p>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Image attached</p>
            <button
              onClick={handleRemoveImage}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <div className="relative w-20 h-20">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-850">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={imageFile ? "Add a caption to your image..." : "Type your message..."}
            className="w-full px-4 py-3 pr-24 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Attach image button */}
          {onSendImageMessage && (
            <button
              type="button"
              onClick={handleAttachImage}
              disabled={isLoading || !!imageFile}
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                isLoading || !!imageFile ? 'text-gray-600' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}

          {/* Send button */}
          <button
            type="submit"
            disabled={((!inputValue.trim() && !imageFile) || isLoading)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              ((!inputValue.trim() && !imageFile) || isLoading) ? 'text-gray-600' : 'text-blue-500 hover:bg-gray-700'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
