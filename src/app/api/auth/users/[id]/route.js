import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const { id } = params;

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update user', details: data },
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, {
        status: response.status,
      });
    } else {
      const data = await response.json();
      return NextResponse.json(
        { error: 'Failed to delete user', details: data },
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
