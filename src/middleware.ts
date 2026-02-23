import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Supported locales
 */
const SUPPORTED_LOCALES = ['pl', 'en'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

const DEFAULT_LOCALE: Locale = 'pl';

/**
 * URL path mappings: Polish → English
 */
const PATH_MAPPINGS: Record<string, string> = {
  // Cart & Checkout
  'koszyk': 'cart',
  'checkout': 'checkout',
  'dziekujemy': 'thank-you',
  'zamowienie-otrzymane': 'order-received',
  
  // Auth
  'logowanie': 'login',
  'zapomniane-haslo': 'forgot-password',
  'aktywacja-konta': 'account-activation',
  'potwierdzenie-email': 'email-confirmation',
  
  // User account
  'moje-konto': 'my-account',
  'ulubione': 'wishlist',
  
  // Static pages
  'o-nas': 'about-us',
  'kontakt': 'contact',
  'wspolpraca': 'cooperation',
  'dostawa': 'delivery',
  'zwroty-i-reklamacje': 'returns',
  'wygodne-zwroty': 'easy-returns',
  'regulamin': 'terms',
  'polityka-prywatnosci': 'privacy-policy',
  
  // Content
  'kolekcje': 'collections',
  'blog': 'blog',
  'kategoria': 'category',
  'produkt': 'product',
};

/**
 * Reverse mapping: English → Polish
 */
const REVERSE_PATH_MAPPINGS: Record<string, string> = {};
Object.entries(PATH_MAPPINGS).forEach(([pl, en]) => {
  REVERSE_PATH_MAPPINGS[en] = pl;
});

/**
 * Paths that should be excluded from middleware processing
 */
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/static',
  '/icons',
  '/images',
  '/fonts',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

/**
 * Check if path should be excluded from middleware
 */
function shouldExcludePath(pathname: string): boolean {
  return EXCLUDED_PATHS.some(excluded => pathname.startsWith(excluded));
}

/**
 * Detect language from various sources
 */
function detectLanguage(request: NextRequest): Locale {
  const { pathname, hostname } = request.nextUrl;
  
  // 1. Check URL path prefix (/en/...)
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  
  // 2. Check hostname for multi-domain mode
  if (hostname.includes('hvyt.eu') || hostname.endsWith('.eu')) {
    return 'en';
  }
  
  // 3. Check cookie for language preference
  const langCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (langCookie && SUPPORTED_LOCALES.includes(langCookie as Locale)) {
    return langCookie as Locale;
  }
  
  // 4. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (SUPPORTED_LOCALES.includes(preferredLang as Locale)) {
      return preferredLang as Locale;
    }
  }
  
  // 5. Default to Polish
  return DEFAULT_LOCALE;
}

/**
 * Check if we're in multi-domain mode (hvyt.pl / hvyt.eu)
 */
function isMultiDomainMode(hostname: string): boolean {
  return hostname.includes('hvyt.eu') || hostname.endsWith('.eu');
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Skip excluded paths
  if (shouldExcludePath(pathname)) {
    return NextResponse.next();
  }
  
  const detectedLocale = detectLanguage(request);
  const isMultiDomain = isMultiDomainMode(hostname);
  
  // Create response with locale cookie
  const response = NextResponse.next();
  
  // Set locale cookie if not already set
  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', detectedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }
  
  // Set locale header for downstream use
  response.headers.set('x-locale', detectedLocale);
  
  // Multi-domain mode: no URL rewriting needed
  if (isMultiDomain) {
    return response;
  }
  
  // Subdirectory mode: handle /en/* paths
  // The rewrites in next.config.js will handle the actual path resolution

  return response;
}

/**
 * Middleware configuration - specify which paths to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
