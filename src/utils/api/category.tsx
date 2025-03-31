import axios from 'axios';

// Setup the WooCommerce API instance with the necessary credentials.
const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', // Consumer Key
    password: process.env.WC_CONSUMER_SECRET || '', // Consumer Secret
  },
});

const CustomAPI = axios.create({
  baseURL: 'https://wp.hvyt.pl/wp-json/custom/v1', // Custom API base URL
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
  perPage = 10,
  filters: { name: string; value: string }[] = [],
  sortingOption: string = 'default',
) => {
  try {
    // Initialize API request parameters and include published status
    const params: Record<string, any> = {
      category: categoryId,
      page,
      per_page: perPage,
      status: 'publish', // Only published products will be returned
      _fields: 'id,name,price,slug,images',
    };

    // Add filters to the request
    filters.forEach((filter) => {
      if (filter.name && filter.value) {
        // Use WooCommerce attribute query format
        const attributeKey = `attribute_${filter.name}`;
        if (!params[attributeKey]) {
          params[attributeKey] = filter.value;
        } else {
          params[attributeKey] += `,${filter.value}`; // Handle multiple values for the same filter
        }
      }
    });

    // Map the sortingOption to WooCommerce-compatible parameters
    const sortingMap: Record<string, { orderby: string; order?: string }> = {
      default: { orderby: 'date', order: 'desc' },
      'price-asc': { orderby: 'price', order: 'asc' },
      'price-desc': { orderby: 'price', order: 'desc' },
      newest: { orderby: 'date', order: 'desc' },
      bestsellers: { orderby: 'popularity' },
    };

    const sortingParams =
      sortingMap[sortingOption.toLowerCase()] || sortingMap.default;
    params.orderby = sortingParams.orderby;

    if (sortingParams.order) {
      params.order = sortingParams.order;
    }

    // Fetch products from WooCommerce API
    const response = await WooCommerceAPI.get('/products', { params });

    return {
      products: response.data || [],
      totalProducts: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    console.error('Error in fetchProductsByCategoryId:', error);
    return {
      products: [],
      totalProducts: 0,
    };
  }
};

export const fetchProductAttributesWithTerms = async (categoryId: number) => {
  try {
    const response = await CustomAPI.get('/attributes', {
      params: { category: categoryId },
    });

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

  filters.forEach((filter) => {
    if (filter.name === 'price') {
      // Add price filter to params
      const [minPrice, maxPrice] = filter.value.split('-').map(Number);
      params.min_price = minPrice;
      params.max_price = maxPrice;
    } else {
      // Add attribute filter to params
      params.attributes = params.attributes || [];
      params.attributes.push({
        key: filter.name,
        value: filter.value,
      });
    }
  });

  try {
    const response = await CustomAPI.get('/filtered-products', { params });

    return {
      products: response.data.products || [],
      totalProducts: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching products with filters:', error);
    throw error;
  }
};

// Fetch products with custom sorting
export const fetchSortedProducts = async (
  categoryId: number,
  orderby: string,
  order: string,
  page = 1,
  perPage = 12,
) => {
  try {
    const params = {
      category: categoryId,
      page,
      per_page: perPage,
      orderby,
      order,
    };

    const response = await CustomAPI.get('/sorted-products', { params });

    return {
      products: response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.permalink.split('/').filter(Boolean).pop(), // Extract slug from permalink
        images: [
          { src: product.image }, // Wrap image in an array
        ],
        variations: [], // Add variations if available in API
      })),
      totalProducts: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error in fetchSortedProducts:', error);
    throw error;
  }
};
