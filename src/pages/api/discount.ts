import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// WooCommerce API client setup
const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const CustomAPI = axios.create({
  baseURL: process.env.REST_API_CUSTOM,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const toUniqueNumberArray = (input: unknown): number[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  const nums = input
    .map((entry) => {
      if (typeof entry === 'number') {
        return entry;
      }
      if (typeof entry === 'string') {
        const parsed = Number(entry);
        return Number.isFinite(parsed) ? parsed : NaN;
      }
      if (entry && typeof entry === 'object') {
        const maybeId =
          // @ts-ignore - REST objects can expose these fields
          entry.id ?? entry.term_id ?? entry.value ?? entry.ID ?? entry.slug;
        if (typeof maybeId === 'number') {
          return maybeId;
        }
        if (typeof maybeId === 'string') {
          const parsed = Number(maybeId);
          return Number.isFinite(parsed) ? parsed : NaN;
        }
      }
      return NaN;
    })
    .filter((n): n is number => Number.isFinite(n));

  return Array.from(new Set(nums));
};

const normalizeCategoryIds = (input: unknown): number[] => {
  return toUniqueNumberArray(
    Array.isArray(input)
      ? input.map((entry) => {
          if (entry && typeof entry === 'object' && 'id' in entry) {
            return (entry as any).id;
          }
          return entry;
        })
      : [],
  );
};

const parsePrice = (value: unknown): number => {
  if (value == null) {
    return NaN;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === 'string') {
    const sanitized = value.replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
};

const pickFirstFinitePrice = (...values: unknown[]): number => {
  for (const value of values) {
    const parsed = parsePrice(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return NaN;
};

const productIsOnSale = (product: any): boolean => {
  if (!product) {
    return false;
  }
  if (product.on_sale === true || product.on_sale === 'true') {
    return true;
  }

  const salePrice = pickFirstFinitePrice(
    product.sale_price,
    product.prices?.sale_price,
    product.prices?.sale,
  );
  const regularPrice = pickFirstFinitePrice(
    product.regular_price,
    product.prices?.regular_price,
    product.prices?.regular,
  );
  const currentPrice = pickFirstFinitePrice(
    product.price,
    product.prices?.price,
  );

  if (Number.isFinite(salePrice) && (salePrice as number) > 0) {
    if (!Number.isFinite(regularPrice)) {
      return true;
    }
    if ((salePrice as number) < (regularPrice as number)) {
      return true;
    }
  }

  if (
    Number.isFinite(currentPrice) &&
    Number.isFinite(regularPrice) &&
    (currentPrice as number) < (regularPrice as number)
  ) {
    return true;
  }

  return false;
};

const gatherCategoryIds = (product: any, requestItem: any): number[] => {
  const fromProduct = normalizeCategoryIds(product?.categories);
  if (fromProduct.length) {
    return fromProduct;
  }
  return normalizeCategoryIds(requestItem?.categories);
};

const categorySlugCache = new Map<string, number | null>();

const fetchCategoryIdBySlug = async (slug: string): Promise<number | null> => {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (categorySlugCache.has(normalized)) {
    return categorySlugCache.get(normalized) ?? null;
  }

  try {
    const response = await WooCommerceAPI.get('/products/categories', {
      params: { slug: normalized, per_page: 100 },
    });
    const match = Array.isArray(response.data)
      ? response.data.find(
          (cat: any) => String(cat?.slug || '').toLowerCase() === normalized,
        )
      : null;
    const id = Number(match?.id);
    if (Number.isFinite(id)) {
      categorySlugCache.set(normalized, id);
      return id;
    }
  } catch (error) {
    console.warn(
      `Failed to resolve category slug "${slug}":`,
      (error as any)?.message || error,
    );
  }

  categorySlugCache.set(normalized, null);
  return null;
};

const resolveCategoryIdsBySlugList = async (
  slugs?: string[],
): Promise<number[]> => {
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return [];
  }

  const ids: number[] = [];

  for (const rawSlug of slugs) {
    const slug = String(rawSlug ?? '').trim().toLowerCase();
    if (!slug) {
      continue;
    }

    let cached = categorySlugCache.get(slug);
    if (typeof cached === 'undefined') {
      cached = await fetchCategoryIdBySlug(slug);
    }

    if (typeof cached === 'number' && Number.isFinite(cached)) {
      ids.push(cached);
    }
  }

  return Array.from(new Set(ids));
};

const hvytSiteUrl = (
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  ''
).replace(/\/$/, '');

const couponRuleCache = new Map<string, any>();

const fetchHvytCouponRule = async (code: string, lang: string) => {
  const normalized = code.trim().toLowerCase();
  if (!normalized || !hvytSiteUrl) {
    return null;
  }

  if (couponRuleCache.has(normalized)) {
    return couponRuleCache.get(normalized);
  }

  try {
    const response = await axios.get(
      `${hvytSiteUrl}/wp-json/hvyt/v1/coupon-rules`,
      { params: { code: normalized, lang } },
    );

    if (response.data && Object.keys(response.data).length > 0) {
      couponRuleCache.set(normalized, response.data);
      return response.data;
    }
  } catch (error) {
    console.warn(
      'HVYT coupon rule fetch failed:',
      (error as any)?.message || error,
    );
  }

  couponRuleCache.set(normalized, null);
  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { code, cartTotal, items, lang } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Wprowadź kod rabatowy.', messageCode: 'supplyCode' });
  }

  const ids = Array.isArray(items)
    ? items.map((it: any) => Number(it?.id)).filter((n: number) => Number.isFinite(n))
    : [];

  const itemsById = new Map<number, any>();
  if (Array.isArray(items)) {
    items.forEach((it: any) => {
      const pid = Number(it?.id);
      if (Number.isFinite(pid)) {
        itemsById.set(pid, it);
      }
    });
  }

  const productsById = new Map<number, any>();
  const saleProductsFromServer = new Set<number>();

  if (ids.length > 0) {
    try {
      const productsRes = await WooCommerceAPI.get('/products', {
        params: { include: ids, per_page: ids.length },
      });

      if (Array.isArray(productsRes.data)) {
        productsRes.data.forEach((product: any) => {
          const pid = Number(product?.id);
          if (!Number.isFinite(pid)) {
            return;
          }
          productsById.set(pid, product);
          if (productIsOnSale(product)) {
            saleProductsFromServer.add(pid);
          }
        });
      }
    } catch (e) {
      console.warn('Sale verification skipped:', (e as any)?.message || e);
    }
  }

  try {
    const response = await CustomAPI.get('/coupon', {
      params: { code, lang },
    });

    if (response.data.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'Podany kod rabatowy nie istnieje.',
        messageCode: 'CodeNotExist',
      });
    }

    const coupon = response.data[0];

    const now = new Date();
    
    // if (coupon.date_expires && new Date(coupon.date_expires) < now) {
    //   return res.status(400).json({
    //     valid: false,
    //     message: 'Ten kod rabatowy wygasł.',
    //     messageCode: 'codeExpired',
    //   });
    // }

    // if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    //   return res.status(400).json({
    //     valid: false,
    //     message: 'Limit użycia tego kodu został osiągnięty.',
    //     messageCode: 'codeLimitReached',
    //   });
    // }
    if (
      coupon.minimum_amount &&
      cartTotal &&
      parseFloat(cartTotal) < parseFloat(coupon.minimum_amount)
    ) { console.log('cartvalues', cartTotal, coupon.minimum_amount);
    
      return res.status(400).json({
        valid: false,
        message: `Minimalna wartość zamówienia to ${parseFloat(coupon.minimum_amount).toFixed(2)} zł.`,
        messageCode: 'minAmount',
        messageParams: {amount: parseFloat(coupon.minimum_amount).toFixed(2)}
      });
    }

    const couponData: any = coupon;
    const appliedCode = String((coupon.code || code || '')).trim().toUpperCase();
    const normalizedCode = appliedCode.toLowerCase();

    let allowedCats = toUniqueNumberArray(
      couponData.product_categories ??
        couponData.product_category_ids ??
        couponData.categories ??
        [],
    );
    let excludedCats = toUniqueNumberArray(
      couponData.excluded_product_categories ??
        couponData.excluded_product_category_ids ??
        [],
    );
    let allowedProductIds = toUniqueNumberArray(
      couponData.product_ids ?? couponData.included_product_ids ?? [],
    );
    let excludedProductIds = toUniqueNumberArray(
      couponData.excluded_product_ids ?? [],
    );
    const excludeSaleItems = Boolean(couponData.exclude_sale_items);

    let specialExcludeCategoriesOnSale: number[] = [];

    const remoteRule = await fetchHvytCouponRule(normalizedCode, lang);
    if (remoteRule) {
      const [
        extraAllowedFromSlugs,
        extraExcludedFromSlugs,
        extraExcludedOnSaleFromSlugs,
      ] = await Promise.all([
        resolveCategoryIdsBySlugList(
          remoteRule.include_category_slugs ??
            remoteRule.includeCategorySlugs ??
            [],
        ),
        resolveCategoryIdsBySlugList(
          remoteRule.exclude_category_slugs ??
            remoteRule.excludeCategorySlugs ??
            [],
        ),
        resolveCategoryIdsBySlugList(
          remoteRule.exclude_category_slugs_on_sale ??
            remoteRule.excludeCategoriesOnSaleSlugs ??
            [],
        ),
      ]);

      const includeIdValues = toUniqueNumberArray(
        remoteRule.include_category_ids ?? remoteRule.includeCategoryIds ?? [],
      );
      const excludeIdValues = toUniqueNumberArray(
        remoteRule.exclude_category_ids ?? remoteRule.excludeCategoryIds ?? [],
      );
      const excludeOnSaleIdValues = toUniqueNumberArray(
        remoteRule.exclude_category_ids_on_sale ??
          remoteRule.excludeCategoryIdsOnSale ??
          [],
      );

      if (includeIdValues.length || extraAllowedFromSlugs.length) {
        allowedCats.push(...includeIdValues, ...extraAllowedFromSlugs);
      }
      if (excludeIdValues.length || extraExcludedFromSlugs.length) {
        excludedCats.push(...excludeIdValues, ...extraExcludedFromSlugs);
      }
      specialExcludeCategoriesOnSale = [
        ...excludeOnSaleIdValues,
        ...extraExcludedOnSaleFromSlugs,
      ];
    }

    allowedCats = Array.from(new Set(allowedCats));
    excludedCats = Array.from(new Set(excludedCats));
    allowedProductIds = Array.from(new Set(allowedProductIds));
    excludedProductIds = Array.from(new Set(excludedProductIds));
    specialExcludeCategoriesOnSale = Array.from(
      new Set(specialExcludeCategoriesOnSale),
    );

    const allowedCatSet = new Set(allowedCats);
    const excludedCatSet = new Set(excludedCats);
    const allowedProductSet = new Set(allowedProductIds);
    const excludedProductSet = new Set(excludedProductIds);
    const excludedCatsOnSaleSet = new Set(specialExcludeCategoriesOnSale);

    const applicableProductIds: number[] = [];
    const eligibleNonSaleProductIds: number[] = [];

    ids.forEach((pid) => {
      if (!Number.isFinite(pid)) {
        return;
      }
      if (excludedProductSet.has(pid)) {
        return;
      }
      if (allowedProductSet.size > 0 && !allowedProductSet.has(pid)) {
        return;
      }

      const product = productsById.get(pid);
      const requestItem = itemsById.get(pid);
      const categoryIds = gatherCategoryIds(product, requestItem);

      if (excludedCatSet.size > 0 && categoryIds.some((id) => excludedCatSet.has(id))) {
        return;
      }
      if (
        allowedCatSet.size > 0 &&
        !categoryIds.some((id) => allowedCatSet.has(id))
      ) {
        return;
      }

      applicableProductIds.push(pid);

      const isOnSale = saleProductsFromServer.has(pid) || productIsOnSale(product);
      const blockedByCategorySale =
        excludedCatsOnSaleSet.size > 0 &&
        isOnSale &&
        categoryIds.some((id) => excludedCatsOnSaleSet.has(id));
      const blockedByGlobalSale = excludeSaleItems && isOnSale;

      if (!blockedByCategorySale && !blockedByGlobalSale) {
        eligibleNonSaleProductIds.push(pid);
      }

    });

    const uniqueApplicableProductIds = Array.from(new Set(applicableProductIds));
    const uniqueEligibleNonSaleProductIds = Array.from(
      new Set(eligibleNonSaleProductIds),
    );

    if (ids.length > 0 && uniqueApplicableProductIds.length === 0) {
      return res.status(400).json({
        valid: false,
        message: 'Ten kod nie obejmuje żadnego produktu w koszyku.',
        messageCode: 'noValidProducts',
        debug: 'no_matching_products',
      });
    }

    const requiresNonSaleItems =
      excludeSaleItems || excludedCatsOnSaleSet.size > 0;

    if (
      requiresNonSaleItems &&
      uniqueApplicableProductIds.length > 0 &&
      uniqueEligibleNonSaleProductIds.length === 0
    ) {
      return res.status(400).json({
        valid: false,
        message: 'Kod nie działa na produkty z promocji.',
        messageCode: 'notForPromotions',
        debug: 'only_sale_products_in_scope',
      });
    }

    const isPercentage = coupon.discount_type === 'percent';
    const discountValue = parseFloat(coupon.amount || '0');
    const freeShipping = Boolean(coupon.free_shipping);

    return res.status(200).json({
      valid: true,
      discountType: isPercentage ? 'percent' : 'fixed',
      discountValue,
      couponId: coupon.id,
      description: coupon.description || '',
      allowedCats,
      allowedProductIds,
      eligibleProductIds: uniqueEligibleNonSaleProductIds,
      applicableProductIds: uniqueApplicableProductIds,
      excludedCats,
      excludedProductIds,
      excludeSaleItems,
      excludeCategoriesOnSale: specialExcludeCategoriesOnSale,
      freeShipping,
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return res.status(500).json({
      valid: false,
      message: 'Wystąpił błąd serwera. Spróbuj ponownie później.',
      messageCode: 'serverError',
    });
  }
}
