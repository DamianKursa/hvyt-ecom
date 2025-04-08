import React, { useContext, useState } from 'react';
import { CartContext, Product as CartProduct } from '@/stores/CartProvider';
import { Product } from '@/utils/functions/interfaces';
import Snackbar from '../UI/Snackbar.component';

interface BoughtProductsListProps {
  products: Product[];
}

const BoughtProductsList: React.FC<BoughtProductsListProps> = ({
  products,
}) => {
  const { addCartItem } = useContext(CartContext);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    const price = parseFloat(product.price);
    const productId = parseInt(product.id.toString(), 10);

    if (isNaN(price) || isNaN(productId)) {
      console.error('Invalid product data:', product);
      return;
    }

    const cartItem: CartProduct = {
      cartKey: `purchased-${productId}`,
      name: product.name,
      qty: 1,
      price,
      totalPrice: price,
      image: product.image || '/placeholder.jpg',
      productId,
      slug: product.slug,
    };

    addCartItem(cartItem);

    setSnackbarMessage(`Dodano "${product.name}" do koszyka.`);
    setTimeout(() => setSnackbarMessage(null), 3000);
  };

  // MOBILE CARD LAYOUT
  const renderMobileCard = (product: Product) => {
    return (
      <div
        key={product.id}
        className="mb-6 border-b border-gray-200 last:border-b-0"
      >
        {/* Product Info Row */}
        <div className="flex items-center py-2">
          <div className="w-[80px] h-[80px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mr-4">
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[16px] mb-1">{product.name}</p>
            {/* If product has attributes, display them here */}
            {product.attributes &&
              Array.isArray(product.attributes) &&
              product.attributes.map((attr) => (
                <p key={attr.name} className="text-sm text-gray-500">
                  {attr.name}: {attr.options?.join(', ')}
                </p>
              ))}
          </div>
        </div>

        {/* Ostatni zakup */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Ostatni zakup:</span>
          <span className="text-black">{new Date().toLocaleDateString()}</span>
        </div>

        {/* Aktualna cena */}
        <div className="flex items-center justify-between  mb-2">
          <span className="text-gray-700">Aktualna cena:</span>
          <span className="text-black font-medium">{product.price} zł</span>
        </div>

        {/* Add to Cart Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-transparent border border-gray-400 rounded-full py-2 mt-4 px-4 flex items-center hover:bg-gray-100 transition text-black"
          >
            Dodaj do koszyka
            <span className="ml-2 flex items-center">
              <img
                src="/icons/cart.svg"
                alt="Koszyk"
                className="w-4 h-4 object-contain"
              />
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block rounded-[25px] overflow-hidden border border-gray-200">
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
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-transparent border border-gray-400 rounded-full py-2 px-2 flex items-center hover:bg-gray-100 transition"
                  >
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

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden">
        {products.map((product) => renderMobileCard(product))}
      </div>

      {/* Snackbar Notification */}
      {snackbarMessage && (
        <Snackbar message={snackbarMessage} type="success" visible={true} />
      )}
    </>
  );
};

export default BoughtProductsList;
