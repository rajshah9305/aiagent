import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, temperature, max_tokens } = body;
    
    const apiKey = process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY;
    const apiUrl = process.env.SAMBANOVA_API_URL || 'https://api.sambanova.ai/v1';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const response = await axios.post(
      `${apiUrl}/chat/completions`,
      {
        model,
        messages,
        temperature,
        max_tokens: max_tokens || 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
