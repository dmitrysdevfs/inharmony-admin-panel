import { API_CONFIG } from '@/lib/config';
import { NextResponse } from 'next/server';

// Helper function to convert base64 to blob
function base64ToBlob(base64Data, mimeType) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export async function POST(request, { params }) {
  try {
    const { locale } = await params;

    // Handle JSON and convert to FormData as API expects
    const body = await request.json();

    // Convert to FormData with proper long_desc format
    const formData = new FormData();

    Object.keys(body).forEach(key => {
      if (key === 'long_desc' && typeof body[key] === 'object') {
        // Convert long_desc object to proper format
        const longDescObj = {
          section1: body[key].section1 || '',
          section2: body[key].section2 || '',
          section3: body[key].section3 || '',
        };
        // Send as JSON string
        formData.append('long_desc', JSON.stringify(longDescObj));
      } else if (key === 'image' && body[key] && body[key].startsWith('data:')) {
        // Convert base64 to blob
        const base64Data = body[key].split(',')[1];
        const mimeType = body[key].split(';')[0].split(':')[1];
        const blob = base64ToBlob(base64Data, mimeType);
        formData.append('image', blob, 'image.jpg');
      } else if (body[key] !== null && body[key] !== undefined) {
        formData.append(key, body[key]);
      }
    });

    // Forward cookies from the original request
    const cookieHeader = request.headers.get('cookie');

    // Forward request to InHarmony API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/collections/${locale}`, {
      method: 'POST',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: formData,
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
