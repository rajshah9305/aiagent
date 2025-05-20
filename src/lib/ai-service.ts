import { SambanovaAI } from './sambanova';
import { Agent } from '@/types';

export class AIService {
  sambanovaClient: SambanovaAI;

  constructor() {
    this.sambanovaClient = new SambanovaAI();
  }

  async chat(agent: Agent, message: string, conversationHistory: any[] = []) {
    try {
      console.log('Starting chat with agent:', agent.name);
      console.log('API Key configured:', this.sambanovaClient.isConfigured());

      // Format conversation history for the API
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the new message
      formattedHistory.push({
        role: 'user',
        content: message
      });

      console.log('Formatted history length:', formattedHistory.length);

      // Create system message based on agent's role and characteristics
      const systemMessage = this.createSystemPrompt(agent);
      console.log('System prompt created');

      // Force mock API for testing if needed
      // this.sambanovaClient.useMock(true);

      // Call the SambaNova API with fallback to mock API
      console.log('Calling AI API with model:', agent.modelConfig.model);
      const response = await this.sambanovaClient.generateResponse(
        systemMessage,
        formattedHistory,
        agent.modelConfig
      );

      console.log('Received response from API');
      return response;
    } catch (error: any) {
      console.error('Error in AI chat service:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('API response error:', error.response.data);
        console.error('API response status:', error.response.status);
      }
      throw new Error(`Failed to generate response from AI service: ${error.message}`);
    }
  }

  async generateFollowUpSuggestions(agent: Agent, conversationHistory: any[]) {
    try {
      // Create a prompt specifically for generating follow-up questions
      const prompt = `Based on the conversation history, generate 3 relevant follow-up questions that the user might want to ask next. Make them concise and directly related to the conversation context.`;

      // Add this as a system message
      const systemMessage = {
        role: 'system',
        content: prompt
      };

      // Format the conversation history
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the SambaNova API
      const response = await this.sambanovaClient.generateResponse(
        systemMessage.content,
        formattedHistory,
        { ...agent.modelConfig, temperature: 0.7 }
      );

      // Parse the response to extract questions
      const questions = this.parseFollowUpQuestions(response);

      return questions;
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
      return [];
    }
  }

  private parseFollowUpQuestions(response: string): string[] {
    // Simple parsing logic - can be enhanced for better extraction
    const questions = response
      .split('\n')
      .filter(line => line.trim().length > 0 && (line.includes('?') || /^\d+\./.test(line)))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);

    return questions;
  }

  private createSystemPrompt(agent: Agent): string {
    // Create a tailored system prompt based on the agent's characteristics
    return `You are ${agent.name}, ${agent.role}. ${agent.description} Your character is based on ${agent.tvReference}.

Your tagline is: "${agent.tagline}"

Respond in a way that reflects your character's personality and expertise. You have access to the following tools: ${agent.tools.map(tool => tool.name).join(', ')}.

Your knowledge sources include: ${agent.knowledgeSources.join(', ')}.
${agent.webAccess ? 'You have access to the web for retrieving information.' : 'You do not have web access.'}

Always stay in character and provide helpful, accurate information to the user.`;
  }

  async moderateContent(content: string): Promise<boolean> {
    try {
      // Simple NSFW check - in a real app, this would use a more sophisticated approach
      const nsfwTerms = ['explicit', 'nsfw', 'adult content', 'pornography', 'obscene'];
      const lowerContent = content.toLowerCase();

      // Check if any NSFW terms are present
      const containsNSFW = nsfwTerms.some(term => lowerContent.includes(term));

      if (containsNSFW) {
        return false; // Content is not appropriate
      }

      return true; // Content is appropriate
    } catch (error) {
      console.error('Error in content moderation:', error);
      return true; // Default to allowing content if moderation fails
    }
  }
}

export const aiService = new AIService();
