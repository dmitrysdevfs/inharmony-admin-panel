import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(request) {
  try {
    // Forward cookies from the original request
    const cookieHeader = request.headers.get('cookie');

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/merch`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Return data with proper headers
      const responseHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      };

      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      // Error fetching data
      return NextResponse.json(
        { error: 'Failed to fetch merch settings', details: data },
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

