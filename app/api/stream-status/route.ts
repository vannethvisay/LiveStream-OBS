import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get user info from session/cookies in a real app
    const userId = '123'; // Mock user ID
    
    // Forward request to our Express backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/api/stream-status`, {
      headers: {
        'x-user-id': userId
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stream status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream status' },
      { status: 500 }
    );
  }
}
