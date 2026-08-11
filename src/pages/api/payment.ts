import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache'; 

const CACHE_TTL = 86400;

const PAYMENT_TITLE_OVERRIDES: Record<string, string> = {
  pay_by_paynow_pl_paywall:
    'Paynow (BLIK, szybkie przelewy, karty, Google Pay)',
  pay_by_paynow_pl_pbl: 'Paynow (BLIK, szybkie przelewy, karty, Google Pay)',
};

const applyPaymentTitleOverrides = (methods: any[]) =>
  methods.map((method) => {
    const id = String(method?.id || '').toLowerCase();
    if (id === 'bacs' || id.includes('bacs')) {
      return { ...method, title: 'Faktura proforma' };
    }
    return {
      ...method,
      title: PAYMENT_TITLE_OVERRIDES[method.id] ?? method.title,
    };
  });

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
      // Wersjonowanie cache: pozwala ominąć stare wpisy z poprzedniej logiki filtrowania.
      const cacheKey = `payment_methods:v2:${lang}`;

      let cachedPaymentMethods = await getCache(cacheKey);
      if (cachedPaymentMethods) {
        const hasBacsInCache = Array.isArray(cachedPaymentMethods)
          ? cachedPaymentMethods.some((m: any) => String(m?.id || '').toLowerCase().includes('bacs'))
          : false;

        // Jeśli cache nie zawiera BACS, to prawdopodobnie został zbudowany w „starym” wariancie logiki
        // (np. z filtrem `enabled`). Wtedy pobieramy świeże dane z Woo.
        if (hasBacsInCache) {
          return res
            .status(200)
            .json(applyPaymentTitleOverrides(cachedPaymentMethods));
        }
      }
      
      const paymentResponse = await WooCommerceAPI.get(`/payment_gateways?lang=${lang}`);
      const paymentMethods = paymentResponse.data;

      if (!paymentMethods || paymentMethods.length === 0) {
        return res.status(404).json({ error: 'No payment methods available' });
      }


      // Woo REST potrafi zwrócić `enabled: false` dla bramek offline zależnie od kontekstu (np. dostępność dla wysyłki).
      // Żeby umożliwić obsługę „Faktury proforma” (BACS) po stronie frontu, nie filtrujemy BACS przez `enabled`.
      const normalizedMethods = paymentMethods.filter((method: any) => {
        const id = String(method?.id || '').toLowerCase();
        return Boolean(method?.enabled) || id.includes('bacs');
      });

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
