import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('🔐 API Login attempt:', { email: body.email });

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    console.log('📡 External API response status:', response.status);
    console.log('🍪 Set-Cookie header:', response.headers.get('set-cookie'));

    // Check Content-Type before parsing JSON
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Non-JSON response from external API');
      return NextResponse.json(
        { error: 'External API returned non-JSON response', status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('📦 External API data:', data);

    if (response.ok) {
      // Forward cookies from external API to client
      const setCookieHeader = response.headers.get('set-cookie');
      const responseOptions = {
        status: response.status,
      };

      if (setCookieHeader) {
        console.log('🍪 Forwarding cookie to client:', setCookieHeader);
        responseOptions.headers = {
          'Set-Cookie': setCookieHeader,
        };
      } else {
        console.warn('⚠️ No Set-Cookie header from external API');
      }

      return NextResponse.json(data, responseOptions);
    } else {
      console.error('❌ External API error:', data);
      return NextResponse.json(
        { error: 'Authentication failed', details: data },
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
