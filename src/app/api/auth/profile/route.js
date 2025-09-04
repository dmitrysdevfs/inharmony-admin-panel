import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(request) {
  try {
    // Токен автоматично надсилається з httpOnly cookies
    // Не потрібно перевіряти Authorization заголовок

    // Перенаправляємо запит до InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include', // важливо для cookie
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: data },
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
