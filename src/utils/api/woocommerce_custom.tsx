import axios from 'axios';
import { Kolekcja } from '../functions/interfaces';
import { NowosciPost } from '../functions/interfaces';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API_CUSTOM,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

interface Attribute {
  id: number;
  name: string;
}
interface MediaItem {
  id: number;
  source_url: string;
}

// export const fetchCategoryBySlug = async (slug: string) => {
//   try {
//     const response = await WooCommerceAPI.get('/products/categories', {
//       params: {
//         slug,
//         per_page: 50,
//       },
//     });
//     if (response.data.length === 0) {
//       throw new Error('Category not found');
//     }
//     return response.data[0];
//   } catch (error) {
//     console.error('Error fetching category:', error);
//     throw error;
//   }
// };

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