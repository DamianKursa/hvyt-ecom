import { getCurrencySlugByLocale } from '@/config/currencies';
import { createApiClient } from './http';

const WooCommerceAPI = createApiClient({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const CustomAPI = createApiClient({
  baseURL: `${process.env.WORDPRESS_API_URL || 'https://wp.hvyt.pl'}/wp-json/custom/v1`,
});

interface Attribute {
  id: number;
  name: string;
  slug: string;
}

export const fetchCategoryBySlug = async (slug: string, lang: string) => {
  try {
    const response = await WooCommerceAPI.get('/products/categories', {
      params: {
        slug,
        per_page: 50,
        lang,
        currency: getCurrencySlugByLocale(lang)
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
  lang: string
) => {
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error(`Invalid categoryId: ${categoryId}`);
  }

  try {
    const params: Record<string, any> = {
      category: categoryId,
      page,
      per_page: perPage,
      status: 'publish',
      lang
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
      bestsellers: { orderby: 'popularity', order: 'desc' },
    };

    const sortingParams =
      sortingMap[sortingOption.toLowerCase()] || sortingMap.default;
    params.orderby = sortingParams.orderby;

    if (sortingParams.order) {
      params.order = sortingParams.order;
    }

    if(params.lang) {
      params.currency = getCurrencySlugByLocale(lang)
    }
    
    const response = await WooCommerceAPI.get('/products', { params });

    return {
      products: response.data || [],
      totalProducts: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    console.error('Error in fetchProductsByCategoryId:', error);
    throw error;
  }
};

export const fetchProductAttributesWithTerms = async (categoryId: number, lang: string) => {
  try {
    const response = await CustomAPI.get('/attributes', {
      params: { category: categoryId, lang },
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

type ListingFilter = { name: string; value: string };

const parsePriceFilter = (filters: ListingFilter[]) => {
  const priceFilter = filters.find((filter) => filter.name === 'price');
  if (!priceFilter?.value) return null;
  const [minPrice, maxPrice] = priceFilter.value.split('-').map(Number);
  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return null;
  return { minPrice, maxPrice };
};

/** Values of one attribute are OR. Separate attributes are AND. */
const groupAttributeFilters = (filters: ListingFilter[]) => {
  const groups = new Map<string, string[]>();
  filters.forEach((filter) => {
    if (!filter.name || !filter.value || filter.name === 'price') return;
    const taxonomy = filter.name.startsWith('pa_')
      ? filter.name
      : `pa_${filter.name}`;
    const values = groups.get(taxonomy) ?? [];
    if (!values.includes(filter.value)) values.push(filter.value);
    groups.set(taxonomy, values);
  });
  return groups;
};

const formatMinorUnitPrice = (raw: unknown, minorUnit: number) => {
  const text = String(raw ?? '').trim();
  if (!text) return '';
  const negative = text.startsWith('-');
  const digits = text.replace('-', '').replace(/\D/g, '');
  if (!digits) return '';
  const unit = Number.isFinite(minorUnit) && minorUnit > 0 ? minorUnit : 0;
  const padded = digits.padStart(unit + 1, '0');
  const whole = padded.slice(0, padded.length - unit) || '0';
  const fraction =
    unit > 0 ? padded.slice(padded.length - unit).replace(/0+$/, '') : '';
  const formatted = fraction ? `${whole}.${fraction}` : whole;
  return negative ? `-${formatted}` : formatted;
};

const mapStoreProduct = (product: any) => {
  const minorUnit = Number(product?.prices?.currency_minor_unit ?? 2);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: formatMinorUnitPrice(product?.prices?.price, minorUnit),
    on_sale: Boolean(product.on_sale),
    images: (product.images || [])
      .filter((image: { src?: string }) => image?.src)
      .map((image: { src: string }) => ({ src: image.src })),
    attributes: (product.attributes || []).map(
      (attribute: { name?: string; terms?: { name?: string }[] }) => ({
        name: attribute.name,
        options: (attribute.terms || [])
          .map((term) => term.name)
          .filter((name): name is string => Boolean(name)),
      }),
    ),
    date_created: null,
  };
};

export const fetchProductsWithFilters = async (
  categoryId: number,
  filters: ListingFilter[],
  page = 1,
  perPage = 12,
  lang: string,
) => {
  if (!filters || filters.length === 0) {
    throw new Error(
      'No filters applied. Cannot fetch products without filters.',
    );
  }

  const price = parsePriceFilter(filters);
  const attributeGroups = groupAttributeFilters(filters);
  const storeRoot = `${(process.env.REST_API || '').replace(/\/wc\/v3\/?$/i, '')}/wc/store/v1`;
  const params: Record<string, unknown> = {
    category: categoryId,
    page,
    per_page: perPage,
    orderby: 'date',
    order: 'desc',
    attribute_relation: 'and',
  };

  if (lang === 'pl' || lang === 'en') {
    params.wpml_language = lang;
  }

  if (attributeGroups.size > 0) {
    params.attributes = Array.from(attributeGroups.entries()).map(
      ([taxonomy, slugs]) => ({
        attribute: taxonomy,
        slug: slugs,
        operator: 'in',
      }),
    );
  }

  if (price) {
    params.min_price = String(Math.round(price.minPrice * 100));
    params.max_price = String(Math.round(price.maxPrice * 100));
  }

  try {
    const response = await WooCommerceAPI.get('/products', {
      baseURL: storeRoot,
      params,
    });

    return {
      products: (response.data || []).map(mapStoreProduct),
      totalProducts: parseInt(response.headers['x-wp-total'] || '0', 10),
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
  lang: string
) => {
  try {
    const params = {
      category: categoryId,
      page,
      per_page: perPage,
      orderby,
      order,
      lang,
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
        total_sales: Number(product.total_sales) || 0,
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
