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

    // Otherwise, return only the PayNow method
    return paymentMethods.filter(
      (method) => method.id === 'pay_by_paynow_pl_pbl',
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
              className={`flex items-center py-[16px] border-b ${
                paymentMethod === method.id
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
                className={`w-5 h-5 rounded-full ${
                  paymentMethod === method.id
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
          Brak dostępnych metod płatności dla wybranej metody dostawy.
        </p>
      )}
    </div>
  );
};

export default Payment;
