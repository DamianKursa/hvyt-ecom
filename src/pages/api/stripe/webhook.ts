import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { stripe } from '@/utils/api/stripe';
import { applyStripeCheckoutResult } from '@/lib/stripeOrder';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : Uint8Array.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];
  if (!webhookSecret || !signature || Array.isArray(signature)) {
    return res.status(400).json({ error: 'Missing Stripe webhook signature' });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Nieprawidłowy podpis webhooka Stripe:', error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await applyStripeCheckoutResult(session, 'paid');
        }
        break;
      }
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await applyStripeCheckoutResult(session, 'failed');
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('Błąd obsługi webhooka Stripe:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }

  return res.status(200).json({ received: true });
}
