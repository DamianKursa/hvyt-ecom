import type Stripe from 'stripe';

/**
 * Metody włączane w konfiguracji Stripe (dynamiczne metody Payment Element).
 * Cartes Bancaires nie jest osobnym `payment_method_type` — Stripe udostępnia je
 * jako metodę w konfiguracji płatności. iDEAL, Klarna i PayPal są metodami Stripe.
 */
const STRIPE_CHECKOUT_METHODS = ['ideal', 'klarna', 'paypal', 'cartes_bancaires'] as const;

type StripeCheckoutMethod = (typeof STRIPE_CHECKOUT_METHODS)[number];

let activationPromise: Promise<void> | null = null;

function isAlreadyOn(
  config: Stripe.PaymentMethodConfiguration,
  method: StripeCheckoutMethod,
): boolean {
  const preference = config[method]?.display_preference;
  return preference?.preference === 'on' || preference?.value === 'on';
}

function enableParams(
  method: StripeCheckoutMethod,
): Stripe.PaymentMethodConfigurationUpdateParams {
  const display_preference = { preference: 'on' as const };

  switch (method) {
    case 'ideal':
      return { ideal: { display_preference } };
    case 'klarna':
      return { klarna: { display_preference } };
    case 'paypal':
      return { paypal: { display_preference } };
    case 'cartes_bancaires':
      return { cartes_bancaires: { display_preference } };
  }
}

async function enableOnDefaultConfiguration(stripe: Stripe): Promise<void> {
  const list = await stripe.paymentMethodConfigurations.list({ limit: 100 });
  const defaults = list.data.filter((config) => config.is_default);

  if (defaults.length === 0) {
    console.error('Brak domyślnej konfiguracji metod płatności Stripe.');
    return;
  }

  await Promise.all(
    defaults.flatMap((config) =>
      STRIPE_CHECKOUT_METHODS.filter((method) => !isAlreadyOn(config, method)).map(
        async (method) => {
          try {
            await stripe.paymentMethodConfigurations.update(config.id, enableParams(method));
          } catch (error) {
            console.error(
              `Metoda płatności Stripe „${method}” nie została włączona w module Stripe.`,
              error,
            );
          }
        },
      ),
    ),
  );
}

/** Włącza iDEAL, Klarna, PayPal i Cartes Bancaires w domyślnej konfiguracji Stripe. */
export async function activateStripeCheckoutPaymentMethods(stripe: Stripe): Promise<void> {
  try {
    if (!activationPromise) {
      activationPromise = enableOnDefaultConfiguration(stripe);
    }
    await activationPromise;
  } catch (error) {
    activationPromise = null;
    console.error('Nie udało się zaktualizować metod płatności Stripe:', error);
  }
}
