import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: cookieHeader || '',
      },
      credentials: 'include',
    });

    const setCookieHeader = response.headers.get('set-cookie');
    const data = await response.json().catch(() => ({}));

    const responseOptions = {
      status: response.status,
    };

    if (setCookieHeader) {
      responseOptions.headers = {
        'Set-Cookie': setCookieHeader,
      };
    } else {
      responseOptions.headers = {
        'Set-Cookie': [
          'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly; Secure; SameSite=None',
          'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly; Secure; SameSite=None',
        ],
      };
    }

    if (response.ok || response.status === 204) {
      return NextResponse.json({ success: true }, responseOptions);
    }

    return NextResponse.json({ error: 'Logout failed', details: data }, responseOptions);
  } catch (error) {
    return NextResponse.json(
      { success: true, message: 'Local logout successful' },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly; Secure; SameSite=None',
            'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly; Secure; SameSite=None',
          ],
        },
      }
    );
  }
}
