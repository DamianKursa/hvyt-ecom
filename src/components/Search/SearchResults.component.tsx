import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SearchComponent = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestKolekcja, setLatestKolekcja] = useState<any>(null);
  // Track if a search has been attempted (to conditionally show "no results" message)
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/woocommerce?action=fetchLatestKolekcja');
        if (!res.ok) {
          throw new Error('Failed to fetch latest Kolekcja');
        }
        const latest = await res.json();
        setLatestKolekcja(latest);
      } catch (error) {
        console.error('Error fetching the latest Kolekcja:', error);
      }
    };
    fetchLatest();
  }, []);

  // This function is only triggered when the user clicks the "Szukaj" button
  const handleSearchSubmit = async () => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    setHasSearched(true);

    // Normalize the query: lowercase and remove diacritics
    const normalizedQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    try {
      const res = await fetch(
        `/api/woocommerce?action=searchProducts&query=${encodeURIComponent(normalizedQuery)}`,
      );
      if (!res.ok) {
        throw new Error('Error fetching search results');
      }
      const products = await res.json();
      setResults(products);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Do NOT trigger search here.
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[800px] max-h-[80vh] flex flex-col">
        {/* Header (fixed) */}
        <div className="flex items-center justify-between pb-2 mb-4 flex-shrink-0">
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

        {/* Search Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-dark transition-colors"
          >
            Szukaj
          </button>
        </div>

        {/* Content area (scrollable) */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="mt-6 text-center">Wyszukuje...</div>
          ) : results.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">
                Wyniki wyszukiwania
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((product) => (
                  <Link
                    href={`/produkt/${product.slug}`}
                    key={product.id}
                    passHref
                  >
                    <div
                      className="flex flex-col items-start text-start cursor-pointer"
                      onClick={onClose}
                    >
                      <div className="w-[140px] h-[140px] bg-gray-200 rounded-lg mb-2">
                        <Image
                          height={140}
                          width={140}
                          src={product.images?.[0]?.src}
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
            // Only show "no results" if a search has been attempted and query length >= 3
            hasSearched &&
            query.length >= 3 && (
              <div className="mt-6 text-center text-black text-regular">
                <p>
                  Niestety nie znaleziono żadnych wyników dla &quot;{query}
                  &quot;.
                </p>
                <p>
                  Spróbuj ponownie używając innej pisowni lub słów kluczowych.
                </p>
              </div>
            )
          )}

          {/* Static Section */}
          <div className="mt-6 flex w-full">
            <div className="w-3/10">
              <h3 className="text-sm font-semibold mb-2">Co nowego?</h3>
              {latestKolekcja && (
                <Link href={`/kolekcje/${latestKolekcja.slug}`} passHref>
                  <div
                    className="flex flex-col items-start text-start cursor-pointer"
                    onClick={onClose}
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
    </div>
  );
};

export default SearchComponent;
