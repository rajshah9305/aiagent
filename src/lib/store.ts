import { create } from 'zustand';
import { Agent, Conversation, Message, FollowUpSuggestion, MessageContent } from '@/types';
import { agents } from '@/lib/agents';
import { aiService } from '@/lib/ai-service';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  agents: Agent[];
  selectedAgent: Agent | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  apiKeyConfigured: boolean;
  followUpSuggestions: FollowUpSuggestion[];
  isLoading: boolean;
  error: string | null;
  usingMockApi: boolean;

  // Actions
  setApiKey: (apiKey: string) => void;
  selectAgent: (agentId: string) => void;
  startConversation: (agentId: string) => void;
  sendMessage: (content: string | MessageContent[]) => Promise<void>;
  sendImageMessage: (text: string, imageUrl: string) => Promise<void>;
  updateAgentSettings: (agentId: string, updates: Partial<Agent>) => void;
  clearConversation: () => void;
  generateFollowUps: () => Promise<void>;
  clearError: () => void;
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
  usingMockApi: true, // Default to using mock API until real API is working

  setApiKey: (apiKey: string) => {
    try {
      // Store the API key in localStorage
      localStorage.setItem('sambanova_api_key', apiKey);

      // Set the API key in the SambaNova client
      aiService.sambanovaClient.setApiKey(apiKey);

      // Update the state
      set({
        apiKeyConfigured: true,
        usingMockApi: false, // Attempt to use real API when key is set
        error: null
      });

      console.log('API key configured successfully');
    } catch (error) {
      console.error('Error setting API key:', error);
      set({
        error: 'Failed to configure API key. Please try again.'
      });
    }
  },

  selectAgent: (agentId: string) => {
    const agent = get().agents.find(a => a.id === agentId) || null;
    set({
      selectedAgent: agent,
      error: null
    });

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
      id: `conv-${uuidv4()}`,
      agentId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      conversations: [...state.conversations, newConversation],
      currentConversation: newConversation,
      followUpSuggestions: [],
      error: null
    }));
  },

  sendMessage: async (content: string | MessageContent[]) => {
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
      id: `msg-${uuidv4()}`,
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

      // Check if we're using the mock API
      const usingMock = aiService.sambanovaClient.isUsingMockApi();

      // Add AI response to conversation
      const aiMessage: Message = {
        id: `msg-${uuidv4()}`,
        role: 'assistant',
        content: response || 'I apologize, but I was unable to generate a response at this time. Please try again later.',
        timestamp: new Date()
      };

      set(state => ({
        currentConversation: {
          ...state.currentConversation!,
          messages: [...state.currentConversation!.messages, aiMessage],
          updatedAt: new Date()
        },
        isLoading: false,
        error: null,
        usingMockApi: usingMock
      }));

      // Generate follow-up suggestions
      get().generateFollowUps();

    } catch (error: any) {
      console.error('Error sending message:', error);

      // Add error message as AI response
      const errorMessage: Message = {
        id: `msg-${uuidv4()}`,
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message || 'Unknown error'}. Please try again later.`,
        timestamp: new Date()
      };

      set(state => ({
        isLoading: false,
        error: 'Failed to get response from AI service',
        currentConversation: {
          ...state.currentConversation!,
          messages: [...state.currentConversation!.messages, errorMessage],
          updatedAt: new Date()
        }
      }));
    }
  },

  sendImageMessage: async (text: string, imageUrl: string) => {
    try {
      // Create a multimodal message with text and image
      const multimodalContent = await aiService.createImageMessage(text, imageUrl);

      // Send the message using the standard sendMessage function
      await get().sendMessage(multimodalContent);
    } catch (error: any) {
      console.error('Error sending image message:', error);
      set({
        error: `Failed to send image: ${error.message || 'Unknown error'}`
      });
    }
  },

  updateAgentSettings: (agentId: string, updates: Partial<Agent>) => {
    set(state => ({
      agents: state.agents.map(agent =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      ),
      error: null
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
      followUpSuggestions: [],
      error: null
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
        id: `followup-${uuidv4()}-${index}`,
        text,
        conversationId: currentConversation.id
      }));

      set({ followUpSuggestions: followUps });
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
