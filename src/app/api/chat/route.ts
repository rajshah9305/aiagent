import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, temperature, max_tokens, top_p } = body;

    // In server components/API routes, we should use process.env directly (not NEXT_PUBLIC_*)
    const apiKey = process.env.SAMBANOVA_API_KEY || process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY;
    // Based on the reference code, the correct URL is 'https://api.sambanova.ai/v1'
    const apiUrl = process.env.SAMBANOVA_API_URL || 'https://api.sambanova.ai/v1';

    console.log('API URL:', apiUrl);
    console.log('API Key configured:', !!apiKey);
    console.log('Model:', model);
    console.log('Messages count:', messages.length);

    if (!apiKey) {
      console.error('API key not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // For debugging in development, uncomment to use mock response
    // return NextResponse.json({
    //   choices: [
    //     {
    //       message: {
    //         content: "This is a mock response from the server-side API route. Your actual SambaNova API integration may not be working correctly."
    //       }
    //     }
    //   ]
    // });

    try {
      // Based on the reference code, we should use model "Llama-4-Maverick-17B-128E-Instruct" if none specified
      const modelToUse = model || "Llama-4-Maverick-17B-128E-Instruct";

      // Create OpenAI client with SambaNova base URL
      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: apiUrl,
      });

      console.log('Attempting API call to SambaNova with OpenAI client');

      // Log the request parameters for debugging
      console.log('Request parameters:', {
        model: modelToUse,
        messagesCount: messages.length,
        temperature: temperature || 0.1,
        top_p: top_p || 0.1,
        max_tokens: max_tokens || 1024,
      });

      // Make the API call using the OpenAI client
      const response = await client.chat.completions.create({
        model: modelToUse,
        messages,
        temperature: temperature || 0.1,
        top_p: top_p || 0.1,
        max_tokens: max_tokens || 1024,
      });

      console.log('API response received successfully');

      // Format the response to match the expected structure
      return NextResponse.json({
        id: response.id,
        object: response.object,
        created: response.created,
        model: response.model,
        choices: response.choices.map(choice => ({
          index: choice.index,
          message: {
            role: choice.message.role,
            content: choice.message.content
          },
          finish_reason: choice.finish_reason
        })),
        usage: response.usage
      });
    } catch (error: any) {
      console.error('Error with API call:', error.message);

      // If the error is related to the model, try with a different model
      if (error.message.includes('model') || error.response?.data?.error?.includes('model')) {
        console.log('Attempting with alternative model');
        try {
          // Create OpenAI client with SambaNova base URL
          const client = new OpenAI({
            apiKey: apiKey,
            baseURL: apiUrl,
          });

          const response = await client.chat.completions.create({
            model: "Llama-4-Maverick-17B-128E-Instruct", // Try with this specific model
            messages,
            temperature: temperature || 0.1,
            top_p: top_p || 0.1,
            max_tokens: max_tokens || 1024,
          });

          console.log('API response received successfully with alternative model');

          // Format the response to match the expected structure
          return NextResponse.json({
            id: response.id,
            object: response.object,
            created: response.created,
            model: response.model,
            choices: response.choices.map(choice => ({
              index: choice.index,
              message: {
                role: choice.message.role,
                content: choice.message.content
              },
              finish_reason: choice.finish_reason
            })),
            usage: response.usage
          });
        } catch (fallbackError: any) {
          console.error('Error with fallback model:', fallbackError.message);
          return handleApiError(fallbackError);
        }
      }

      return handleApiError(error);
    }
  } catch (error: any) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      {
        choices: [
          {
            message: {
              content: "I apologize, but I encountered an error processing your request: " +
                      (error.message || 'Unknown error')
            }
          }
        ],
        error: 'Failed to process request',
        details: error.message || 'Unknown error'
      },
      { status: 400 }
    );
  }
}

function handleApiError(error: any) {
  console.error('Error in chat API route:', error);

  // Log more detailed error information
  if (error.response) {
    console.error('API response status:', error.response.status);
    console.error('API response data:', error.response.data);
  }

  // Return a more user-friendly response with detailed error information
  return NextResponse.json(
    {
      choices: [
        {
          message: {
            content: "I apologize, but I encountered an error: Failed to generate response from AI service:\n" +
                    (error.message || 'Unknown error') + "\n\n" +
                    "Please try again later or check your API configuration."
          }
        }
      ],
      error: 'Failed to generate response',
      details: error.message || 'Unknown error',
      status: error.response?.status || 'unknown'
    },
    { status: 200 } // Return 200 so the client can display the error message
  );
}
