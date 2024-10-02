import { useState } from 'react';
import { useQuery } from '@apollo/client';
import ProductPreview from '../Product/ProductPreview.component';
import { FETCH_PRODUCTS_WITH_PRICE_AND_IMAGE } from '../../utils/gql/GQL_QUERIES';

const fallbackBestsellers = [
  // Fallback products (same as before, using static data)
  {
    id: 1,
    title: 'UCHWYT INDUSTRIALNY ZŁOTY',
    price: '15,90',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    title: 'UCHWYT INDUSTRIALNY ZŁOTY',
    price: '15,90',
    image: 'https://via.placeholder.com/300',
  },
  // Add more fallback products as needed...
];

const KupowaneRazem = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3.8; // 3.8 slides visible
  const gutter = 24; // Gutter size between the slides

  // Fetch the products from WooCommerce using GraphQL
  const { loading, error, data } = useQuery(FETCH_PRODUCTS_WITH_PRICE_AND_IMAGE);

  const products = data?.products?.nodes || fallbackBestsellers; // Use fallback if data is unavailable
  const totalItems = products.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  return (
    <section className="container mx-auto max-w-grid-desktop py-16">
      <div className="flex justify-between mb-[40px]">
        <div className="flex flex-col h-full">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">Bestsellers</h2>
          <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
            Poznaj nasze najpopularniejsze modele.
          </p>
        </div>

        {/* Custom Navigation */}
        <div className="flex items-center space-x-4">
          <button onClick={handlePrev} className="p-3 bg-neutral-lighter rounded-full shadow-lg">
            <img src="/icons/arrow-left.svg" alt="Previous" className="h-6 w-6" />
          </button>
          <button onClick={handleNext} className="p-3 bg-neutral-lighter rounded-full shadow-lg">
            <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Custom Slider */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${(currentIndex % totalItems) * (100 / itemsPerPage)}%)`,
            gap: `${gutter}px`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.slug || index} // Fallback for key
              className="flex-none"
              style={{
                width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                transition: 'all 0.3s ease',
              }}
            >
              <ProductPreview product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KupowaneRazem;
