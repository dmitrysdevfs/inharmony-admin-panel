import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(request) {
  try {
    if (!API_CONFIG.BASE_URL) {
      return NextResponse.json({ error: 'API configuration is missing' }, { status: 500 });
    }

    // Extract cookies from the incoming request
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/reports`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: cookieHeader || '',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: data },
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
