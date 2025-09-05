import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST(request) {
  try {
    console.log('🔐 API logout: починаємо запит...');

    // TODO: ВИРІШИТИ ПРОБЛЕМУ З COOKIES
    // Проблема: cookies не передаються до API роуту через SameSite=None + Secure
    // Рішення: або перейти на HTTPS, або змінити налаштування cookies на зовнішньому API
    //
    // Коли проблема буде вирішена, розкоментувати код нижче:
    /*
    const cookieHeader = request.headers.get('cookie');
    console.log('🔐 API logout: cookie header:', cookieHeader);
    console.log('🔐 API logout: API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('🔐 API logout: отримали відповідь:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok || response.status === 204) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Logout failed', details: data },
      { status: response.status }
    );
    */

    // Тимчасове рішення: локальний logout
    console.log(
      '🔐 API logout: використовуємо локальний logout (зовнішній API тимчасово відключено)'
    );
    return NextResponse.json({ success: true, message: 'Local logout successful' });
  } catch (error) {
    console.error('🔐 API logout: помилка:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
