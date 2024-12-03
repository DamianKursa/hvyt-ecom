import React, { useState, useEffect } from 'react';
import {
  searchProducts,
  fetchLatestKolekcja,
} from '../../utils/api/woocommerce';
import Link from 'next/link';
import Image from 'next/image';

const SearchComponent = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [latestKolekcja, setLatestKolekcja] = useState<any>(null);

  useEffect(() => {
    // Fetch the latest Kolekcja when the component mounts
    const fetchData = async () => {
      try {
        const latestCollection = await fetchLatestKolekcja();
        setLatestKolekcja(latestCollection);
      } catch (error) {
        console.error('Error fetching the latest Kolekcja:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]); // Clear results if query is too short
      return;
    }

    setLoading(true);
    try {
      const products = await searchProducts(value);
      setResults(products); // Set search results
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[800px]">
        <div className="flex items-center justify-between pb-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Wyszukaj"
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />
          <button onClick={onClose} className="text-gray-500 text-2xl ml-4">
            ×
          </button>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="mt-6 text-center">Wyszukuje...</div>
        ) : results.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Wyniki wyszukiwania</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((product) => (
                <Link
                  href={`/produkt/${product.slug}`}
                  key={product.id}
                  passHref
                >
                  <div
                    className="flex flex-col items-start text-start cursor-pointer"
                    onClick={onClose} // Close the modal when clicking on a product
                  >
                    <div className="w-[140px] h-[140px] bg-gray-200 rounded-lg mb-2">
                      <Image
                        height={140}
                        width={140}
                        src={product.images[0]?.src}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm font-medium">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          query.length >= 3 && (
            <div className="mt-6 text-center text-black text-regular">
              <p>
                Niestety nie znaleziono żadnych wyników dla &quot;{query}&quot;.
              </p>
              <p>
                Spróbuj ponownie używając innej pisowni lub słów kluczowych.
              </p>
            </div>
          )
        )}

        {/* Static Sections in One Row */}
        <div className="mt-6 flex w-full">
          {/* Najczęściej wyszukiwane Section - 70% width */}
          {/*<div className="w-7/10 pr-4">
            <h3 className="text-sm font-semibold mb-2">
              Najczęściej wyszukiwane
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularSearches.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-[140px] h-[140px] bg-gray-200 rounded-lg mb-2">
                    <Image
                      src={item.images[0]?.src}
                      alt={item.name}
                      height={140}
                      width={140}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm font-medium">{item.name}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Co nowego Section - 30% width */}
          <div className="w-3/10">
            <h3 className="text-sm font-semibold mb-2">Co nowego?</h3>
            {latestKolekcja && (
              <Link href={`/kolekcje/${latestKolekcja.slug}`} passHref>
                <div
                  className="flex flex-col items-start text-start cursor-pointer"
                  onClick={onClose} // Close the modal when clicking on the latest Kolekcja
                >
                  <div className="w-[140px] h-[140px] bg-gray-200 rounded-lg mb-2">
                    <Image
                      height={140}
                      width={140}
                      src={latestKolekcja.imageUrl}
                      alt={latestKolekcja.title.rendered}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm font-medium">
                    {latestKolekcja.title.rendered}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
