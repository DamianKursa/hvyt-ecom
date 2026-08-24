import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache';

const CACHE_TTL = 86400;

/** Only gateways the storefront checkout can show / select. */
const STOREFRONT_GATEWAY_IDS = new Set([
  'cod',
  'bacs',
  'pay_by_paynow_pl_pbl',
  'pay_by_paynow_pl_paywall',
  'stripe',
  'przelewy24',
  'p24-online-payments',
]);

const PAYMENT_TITLE_OVERRIDES: Record<string, string> = {
  pay_by_paynow_pl_paywall:
    'Paynow (BLIK, szybkie przelewy, karty, Google Pay)',
  pay_by_paynow_pl_pbl: 'Paynow (BLIK, szybkie przelewy, karty, Google Pay)',
  bacs: 'Faktura proforma',
};

const applyPaymentTitleOverrides = (methods: any[]) =>
  methods.map((method) => ({
    ...method,
    title: PAYMENT_TITLE_OVERRIDES[method.id] ?? method.title,
  }));

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { lang } = req.query;

    try {
      // v5: whitelist storefront gateways only (never stripe_bacs_debit etc.).
      const cacheKey = `payment_methods:v5:${lang}`;

      const cachedPaymentMethods = await getCache(cacheKey);
      if (cachedPaymentMethods) {
        return res
          .status(200)
          .json(applyPaymentTitleOverrides(cachedPaymentMethods));
      }

      const paymentResponse = await WooCommerceAPI.get(
        `/payment_gateways?lang=${lang}`,
      );
      const paymentMethods = paymentResponse.data;

      if (!paymentMethods || paymentMethods.length === 0) {
        return res.status(404).json({ error: 'No payment methods available' });
      }

      const normalizedMethods = paymentMethods.filter((method: any) => {
        const id = String(method?.id || '').toLowerCase();
        if (!STOREFRONT_GATEWAY_IDS.has(id)) return false;
        // Keep exact BACS even if Woo marks it disabled in REST context.
        return Boolean(method?.enabled) || id === 'bacs';
      });

      // Ensure exact `bacs` is present when force-include is needed.
      const hasExactBacs = normalizedMethods.some(
        (method: any) => String(method?.id || '').toLowerCase() === 'bacs',
      );
      if (!hasExactBacs) {
        try {
          const bacsResponse = await WooCommerceAPI.get(
            `/payment_gateways/bacs?lang=${lang}`,
          );
          if (bacsResponse.data?.id === 'bacs') {
            normalizedMethods.push(bacsResponse.data);
          }
        } catch (bacsError: any) {
          console.warn(
            'Could not fetch exact bacs gateway:',
            bacsError?.message || bacsError,
          );
        }
      }

      const enabledMethods = applyPaymentTitleOverrides(normalizedMethods);

      await setCache(cacheKey, enabledMethods, CACHE_TTL);

      return res.status(200).json(enabledMethods);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error.message || error);
      return res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
