import { API_CONFIG } from '@/lib/config';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { locale } = await params;

    // Перенаправляємо запит до InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/collections/${locale}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Повертаємо дані з правильними заголовками
      const responseHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      };

      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      // Помилка отримання даних
      return NextResponse.json(
        { error: 'Failed to fetch collections', details: data },
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
