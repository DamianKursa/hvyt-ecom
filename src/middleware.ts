import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Locale = 'pl' | 'en';

const DEFAULT_LOCALE: Locale = 'pl';
const MAINTENANCE_PATH = '/maintenance';

const isMaintenanceMode = (): boolean => {
  const value =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? process.env.MAINTENANCE_MODE;
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

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

const AUTH_PATHS = ['/moje-konto', '/my-account'];

const parseHostname = (value: string | undefined, fallback: string): string => {
  if (!value?.trim()) return fallback;
  const trimmed = value.trim();
  try {
    if (trimmed.includes('://')) {
      return new URL(trimmed).hostname.toLowerCase();
    }
  } catch {
    // fall through
  }
  return trimmed.split('/')[0].split(':')[0].toLowerCase();
};

const buildSiteUrl = (value: string | undefined, fallbackHostname: string): string => {
  if (!value?.trim()) return `https://${fallbackHostname}`;
  const trimmed = value.trim();
  if (trimmed.includes('://')) return trimmed.replace(/\/$/, '');
  return `https://${trimmed.split('/')[0]}`;
};

const DOMAIN_PL = parseHostname(
  process.env.NEXT_PUBLIC_DOMAIN_PL || process.env.NEXT_PUBLIC_SITE_URL_PL,
  'hvyt.pl',
);
const DOMAIN_EN = parseHostname(
  process.env.NEXT_PUBLIC_DOMAIN_EN || process.env.NEXT_PUBLIC_SITE_URL_EN,
  'hvyt.eu',
);
const SITE_URL_EN = buildSiteUrl(process.env.NEXT_PUBLIC_SITE_URL_EN, DOMAIN_EN);

const hostnameMatchesDomain = (hostname: string, domain: string): boolean => {
  const host = hostname.toLowerCase();
  const configured = domain.toLowerCase();
  return host === configured || host.endsWith(`.${configured}`);
};

const getLanguageFromHostname = (hostname: string): Locale | null => {
  if (hostnameMatchesDomain(hostname, DOMAIN_EN)) return 'en';
  if (hostnameMatchesDomain(hostname, DOMAIN_PL)) return 'pl';
  return null;
};

const shouldExcludePath = (pathname: string): boolean =>
  EXCLUDED_PATHS.some((excluded) => pathname.startsWith(excluded));

const isAuthPath = (pathname: string): boolean =>
  AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

const detectLanguage = (request: NextRequest): Locale => {
  const { hostname } = request.nextUrl;

  const fromDomain = getLanguageFromHostname(hostname);
  if (fromDomain) return fromDomain;

  const langCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (langCookie === 'pl' || langCookie === 'en') {
    return langCookie;
  }

  return (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || DEFAULT_LOCALE;
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Paynow (and other WC gateways) POST status notifications to /?wc-api=...
  // Next.js pages only accept GET, so proxy POST webhooks to WordPress.
  if (
    request.method === 'POST' &&
    searchParams.has('wc-api') &&
    !pathname.startsWith('/api')
  ) {
    const proxyUrl = new URL('/api/wc-gateway-proxy', request.url);
    proxyUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(proxyUrl);
  }

  if (shouldExcludePath(pathname)) {
    return NextResponse.next();
  }

  if (isMaintenanceMode() && pathname !== MAINTENANCE_PATH) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = MAINTENANCE_PATH;
    return NextResponse.rewrite(maintenanceUrl, {
      status: 503,
      headers: { 'Retry-After': '3600' },
    });
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const legacyPath = pathname.replace(/^\/en/, '') || '/';
    const redirectUrl = new URL(legacyPath, SITE_URL_EN);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl, 308);
  }

  const detectedLocale = detectLanguage(request);

  if (isAuthPath(pathname)) {
    const token = request.cookies.get('token');
    if (!token) {
      const loginPath = detectedLocale === 'en' ? '/login' : '/logowanie';
      const loginUrl = new URL(loginPath, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  response.headers.set('x-locale', detectedLocale);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
