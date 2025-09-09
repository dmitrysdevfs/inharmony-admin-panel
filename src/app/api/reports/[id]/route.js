import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!API_CONFIG.BASE_URL) {
      return NextResponse.json({ error: 'API configuration is missing' }, { status: 500 });
    }

    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/reports/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Cookie: cookieHeader || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      // For 204 No Content, don't try to parse JSON
      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }

      // For other successful responses, parse JSON
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      // Handle specific error codes
      let errorMessage = 'Failed to delete report';

      switch (response.status) {
        case 400:
          errorMessage = 'Invalid report ID';
          break;
        case 403:
          errorMessage = 'Unauthorized access';
          break;
        case 404:
          errorMessage = 'Report not found';
          break;
        default:
          errorMessage = 'Failed to delete report';
      }

      // Try to parse JSON error response
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, use default error
      }

      return NextResponse.json(
        { error: errorMessage, details: errorData },
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
