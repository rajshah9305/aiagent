import axios from 'axios';
import { ModelConfig, Message } from '@/types';
import OpenAI from 'openai';

export class SambanovaAI {
  private apiKey: string | undefined;
  private apiUrl: string;
  private useMockApi: boolean;
  private client: OpenAI | null = null;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY;
    this.apiUrl = process.env.SAMBANOVA_API_URL || 'https://api.sambanova.ai/v1';
    this.useMockApi = true; // Default to using the mock API until we get the real API working

    // Initialize OpenAI client if API key is available
    if (this.apiKey) {
      this.initClient();
    }
  }

  private initClient() {
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.apiUrl,
      });
      this.useMockApi = false;
    }
  }

  async generateResponse(
    systemPrompt: string,
    messages: { role: string; content: string | any }[],
    modelConfig: ModelConfig
  ): Promise<string> {
    try {
      if (!this.apiKey && !this.useMockApi) {
        console.warn('SambaNova API key is not configured, falling back to mock API');
        this.useMockApi = true;
      }

      // Format messages with system prompt
      const formattedMessages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ];

      // Try the real API first (unless we're explicitly using the mock)
      if (!this.useMockApi) {
        try {
          console.log('Attempting to use real SambaNova API');

          // Use the OpenAI client if available
          if (this.client) {
            const response = await this.client.chat.completions.create({
              model: modelConfig.model || "Llama-4-Maverick-17B-128E-Instruct",
              messages: formattedMessages,
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens || 1024,
              top_p: 0.1
            });

            return response.choices[0].message.content || '';
          } else {
            // Fallback to using the API route
            const payload = {
              model: modelConfig.model || "Llama-4-Maverick-17B-128E-Instruct",
              messages: formattedMessages,
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens || 1024,
              top_p: 0.1
            };

            const response = await axios.post('/api/chat', payload);
            return response.data.choices[0].message.content;
          }
        } catch (error) {
          console.error('Error calling SambaNova API, falling back to mock API:', error);
          this.useMockApi = true;
        }
      }

      // If we get here, use the mock API
      if (this.useMockApi) {
        console.log('Using mock API');
        const payload = {
          model: modelConfig.model || "Llama-4-Maverick-17B-128E-Instruct",
          messages: formattedMessages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens || 1024,
        };
        const mockResponse = await axios.post('/api/mock-chat', payload);
        return mockResponse.data.choices[0].message.content;
      }

      throw new Error('Failed to generate response from any API');
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw new Error('Failed to generate response from AI service');
    }
  }

  async generateImageResponse(
    systemPrompt: string,
    messages: Message[],
    imageUrl: string,
    modelConfig: ModelConfig
  ): Promise<string> {
    try {
      if (this.useMockApi) {
        console.log('Using mock API for image response');
        return "I'm currently in mock mode and can't process images. Please configure the SambaNova API key to enable image processing.";
      }

      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      // Format the messages with the image
      const formattedMessages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What do you see in this image?' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ];

      const response = await this.client.chat.completions.create({
        model: modelConfig.model || "Llama-4-Maverick-17B-128E-Instruct",
        messages: formattedMessages,
        temperature: modelConfig.temperature || 0.1,
        top_p: 0.1
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error in generateImageResponse:', error);
      throw new Error('Failed to generate image response from AI service');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey || this.useMockApi;
  }

  isUsingMockApi(): boolean {
    return this.useMockApi;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.useMockApi = false; // Reset to use real API when key is set
    this.initClient(); // Initialize the client with the new API key
  }

  // For testing purposes
  useMock(use: boolean = true): void {
    this.useMockApi = use;
  }
}
