import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCurrentLanguage, type Language } from '@/utils/i18n/config';
import { parseHostname } from '@/utils/i18n/domains';
import { getLoginPathForLang } from '@/utils/auth/activationStatus';
import { isHttpsRequest } from '@/utils/cookies';

const pickQuery = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

const resolveLang = (req: NextApiRequest): Language => {
  const fromQuery = pickQuery(req.query.lang).toLowerCase();
  if (fromQuery === 'en' || fromQuery === 'pl') return fromQuery;

  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  return getCurrentLanguage(parseHostname(host, ''));
};

const frontendOrigin = (req: NextApiRequest): string => {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000');
  const proto = isHttpsRequest(req) ? 'https' : 'http';
  return `${proto}://${host}`;
};

const loginRedirect = (
  req: NextApiRequest,
  params: Record<string, string>,
): string => {
  const lang = resolveLang(req);
  const url = new URL(getLoginPathForLang(lang), frontendOrigin(req));
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

const paramsFromLocation = (location: string, wpBase: string): Record<string, string> => {
  try {
    const loc = new URL(location, wpBase);
    const error = loc.searchParams.get('error') || loc.searchParams.get('code') || '';
    const activated =
      loc.searchParams.get('activated') ||
      loc.searchParams.get('success') ||
      '';
    const status = loc.searchParams.get('status') || '';

    if (error) return { error };
    if (activated) return { activated };
    if (status) return { status };

    const path = loc.pathname.replace(/\/$/, '');
    if (path.endsWith('/logowanie') || path.endsWith('/login')) {
      return { activated: '1' };
    }
  } catch {
    // ignore malformed Location
  }
  return { error: 'invalid_token' };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = pickQuery(req.query.token);
  const lang = resolveLang(req);

  if (!token) {
    return res.redirect(302, loginRedirect(req, { error: 'missing_token' }));
  }

  const wpBase = process.env.WORDPRESS_API_URL || '';
  const origin = pickQuery(req.query.origin);
  const wpActivateUrl =
    `${wpBase}/wp-json/custom/v1/activate?token=${encodeURIComponent(token)}&lang=${lang}` +
    (origin ? `&origin=${encodeURIComponent(origin)}` : '');

  try {
    const wpRes = await axios.get(wpActivateUrl, {
      maxRedirects: 0,
      validateStatus: () => true,
    });

    const location = String(wpRes.headers.location || wpRes.headers.Location || '');
    if (location && wpRes.status >= 300 && wpRes.status < 400) {
      try {
        const loc = new URL(location, wpBase);
        if (loc.protocol === 'http:' || loc.protocol === 'https:') {
          return res.redirect(302, loc.toString());
        }
      } catch {
        // fall through to mapped login redirect
      }
      return res.redirect(302, loginRedirect(req, paramsFromLocation(location, wpBase)));
    }

    const data = wpRes.data;
    if (data && typeof data === 'object') {
      const error =
        (typeof data.error === 'string' && data.error) ||
        (typeof data.code === 'string' && data.code) ||
        '';
      const ok =
        data.success === true ||
        data.activated === true ||
        data.status === 'activated' ||
        wpRes.status === 200;

      if (error && !ok) {
        return res.redirect(302, loginRedirect(req, { error }));
      }
      if (ok) {
        return res.redirect(302, loginRedirect(req, { activated: '1' }));
      }
    }

    if (wpRes.status >= 200 && wpRes.status < 300) {
      return res.redirect(302, loginRedirect(req, { activated: '1' }));
    }

    return res.redirect(302, loginRedirect(req, { error: 'invalid_token' }));
  } catch (error: any) {
    const location = error?.response?.headers?.location || error?.response?.headers?.Location;
    if (location) {
      return res.redirect(302, loginRedirect(req, paramsFromLocation(String(location), wpBase)));
    }
    return res.redirect(302, loginRedirect(req, { error: 'invalid_token' }));
  }
}
