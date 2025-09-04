import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Logout failed', details: data },
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
