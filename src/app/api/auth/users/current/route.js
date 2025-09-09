import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(request) {
  try {
    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/users/current`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: request.headers.get('cookie') || '', // Forward cookies from client
      },
      credentials: 'include', // important for cookies
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch current user', details: data },
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
