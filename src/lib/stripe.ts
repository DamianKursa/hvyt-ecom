// lib/stripe.ts
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Funkcja pomocnicza do konwersji kwoty na najmniejszą jednostkę waluty
// Stripe wymaga kwot w groszach (cents), nie w dolarach/złotych
export function convertToStripeAmount(amount: number, currency: string = 'pln'): number {
  // Większość walut używa 2 miejsc po przecinku (grosze)
  // Wyjątki: JPY, KRW (bez miejsc po przecinku)
  const zeroDecimalCurrencies = ['jpy', 'krw', 'vnd', 'clp'];
  
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount);
  }
  
  return Math.round(amount * 100);
}

// lib/stripe-client.ts
// Zamiast importować Server Actions bezpośrednio, używaj tych funkcji w komponentach klienckich

type CreatePaymentIntentParams = {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
};

type CreatePaymentIntentResult =
  | { success: true; clientSecret: string | null; paymentIntentId: string }
  | { success: false; error: string };

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<CreatePaymentIntentResult> {
  const res = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  return res.json();
}

export async function getPaymentIntent(
  paymentIntentId: string
): Promise<{ success: boolean; paymentIntent?: any; error?: string }> {
  const res = await fetch(
    `/api/stripe/get-payment-intent?paymentIntentId=${encodeURIComponent(paymentIntentId)}`
  );

  return res.json();
}

export async function cancelPaymentIntent(
  paymentIntentId: string
): Promise<{ success: boolean; paymentIntent?: any; error?: string }> {
  const res = await fetch('/api/stripe/cancel-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  });

  return res.json();
}


// Singleton pattern - ładujemy Stripe.js tylko raz  
let stripePromise: Promise<StripeJS | null>;  
  
/**  
 * Pobiera instancję Stripe.js dla przeglądarki  
 * Używa klucza publicznego (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)  
 */  
export function getStripeClient() {  
  if (!stripePromise) {  
    stripePromise = loadStripe(  
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string  
    );  
  }  
  return stripePromise;  
}