import type { Translations } from '@/utils/i18n/translations';

/**
 * Powód, dla którego podsumowanie nie może pokazać cen zależnych od dostawy.
 * Nowe przypadki dopisuj tutaj i w `resolveActionNeeded`.
 */
export type ActionNeeded = 'selectDeliveryCountry';

export type ActionNeededTone = 'success' | 'warning' | 'error';

export interface ActionNeededContent {
  type: ActionNeededTone;
  message: string;
}

export const resolveActionNeeded = (
  actionNeeded: ActionNeeded | null | undefined,
  t: Translations,
): ActionNeededContent | null => {
  if (!actionNeeded) return null;

  switch (actionNeeded) {
    case 'selectDeliveryCountry':
      return {
        type: 'warning',
        message: t.cart.summary.selectDeliveryCountry,
      };
    default: {
      const unknown: never = actionNeeded;
      return unknown;
    }
  }
};
