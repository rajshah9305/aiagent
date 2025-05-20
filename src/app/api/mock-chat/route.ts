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
    const userContent = lastUserMessage?.content || '';

    console.log('Mock API received message:', userContent);
    console.log('System prompt:', systemContent);

    // Generate a more realistic mock response based on the user's message
    let responseContent = '';

    // Check if the system message contains character information
    if (systemContent.includes('Better Call Saul')) {
      responseContent = `Well, well, well. You've got a legal question on your hands, huh? "${userContent}" - that's quite the situation you've got there. \n\nLet me tell you something, as your legal counsel, I'd advise you to consider all your options carefully. The law is complicated, but that's why you've got me - Saul Goodman - in your corner. \n\nNeed anything else? Just say the word. Remember: Better Call Saul!`;
    } else if (systemContent.includes('SheldonGPT')) {
      responseContent = `Fascinating question: "${userContent}". \n\nAccording to my superior intellect and extensive research, I can provide you with a comprehensive answer that few others would be capable of understanding. The scientific literature on this topic is quite clear, though I suspect I'm the only one who has read all 127 relevant papers. \n\nBazinga! That was a joke. Though my answer is, of course, entirely factual.`;
    } else {
      // Generic response if no specific character is detected
      responseContent = `Thank you for your message: "${userContent}". \n\nI'm currently running in mock mode because the SambaNova API connection isn't working correctly. This is a simulated response to show that the chat interface is functioning properly. \n\nIn a real deployment, you would be getting responses from the actual AI model. Please check your API configuration in the environment variables.`;
    }

    // Simulate a delay to make it feel more realistic (1-2 seconds)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return NextResponse.json({
      choices: [
        {
          message: {
            content: responseContent
          }
        }
      ],
      model: model || 'mock-gpt',
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
        choices: [
          {
            message: {
              content: "I apologize, but there was an error processing your request in the mock API. This is unusual since the mock API should always work. Please check the server logs for more details."
            }
          }
        ],
        error: 'Failed to generate mock response',
        details: error.message || 'Unknown error'
      },
      { status: 200 } // Return 200 so the client can display the error message
    );
  }
}
