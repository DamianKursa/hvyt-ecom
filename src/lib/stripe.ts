// Stripe wymaga kwot w najmniejszej jednostce waluty (np. centy).
const ZERO_DECIMAL_CURRENCIES = ['jpy', 'krw', 'vnd', 'clp'];

export function convertToStripeAmount(amount: number, currency: string = 'eur'): number {
  if (ZERO_DECIMAL_CURRENCIES.includes(currency.toLowerCase())) {
    return Math.round(amount);
  }

  return Math.round(amount * 100);
}

export function minimumStripeAmount(currency: string): number {
  const code = currency.toLowerCase();
  if (code === 'usd' || code === 'eur') return 50;
  return 100;
}
