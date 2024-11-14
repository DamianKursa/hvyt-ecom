import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface CartModalProps {
  product: {
    name: string;
    image: string;
    price: string;
  };
  quantity: number;
  total: string;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  product,
  quantity,
  total,
  onClose,
}) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-4 right-4 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Twój koszyk</h2>
        <div className="flex items-center mb-6">
          <Image
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="rounded-md"
          />
          <div className="ml-4">
            <p>{product.name} został dodany do koszyka</p>
          </div>
        </div>
        <p className="flex items-center text-lg mb-6">
          <span className="mr-2">&#128717;</span> Suma produktów w koszyku:{' '}
          <strong className="ml-2">{total} zł</strong>
        </p>
        <div className="flex space-x-4">
          <button onClick={onClose} className="w-1/2 py-2 border rounded-lg">
            Kontynuuj zakupy
          </button>
          <button
            onClick={() => router.push('/koszyk')}
            className="w-1/2 py-2 bg-black text-white rounded-lg"
          >
            Przejdź do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
