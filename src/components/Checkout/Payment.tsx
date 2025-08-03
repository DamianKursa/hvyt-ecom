import React, { useEffect, useState } from 'react';

interface PaymentProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  shippingMethod: string; // Pass the shipping method to filter payment methods
}

interface PaymentMethod {
  id: string;
  title: string;
  enabled: boolean;
}

const Payment: React.FC<PaymentProps> = ({
  paymentMethod,
  setPaymentMethod,
  shippingMethod,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Icon paths for payment methods
  const paymentIcons: Record<string, string> = {
    pay_by_paynow_pl_pbl: '/icons/paynow.png',
    faktura_proforma: '/icons/download-single.svg', // new icon
    bacs: '/icons/download-single.svg',             // WooCommerce bank-transfer alias
    cod: '/icons/wallet.svg',
  };
  // Shipping method mapping (adjust if needed)
  const shippingMethodMapping: Record<string, string> = {
    '1': 'kurier_gls',
    '3': 'kurier_gls_pobranie',
    '13': 'paczkomaty_inpost',
    kurier_gls_pobranie: 'kurier_gls_pobranie', // For safety
  };

  // Fetch payment methods on component mount, with auto-retry if error occurs
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/payment');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać metod płatności');
        }
        const data = await response.json();
        setPaymentMethods(data);
      } catch (err) {
        console.error('Błąd podczas pobierania metod płatności:', err);
        setError(
          'Wystąpił błąd podczas pobierania metod płatności. Ponowna próba za 5 sekund.',
        );
        setTimeout(() => {
          fetchPaymentMethods();
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Filter payment methods based on the selected shipping method
  const getFilteredPaymentMethods = () => {
    const mappedShippingMethod =
      shippingMethodMapping[shippingMethod] || shippingMethod;

    // For "Kurier GLS Pobranie" return only the COD option
    if (mappedShippingMethod === 'kurier_gls_pobranie') {
      return paymentMethods.filter((method) => method.id === 'cod');
    }

    // Otherwise, allow both PayNow and Faktura Proforma
    return paymentMethods.filter(
      (method) =>
        method.id === 'pay_by_paynow_pl_pbl' ||
        method.id === 'faktura_proforma' ||
        method.id === 'bacs', // Faktura Proforma (Przelew bankowy)
    );
  };

  const availableMethods = getFilteredPaymentMethods();

  // Set the default payment method based on the mapped shipping method
  useEffect(() => {
    const mappedShippingMethod =
      shippingMethodMapping[shippingMethod] || shippingMethod;
    if (mappedShippingMethod === 'kurier_gls_pobranie') {
      setPaymentMethod('cod');
    } else {
      setPaymentMethod('pay_by_paynow_pl_pbl');
    }
  }, [shippingMethod, setPaymentMethod]);

  if (loading) {
    return <p>Ładowanie metod płatności...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-[20px] font-bold mb-6 text-neutral-darkest">
        Wybierz sposób płatności
      </h2>
      {availableMethods.length > 0 ? (
        <div>
          {availableMethods.map((method) => (
            <label
              key={method.id}
              className={`grid grid-cols-[60%_20%_20%] sm:grid-cols-3 items-center py-[16px] border-b ${paymentMethod === method.id
                ? 'border-dark-pastel-red'
                : 'border-beige-dark'
                }`}
            >
              {/* Radio button and title */}
              <div className="flex items-center">
                <input
                  type="radio"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full ${paymentMethod === method.id
                    ? 'border-4 border-dark-pastel-red'
                    : 'border-2 border-gray-400'
                    }`}
                />
                <span className="ml-2 truncate">{method.title}</span>
              </div>

              {/* Placeholder column for cost (to match shipping grid) */}
              <div className="w-full"></div>

              {/* Payment method icon */}
              <div className="flex items-center justify-center w-full">
                <img
                  src={paymentIcons[method.id] || '/icons/default.svg'}
                  alt={`${method.title} icon`}
                  className="sm:w-[55px] h-8 "
                />
              </div>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-red-500 mt-4">
          Brak dostępnych metod płatności dla wybranej metody dostawy.
        </p>
      )}
    </div>
  );
};

export default Payment;
