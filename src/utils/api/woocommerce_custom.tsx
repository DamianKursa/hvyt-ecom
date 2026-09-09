import { Kolekcja } from '../functions/interfaces';
import { NowosciPost } from '../functions/interfaces';
import { createApiClient } from './http';

const WooCommerceAPI = createApiClient({
  baseURL: process.env.REST_API_CUSTOM,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

// Fetch product ids and slugs in all languages
export const fetchProductMultilangIds = async (id: number | string) => {
  try {

    const response = await WooCommerceAPI.get(`/product-multilang`, {
      params: { ts: Date.now(), id },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching multilang product ids:', error);
    throw error;
  }
};

// Fetch product id by slug
export const fetchProductIdBySlug = async (slug: string) => {
  try {
    const response = await WooCommerceAPI.get('/product-id-by-slug', {
      params: {
        slug,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};