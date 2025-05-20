export interface Agent {
  id: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  avatar: string;
  tvReference: string;
  modelConfig: ModelConfig;
  tools: Tool[];
  knowledgeSources: string[];
  webAccess: boolean;
}

export interface ModelConfig {
  model: string;
  temperature: number;
  maxTokens?: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  conversationId: string;
}
