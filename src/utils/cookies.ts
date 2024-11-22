import { parse, serialize } from 'cookie';
import { NextApiResponse } from 'next';

/**
 * Parse cookies from the request header
 */
export const parseCookies = (cookieHeader?: string) => {
  return cookieHeader ? parse(cookieHeader) : {};
};

/**
 * Set a cookie on the response
 */
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: { maxAge?: number; path?: string; httpOnly?: boolean; secure?: boolean } = {}
) => {
  const stringValue = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  const serializedCookie = serialize(name, stringValue, {
    maxAge: options.maxAge,
    path: options.path || '/',
    httpOnly: options.httpOnly || true,
    secure: options.secure || process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', serializedCookie);
};

/**
 * Delete a cookie by setting its maxAge to 0
 */
export const deleteCookie = (res: NextApiResponse, name: string) => {
  setCookie(res, name, '', { maxAge: 0 });
};
