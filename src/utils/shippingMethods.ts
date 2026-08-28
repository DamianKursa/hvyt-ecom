import type { ShippingMethod } from '@/types/checkout';

const methodTitle = (method?: { title?: string } | null): string =>
  method?.title?.toLowerCase().trim() ?? '';

/** InPost parcel lockers — Woo title is currently "Paczkomaty 24/7 Inpost". */
export const isPaczkomatyMethod = (
  method?: { title?: string } | null,
): boolean => methodTitle(method).includes('paczkomat');

export const isPunktyGlsMethod = (
  method?: { title?: string } | null,
): boolean => methodTitle(method).includes('punkty gls');

/** Place InPost lockers first on the shipping list. */
export const placePaczkomatyFirst = (
  methods: ShippingMethod[],
): ShippingMethod[] => {
  const paczkomaty = methods.filter(isPaczkomatyMethod);
  if (paczkomaty.length === 0) return methods;

  const withoutPaczkomaty = methods.filter((method) => !isPaczkomatyMethod(method));
  return [...paczkomaty, ...withoutPaczkomaty];
};
