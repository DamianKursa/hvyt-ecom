import React, { useState } from 'react';

interface Color {
  name: string;
}

interface Size {
  name: string;
}

interface Product {
  name: string;
  salePrice?: string;
  regularPrice: string;
  price: string;
  description: string;
  allPaColors?: {
    nodes?: Color[];
  };
  allPaSizes?: {
    nodes?: Size[];
  };
}

interface SingleProductDetailsProps {
  product: Product;
}

const SingleProductDetails: React.FC<SingleProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const isOnSale = !!product.salePrice;

  return (
    <div className="product-details">
      <h1 className="text-4xl font-bold text-neutral-darkest">{product.name}</h1>

      {/* Price Section */}
      <div className="flex items-center space-x-4">
        {isOnSale ? (
          <>
            <span className="text-3xl font-bold text-dark-pastel-red">{product.salePrice} zł</span>
            <span className="text-xl line-through text-neutral-dark">{product.regularPrice} zł</span>
          </>
        ) : (
          <span className="text-3xl font-bold">{product.price} zł</span>
        )}
      </div>

      {/* Variations (Color/Size) */}
      {product.allPaColors?.nodes && product.allPaColors.nodes.length > 0 && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Kolor</label>
          <div className="flex space-x-2">
            {product.allPaColors.nodes.map((color) => (
              <button
                key={color.name}
                className={`px-4 py-2 rounded-full border ${
                  selectedColor === color.name ? 'border-black' : 'border-neutral-light'
                }`}
                onClick={() => setSelectedColor(color.name)}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.allPaSizes?.nodes && product.allPaSizes.nodes.length > 0 && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Rozmiar</label>
          <div className="flex space-x-2">
            {product.allPaSizes.nodes.map((size) => (
              <button
                key={size.name}
                className={`px-4 py-2 rounded-full border ${
                  selectedSize === size.name ? 'border-black' : 'border-neutral-light'
                }`}
                onClick={() => setSelectedSize(size.name)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="mt-6">
        <button className="w-full py-3 text-lg font-semibold text-white bg-black rounded-full">
          Dodaj do koszyka
        </button>
      </div>

      {/* Product Description */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Szczegóły produktu</h2>
        <p className="text-neutral-darkest">{product.description}</p>
      </div>
    </div>
  );
};

export default SingleProductDetails;
