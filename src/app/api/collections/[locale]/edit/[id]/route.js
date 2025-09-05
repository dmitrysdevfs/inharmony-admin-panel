import { API_CONFIG } from '@/lib/config';
import { NextResponse } from 'next/server';

// Отримання збору для редагування
export async function GET(request, { params }) {
  try {
    const { locale, id } = await params;

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch collection for editing', details: data },
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

// Оновлення збору при редагуванні
export async function PUT(request, { params }) {
  try {
    const { locale, id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}/${id}`, {
      method: 'PUT',
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
        { error: 'Failed to update collection', details: data },
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
