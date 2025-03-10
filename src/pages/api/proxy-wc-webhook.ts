// pages/api/proxy-wc-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Expecting query parameters like wc-api and order_hash.
    const { 'wc-api': wcApi, order_hash } = req.query;

    if (!wcApi || wcApi !== 'WC_Gateway_Przelewy24' || !order_hash) {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    const wpResponse = await axios.get(
      `https://wp.hvyt.pl/wp-json/custom/v1/resolve-order`,
      {
        params: { order_hash }
      }
    );

    // If the WP endpoint returns order details, you can then trigger further actions,
    // e.g., update the order status by calling another WP endpoint if needed.
    // For this example, we assume the WP endpoint already updates the order status.
    // Finally, you can redirect the user (or return a JSON response) with the order info.

    // Example: redirect to your thank-you page with order details:
    const { order_id, order_key } = wpResponse.data;
    // Here, you might decide to send a redirect response:
    res.status(200).json({
      redirectUrl: `/dziekujemy?order_id=${order_id}&key=${order_key}`
    });
  } catch (error) {
    console.error('Error in proxy-wc-webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
