import { parse, serialize } from 'cookie';
import { NextApiResponse } from 'next';

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
