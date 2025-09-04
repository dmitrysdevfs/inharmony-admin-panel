import { API_CONFIG } from '@/lib/config';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { locale } = await params;
    const body = await request.json();

    // Перенаправляємо запит до InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/collections/${locale}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create collection', details: data },
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
