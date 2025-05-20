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
  capabilities?: AgentCapability[];
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

export interface AgentCapability {
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
  content: string | MessageContent[];
  timestamp: Date;
}

export type MessageContent = TextContent | ImageContent;

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  conversationId: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'website' | 'database' | 'api';
  url?: string;
  content?: string;
}

export interface AgentCollaboration {
  id: string;
  name: string;
  description: string;
  agents: string[]; // Agent IDs
  goal: string;
  workflow: CollaborationWorkflow;
}

export interface CollaborationWorkflow {
  steps: CollaborationStep[];
}

export interface CollaborationStep {
  id: string;
  agentId: string;
  task: string;
  dependsOn: string[]; // Step IDs
}

export interface UserFeedback {
  id: string;
  conversationId: string;
  messageId: string;
  rating: number; // 1-5
  comment?: string;
  timestamp: Date;
}
