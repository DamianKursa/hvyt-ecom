
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

    const { order_id, order_key } = wpResponse.data;
    res.status(200).json({
      redirectUrl: `/dziekujemy?order_id=${order_id}&key=${order_key}`
    });
  } catch (error) {
    console.error('Error in proxy-wc-webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
