import { NextRequest, NextResponse } from 'next/server';

// This is a Next.js API route that proxies requests to our Express backend
export async function GET(request: NextRequest) {
  try {
    // Get user info from session/cookies in a real app
    const userId = '123'; // Mock user ID
    const username = 'testuser'; // Mock username
    
    // Forward request to our Express backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/api/stream-credentials`, {
      headers: {
        'x-user-id': userId,
        'x-username': username
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stream credentials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream credentials' },
      { status: 500 }
    );
  }
}
