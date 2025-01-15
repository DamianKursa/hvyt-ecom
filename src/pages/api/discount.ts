import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Create the WooCommerce REST API client
const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Handle only POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    // Validate input
    return res.status(400).json({ valid: false, message: 'Discount code is required' });
  }

  try {
    // Fetch the coupon from WooCommerce
    const response = await WooCommerceAPI.get('/coupons', {
      params: {
        code,
      },
    });

    if (response.data.length > 0) {
      const coupon = response.data[0];

      // Determine discount type and amount
      const isPercentage = coupon.discount_type === 'percent';
      const discountValue = parseFloat(coupon.amount || '0');

      // If coupon is found, return valid status and discount details
      return res.status(200).json({
        valid: true,
        discountType: isPercentage ? 'percent' : 'fixed', // Discount type: percent or fixed
        discountValue, // Discount amount
        couponId: coupon.id, // Coupon ID
        description: coupon.description || '', // Optional description
      });
    } else {
      // No coupon found
      return res.status(404).json({
        valid: false,
        message: 'Discount code not found',
      });
    }
  } catch (error) {
    const errorMessage = (error as any).message;
    console.error('Error validating discount code:', errorMessage);
    return res.status(500).json({
      valid: false,
      message: 'Internal Server Error',
    });
  }
}
