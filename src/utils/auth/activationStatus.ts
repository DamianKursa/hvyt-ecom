import type { Translations } from '@/utils/i18n/translations';
import { getLocalizedPath } from '@/utils/i18n/routing';

export type ActivationNotice = {
  type: 'error' | 'success' | 'info';
  key: keyof Translations['auth'];
};

const firstQueryValue = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

export function getActivationNotice(
  query: Record<string, string | string[] | undefined>,
): ActivationNotice | null {
  const error = firstQueryValue(query.error || query.code).toLowerCase();
  const activated = firstQueryValue(query.activated || query.success).toLowerCase();
  const status = firstQueryValue(query.status).toLowerCase();

  if (error) {
    switch (error) {
      case 'invalid_token':
        return { type: 'error', key: 'activationInvalidToken' };
      case 'expired_token':
        return { type: 'error', key: 'activationExpiredToken' };
      case 'already_active':
      case 'already_activated':
        return { type: 'info', key: 'activationAlreadyActive' };
      case 'missing_token':
        return { type: 'error', key: 'activationMissingToken' };
      default:
        return { type: 'error', key: 'activationError' };
    }
  }

  if (
    activated === '1' ||
    activated === 'true' ||
    activated === 'account_activated' ||
    status === 'activated' ||
    status === 'success'
  ) {
    return { type: 'success', key: 'activationSuccess' };
  }

  return null;
}

export function getLoginPathForLang(lang: 'pl' | 'en'): string {
  return getLocalizedPath('/logowanie', lang);
}
