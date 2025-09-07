import { API_CONFIG } from '@/lib/config';
import { NextResponse } from 'next/server';

// Get specific collection
export async function GET(request, { params }) {
  try {
    const { locale, id } = await params;

    // Forward cookies from the original request
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch collection', details: data },
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

// Update collection
export async function PUT(request, { params }) {
  try {
    const { locale, id } = await params;
    const body = await request.json();

    // Forward cookies from the original request
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
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

// Delete collection
export async function DELETE(request, { params }) {
  try {
    const { locale, id } = await params;

    // Forward cookies from the original request
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete collection', details: data },
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
