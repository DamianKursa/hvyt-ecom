import axios from 'axios';

// Setup the WooCommerce API instance with the necessary credentials.
const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret
  },
});

// Define the type for attributes
interface Attribute {
  id: number;
  name: string;
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

// Fetch products by category ID
export const fetchProductsByCategoryId = async (
  categoryId: number,
  page = 1,
  perPage = 12,
  filters: { name: string; value: string }[] = [],
  sortingOption: string = 'default',
) => {
  try {
    const params: any = {
      category: categoryId,
      page,
      per_page: perPage,
    };

    filters.forEach((filter) => {
      if (filter.name && filter.value) {
        params[`attribute_${filter.name}`] = filter.value;
      }
    });

    if (sortingOption !== 'default') {
      params.orderby = sortingOption;
    }

    console.log('Sending API request to fetch products:', params);

    const response = await WooCommerceAPI.get('/products', { params });

    console.log('Products fetched from WooCommerce:', response.data);

    return {
      products: response.data || [],
      totalProducts: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    console.error('Error in fetchProductsByCategoryId:', error);
    throw error;
  }
};

// Fetch product attributes with terms
export const fetchProductAttributesWithTerms = async (categoryId: number) => {
  try {
    const attributesResponse = await WooCommerceAPI.get('/products/attributes');
    const attributes: Attribute[] = attributesResponse.data;

    console.log('Fetched attributes:', attributes);

    const attributesWithTerms = await Promise.all(
      attributes.map(async (attribute: Attribute) => {
        const termsResponse = await WooCommerceAPI.get(
          `/products/attributes/${attribute.id}/terms`,
        );

        console.log(`Fetched terms for ${attribute.name}:`, termsResponse.data);

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
// Combined fetch function
export const fetchCategoryData = async (
  slug: string,
  page = 1,
  perPage = 12,
  filters: { name: string; value: string }[] = [],
  sortingOption: string = 'default',
) => {
  try {
    const category = await fetchCategoryBySlug(slug);
    const [attributes, { products, totalProducts }] = await Promise.all([
      fetchProductAttributesWithTerms(category.id),
      fetchProductsByCategoryId(
        category.id,
        page,
        perPage,
        filters,
        sortingOption,
      ),
    ]);

    return {
      category,
      attributes,
      products,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
};
