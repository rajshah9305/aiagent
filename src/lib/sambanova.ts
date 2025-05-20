import axios from 'axios';
import { ModelConfig } from '@/types';

export class SambanovaAI {
  private apiKey: string | undefined;
  private apiUrl: string;
  private useMockApi: boolean;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY;
    this.apiUrl = process.env.SAMBANOVA_API_URL || 'https://api.sambanova.net/api/v1';
    this.useMockApi = true; // Default to using the mock API until we get the real API working
  }

  async generateResponse(
    systemPrompt: string,
    messages: { role: string; content: string }[],
    modelConfig: ModelConfig
  ): Promise<string> {
    try {
      if (!this.apiKey && !this.useMockApi) {
        console.warn('SambaNova API key is not configured, falling back to mock API');
        this.useMockApi = true;
      }

      const payload = {
        model: modelConfig.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens || 1024,
      };

      // Try the real API first (unless we're explicitly using the mock)
      if (!this.useMockApi) {
        try {
          console.log('Attempting to use real SambaNova API');
          const response = await axios.post('/api/chat', payload);
          return response.data.choices[0].message.content;
        } catch (error) {
          console.error('Error calling SambaNova API, falling back to mock API:', error);
          this.useMockApi = true;
        }
      }

      // If we get here, use the mock API
      if (this.useMockApi) {
        console.log('Using mock API');
        const mockResponse = await axios.post('/api/mock-chat', payload);
        return mockResponse.data.choices[0].message.content;
      }

      throw new Error('Failed to generate response from any API');
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw new Error('Failed to generate response from AI service');
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
  }

  // For testing purposes
  useMock(use: boolean = true): void {
    this.useMockApi = use;
  }
}
