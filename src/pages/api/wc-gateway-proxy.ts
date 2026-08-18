import { buffer } from 'node:stream/consumers';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'cookie',
  'expect',
  'host',
  'keep-alive',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const getWordpressOrigin = (): string => {
  const raw =
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    'https://wp.hvyt.pl';

  try {
    return new URL(raw).origin;
  } catch {
    return 'https://wp.hvyt.pl';
  }
};

const readRawBody = async (req: NextApiRequest): Promise<ArrayBuffer> => {
  const raw = await buffer(req);
  const body = new ArrayBuffer(raw.byteLength);
  new Uint8Array(body).set(raw);
  return body;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const wcApi = req.query['wc-api'];
  const gateway =
    typeof wcApi === 'string' ? wcApi : Array.isArray(wcApi) ? wcApi[0] : '';

  if (!gateway || !/^[A-Za-z0-9_]+$/.test(gateway)) {
    return res.status(400).json({ error: 'Missing or invalid wc-api' });
  }

  const target = new URL('/', getWordpressOrigin());
  target.searchParams.set('wc-api', gateway);

  const forwardedHeaders = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || HOP_BY_HOP_HEADERS.has(key)) continue;
    forwardedHeaders.set(
      key,
      Array.isArray(value) ? value.join(', ') : value,
    );
  }

  try {
    const body = await readRawBody(req);
    const wpResponse = await fetch(target, {
      method: 'POST',
      headers: forwardedHeaders,
      body,
      redirect: 'manual',
    });

    res.status(wpResponse.status);

    wpResponse.headers.forEach((value, key) => {
      if (HOP_BY_HOP_HEADERS.has(key)) return;
      if (key === 'set-cookie') return;
      res.setHeader(key, value);
    });

    const payload = Buffer.from(await wpResponse.arrayBuffer());
    return res.send(payload);
  } catch (error) {
    console.error('wc-gateway-proxy error:', error);
    return res.status(502).json({ error: 'Failed to proxy payment notification' });
  }
}
