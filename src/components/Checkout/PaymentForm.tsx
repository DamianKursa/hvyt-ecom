// components/checkout/PaymentForm.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { getStripeClient, createPaymentIntent, getStripeLocale } from '@/lib/stripe';
import type { PaymentFormData, StripePaymentFormHandle } from '@/types/stripe';
import { Cart } from '@/stores/CartProvider';
import { getCurrencySlugByLocale } from '@/config/currencies';
import { useRouter } from 'next/router';
import { useI18n } from '@/utils/hooks/useI18n';

interface PaymentFormWrapperProps {
  cart: Cart | null;
  shippingPrice: number;
  billingData: PaymentFormData;
}

/**
 * Wrapper komponentu płatności - ładuje Stripe Elements po wyborze karty.
 */
export const PaymentFormWrapper = forwardRef<StripePaymentFormHandle, PaymentFormWrapperProps>(
  function PaymentFormWrapper({ cart, shippingPrice, billingData }, ref) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const currency = getCurrencySlugByLocale(router.locale as string);
    const stripeLocale = getStripeLocale(router.locale);
    const { t } = useI18n();
    const stripePromise = getStripeClient();

    useEffect(() => {
      async function initPayment() {
        try {
          const result = await createPaymentIntent({
            amount: (cart?.totalProductsPrice || 0) + shippingPrice,
            currency,
            metadata: {
              customer_email: billingData.email,
              customer_name: billingData.name,
            },
          });

          if (result.success && result.clientSecret) {
            setClientSecret(result.clientSecret);
            setError(null);
          } else if (!result.success) {
            setError(result.error || t.stripePayment.errorInit);
          } else {
            setError(t.stripePayment.errorInit);
          }
        } catch (err) {
          setError(t.stripePayment.errorLoading);
          console.log('PaymentIntentError', err);
        }
      }

      initPayment();
    }, [cart, billingData, shippingPrice, currency, t]);

    if (error) {
      return (
        <div className="payment-error my-4">
          <p>❌ {error}</p>
          <button
            className="my-4 flex-1 py-2 px-4 text-[16px] font-normal rounded-full flex justify-center items-center transition-colors bg-black text-white hover:bg-dark-pastel-red"
            onClick={() => window.location.reload()}
          >
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

    const elementsOptions = {
      clientSecret,
      locale: stripeLocale,
      appearance: {
        theme: 'stripe' as const,
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
      <Elements key={stripeLocale} stripe={stripePromise} options={elementsOptions}>
        <PaymentFormContent
          ref={ref}
          billingData={billingData}
        />
      </Elements>
    );
  },
);

interface PaymentFormContentProps {
  billingData: PaymentFormData;
}

const PaymentFormContent = forwardRef<StripePaymentFormHandle, PaymentFormContentProps>(
  function PaymentFormContent({ billingData }, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useI18n();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        confirmPayment: async () => {
          if (!stripe || !elements) {
            setErrorMessage(t.stripePayment.errorNotReady);
            return null;
          }

          setErrorMessage(null);

          try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
              elements,
              confirmParams: {
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
              redirect: 'if_required',
            });

            if (stripeError) {
              setErrorMessage(stripeError.message || t.stripePayment.errorTryAgain);
              return null;
            }

            if (paymentIntent?.status === 'succeeded') {
              return paymentIntent.id;
            }

            setErrorMessage(t.stripePayment.errorNeddsAuth);
            return null;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t.stripePayment.errorUnexpected;
            setErrorMessage(message);
            return null;
          }
        },
      }),
      [stripe, elements, billingData, t],
    );

    return (
      <div className="stripe-payment-form mt-8">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        {errorMessage && (
          <div className="payment-error mt-2" role="alert">
            <p>❌ {errorMessage}</p>
          </div>
        )}

        <p className="payment-secure-info text-[14px] mt-4">
          🔒 {t.stripePayment.paymentSecured}
        </p>
      </div>
    );
  },
);
