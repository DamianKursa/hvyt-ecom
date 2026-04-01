import Stripe from 'stripe';

// Inicjalizacja klienta Stripe dla serwera
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Najnowsza wersja API Stripe w 2026
  typescript: true,
});
