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

  // Shipping method mapping
  const shippingMethodMapping: Record<string, string> = {
    '1': 'kurier_gls',
    '3': 'kurier_gls_pobranie', // Match this to the value for Kurier GLS Pobranie
    '13': 'paczkomaty_inpost',
    kurier_gls_pobranie: 'kurier_gls_pobranie', // Include full mapping for safety
  };

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/payment');
        const data = await response.json();
        setPaymentMethods(data);
      } catch (err) {
        setError((err as Error).message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Filter payment methods based on the selected shipping method
  const getFilteredPaymentMethods = () => {
    const mappedShippingMethod = shippingMethodMapping[shippingMethod];

    if (mappedShippingMethod === 'kurier_gls_pobranie') {
      return paymentMethods.filter((method) => method.id === 'cod'); // "Za pobraniem"
    }

    return paymentMethods.filter((method) => method.id === 'przelewy24');
  };

  const availableMethods = getFilteredPaymentMethods();

  // Automatically adjust the selected payment method
  useEffect(() => {
    if (shippingMethod === 'paczkomaty_inpost') {
      setPaymentMethod('przelewy24');
    } else if (shippingMethod === 'kurier_gls_pobranie') {
      setPaymentMethod('cod');
    } else {
      setPaymentMethod('przelewy24');
    }
  }, [shippingMethod, setPaymentMethod]);

  if (loading) {
    return <p>Loading payment methods...</p>;
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
          No payment methods available for the selected shipping method.
        </p>
      )}
    </div>
  );
};

export default Payment;
