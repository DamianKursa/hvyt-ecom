import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    const loginUrl = new URL('/logowanie', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/moje-konto', '/moje-konto/:path*'], 
};
