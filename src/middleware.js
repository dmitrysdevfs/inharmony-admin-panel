import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected route (dashboard)
  if (pathname.startsWith('/dashboard')) {
    // Check if user has authentication cookie
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Check if user is trying to access login page while already authenticated
  if (pathname === '/auth/login') {
    const accessToken = request.cookies.get('accessToken');

    if (accessToken) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login'],
};
