// pages/api/stripe/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { convertToStripeAmount } from '@/lib/stripe';
import { stripe } from '@/utils/api/stripe';
import Stripe from 'stripe';

type ResponseData =
  | { success: true; clientSecret: string | null; paymentIntentId: string }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { amount, currency = 'PLN', metadata } = req.body as {
    amount: number;
    currency?: string;
    metadata?: Record<string, string>;
  };

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Kwota musi być większa niż 0' });
  }

  const stripeAmount = convertToStripeAmount(amount, currency);
  const minAmount = currency === 'USD' || currency === 'EUR' ? 50 : 100;

  if (stripeAmount < minAmount) {
    return res.status(400).json({
      success: false,
      error: `Minimalna kwota to ${minAmount / 100} ${currency.toUpperCase()}`,
    });
  }

  try {
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        integration: 'nextjs-woocommerce',
        ...metadata,
      },
      description: metadata?.order_id
        ? `Zamówienie #${metadata.order_id}`
        : 'Płatność za zamówienie',
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Błąd podczas tworzenia Payment Intent:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Nie udało się utworzyć płatności',
    });
  }
}
