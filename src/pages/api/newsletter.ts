import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function env(name: string): string {
  return String(process.env[name] || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

const MAILCHIMP_API_KEY = env('MAILCHIMP_API_KEY');
const MAILCHIMP_AUDIENCE_ID =
  env('MAILCHIMP_AUDIENCE_ID') || env('MAILCHIMP_LIST_ID');

function getMailchimpStatus(): 'subscribed' | 'pending' {
  return env('MAILCHIMP_DOUBLE_OPT_IN') === 'true' ? 'pending' : 'subscribed';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function subscribeViaMailchimp(email: string) {
  const dataCenter = MAILCHIMP_API_KEY.includes('-')
    ? MAILCHIMP_API_KEY.split('-').pop()
    : '';

  if (!dataCenter) {
    const err = new Error('Invalid MAILCHIMP_API_KEY format (expected key-usXX)');
    (err as Error & { code?: string }).code = 'invalid_api_key';
    throw err;
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

  const createBody = await createResponse.json().catch(() => ({} as any));
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
    }

    return { ok: true, alreadySubscribed: true };
  }

  console.error('Mailchimp subscribe failed:', createResponse.status, createBody);

  const err = new Error(
    createBody?.detail || createBody?.title || 'Mailchimp subscription failed',
  );
  (err as Error & { code?: string; status?: number }).code = 'mailchimp_error';
  (err as Error & { status?: number }).status = createResponse.status;
  throw err;
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

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
    console.error(
      'Newsletter misconfigured: missing MAILCHIMP_API_KEY and/or MAILCHIMP_AUDIENCE_ID',
      {
        hasKey: Boolean(MAILCHIMP_API_KEY),
        hasAudience: Boolean(MAILCHIMP_AUDIENCE_ID),
      },
    );
    return res.status(503).json({
      error:
        'Newsletter is not configured. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in production env.',
      code: 'not_configured',
    });
  }

  try {
    const result = await subscribeViaMailchimp(email);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    const err = error as Error & { code?: string; status?: number };
    console.error('Newsletter subscribe error:', {
      message: err?.message,
      code: err?.code,
      status: err?.status,
    });

    return res.status(500).json({
      error: 'Something went wrong',
      code: err?.code || 'subscribe_failed',
      // Safe for ops debugging — no secrets, only Mailchimp's public error text
      detail: err?.message || undefined,
    });
  }
}
