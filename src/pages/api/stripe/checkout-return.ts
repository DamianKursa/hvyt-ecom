import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/utils/api/stripe';
import { applyStripeCheckoutResult, stripeThankYouPath } from '@/lib/stripeOrder';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store');

  const sessionId = Array.isArray(req.query.session_id)
    ? req.query.session_id[0]
    : req.query.session_id;

  if (!sessionId) {
    return res.redirect(302, '/checkout?stripe=cancelled');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id;
    const orderKey = session.metadata?.order_key;

    if (session.payment_status === 'paid') {
      try {
        await applyStripeCheckoutResult(session, 'paid');
      } catch (error) {
        console.error('Nie udało się oznaczyć zamówienia jako opłacone po powrocie ze Stripe:', error);
      }
    }

    if (session.status === 'complete' && orderId && orderKey) {
      return res.redirect(302, stripeThankYouPath(orderId, orderKey));
    }
  } catch (error) {
    console.error('Błąd powrotu ze Stripe Checkout:', error);
  }

  return res.redirect(302, '/checkout?stripe=cancelled');
}
