import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, temperature, max_tokens } = body;

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

    // Mock response for testing - uncomment to test without actual API call
    /*
    return NextResponse.json({
      choices: [
        {
          message: {
            content: "This is a mock response from the server-side API route. Your actual SambaNova API integration may not be working correctly."
          }
        }
      ]
    });
    */

    // Uncomment this mock response for testing if needed
    /*
    return NextResponse.json({
      choices: [
        {
          message: {
            content: "This is a mock response from the server-side API route. Your actual SambaNova API integration may not be working correctly."
          }
        }
      ]
    });
    */

    // Make the API call based on the reference code format
    console.log('Attempting API call to:', `${apiUrl}/chat/completions`);
    try {
      // Based on the reference code, we should use model "Llama-4-Maverick-17B-128E-Instruct" if none specified
      const modelToUse = model || "Llama-4-Maverick-17B-128E-Instruct";

      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: modelToUse,
          messages,
          temperature: temperature || 0.1,
          top_p: 0.1,
          max_tokens: max_tokens || 1024,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      console.log('API response status:', response.status);
      return NextResponse.json(response.data);
    } catch (error: any) {
      console.error('Error with API call:', error.message);

      // If the error is related to the model, try with a different model
      if (error.message.includes('model') || error.response?.data?.error?.includes('model')) {
        console.log('Attempting with alternative model');
        try {
          const response = await axios.post(
            `${apiUrl}/chat/completions`,
            {
              model: "Llama-4-Maverick-17B-128E-Instruct", // Try with this specific model
              messages,
              temperature: temperature || 0.1,
              top_p: 0.1,
              max_tokens: max_tokens || 1024,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              }
            }
          );

    console.log('API response status:', response.status);

    return NextResponse.json(response.data);
  } catch (error: any) {
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
}
