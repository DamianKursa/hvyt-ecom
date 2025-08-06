import axios from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const CustomAPI = axios.create({
  baseURL: 'https://wp.hvyt.pl/wp-json/custom/v1',
});

interface Attribute {
  id: number;
  name: string;
  slug: string;
}

export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const response = await WooCommerceAPI.get('/products/categories', {
      params: {
        slug,
        per_page: 50,
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

export const fetchProductsByCategoryId = async (
  categoryId: number,
  page = 1,
  perPage = 10,
  filters: { name: string; value: string }[] = [],
  sortingOption: string = 'default',
) => {
  try {
    const params: Record<string, any> = {
      category: categoryId,
      page,
      per_page: perPage,
      status: 'publish',
    };

    filters.forEach((filter) => {
      if (filter.name && filter.value) {
        const attributeKey = `attribute_${filter.name}`;
        if (!params[attributeKey]) {
          params[attributeKey] = filter.value;
        } else {
          params[attributeKey] += `,${filter.value}`;
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
      _fields: 'id,name,price,regular_price,sale_price,slug,images',
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
      slug: `pa_${attribute.slug}`,
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
      const [minPrice, maxPrice] = filter.value.split('-').map(Number);
      params.min_price = minPrice;
      params.max_price = maxPrice;
    } else {
      params.attributes = params.attributes || [];
      params.attributes.push({
        key: filter.name,
        value: filter.value,
      });
    }
  });

  try {
    const response = await CustomAPI.get('/filtered-products', { params });

    const mapped = (response.data.products || []).map((p: any) => ({
      ...p,
      // ensure date_created exists so the "Nowość" badge logic works
      date_created:
        p.date_created ||
        p.date_gmt ||
        p.date_created_gmt ||
        p.date ||
        p.created_date ||
        p.created_at ||
        null,
    }));

    return {
      products: mapped,
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
        slug: product.permalink.split('/').filter(Boolean).pop(),
        images: [{ src: product.image }],
        variations: [],
        date_created:
          product.date_created ||
          product.date_gmt ||
          product.date_created_gmt ||
          product.date ||
          product.created_date ||
          product.created_at ||
          null,
      })),
      totalProducts: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error in fetchSortedProducts:', error);
    throw error;
  }
};
