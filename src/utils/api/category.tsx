import axios from 'axios';

// Setup the WooCommerce API instance with the necessary credentials.
const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret
  },
});

const CustomAPI = axios.create({
  baseURL: 'https://hvyt.pl/wp-json/custom/v1', // Custom API base URL
});

// Define the type for attributes
interface Attribute {
  id: number;
  name: string;
  slug: string;
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

export const fetchProductAttributesWithTerms = async (categoryId: number) => {
  try {
    const response = await CustomAPI.get('/attributes', {
      params: { category: categoryId },
    });

    console.log('Fetched attributes from Custom API:', response.data);

    return response.data.map((attribute: any) => ({
      id: attribute.id,
      name: attribute.name,
      slug: `pa_${attribute.slug}`, // Ensure slug matches taxonomy in backend
      options: attribute.options.map((option: any) => ({
        id: option.id,
        name: option.name,
        slug: option.slug,
      })),
    }));
  } catch (error) {
    console.error('Error fetching attributes with terms:', error);
    throw error;
  }
};

export const fetchProductsWithFilters = async (
  categoryId: number,
  filters: { name: string; value: string }[],
  page = 1,
  perPage = 12,
) => {
  if (!filters || filters.length === 0) {
    throw new Error(
      'No filters applied. Cannot fetch products without filters.',
    );
  }

  const params: any = {
    category: categoryId,
    page,
    per_page: perPage,
  };

  filters.forEach((filter, index) => {
    if (filter.name && filter.value) {
      params[`attributes[${index}][key]`] = filter.name; // Slug of attribute
      params[`attributes[${index}][value]`] = filter.value;
    }
  });

  try {
    const response = await CustomAPI.get('/filtered-products', { params });

    console.log('Filtered products fetched:', response.data);

    return {
      products: response.data.products || [],
      totalProducts: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching products with filters:', error);
    throw error;
  }
};
