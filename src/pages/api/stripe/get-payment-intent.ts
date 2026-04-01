// pages/api/stripe/get-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/utils/api/stripe';
import Stripe from 'stripe';

type ResponseData =
  | { success: true; paymentIntent: Stripe.PaymentIntent }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { paymentIntentId } = req.query;

  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return res.status(400).json({ success: false, error: 'Brak paymentIntentId' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return res.status(200).json({ success: true, paymentIntent });
  } catch (error: any) {
    console.error('Błąd podczas pobierania Payment Intent:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Nie udało się pobrać płatności',
    });
  }
}
