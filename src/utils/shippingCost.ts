import type { ShippingMethod } from '@/types/checkout';

const parseCost = (value: unknown): number | null => {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolveShippingClassCost = (shippingClass: {
  cost?: number | string | null;
  cost_original?: number | string | null;
  price_source?: string;
}): number | null => {
  const original = parseCost(shippingClass.cost_original);
  const cost = parseCost(shippingClass.cost);
  const priceSource = shippingClass.price_source;

  if (
    original != null &&
    (priceSource === 'manual_wcml' ||
      priceSource === 'manual_wcml_only' ||
      priceSource === 'fallback_pl')
  ) {
    return original;
  }

  return cost ?? original;
};

export interface CartShippingClassRef {
  class_id?: number;
  shipping_class?: string;
}

const shippingClassMatchesCart = (
  shippingClass: { class_id: number; class_slug?: string },
  cartClasses: CartShippingClassRef[],
): boolean => {
  const activeIds = new Set(
    cartClasses
      .map((item) => Number(item.class_id) || 0)
      .filter((classId) => classId > 0),
  );
  const activeSlugs = new Set(
    cartClasses
      .map((item) => item.shipping_class?.trim())
      .filter((slug): slug is string => Boolean(slug)),
  );

  if (activeIds.has(shippingClass.class_id)) return true;

  const classSlug = shippingClass.class_slug?.trim();
  return Boolean(classSlug && activeSlugs.has(classSlug));
};

/**
 * Resolve shipping method cost.
 * When the cart has shipping classes matching method rules, use the highest class cost.
 * Matches by class_id and shipping_class slug (WPML uses different term ids per language).
 * Otherwise fall back to the method base cost.
 */
export const resolveShippingMethodCost = (
  method: ShippingMethod,
  cartShippingClasses: CartShippingClassRef[] | number[],
): number => {
  const normalizedCartClasses: CartShippingClassRef[] = cartShippingClasses.map((item) =>
    typeof item === 'number' ? { class_id: item } : item,
  );

  let highestClassCost: number | null = null;

  for (const shippingClass of method.shipping_classes ?? []) {
    if (!shippingClassMatchesCart(shippingClass, normalizedCartClasses)) continue;

    const classCost = resolveShippingClassCost(shippingClass);
    if (classCost == null) continue;

    highestClassCost =
      highestClassCost == null ? classCost : Math.max(highestClassCost, classCost);
  }

  if (highestClassCost != null) {
    return highestClassCost;
  }

  return parseCost(method.cost) ?? 0;
};

export const getShippingClassIdsFromCart = (
  products: Array<{ shipping_class_id?: number }> | undefined,
): number[] => {
  if (!products?.length) return [];

  return products
    .map((product) => Number(product.shipping_class_id) || 0)
    .filter((classId) => classId > 0);
};

export const getShippingClassesFromCart = (
  products: Array<{ shipping_class_id?: number; shipping_class?: string }> | undefined,
): CartShippingClassRef[] => {
  if (!products?.length) return [];

  const seen = new Set<string>();
  const result: CartShippingClassRef[] = [];

  for (const product of products) {
    const classId = Number(product.shipping_class_id) || 0;
    const slug = product.shipping_class?.trim() || '';
    const key = `${classId}:${slug}`;

    if (classId <= 0 && !slug) continue;
    if (seen.has(key)) continue;

    seen.add(key);
    result.push({
      class_id: classId > 0 ? classId : undefined,
      shipping_class: slug || undefined,
    });
  }

  return result;
};
