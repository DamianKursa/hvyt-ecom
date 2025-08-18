import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// WooCommerce API client setup
const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code, cartTotal, hasSaleItems, items } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Wprowadź kod rabatowy.' });
  }

  // Block coupons when any product in the cart is on sale (frontend sends this flag)
  if (hasSaleItems === true) {
    return res.status(400).json({
      valid: false,
      message: 'Kod nie działa na produkty z promocji.',
      debug: 'blocked_by_sale_items',
    });
  }

  // Extra server-side verification: check actual WooCommerce products
  try {
    const ids = Array.isArray(items)
      ? items.map((it: any) => Number(it?.id)).filter((n: number) => Number.isFinite(n))
      : [];

    if (ids.length > 0) {
      const productsRes = await WooCommerceAPI.get('/products', {
        params: { include: ids, per_page: ids.length },
      });

      const anyOnSale = Array.isArray(productsRes.data) && productsRes.data.some((p: any) => {
        if (p?.on_sale === true) return true;
        const rp = Number(p?.regular_price);
        const sp = Number(p?.sale_price);
        return Number.isFinite(sp) && sp > 0 && (!Number.isFinite(rp) || sp < rp);
      });

      if (anyOnSale) {
        return res.status(400).json({
          valid: false,
          message: 'Kod nie działa na produkty z promocji.',
          debug: 'blocked_by_sale_items_server',
        });
      }
    }
  } catch (e) {
    // Log only; don't block coupon if verification fails
    console.warn('Sale verification skipped:', (e as any)?.message || e);
  }

  try {
    const response = await WooCommerceAPI.get('/coupons', {
      params: { code },
    });

    if (response.data.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'Podany kod rabatowy nie istnieje.',
      });
    }

    const coupon = response.data[0];

    const now = new Date();
    if (coupon.date_expires && new Date(coupon.date_expires) < now) {
      return res.status(400).json({
        valid: false,
        message: 'Ten kod rabatowy wygasł.',
      });
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({
        valid: false,
        message: 'Limit użycia tego kodu został osiągnięty.',
      });
    }
    if (
      coupon.minimum_amount &&
      cartTotal &&
      parseFloat(cartTotal) < parseFloat(coupon.minimum_amount)
    ) {
      return res.status(400).json({
        valid: false,
        message: `Minimalna wartość zamówienia to ${parseFloat(coupon.minimum_amount).toFixed(2)} zł.`,
      });
    }

    const isPercentage = coupon.discount_type === 'percent';
    const discountValue = parseFloat(coupon.amount || '0');

    return res.status(200).json({
      valid: true,
      discountType: isPercentage ? 'percent' : 'fixed',
      discountValue,
      couponId: coupon.id,
      description: coupon.description || '',
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return res.status(500).json({
      valid: false,
      message: 'Wystąpił błąd serwera. Spróbuj ponownie później.',
    });
  }
}
