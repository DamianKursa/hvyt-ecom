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

  const { code, cartTotal } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Wprowadź kod rabatowy.' });
  }

  try {
    // Fetch the coupon from WooCommerce
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

    // Check if coupon is expired
    const now = new Date();
    if (coupon.date_expires && new Date(coupon.date_expires) < now) {
      return res.status(400).json({
        valid: false,
        message: 'Ten kod rabatowy wygasł.',
      });
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({
        valid: false,
        message: 'Limit użycia tego kodu został osiągnięty.',
      });
    }

    // Check minimum amount (if `cartTotal` is provided from frontend)
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

    // Determine discount type and amount
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
