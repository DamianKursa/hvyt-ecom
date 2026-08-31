import axios from 'axios';
import { formatPersonName } from './displayName';
import { getUserIdFromJwt } from './jwt';

export type PersonName = {
  firstName: string;
  lastName: string;
  displayName: string;
};

const pickName = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const fromParts = (firstName: string, lastName: string): PersonName => ({
  firstName,
  lastName,
  displayName: formatPersonName(firstName, lastName),
});

export async function resolveCustomerPersonName(token: string): Promise<PersonName> {
  const headers = { Authorization: `Bearer ${token}` };
  const wpBase = process.env.WORDPRESS_API_URL || '';

  try {
    const { data } = await axios.get(`${wpBase}/wp-json/custom-api/v1/user-data`, {
      headers,
    });
    const firstName = pickName(data?.firstName, data?.first_name);
    const lastName = pickName(data?.lastName, data?.last_name);
    if (firstName || lastName) {
      return fromParts(firstName, lastName);
    }
  } catch {
    // Try the next source
  }

  try {
    const { data } = await axios.get(`${wpBase}/wp-json/wp/v2/users/me`, {
      headers,
      params: { context: 'edit' },
    });
    const firstName = pickName(data?.first_name, data?.firstName);
    const lastName = pickName(data?.last_name, data?.lastName);
    if (firstName || lastName) {
      return fromParts(firstName, lastName);
    }
  } catch {
    // Try the next source
  }

  try {
    const { data } = await axios.get(`${wpBase}/wp-json/wc/v3/customers/me`, {
      headers,
    });
    const firstName = pickName(data?.first_name, data?.billing?.first_name);
    const lastName = pickName(data?.last_name, data?.billing?.last_name);
    if (firstName || lastName) {
      return fromParts(firstName, lastName);
    }
  } catch {
    // Try the next source
  }

  const customerId = getUserIdFromJwt(token);
  const wcBase = process.env.REST_API || '';
  const wcKey = process.env.WC_CONSUMER_KEY || '';
  const wcSecret = process.env.WC_CONSUMER_SECRET || '';

  if (customerId && wcBase && wcKey && wcSecret) {
    try {
      const { data } = await axios.get(`${wcBase}/customers/${customerId}`, {
        auth: { username: wcKey, password: wcSecret },
      });
      const firstName = pickName(data?.first_name, data?.billing?.first_name);
      const lastName = pickName(data?.last_name, data?.billing?.last_name);
      if (firstName || lastName) {
        return fromParts(firstName, lastName);
      }
    } catch {
      // Fall through to empty name
    }
  }

  return fromParts('', '');
}
