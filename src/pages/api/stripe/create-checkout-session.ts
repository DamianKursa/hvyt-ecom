import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { stripe } from '@/utils/api/stripe';
import { convertToStripeAmount, minimumStripeAmount } from '@/lib/stripe';
import { activateStripeCheckoutPaymentMethods } from '@/lib/stripePaymentMethods';
import {
  applyStripeCheckoutResult,
  buildCheckoutLineItems,
  getWooOrder,
  isUnpaidStripeOrder,
  metaValue,
  rememberCheckoutSession,
  safeEqual,
  stripeShipping,
  stripeThankYouPath,
} from '@/lib/stripeOrder';

type ResponseData =
  | { url: string }
  | { thankYouPath: string }
  | { error: string };

function publicOrigin(req: NextApiRequest): string | null {
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
  const host = String(hostHeader || '').split(',')[0].trim().toLowerCase();
  if (!host) return null;

  const hostname = host.split(':')[0];
  const enDomain = String(process.env.NEXT_PUBLIC_DOMAIN_EN || 'hvyt.eu')
    .split(':')[0]
    .toLowerCase();
  const enSite = String(process.env.NEXT_PUBLIC_SITE_URL_EN || `https://${enDomain}`)
    .replace(/\/$/, '')
    .toLowerCase();
  const isEnHost = hostname === enDomain || hostname.endsWith(`.${enDomain}`);

  if (!isEnHost) return null;

  try {
    const configured = new URL(enSite.includes('://') ? enSite : `https://${enSite}`);
    if (configured.host === host) return configured.origin;
  } catch {
    // fall through to the request host
  }

  const forwarded = req.headers['x-forwarded-proto'];
  const proto = forwarded
    ? String(forwarded).split(',')[0].trim()
    : host.endsWith(':3000')
      ? 'http'
      : 'https';

  return `${proto}://${host}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderId = String(req.body?.orderId ?? '').trim();
  const orderKey = String(req.body?.orderKey ?? '').trim();
  if (!/^\d+$/.test(orderId) || !orderKey) {
    return res.status(400).json({ error: 'Missing order id or key' });
  }

  const origin = publicOrigin(req);
  if (!origin) {
    return res.status(403).json({ error: 'Stripe Checkout is available for the EN store only' });
  }

  try {
    const order = await getWooOrder(orderId);
    if (!safeEqual(String(order.order_key), orderKey)) {
      return res.status(403).json({ error: 'Invalid order key' });
    }
    if (order.payment_method !== 'stripe' || metaValue(order.meta_data, 'order_language') !== 'en') {
      return res.status(403).json({ error: 'Stripe Checkout is available for EN orders only' });
    }

    const thankYouPath = stripeThankYouPath(String(order.id), order.order_key);
    if (['processing', 'completed', 'refunded'].includes(order.status)) {
      return res.status(200).json({ thankYouPath });
    }
    if (!isUnpaidStripeOrder(order)) {
      return res.status(409).json({ error: 'Order cannot be paid' });
    }

    const existingSessionId = metaValue(order.meta_data, '_stripe_checkout_session_id');
    if (existingSessionId) {
      try {
        const existing = await stripe.checkout.sessions.retrieve(existingSessionId);
        if (existing.payment_status === 'paid') {
          await applyStripeCheckoutResult(existing, 'paid');
          return res.status(200).json({ thankYouPath });
        }
        if (existing.status === 'open' && existing.url) {
          return res.status(200).json({ url: existing.url });
        }
      } catch (error) {
        console.error('Nie udało się odczytać istniejącej sesji Stripe:', error);
      }
    }

    const currency = String(order.currency || 'eur');
    const amount = convertToStripeAmount(parseFloat(order.total), currency);
    const minAmount = minimumStripeAmount(currency);
    if (!Number.isFinite(amount) || amount < minAmount) {
      return res.status(400).json({
        error: `Minimalna kwota to ${minAmount / 100} ${currency.toUpperCase()}`,
      });
    }

    await activateStripeCheckoutPaymentMethods(stripe);

    const email = String(order.billing?.email || '').trim();
    const shipping = stripeShipping(order);
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      ui_mode: 'hosted',
      locale: 'en',
      customer_email: email || undefined,
      client_reference_id: String(order.id),
      line_items: buildCheckoutLineItems(order),
      metadata: {
        order_id: String(order.id),
        order_key: order.order_key,
        order_language: 'en',
      },
      payment_intent_data: {
        description: `Order #${order.id}`,
        receipt_email: email || undefined,
        metadata: {
          order_id: String(order.id),
          order_key: order.order_key,
          order_language: 'en',
        },
        ...(shipping ? { shipping } : {}),
      },
      success_url: `${origin}/api/stripe/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?stripe=cancelled`,
    };

    let session = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `hvyt-checkout-${order.id}`,
    });

    if (session.payment_status === 'paid') {
      await applyStripeCheckoutResult(session, 'paid');
      return res.status(200).json({ thankYouPath });
    }

    if (session.status !== 'open' || !session.url) {
      session = await stripe.checkout.sessions.create(params, {
        idempotencyKey: `hvyt-checkout-${order.id}-retry-${Date.now()}`,
      });
    }

    if (!session.url) {
      return res.status(502).json({ error: 'Stripe did not return a Checkout URL' });
    }

    try {
      await rememberCheckoutSession(order, session.id);
    } catch (error) {
      console.error('Nie udało się zapisać identyfikatora sesji Stripe na zamówieniu:', error);
    }

    return res.status(200).json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create Checkout Session';
    console.error('Błąd tworzenia sesji Stripe Checkout:', error);
    return res.status(500).json({ error: message });
  }
}
