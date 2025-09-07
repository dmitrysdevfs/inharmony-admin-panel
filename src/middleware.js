import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('🛡️ Middleware: Checking path:', pathname);

  // Check if the request is for a protected route (dashboard)
  if (pathname.startsWith('/dashboard')) {
    // Check if user has authentication cookie
    const accessToken = request.cookies.get('accessToken');
    console.log('🛡️ Middleware: Dashboard access, token exists:', !!accessToken);

    if (!accessToken) {
      console.log('🛡️ Middleware: No token, redirecting to login');
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Check if user is trying to access login page while already authenticated
  if (pathname === '/auth/login') {
    const accessToken = request.cookies.get('accessToken');
    console.log('🛡️ Middleware: Login page access, token exists:', !!accessToken);

    if (accessToken) {
      console.log('🛡️ Middleware: Already authenticated, redirecting to dashboard');
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  console.log('🛡️ Middleware: Allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login'],
};
