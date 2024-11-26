import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    const loginUrl = new URL('/logowanie', req.url); // Redirect to login page
    return NextResponse.redirect(loginUrl);
  }

  // Debug: Log token for verification
  console.log('Token found:', token);
}

export const config = {
  matcher: ['/moje-konto', '/moje-konto/:path*'], // Protect these routes
};
