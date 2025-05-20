import { SambanovaAI } from './sambanova';
import { Agent, Message, MessageContent, TextContent, ImageContent } from '@/types';

export class AIService {
  sambanovaClient: SambanovaAI;

  constructor() {
    this.sambanovaClient = new SambanovaAI();
  }

  async chat(agent: Agent, message: string | MessageContent[], conversationHistory: Message[] = []) {
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

      // Check if the message contains an image
      const hasImage = this.containsImage(message);
      console.log('Message contains image:', hasImage);

      // Call the appropriate SambaNova API method based on content type
      console.log('Calling AI API with model:', agent.modelConfig.model);

      let response: string;

      if (hasImage) {
        // Extract the image URL
        const imageUrl = this.extractImageUrl(message);
        if (!imageUrl) {
          throw new Error('Failed to extract image URL from message');
        }

        // Call the image-specific API method
        response = await this.sambanovaClient.generateImageResponse(
          systemMessage,
          conversationHistory,
          imageUrl,
          agent.modelConfig
        );
      } else {
        // Call the standard text API method
        response = await this.sambanovaClient.generateResponse(
          systemMessage,
          formattedHistory,
          agent.modelConfig
        );
      }

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

  private containsImage(message: string | MessageContent[]): boolean {
    if (typeof message === 'string') {
      return false;
    }

    return message.some(content => 'type' in content && content.type === 'image_url');
  }

  private extractImageUrl(message: string | MessageContent[]): string | null {
    if (typeof message === 'string') {
      return null;
    }

    const imageContent = message.find(content =>
      'type' in content && content.type === 'image_url'
    ) as ImageContent | undefined;

    return imageContent?.image_url.url || null;
  }

  async generateFollowUpSuggestions(agent: Agent, conversationHistory: Message[]) {
    try {
      // Create a prompt specifically for generating follow-up questions
      const prompt = `Based on the conversation history, generate 3 relevant follow-up questions that the user might want to ask next. Make them concise and directly related to the conversation context.`;

      // Format the conversation history
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the SambaNova API
      const response = await this.sambanovaClient.generateResponse(
        prompt,
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
    // Enhanced parsing logic for better extraction
    const lines = response.split('\n');

    // First, try to extract numbered questions (1. What is...? 2. How do...?)
    let questions = lines
      .filter(line => /^\d+\.?\s+.+\?/.test(line.trim()))
      .map(line => line.replace(/^\d+\.?\s+/, '').trim());

    // If we didn't find numbered questions, look for lines ending with question marks
    if (questions.length === 0) {
      questions = lines
        .filter(line => line.trim().endsWith('?'))
        .map(line => line.trim());
    }

    // If we still don't have questions, try to extract any sentence ending with a question mark
    if (questions.length === 0) {
      const text = response.replace(/\n/g, ' ');
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      questions = sentences
        .filter(sentence => sentence.trim().endsWith('?'))
        .map(sentence => sentence.trim());
    }

    // Limit to 3 questions and ensure they're not too long
    return questions
      .slice(0, 3)
      .map(q => q.length > 100 ? q.substring(0, 97) + '...' : q);
  }

  private createSystemPrompt(agent: Agent): string {
    // Create a tailored system prompt based on the agent's characteristics
    const toolsText = agent.tools.filter(tool => tool.enabled)
      .map(tool => `${tool.name}: ${tool.description}`)
      .join('\n- ');

    const capabilitiesText = agent.capabilities?.filter(cap => cap.enabled)
      .map(cap => `${cap.name}: ${cap.description}`)
      .join('\n- ');

    return `You are ${agent.name}, ${agent.role}. ${agent.description} Your character is based on ${agent.tvReference}.

Your tagline is: "${agent.tagline}"

Respond in a way that reflects your character's personality and expertise.

${agent.tools.length > 0 ? `You have access to the following tools:
- ${toolsText}` : ''}

${agent.capabilities?.length ? `You have the following capabilities:
- ${capabilitiesText}` : ''}

Your knowledge sources include: ${agent.knowledgeSources.join(', ')}.
${agent.webAccess ? 'You have access to the web for retrieving information.' : 'You do not have web access.'}

Always stay in character and provide helpful, accurate information to the user. Be engaging, witty, and true to your character's personality while remaining helpful and respectful.`;
  }

  async moderateContent(content: string | MessageContent[]): Promise<boolean> {
    try {
      // Extract text content for moderation
      let textToModerate = '';

      if (typeof content === 'string') {
        textToModerate = content;
      } else {
        // Extract text from MessageContent array
        const textContents = content.filter(item =>
          'type' in item && item.type === 'text'
        ) as TextContent[];

        textToModerate = textContents.map(item => item.text).join(' ');
      }

      // Check if content moderation is enabled in environment
      const moderationEnabled = process.env.CONTENT_MODERATION_ENABLED === 'true';
      if (!moderationEnabled) {
        return true; // Skip moderation if disabled
      }

      // Enhanced NSFW check with more comprehensive list
      const nsfwTerms = [
        'explicit', 'nsfw', 'adult content', 'pornography', 'obscene',
        'sexually explicit', 'adult material', 'xxx', 'erotic',
        'violent content', 'graphic violence', 'hate speech', 'racial slur',
        'illegal activity', 'drug manufacturing', 'terrorism'
      ];

      const lowerContent = textToModerate.toLowerCase();

      // Check if any NSFW terms are present
      const containsNSFW = nsfwTerms.some(term => lowerContent.includes(term));

      if (containsNSFW) {
        console.warn('Content moderation: Inappropriate content detected');
        return false; // Content is not appropriate
      }

      return true; // Content is appropriate
    } catch (error) {
      console.error('Error in content moderation:', error);
      return true; // Default to allowing content if moderation fails
    }
  }

  async createImageMessage(text: string, imageUrl: string): Promise<MessageContent[]> {
    return [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: imageUrl } }
    ];
  }
}

export const aiService = new AIService();
