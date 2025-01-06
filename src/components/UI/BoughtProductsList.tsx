import React from 'react';
import { Product } from '@/utils/functions/interfaces';

interface BoughtProductsListProps {
  products: Product[];
}

const BoughtProductsList: React.FC<BoughtProductsListProps> = ({
  products,
}) => {
  return (
    <div className="rounded-[25px] overflow-hidden border border-gray-200">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-beige">
          <tr>
            <th className="py-4 px-6 text-left font-semibold text-neutral-darker">
              Produkt
            </th>
            <th className="py-4 px-6 text-center font-semibold text-neutral-darker">
              Ostatni zakup
            </th>
            <th className="py-4 px-6 text-center font-semibold text-neutral-darker">
              Aktualna cena
            </th>
            <th className="py-4 px-6 text-center font-semibold text-neutral-darker"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="py-4 px-6 flex items-center gap-4">
                {/* Image Container with Cover Behavior */}
                <div className="w-[120px] h-[120px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.attributes &&
                    Array.isArray(product.attributes) &&
                    product.attributes.map((attr) => (
                      <p key={attr.name} className="text-sm text-gray-500">
                        {attr.name}: {attr.options?.join(', ')}
                      </p>
                    ))}
                </div>
              </td>
              <td className="py-4 text-center align-middle">
                {new Date().toLocaleDateString()}
              </td>
              <td className="py-4 text-center align-middle">
                <p>{product.price} zł</p>
              </td>
              <td className="py-4 px-6 text-center align-middle">
                <button className="bg-transparent border border-gray-400 rounded-full py-2 px-4 flex items-center hover:bg-gray-100">
                  Dodaj do koszyka
                  <span className="ml-2 flex items-center">
                    <img
                      src="/icons/cart.svg"
                      alt="Koszyk"
                      className="w-4 h-4 object-contain"
                    />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoughtProductsList;
