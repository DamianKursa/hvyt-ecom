import React, { useEffect, useState } from 'react';
import { useI18n } from '@/utils/hooks/useI18n';
import { ShippingMethod } from '@/types/checkout';
import { isPolandCountryCode } from '@/utils/countryCode';

interface PaymentProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  shippingMethod: ShippingMethod;
  deliveryCountryCode: string;
}

interface PaymentMethod {
  id: string;
  title: string;
  enabled: boolean;
}

const COD_METHOD_ID = 'cod';
const STRIPE_METHOD_ID = 'stripe';
const ONLINE_TRANSFER_METHOD_IDS = [
  'pay_by_paynow_pl_pbl',
  'przelewy24',
  'p24-online-payments',
] as const;

const pickOnlineTransferMethod = (
  methods: PaymentMethod[],
): PaymentMethod | undefined =>
  methods.find((method) =>
    ONLINE_TRANSFER_METHOD_IDS.includes(
      method.id as (typeof ONLINE_TRANSFER_METHOD_IDS)[number],
    ),
  );

const Payment: React.FC<PaymentProps> = ({
  paymentMethod,
  setPaymentMethod,
  shippingMethod,
  deliveryCountryCode,
}) => {
  const { t, language } = useI18n();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Shipping method mapping (adjust if needed)
  // const shippingMethodMapping: Record<string, string> = {
  //   '1': 'kurier_gls',
  //   '3': 'kurier_gls_pobranie',
  //   '13': 'paczkomaty_inpost',
  //   '11': 'kurier_gls_zagranica',
  //   kurier_gls_pobranie: 'kurier_gls_pobranie', // For safety
  // };

  // Fetch payment methods on component mount, with auto-retry if error occurs
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/payment?lang=${language}`);
        if (!response.ok) {
          throw new Error(t.checkout.payment.errorLoading);
        }
        const data = await response.json();
        
        setPaymentMethods(data);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError(t.checkout.payment.retryMessage);
        setTimeout(() => {
          fetchPaymentMethods();
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [language, t]);

  const getShippingTitle = () =>
    Object.keys(shippingMethod).length !== 0
      ? shippingMethod.title.toLowerCase()
      : '';

  const resolveDefaultPaymentMethodId = (): string | null => {
    const shippingTitle = getShippingTitle();
    if (!shippingTitle) return null;

    if (shippingTitle === 'kurier gls pobranie') {
      return COD_METHOD_ID;
    }

    if (language === 'en') {
      return STRIPE_METHOD_ID;
    }

    if (!isPolandCountryCode(deliveryCountryCode)) {
      return pickOnlineTransferMethod(paymentMethods)?.id ?? 'pay_by_paynow_pl_pbl';
    }

    return 'pay_by_paynow_pl_pbl';
  };

  const getFilteredPaymentMethods = () => {
    const shippingTitle = getShippingTitle();
    if (shippingTitle === '') {
      return [] as PaymentMethod[];
    }

    if (shippingTitle === 'kurier gls pobranie') {
      return paymentMethods.filter((method) => method.id === COD_METHOD_ID);
    }

    if (language === 'en') {
      return paymentMethods.filter((method) => method.id === STRIPE_METHOD_ID);
    }

    if (!isPolandCountryCode(deliveryCountryCode)) {
      const onlineTransfer = pickOnlineTransferMethod(paymentMethods);
      return onlineTransfer ? [onlineTransfer] : [];
    }

    return paymentMethods.filter((method) => method.id === 'pay_by_paynow_pl_pbl');
  };

  const availableMethods = getFilteredPaymentMethods();

  useEffect(() => {
    const defaultMethodId = resolveDefaultPaymentMethodId();
    if (defaultMethodId) {
      setPaymentMethod(defaultMethodId);
    }
  }, [shippingMethod, deliveryCountryCode, language, paymentMethods, setPaymentMethod]);

  if (loading) {
    return <p>{t.checkout.payment.loading}</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-[20px] font-bold mb-6 text-neutral-darkest">
        {t.checkout.payment.title}
      </h2>
      {availableMethods.length > 0 ? (
        <div>
          {availableMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center py-[16px] border-b ${paymentMethod === method.id
                  ? 'border-dark-pastel-red'
                  : 'border-beige-dark'
                }`}
            >
              <input
                type="radio"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
                className="hidden"
              />
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full ${paymentMethod === method.id
                    ? 'border-4 border-dark-pastel-red'
                    : 'border-2 border-gray-400'
                  }`}
              ></span>
              <span className="ml-2">{method.title}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-red-500 mt-4">
          {t.checkout.payment.noMethods}
        </p>
      )}
    </div>
  );
};

export default Payment;