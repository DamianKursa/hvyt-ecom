import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

function getFrontendOrigin(req: NextApiRequest): string {
  const fromBody = typeof req.body?.origin === 'string' ? req.body.origin.trim() : '';
  if (fromBody) {
    return fromBody.replace(/\/$/, '');
  }

  const forwardedHost = req.headers['x-forwarded-host'] || req.headers.host;
  const forwardedProto = req.headers['x-forwarded-proto'];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
  const protoHeader = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const proto = protoHeader || (process.env.NODE_ENV === 'production' ? 'https' : 'http');

  return host ? `${proto}://${host}` : '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { first_name, last_name, email, password, lang } = req.body;
  const origin = getFrontendOrigin(req);

  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/register`,
      { first_name, last_name, email, password, lang, origin }
    );

    res.status(201).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error creating user';
      console.error('WordPress Error:', error.response?.data);
      res.status(error.response?.status || 500).json({ message: errorMessage });
    } else {
      console.error('Unexpected Error:', error);
      res.status(500).json({ message: 'Unexpected Error Occurred' });
    }
  }
}
