import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST(request) {
  try {
    const body = await request.json();

    // Перенаправляємо запит до InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // важливо для cookie
      body: JSON.stringify(body),
    });

    // Перевіряємо Content-Type перед парсингом JSON
    const contentType = response.headers.get('content-type');
    console.log('🔐 API login: Content-Type:', contentType);
    console.log('🔐 API login: Response status:', response.status);

    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ API login: зовнішній API повернув не JSON:', contentType);
      // Тимчасово повертаємо помилку без парсингу
      return NextResponse.json(
        { error: 'External API returned non-JSON response', status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (response.ok) {
      // Перевіряємо, чи є дані користувача
      if (data.data) {
        console.log('✅ API login: отримали дані користувача:', data.data);
      } else {
        console.log('⚠️ API login: дані користувача відсутні в відповіді');
      }

      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      console.error('❌ API login: помилка аутентифікації:', data);
      return NextResponse.json(
        { error: 'Authentication failed', details: data },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ API login: внутрішня помилка:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
