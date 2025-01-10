import React, { useEffect, useState } from 'react';

interface PaymentProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

interface PaymentMethod {
  id: string;
  title: string;
  enabled: boolean;
}

const Payment: React.FC<PaymentProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/payment');
        if (!response.ok) {
          throw new Error('Failed to fetch payment methods');
        }
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
      <div>
        {paymentMethods.map((method) => (
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
    </div>
  );
};

export default Payment;
