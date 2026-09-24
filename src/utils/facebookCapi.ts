/**
 * Shared Meta Pixel / Conversions API helpers.
 * hvyt.pl and hvyt.eu send into the same dataset; currency and event_source_url
 * must follow the shop the customer actually used.
 */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_FB_PIXEL_ID || '831581281016056';

const ALLOWED_TRACKING_HOSTS = new Set([
  'hvyt.pl',
  'www.hvyt.pl',
  'hvyt.eu',
  'www.hvyt.eu',
  'localhost',
]);

const stripWww = (hostname: string): string =>
  hostname.replace(/^www\./i, '').toLowerCase();

const isAllowedTrackingHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if (ALLOWED_TRACKING_HOSTS.has(host)) return true;
  return host.endsWith('.vercel.app');
};

const parseHttpUrl = (raw?: string | null): URL | null => {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url;
  } catch {
    return null;
  }
};

export const getClientEventSourceUrl = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.location.href;
  } catch {
    return undefined;
  }
};

export const getTrackingCurrency = (
  locale?: string | null,
  orderCurrency?: string | null,
): 'PLN' | 'EUR' => {
  const fromOrder = orderCurrency?.trim().toUpperCase();
  if (fromOrder === 'EUR' || fromOrder === 'PLN') return fromOrder;
  if (locale === 'en') return 'EUR';
  return 'PLN';
};

export const currencyFromEventSourceUrl = (
  url?: string | null,
): 'PLN' | 'EUR' | undefined => {
  const parsed = parseHttpUrl(url);
  if (!parsed) return undefined;
  const host = stripWww(parsed.hostname);
  if (host === 'hvyt.eu') return 'EUR';
  if (host === 'hvyt.pl') return 'PLN';
  return undefined;
};

export const resolveEventSourceUrl = ({
  clientUrl,
  referer,
  host,
  proto = 'https',
}: {
  clientUrl?: string | null;
  referer?: string | null;
  host?: string | null;
  proto?: string | null;
}): string | undefined => {
  const requestHost = host?.split(',')[0]?.trim() || '';
  const requestHostname = requestHost.split(':')[0];
  const requestProto = (proto?.split(',')[0]?.trim() || 'https').replace(
    /:$/,
    '',
  );

  const toCleanHref = (url: URL): string => {
    url.hash = '';
    return url.toString();
  };

  const client = parseHttpUrl(clientUrl);
  if (client && isAllowedTrackingHost(client.hostname)) {
    return toCleanHref(client);
  }

  const ref = parseHttpUrl(referer);
  if (ref && isAllowedTrackingHost(ref.hostname)) {
    if (
      requestHostname &&
      isAllowedTrackingHost(requestHostname) &&
      stripWww(ref.hostname) !== stripWww(requestHostname)
    ) {
      ref.protocol = `${requestProto}:`;
      ref.host = requestHost;
    }
    return toCleanHref(ref);
  }

  if (requestHostname && isAllowedTrackingHost(requestHostname)) {
    const path = ref ? `${ref.pathname}${ref.search}` : '/';
    return `${requestProto}://${requestHost}${path || '/'}`;
  }

  return undefined;
};

export type MetaCustomData = Record<string, unknown>;

export const getMetaPixelUserData = (
  extra: Record<string, string> = {},
): Record<string, string> => {
  if (typeof document === 'undefined') return extra;

  const fbp = document.cookie.match(/_fbp=([^;]+)/)?.[1] ?? '';
  const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1] ?? '';
  const fbLoginId =
    typeof window !== 'undefined'
      ? String((window as unknown as { fb_login_id?: string }).fb_login_id ?? '')
      : '';

  return {
    ...(fbLoginId ? { fb_login_id: fbLoginId } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...extra,
  };
};

export const trackMetaEvent = (
  eventName: string,
  customData: MetaCustomData,
  userData: Record<string, string> = {},
  eventId: string,
): void => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, customData, { eventID: eventId });
  }

  fetch('/api/fb-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: getClientEventSourceUrl(),
      customData,
      userData: getMetaPixelUserData(userData),
    }),
  })
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) console.error('CAPI error:', json);
    })
    .catch((err) => console.error('CAPI network error:', err));
};
