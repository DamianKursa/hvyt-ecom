// components/checkout/PaymentForm.tsx
// "use client";
import React from 'react';

import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe';
import { createPaymentIntent } from '@/lib/stripe';
// import { createWooCommerceOrder } from '@/app/actions/woocommerce';
import type { PaymentFormData } from '@/types/stripe';
import { Cart } from '@/stores/CartProvider';
import { getCurrencySlugByLocale } from '@/config/currencies';
import { useRouter } from 'next/router';
import { useI18n } from '@/utils/hooks/useI18n';

/**
 * Wrapper komponentu płatności - ładuje Stripe Elements
 */
export function PaymentFormWrapper({ 
  cart, 
  billingData,
  updateStripePaymentIntentId
}: { 
  cart: Cart | null; 
  billingData: PaymentFormData;
  updateStripePaymentIntentId: React.Dispatch<string | null>;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const currency = getCurrencySlugByLocale(router.locale as string)

   const { t } = useI18n();

  // Ładowanie Stripe.js (singleton)
  const stripePromise = getStripeClient();

  // Tworzenie Payment Intent przy montowaniu komponentu
  useEffect(() => {
    async function initPayment() {
      try {
        // Wywołanie Server Action do utworzenia Payment Intent
        const result = await createPaymentIntent(
          {
          amount: cart?.totalProductsPrice || 0,
          currency,
          metadata: {
            customer_email: billingData.email,
            customer_name: billingData.name,
          }
          }
        );

        if (result.success && result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else if (!result.success) {
          setError(result.error || t.stripePayment.errorInit);
        } else {
          setError(t.stripePayment.errorInit)
        }
      } catch (err) {
        setError(t.stripePayment.errorLoading);
        console.log('PaymentIntentError', err);
        
      }
    }

    initPayment();
  }, [cart, billingData]);

  // Wyświetlanie stanów ładowania i błędów
  if (error) {
    return (
      <div className="payment-error my-4">
        <p>❌ {error}</p>
        <button className="my-4 flex-1 py-2 px-4 text-[16px] font-normal rounded-full flex justify-center items-center transition-colors bg-black text-white hover:bg-dark-pastel-red" onClick={() => window.location.reload()}>
          {t.stripePayment.tryAgain}
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="payment-loading my-4">
        <p>⏳ {t.stripePayment.preparingForm}...</p>
      </div>
    );
  }

  // Opcje dla Stripe Elements
  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const, // 'stripe', 'night', 'flat'
      variables: {
        colorPrimary: '#0070f3',
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
    loader: 'auto' as const,
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <PaymentFormContent cart={cart} billingData={billingData} currency={currency} updateStripePaymentIntentId={updateStripePaymentIntentId} />
    </Elements>
  );
}

/**
 * Komponent formularza płatności - wewnątrz Stripe Elements Provider
 */
function PaymentFormContent({ 
  cart, 
  billingData, 
  currency,
  updateStripePaymentIntentId
}: { 
  cart: Cart | null; 
  billingData: PaymentFormData;
  currency: string;
  updateStripePaymentIntentId: React.Dispatch<string|null>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const { t } = useI18n();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Obsługa submitu formularza
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Sprawdzenie czy Stripe.js jest załadowane
    if (!stripe || !elements) {
      setErrorMessage(t.stripePayment.errorNotReady);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // KROK 1: Potwierdzenie płatności w Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Dane rozliczeniowe
          payment_method_data: {
            billing_details: {
              name: billingData.name,
              email: billingData.email,
              phone: billingData.phone,
              address: {
                line1: billingData.address.line1,
                line2: billingData.address.line2 || undefined,
                city: billingData.address.city,
                state: billingData.address.state || undefined,
                postal_code: billingData.address.postal_code,
                country: billingData.address.country,
              },
            },
          },
        },
        // NIE przekierowujemy automatycznie - obsługujemy sukces w kodzie
        redirect: 'if_required',
      });

      // Obsługa błędów Stripe
      if (stripeError) {
        setErrorMessage(
          stripeError.message || t.stripePayment.errorTryAgain
        );
        setIsProcessing(false);
        return;
      }

      // Sprawdzenie czy płatność się udała
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        updateStripePaymentIntentId(paymentIntent.id)
//   paymentIntent.id // Powiązanie z Payment Intent
        setPaymentSuccess(true);
          
          // KROK 3: Przekierowanie na stronę potwierdzenia
        //   window.location.href = `/checkout/success?order_id=${orderResult.orderId}&payment_intent=${paymentIntent.id}`;
      } else {
        updateStripePaymentIntentId(null);
        setErrorMessage(t.stripePayment.errorNeddsAuth);
      }
      
    } catch (err: any) {
      setErrorMessage(err.message || t.stripePayment.errorUnexpected);
    } finally {
      setIsProcessing(false);
    }
  };

  // Wyświetlanie sukcesu
  if (paymentSuccess) {
    return (
      <div className="payment-success my-4">
        <p><strong>✅ {t.stripePayment.paymentSuccess}</strong></p>
        <p>{t.stripePayment.redirecting}...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form mt-8">
      {/* Stripe Payment Element - obsługuje wszystkie metody płatności */}
      <PaymentElement 
        options={{
          layout: 'tabs', // 'tabs' lub 'accordion'
        }}
      />

      {/* Wyświetlanie błędów */}
      {errorMessage && (
        <div className="payment-error mt-2" role="alert">
          <p>❌ {errorMessage}</p>
        </div>
      )}

      {/* Przycisk płatności */}
      <div className="flex gap-8">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="payment-button my-4 flex-1 py-2 px-4 text-[16px] font-normal rounded-full flex justify-center items-center transition-colors bg-dark-pastel-red text-white hover:"
        >
          {isProcessing ? (
            <>⏳ {t.stripePayment.processing}...</>
          ) : (
            <>{t.stripePayment.pay}</>
          )}
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          onClick={()=>{updateStripePaymentIntentId(null)}}
          className="payment-button my-4 flex-1 py-2 px-4 text-[16px] font-normal rounded-full flex justify-center items-center transition-colors bg-black text-white"
        >{ t.common.cancel }
        </button>
      </div>


      {/* Informacja o bezpieczeństwie */}
      <p className="payment-secure-info text-[14px]">🔒 {t.stripePayment.paymentSecured}</p>
    </form>
  );
}