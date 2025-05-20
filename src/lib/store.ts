import { create } from 'zustand';
import { Agent, Conversation, Message, FollowUpSuggestion } from '@/types';
import { agents } from '@/lib/agents';
import { aiService } from '@/lib/ai-service';

interface AppState {
  agents: Agent[];
  selectedAgent: Agent | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  apiKeyConfigured: boolean;
  followUpSuggestions: FollowUpSuggestion[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setApiKey: (apiKey: string) => void;
  selectAgent: (agentId: string) => void;
  startConversation: (agentId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  updateAgentSettings: (agentId: string, updates: Partial<Agent>) => void;
  clearConversation: () => void;
  generateFollowUps: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  agents: agents,
  selectedAgent: null,
  conversations: [],
  currentConversation: null,
  apiKeyConfigured: false,
  followUpSuggestions: [],
  isLoading: false,
  error: null,
  
  setApiKey: (apiKey: string) => {
    // In a real app, we would validate the API key here
    localStorage.setItem('sambanova_api_key', apiKey);
    set({ apiKeyConfigured: true });
  },
  
  selectAgent: (agentId: string) => {
    const agent = get().agents.find(a => a.id === agentId) || null;
    set({ selectedAgent: agent });
    
    // Check if there's an existing conversation with this agent
    const existingConversation = get().conversations.find(c => c.agentId === agentId);
    if (existingConversation) {
      set({ currentConversation: existingConversation });
    } else {
      // Start a new conversation if none exists
      get().startConversation(agentId);
    }
  },
  
  startConversation: (agentId: string) => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      agentId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      conversations: [...state.conversations, newConversation],
      currentConversation: newConversation,
      followUpSuggestions: []
    }));
  },
  
  sendMessage: async (content: string) => {
    const { currentConversation, selectedAgent } = get();
    
    if (!currentConversation || !selectedAgent) {
      set({ error: 'No active conversation or agent selected' });
      return;
    }
    
    // Check content moderation
    const isAppropriate = await aiService.moderateContent(content);
    if (!isAppropriate) {
      set({ error: 'Content flagged as inappropriate' });
      return;
    }
    
    // Add user message to conversation
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    set(state => ({
      isLoading: true,
      error: null,
      currentConversation: {
        ...state.currentConversation!,
        messages: [...state.currentConversation!.messages, userMessage],
        updatedAt: new Date()
      }
    }));
    
    try {
      // Get AI response
      const response = await aiService.chat(
        selectedAgent,
        content,
        get().currentConversation!.messages
      );
      
      // Add AI response to conversation
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      set(state => ({
        currentConversation: {
          ...state.currentConversation!,
          messages: [...state.currentConversation!.messages, aiMessage],
          updatedAt: new Date()
        },
        isLoading: false
      }));
      
      // Generate follow-up suggestions
      get().generateFollowUps();
      
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        isLoading: false,
        error: 'Failed to get response from AI service'
      });
    }
  },
  
  updateAgentSettings: (agentId: string, updates: Partial<Agent>) => {
    set(state => ({
      agents: state.agents.map(agent => 
        agent.id === agentId ? { ...agent, ...updates } : agent
      )
    }));
    
    // If the updated agent is the selected one, update that too
    const { selectedAgent } = get();
    if (selectedAgent && selectedAgent.id === agentId) {
      set(state => ({
        selectedAgent: { ...state.selectedAgent!, ...updates }
      }));
    }
  },
  
  clearConversation: () => {
    const { currentConversation } = get();
    if (!currentConversation) return;
    
    set(state => ({
      conversations: state.conversations.filter(c => c.id !== currentConversation.id),
      currentConversation: null,
      followUpSuggestions: []
    }));
  },
  
  generateFollowUps: async () => {
    const { currentConversation, selectedAgent } = get();
    
    if (!currentConversation || !selectedAgent || currentConversation.messages.length < 2) {
      return;
    }
    
    try {
      const suggestions = await aiService.generateFollowUpSuggestions(
        selectedAgent,
        currentConversation.messages
      );
      
      const followUps: FollowUpSuggestion[] = suggestions.map((text, index) => ({
        id: `followup-${Date.now()}-${index}`,
        text,
        conversationId: currentConversation.id
      }));
      
      set({ followUpSuggestions: followUps });
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
    }
  }
}));
