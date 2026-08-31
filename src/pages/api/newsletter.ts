import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_AUDIENCE_ID =
  process.env.MAILCHIMP_AUDIENCE_ID || process.env.MAILCHIMP_LIST_ID || '';
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || '';

function getMailchimpStatus(): 'subscribed' | 'pending' {
  return process.env.MAILCHIMP_DOUBLE_OPT_IN === 'true' ? 'pending' : 'subscribed';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function subscribeViaMailchimp(email: string) {
  const dataCenter = MAILCHIMP_API_KEY.split('-')[1];
  if (!dataCenter) {
    throw new Error('Invalid MAILCHIMP_API_KEY format');
  }

  const status = getMailchimpStatus();
  const subscriberHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex');

  const baseUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
  const authHeader = `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`;

  const createResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status,
    }),
  });

  if (createResponse.ok) {
    return { ok: true, alreadySubscribed: false };
  }

  const createBody = await createResponse.json().catch(() => ({}));
  const title = String(createBody?.title || '');

  // Member already exists — update marketing status (e.g. re-subscribe)
  if (createResponse.status === 400 && /exists/i.test(title)) {
    const updateResponse = await fetch(`${baseUrl}/${subscriberHash}`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status,
      }),
    });

    if (!updateResponse.ok) {
      const updateBody = await updateResponse.json().catch(() => ({}));
      console.error('Mailchimp update failed:', updateResponse.status, updateBody);
      // Still treat as success if the address is already on the list
      return { ok: true, alreadySubscribed: true };
    }

    return { ok: true, alreadySubscribed: true };
  }

  console.error('Mailchimp subscribe failed:', createResponse.status, createBody);
  throw new Error(createBody?.detail || 'Mailchimp subscription failed');
}

async function subscribeViaWordPress(email: string) {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/custom/v1/newsletter`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || body?.error || 'WordPress newsletter API error');
  }

  return { ok: true, alreadySubscribed: false };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = String(req.body?.email || '')
    .trim()
    .toLowerCase();

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    if (MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID) {
      const result = await subscribeViaMailchimp(email);
      return res.status(200).json({ success: true, ...result });
    }

    if (WORDPRESS_API_URL) {
      const result = await subscribeViaWordPress(email);
      return res.status(200).json({ success: true, ...result });
    }

    return res.status(500).json({
      error:
        'Newsletter is not configured. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID.',
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
