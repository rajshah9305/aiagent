import axios from 'axios';
import { ModelConfig } from '@/types';

export class SambanovaAI {
  private apiKey: string | undefined;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY;
    this.apiUrl = process.env.SAMBANOVA_API_URL || 'https://api.sambanova.ai';
  }

  async generateResponse(
    systemPrompt: string,
    messages: { role: string; content: string }[],
    modelConfig: ModelConfig
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('SambaNova API key is not configured');
      }

      // Use our server-side API route instead of calling SambaNova directly
      const response = await axios.post(
        '/api/chat',
        {
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
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling SambaNova API:', error);
      throw new Error('Failed to generate response from SambaNova API');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}
