import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const userAgent = req.headers.get('user-agent') || '';

  // Detect common in‑app browser signatures from Facebook/Instagram
  const inAppBrowserRegex = /(FBAN|FBAV|Instagram)/i;
  const isInAppBrowser = inAppBrowserRegex.test(userAgent);

  console.log('User Agent:', userAgent, 'isInAppBrowser:', isInAppBrowser);
  console.log('Token:', token);

  // If no token is present, only force redirect for non‑in‑app browsers
  if (!token && !isInAppBrowser) {
    const loginUrl = new URL('/logowanie', req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Otherwise, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/moje-konto', '/moje-konto/:path*'],
};
