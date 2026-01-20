// lib/wpml-translations.ts
// import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import type { WooProduct } from '@/types/woocommerce';
import axios from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

export class WPMLTranslationService {
  private api: any;

  constructor() {
    // WooCommerce API client setup
    this.api = axios.create({
      baseURL: process.env.REST_API,
      auth: {
        username: process.env.WC_CONSUMER_KEY || '',
        password: process.env.WC_CONSUMER_SECRET || '',
      },
    });
  }

  // Get English product by Polish product ID
  async getEnglishProductByPolishId(polishId: number): Promise<WooProduct | null> {
      // Method 1: Using WPML's lang parameter directly
      console.log('polish id', polishId);
      try {
          // const response = await fetch(`/api/products/${polishId}`);
          console.log('start english product');
          
          const response = await fetch(`/api/product?id=7576422&lang=en`);
          if(!response.ok) {
            throw new Error('Error fetching english Product');
          }
          
          const data = await response.json();
          console.log('data', data);
          
          return data;
      } catch (error) {
        console.log('Failed to load english product: ' + error);
        return null;
      }
  }

  // Get English product by Polish slug
  async getEnglishProductByPolishSlug(polishSlug: string): Promise<WooProduct | null> {
    try {
      // First get the Polish product to get its ID
      const polishProduct = await this.api.get('products', {
        slug: polishSlug,
        lang: 'pl',
        per_page: 1
      });

      if (!polishProduct.data.length) {
        return null;
      }

      const polishId = polishProduct.data[0].id;
      
      // Now get the English translation
      return await this.getEnglishProductByPolishId(polishId);
    } catch (error) {
      console.error('Error fetching by Polish slug:', error);
      return null;
    }
  }
}