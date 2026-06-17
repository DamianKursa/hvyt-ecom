/**
 * Domain-based i18n configuration.
 * Language is determined by hostname (hvyt.pl → pl, hvyt.eu → en).
 */

import type { Language } from './config';

export interface DomainLocaleConfig {
  domain: string;
  locale: Language;
  siteUrl: string;
}

const DEFAULT_DOMAIN_PL = 'hvyt.pl';
const DEFAULT_DOMAIN_EN = 'hvyt.eu';

/**
 * Extract hostname from env value (supports bare domain, host:port, or full URL).
 */
export const parseHostname = (value: string | undefined, fallback: string): string => {
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

/**
 * Build https URL from hostname (preserves port for local dev, e.g. localhost:3000).
 */
export const buildSiteUrl = (value: string | undefined, fallbackHostname: string): string => {
  if (!value?.trim()) {
    return `https://${fallbackHostname}`;
  }

  const trimmed = value.trim();
  if (trimmed.includes('://')) {
    return trimmed.replace(/\/$/, '');
  }

  const host = trimmed.split('/')[0];
  return `https://${host}`;
};

export const getDomainLocaleConfigs = (): DomainLocaleConfig[] => {
  const plDomain = parseHostname(
    process.env.NEXT_PUBLIC_DOMAIN_PL || process.env.NEXT_PUBLIC_SITE_URL_PL,
    DEFAULT_DOMAIN_PL,
  );
  const enDomain = parseHostname(
    process.env.NEXT_PUBLIC_DOMAIN_EN || process.env.NEXT_PUBLIC_SITE_URL_EN,
    DEFAULT_DOMAIN_EN,
  );

  return [
    {
      domain: plDomain,
      locale: 'pl',
      siteUrl: buildSiteUrl(process.env.NEXT_PUBLIC_SITE_URL_PL, plDomain),
    },
    {
      domain: enDomain,
      locale: 'en',
      siteUrl: buildSiteUrl(process.env.NEXT_PUBLIC_SITE_URL_EN, enDomain),
    },
  ];
};

export const getDomainForLanguage = (lang: Language): string => {
  const config = getDomainLocaleConfigs().find((entry) => entry.locale === lang);
  return config?.domain ?? (lang === 'en' ? DEFAULT_DOMAIN_EN : DEFAULT_DOMAIN_PL);
};

export const getSiteUrlForLanguage = (lang: Language): string => {
  const config = getDomainLocaleConfigs().find((entry) => entry.locale === lang);
  if (config) return config.siteUrl;
  return lang === 'en' ? buildSiteUrl(undefined, DEFAULT_DOMAIN_EN) : buildSiteUrl(undefined, DEFAULT_DOMAIN_PL);
};

/**
 * Match hostname against configured domain (supports subdomains, e.g. www.hvyt.pl).
 */
export const hostnameMatchesDomain = (hostname: string, domain: string): boolean => {
  const host = hostname.toLowerCase();
  const configured = domain.toLowerCase();
  return host === configured || host.endsWith(`.${configured}`);
};

/**
 * Resolve language from request hostname.
 */
export const getLanguageFromHostname = (hostname: string): Language | null => {
  const normalized = hostname.toLowerCase();

  for (const { domain, locale } of getDomainLocaleConfigs()) {
    if (hostnameMatchesDomain(normalized, domain)) {
      return locale;
    }
  }

  return null;
};

export const getDefaultLanguage = (): Language => {
  const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  if (fromEnv === 'pl' || fromEnv === 'en') {
    return fromEnv;
  }
  return 'pl';
};

/**
 * Next.js i18n.domains config (used in next.config.js).
 */
export const getNextJsDomainConfig = () => {
  return getDomainLocaleConfigs().map(({ domain, locale }) => ({
    domain,
    defaultLocale: locale,
    ...(locale === 'en' ? { locales: ['en'] as const } : { locales: ['pl'] as const }),
  }));
};
