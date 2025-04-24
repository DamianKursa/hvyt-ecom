import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface PaymentPayload {
  externalId: number;
  paymentId: string;
  status: string; // e.g., "CONFIRMED", "NEW", etc.
  // Add other fields as needed from your payment gateway payload
}

const PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for webhook
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate webhook security using a header or other method
  const signature = req.headers['x-payment-signature'];
  if (!signature || signature !== PAYMENT_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Parse the incoming payload
    const payload: PaymentPayload = req.body;
    console.log('Payment webhook payload received:', JSON.stringify(payload));

    // Example: If the payment is confirmed, update order status
    if (payload.status === 'CONFIRMED') {
      // Update your order in the database or call your WordPress REST API.
      // For example:
      // await axios.post('https://hvyt.pl/wp-json/custom/v1/update-order', {
      //   externalId: payload.externalId,
      //   paymentId: payload.paymentId,
      //   status: payload.status,
      // });

      // Alternatively, update your local data store

      console.log(
        `Order with externalId ${payload.externalId} set to CONFIRMED.`
      );
    } else {
      console.log(`Received payment with status: ${payload.status}`);
    }

    // Always respond with a success status to let the gateway know that
    // the webhook has been processed.
    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
