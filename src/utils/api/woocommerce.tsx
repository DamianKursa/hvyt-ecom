import axios from 'axios';
import { Kolekcja } from '../functions/interfaces'; // Adjust the import path
import { NowosciPost } from '../functions/interfaces';
// Setup the WooCommerce API instance with the necessary credentials.
const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', // Consumer Key
    password: process.env.WC_CONSUMER_SECRET || '', // Consumer Secret
  },
});

// Define the type for attributes
interface Attribute {
  id: number;
  name: string;
}
interface MediaItem {
  id: number;
  source_url: string;
}

// Fetch category data by slug
export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const response = await WooCommerceAPI.get('/products/categories', {
      params: {
        slug,
        per_page: 50, // Adjust as necessary
      },
    });
    if (response.data.length === 0) {
      throw new Error('Category not found');
    }
    return response.data[0];
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Fetch product by slug
export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await WooCommerceAPI.get('/products', {
      params: {
        slug,
      },
    });

    return response.data[0]; // Return the first product matching the slug
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

// Fetch media by ID
export const fetchMediaById = async (mediaId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WP_REST_API}/media/${mediaId}`,
    );
    return response.data.source_url; // Return the image URL
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
};

export const fetchKolekcjePostsWithImages = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WP_REST_API}/kolekcje`,
      {
        params: { per_page: 50 },
      },
    );

    const kolekcje: Kolekcja[] = response.data;

    const mediaIds = kolekcje
      .map((k) => k.featured_media)
      .filter(Boolean)
      .join(',');

    const mediaResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_WP_REST_API}/media`,
      {
        params: { include: mediaIds, per_page: 50 },
        timeout: 5000,
      },
    );

    const mediaItems: MediaItem[] = mediaResponse.data;

    const kolekcjeWithImages = kolekcje.map((kolekcja: Kolekcja) => {
      let imageUrl = '/placeholder.jpg';

      const media = mediaItems.find(
        (m: MediaItem) => m.id === kolekcja.featured_media,
      );
      if (media) {
        imageUrl = media.source_url;
      } else if (kolekcja.yoast_head_json?.og_image?.[0]?.url) {
        imageUrl = kolekcja.yoast_head_json.og_image[0].url;
      }

      const icons = [
        kolekcja.acf?.ikonka_1,
        kolekcja.acf?.ikonka_2,
        kolekcja.acf?.ikonka_3,
        kolekcja.acf?.ikonka_4,
      ]
        .filter(Boolean)
        .map((iconName) => `/icons/kolekcja/${iconName}.svg`);

      return {
        ...kolekcja,
        imageUrl,
        description: kolekcja.content?.rendered || 'No description available',
        icons,
      };
    });

    return kolekcjeWithImages;
  } catch (error) {
    console.error('Error fetching Kolekcje posts:', error);
    throw error;
  }
};

export const fetchNowosciPosts = async (): Promise<NowosciPost[]> => {
  try {
    const apiBase = process.env.NEXT_PUBLIC_WP_REST_API;
    const response = await axios.get(`${apiBase}/nowosci`, {
      params: {
        per_page: 4, // Limit to exactly 4 posts
        _embed: true, // Include featured image data
      },
    });

    const posts = response.data.map((post: any) => {
      const featuredImage =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        '/placeholder.jpg'; // Default fallback image

      return {
        id: post.id,
        title: post.title.rendered,
        featured_media: post.featured_media,
        imageUrl: featuredImage, // Map the featured image URL
      };
    });

    return posts;
  } catch (error) {
    console.error('Error fetching Nowosci posts:', error);
    throw error;
  }
};

// Fetch product attributes with terms
export const fetchProductAttributesWithTerms = async (categoryId: number) => {
  try {
    const attributesResponse = await WooCommerceAPI.get('/products/attributes');
    const attributes: Attribute[] = attributesResponse.data;

    const attributesWithTerms = await Promise.all(
      attributes.map(async (attribute: Attribute) => {
        const termsResponse = await WooCommerceAPI.get(
          `/products/attributes/${attribute.id}/terms`,
        );

        return {
          ...attribute,
          options: termsResponse.data.map((term: any) => term.name),
        };
      }),
    );

    return attributesWithTerms.filter(
      (attribute) => attribute.options.length > 0,
    );
  } catch (error) {
    console.error('Error in fetchProductAttributesWithTerms:', error);
    throw error;
  }
};

// Fetch the latest "Kolekcja" with featured image
export const fetchLatestKolekcja = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WP_REST_API}/kolekcje`, // Adjust this endpoint if necessary
      {
        params: {
          per_page: 1, // Get only the latest post
          orderby: 'date',
          order: 'desc',
        },
      },
    );

    const latestKolekcja = response.data[0];

    // Check if a featured image is available and fetch it if so
    if (latestKolekcja && latestKolekcja.featured_media) {
      const mediaResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_WP_REST_API}/media/${latestKolekcja.featured_media}`,
      );
      latestKolekcja.imageUrl = mediaResponse.data.source_url;
    } else {
      latestKolekcja.imageUrl = '/placeholder.jpg'; // Fallback image
    }

    return latestKolekcja;
  } catch (error) {
    console.error('Error fetching latest Kolekcja:', error);
    throw error;
  }
};

// Fetch products by kolekcja attribute
export const fetchProductsByAttribute = async (kolekcja: string) => {
  try {
    const response = await WooCommerceAPI.get('/products', {
      params: {
        attribute: 'kolekcja', // Assuming 'kolekcja' is the correct attribute slug
        attribute_term: kolekcja,
        per_page: 50, // Adjust as necessary
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by attribute:', error);
    throw error;
  }
};

// Fetch cross-sell products

export const fetchCrossSellProducts = async (productId: string) => {
  try {
    // Fetch the main product to get cross-sell IDs
    const productResponse = await WooCommerceAPI.get(`/products/${productId}`);
    const productData = productResponse.data;

    // Limit cross-sell IDs to maximum of 6 products
    const crossSellIds = (productData.cross_sell_ids || []).slice(0, 6);

    if (crossSellIds.length === 0) {
      return { products: [] };
    }

    // Fetch cross-sell products in a single batch API request
    const response = await WooCommerceAPI.get('/products', {
      params: { include: crossSellIds.join(','), per_page: 6 },
      timeout: 5000, // 5 seconds timeout per batch request
    });

    return { products: response.data };
  } catch (error) {
    console.error('Error fetching cross-sell products:', error);
    return { products: [] };
  }
};

// Search products
export const searchProducts = async (query: string, perPage = 10) => {
  try {
    const response = await WooCommerceAPI.get('/products', {
      params: {
        search: query,
        per_page: perPage,
        status: 'publish',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching for products:', error);
    throw error;
  }
};

// Fetch Instagram posts
export const fetchInstagramPosts = async () => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      'Instagram access token is not defined in the environment variables',
    );
  }

  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram posts');
  }

  const data = await response.json();
  return data.data; // Return the array of Instagram posts
};

// Fetch reviews for a specific product
export const fetchProductReviews = async (productId: number) => {
  try {
    const response = await fetch(`/api/reviews?productId=${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
};

// Submit a review for a specific product
export const submitProductReview = async (
  productId: number,
  name: string,
  email: string,
  content: string,
  rating: number,
) => {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, name, email, content, rating }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting product review:', error);
    throw error;
  }
};

export const validateDiscountCode = async (
  code: string,
): Promise<{
  valid: boolean;
  discountValue: number;
  discountType?: 'percent' | 'fixed'; // Added discountType
}> => {
  try {
    const response = await fetch('/api/discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate discount code');
    }

    const data = await response.json();
    return {
      valid: data.valid,
      discountValue: data.discountValue || 0,
      discountType: data.discountType, // Include discountType from the response
    };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return { valid: false, discountValue: 0 }; // Return default values in case of error
  }
};
