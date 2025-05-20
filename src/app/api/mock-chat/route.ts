import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model } = body;

    // Get the system message (if any)
    const systemMessage = messages.find((msg: any) => msg.role === 'system');
    const systemContent = systemMessage?.content || '';

    // Get the last user message
    const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();

    // Check if the user message is a string or an array (for multimodal content)
    let userContent = '';
    let hasImage = false;

    if (lastUserMessage) {
      if (typeof lastUserMessage.content === 'string') {
        userContent = lastUserMessage.content;
      } else if (Array.isArray(lastUserMessage.content)) {
        // Handle multimodal content (text + image)
        const textContent = lastUserMessage.content.find((item: any) => item.type === 'text');
        const imageContent = lastUserMessage.content.find((item: any) => item.type === 'image_url');

        userContent = textContent ? textContent.text : '';
        hasImage = !!imageContent;
      }
    }

    console.log('Mock API received message:', userContent);
    console.log('Contains image:', hasImage);
    console.log('System prompt:', systemContent);

    // Generate a more realistic mock response based on the user's message and agent
    let responseContent = '';

    // Check if this is an image analysis request
    if (hasImage) {
      responseContent = `I notice you've shared an image with me. Since I'm running in mock mode, I can't actually see the image content. In real operation with a valid SambaNova API key, I would analyze the image and provide relevant insights. Please configure the API key to enable image processing capabilities.`;
    }
    // Check if the system message contains character information
    else if (systemContent.includes('Better Call Saul')) {
      responseContent = `Well, well, well. You've got a legal question on your hands, huh? "${userContent}" - that's quite the situation you've got there. \n\nLet me tell you something, as your legal counsel, I'd advise you to consider all your options carefully. The law is complicated, but that's why you've got me - Saul Goodman - in your corner. \n\nNeed anything else? Just say the word. Remember: Better Call Saul!`;
    } else if (systemContent.includes('SheldonGPT')) {
      responseContent = `Fascinating question: "${userContent}". \n\nAccording to my superior intellect and extensive research, I can provide you with a comprehensive answer that few others would be capable of understanding. The scientific literature on this topic is quite clear, though I suspect I'm the only one who has read all 127 relevant papers. \n\nBazinga! That was a joke. Though my answer is, of course, entirely factual.`;
    } else if (systemContent.includes('Wolf of Wall Street')) {
      responseContent = `Listen, pal. "${userContent}" - that's a great question. Let me tell you something: in this business, you gotta be bold. You gotta take risks. \n\nHere's what I'd do in your situation... I'd double down. I'd go all in. Because the winners in this world aren't the ones who play it safe. They're the ones who see an opportunity and TAKE IT. \n\nYou feeling motivated yet? Because I'm just getting started!`;
    } else if (systemContent.includes('Jarvis')) {
      responseContent = `Of course, sir. Regarding "${userContent}" - I've analyzed the situation and prepared several options for you. \n\nMay I suggest approaching this methodically? I've taken the liberty of organizing the relevant information and can present it in whatever format you prefer. \n\nWould you like me to proceed with the standard protocol, or shall I adapt to your current preferences?`;
    } else if (systemContent.includes('Q')) {
      responseContent = `Ah, 007, asking about "${userContent}" I see. \n\nI've been working on something rather special that might help with this particular... predicament. It's a sophisticated solution, if I do say so myself. \n\nThis new approach optimizes for both precision and creativity, allowing you to navigate complex scenarios with remarkable efficiency. Shall I explain the technical specifications, or would you prefer a practical demonstration?`;
    } else {
      // Generic response if no specific character is detected
      responseContent = `Thank you for your message: "${userContent}". \n\nI'm currently running in mock mode because the SambaNova API connection isn't working correctly. This is a simulated response to show that the chat interface is functioning properly. \n\nIn a real deployment, you would be getting responses from the actual AI model. Please check your API configuration in the environment variables.`;
    }

    // Simulate a delay to make it feel more realistic (1-2 seconds)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return NextResponse.json({
      id: `mock-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseContent
          },
          finish_reason: 'stop'
        }
      ],
      model: model || 'mock-llama-4',
      usage: {
        prompt_tokens: userContent.length,
        completion_tokens: responseContent.length,
        total_tokens: userContent.length + responseContent.length
      }
    });
  } catch (error: any) {
    console.error('Error in mock chat API route:', error);

    return NextResponse.json(
      {
        id: `mock-error-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: "I apologize, but there was an error processing your request in the mock API. This is unusual since the mock API should always work. Please check the server logs for more details."
            },
            finish_reason: 'stop'
          }
        ],
        error: 'Failed to generate mock response',
        details: error.message || 'Unknown error'
      },
      { status: 200 } // Return 200 so the client can display the error message
    );
  }
}
