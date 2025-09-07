import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST(request) {
  try {
    const body = await request.json();

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

    // Check Content-Type before parsing JSON
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'External API returned non-JSON response', status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (response.ok) {
      // Forward cookies from external API to client
      const setCookieHeader = response.headers.get('set-cookie');
      const responseOptions = {
        status: response.status,
      };

      if (setCookieHeader) {
        responseOptions.headers = {
          'Set-Cookie': setCookieHeader,
        };
      }

      return NextResponse.json(data, responseOptions);
    } else {
      return NextResponse.json(
        { error: 'Authentication failed', details: data },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
