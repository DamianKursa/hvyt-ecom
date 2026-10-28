import { timingSafeEqual } from 'crypto';
import type Stripe from 'stripe';
import { createApiClient } from '@/utils/api/http';
import { convertToStripeAmount } from '@/lib/stripe';

const WooCommerceAPI = createApiClient({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const PAID_STATUSES = new Set(['processing', 'completed', 'refunded']);
const OPENABLE_STATUSES = new Set(['pending', 'on-hold', 'failed', 'checkout-draft']);

export type OrderMeta = {
  id?: number;
  key: string;
  value: unknown;
};

export type WooOrder = {
  id: number;
  order_key: string;
  status: string;
  currency: string;
  total: string;
  payment_method: string;
  shipping_total?: string;
  shipping_tax?: string;
  billing?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  shipping_lines?: { method_title?: string }[];
  line_items?: {
    name?: string;
    quantity?: number;
    total?: string;
    total_tax?: string;
  }[];
  meta_data?: OrderMeta[];
};

export function safeEqual(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.byteLength !== b.byteLength) return false;
  return timingSafeEqual(a, b);
}

export function metaValue(meta: OrderMeta[] | undefined, key: string): string {
  const found = meta?.find((item) => item.key === key);
  if (found?.value == null) return '';
  return String(found.value);
}

export function upsertMeta(meta: OrderMeta[] | undefined, key: string, value: string) {
  const current = meta?.find((item) => item.key === key);
  return current?.id ? { id: current.id, key, value } : { key, value };
}

export function stripeThankYouPath(orderId: string, orderKey: string): string {
  return `/thank-you?orderId=${encodeURIComponent(orderId)}&orderKey=${encodeURIComponent(orderKey)}`;
}

export function paymentIntentIdFromSession(session: Stripe.Checkout.Session): string {
  if (typeof session.payment_intent === 'string') return session.payment_intent;
  return session.payment_intent?.id ?? '';
}

export async function getWooOrder(orderId: string): Promise<WooOrder> {
  const response = await WooCommerceAPI.get<WooOrder>(`/orders/${orderId}`);
  return response.data;
}

export function isUnpaidStripeOrder(order: WooOrder): boolean {
  return order.payment_method === 'stripe' && OPENABLE_STATUSES.has(order.status);
}

export function buildCheckoutLineItems(
  order: WooOrder,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const currency = String(order.currency || 'eur').toLowerCase();
  const expected = convertToStripeAmount(parseFloat(order.total), currency);
  const detailed: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of order.line_items || []) {
    const quantity = Number(item.quantity) || 1;
    const lineTotal = parseFloat(item.total || '0') + parseFloat(item.total_tax || '0');
    if (lineTotal <= 0 || quantity <= 0) continue;
    detailed.push({
      quantity,
      price_data: {
        currency,
        unit_amount: convertToStripeAmount(lineTotal / quantity, currency),
        product_data: {
          name: String(item.name || 'Product').slice(0, 250),
        },
      },
    });
  }

  const shippingTotal =
    parseFloat(order.shipping_total || '0') + parseFloat(order.shipping_tax || '0');
  if (shippingTotal > 0) {
    detailed.push({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: convertToStripeAmount(shippingTotal, currency),
        product_data: {
          name: String(order.shipping_lines?.[0]?.method_title || 'Shipping').slice(0, 250),
        },
      },
    });
  }

  const detailedSum = detailed.reduce((sum, item) => {
    const unit = item.price_data?.unit_amount || 0;
    return sum + unit * (item.quantity || 1);
  }, 0);

  if (detailed.length > 0 && detailedSum === expected) {
    return detailed;
  }

  return [
    {
      quantity: 1,
      price_data: {
        currency,
        unit_amount: expected,
        product_data: {
          name: `HVYT order #${order.id}`.slice(0, 250),
          description: (order.line_items || [])
            .map((item) => `${item.name || 'Product'} × ${item.quantity || 1}`)
            .join(', ')
            .slice(0, 500) || undefined,
        },
      },
    },
  ];
}

export function stripeShipping(
  order: WooOrder,
): Stripe.Checkout.SessionCreateParams.PaymentIntentData.Shipping | undefined {
  const country = String(order.shipping?.country || '').trim().toUpperCase();
  const line1 = String(order.shipping?.address_1 || '').trim();
  const name = `${order.shipping?.first_name || ''} ${order.shipping?.last_name || ''}`.trim();
  if (!name || !line1 || !/^[A-Z]{2}$/.test(country)) return undefined;

  const phone = String(order.billing?.phone || '').trim();
  const shippingPhone = phone.replace(/[^\d+]/g, '').length >= 6 ? phone : undefined;

  return {
    name,
    phone: shippingPhone,
    address: {
      line1,
      line2: order.shipping?.address_2 || undefined,
      city: order.shipping?.city || undefined,
      postal_code: order.shipping?.postcode || undefined,
      country,
    },
  };
}

export async function rememberCheckoutSession(order: WooOrder, sessionId: string): Promise<void> {
  await WooCommerceAPI.put(`/orders/${order.id}`, {
    meta_data: [upsertMeta(order.meta_data, '_stripe_checkout_session_id', sessionId)],
  });
}

/**
 * Ustawia zamówienie jako opłacone (processing) albo nieudane.
 * Powtórne wywołanie dla już opłaconego zamówienia nic nie zmienia.
 */
export async function applyStripeCheckoutResult(
  session: Stripe.Checkout.Session,
  outcome: 'paid' | 'failed',
): Promise<{ orderId: string; orderKey: string } | null> {
  if (session.metadata?.order_language !== 'en') return null;

  const orderId = session.metadata?.order_id;
  const orderKey = session.metadata?.order_key;
  if (!orderId || !orderKey || !/^\d+$/.test(orderId)) return null;

  const order = await getWooOrder(orderId);
  if (!safeEqual(String(order.order_key), orderKey)) {
    throw new Error('Order key mismatch');
  }
  if (order.payment_method !== 'stripe') {
    throw new Error('Order is not a Stripe order');
  }

  const paymentIntentId = paymentIntentIdFromSession(session);

  if (outcome === 'paid') {
    if (!PAID_STATUSES.has(order.status)) {
      await WooCommerceAPI.put(`/orders/${orderId}`, {
        set_paid: true,
        ...(paymentIntentId ? { transaction_id: paymentIntentId } : {}),
        meta_data: [
          upsertMeta(order.meta_data, '_stripe_checkout_session_id', session.id),
          ...(paymentIntentId
            ? [upsertMeta(order.meta_data, '_stripe_payment_intent_id', paymentIntentId)]
            : []),
        ],
      });
    }
    return { orderId: String(order.id), orderKey: order.order_key };
  }

  if (order.status === 'pending' || order.status === 'on-hold') {
    await WooCommerceAPI.put(`/orders/${orderId}`, {
      status: 'failed',
      meta_data: [upsertMeta(order.meta_data, '_stripe_checkout_session_id', session.id)],
    });
  }

  return { orderId: String(order.id), orderKey: order.order_key };
}
