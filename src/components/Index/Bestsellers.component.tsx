import { useState, useEffect } from 'react';
import ProductPreview from '../Product/ProductPreview.component';
import { fetchProductsByCategoryId } from '../../utils/api/woocommerce'; // Assuming you want to fetch by category

interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: { src: string };
}

const fallbackBestsellers: Product[] = [
  {
    id: '1',
    slug: 'uchwyt-industrialny-zloty-1',
    name: 'UCHWYT INDUSTRIALNY ZŁOTY',
    price: '15,90',
    image: { src: 'https://via.placeholder.com/300' },
  },
  {
    id: '2',
    slug: 'uchwyt-industrialny-zloty-2',
    name: 'UCHWYT INDUSTRIALNY ZŁOTY',
    price: '15,90',
    image: { src: 'https://via.placeholder.com/300' },
  },
  // Add more fallback products as needed...
];

const Bestsellers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3.8; // Number of slides visible at once
  const gutter = 24; // Gutter size between the slides
  const [products, setProducts] = useState<Product[]>(fallbackBestsellers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const categoryId = 123; // Replace with your Bestsellers category ID
        const fetchedProducts = await fetchProductsByCategoryId(categoryId);
        const formattedProducts = fetchedProducts.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: { src: product.images[0]?.src || '/placeholder.jpg' },
        }));
        setProducts(formattedProducts.slice(0, 12)); // Limit to 12 products
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Bestsellers:', error);
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const totalItems = products.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalItems - itemsPerPage));
    }
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
          <button
            onClick={handlePrev}
            className={`p-3 rounded-full shadow-lg ${canGoPrev ? 'bg-black text-white' : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'}`}
            disabled={!canGoPrev}
          >
            <img src="/icons/arrow-left.svg" alt="Previous" className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className={`p-3 rounded-full shadow-lg ${canGoNext ? 'bg-black text-white' : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'}`}
            disabled={!canGoNext}
          >
            <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Product Slider */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${(currentIndex % totalItems) * (100 / itemsPerPage)}%)`,
              gap: `${gutter}px`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none"
                style={{
                  width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                  transition: 'all 0.3s ease',
                }}
              >
                <ProductPreview product={{ ...product, images: [{ src: product.image.src }] }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Bestsellers;
