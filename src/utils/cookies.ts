import { CookieSerializeOptions, parse, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export const isHttpsRequest = (req: NextApiRequest): boolean => {
  const raw = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(raw) ? raw[0] : raw)?.split(',')[0]?.trim().toLowerCase();
  if (proto === 'https') return true;
  if (proto === 'http') return false;
  return process.env.NODE_ENV === 'production';
};

export const getAuthCookieOptions = (
  req: NextApiRequest,
  extra: CookieSerializeOptions = {},
): CookieSerializeOptions => {
  const secure = isHttpsRequest(req);
  return {
    httpOnly: true,
    path: '/',
    secure,
    sameSite: process.env.NODE_ENV === 'production' && secure ? 'none' : 'lax',
    ...extra,
  };
};

export const parseCookies = (cookieHeader: string) => {
  if (!cookieHeader) return {};
  return parse(cookieHeader);
};

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string | object,
  options: { maxAge?: number; path?: string; httpOnly?: boolean; secure?: boolean } = {}
) => {
  const stringValue = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  const serializedCookie = serialize(name, stringValue, {
    maxAge: options.maxAge,
    path: options.path || '/',
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', serializedCookie);
};

export const deleteCookie = (res: NextApiResponse, name: string) => {
  setCookie(res, name, '', { maxAge: 0 });
};
