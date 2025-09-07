import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(request) {
  try {
    console.log('👤 API Current user request');
    console.log('🍪 Request cookies:', request.headers.get('cookie'));

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/users/current`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: request.headers.get('cookie') || '', // Forward cookies from client
      },
      credentials: 'include', // important for cookies
    });

    console.log('📡 External API response status:', response.status);
    console.log(
      '📦 External API response headers:',
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log('📦 External API data:', data);

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      console.error('❌ External API error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch current user', details: data },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('💥 API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
