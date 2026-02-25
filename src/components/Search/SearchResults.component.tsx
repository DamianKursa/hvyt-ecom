import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/utils/hooks/useI18n';
import { getCurrentLanguage } from '@/utils/i18n/config';
import { useRouter } from 'next/router';

const SearchComponent = ({ onClose }: { onClose: () => void }) => {
  const { t, getPath } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestKolekcja, setLatestKolekcja] = useState<any>(null);
  const [topClicked, setTopClicked] = useState<any[]>([]);
  useEffect(() => {
    async function fetchTop() {
      try {
        const base = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wp.hvyt.pl';
        const res = await fetch(`${base}/wp-json/hvyt/v1/top-clicked-products`);
        if (res.ok) {
          const data = await res.json();
          setTopClicked(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Failed to load top clicked products', e);
      }
    }
    fetchTop();
  }, []);
  const [hasSearched, setHasSearched] = useState(false);

  const logSearchClick = (productId: number) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wp.hvyt.pl'}/wp-json/hvyt/v1/log-search-click`;
      const payload = JSON.stringify({ productId });
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const blob = new Blob([payload], { type: 'application/json' });
        (navigator as any).sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          // helps the request survive page navigation in some browsers
          // @ts-ignore
          keepalive: true,
        }).catch(() => { });
      }
    } catch {
      // no-op
    }
  };
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

  const handleSearchSubmit = async () => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    setHasSearched(true);

    const normalizedQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    try {
      const res = await fetch(
        `/api/woocommerce?action=searchProducts&query=${encodeURIComponent(normalizedQuery)}&lang=${router.locale}`,
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
            placeholder={t.search.placeholder}
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />
          <button onClick={onClose} className="text-gray-500 text-2xl ml-4">
            ×
          </button>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-dark transition-colors"
          >
            {t.search.search}
          </button>
        </div>

        {/* Content area (scrollable) */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="mt-6 text-center">{t.modal.loading}</div>
          ) : results.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">
                {t.search.searchResults}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((product) => (
                  <Link
                    href={`${getPath('/produkt')}/${product.slug}`}
                    key={product.id}
                    passHref
                  >
                    <div
                      className="flex flex-col items-start text-start cursor-pointer"
                      onClick={() => {
                        logSearchClick(product.id);
                        onClose();
                      }}
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
              <div className="text-left text-black text-regular">
                <p>
                  {t.search.noResults} &quot;{query}&quot;.
                </p>
                <p>
                  {t.search.noResultsDetails}
                </p>
              </div>
            )
          )}

          {/* Static Section */}
          <div className="mt-6 flex w-full gap-6">
            {/* Top clicked products (before Kolekcje), same card style */}
            {topClicked && topClicked.length > 0 && (
              <div className="w-3/10">
                <h3 className="text-sm font-semibold mb-2">{t.search.mostSearched}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {topClicked.slice(0, 3).map((p) => (
                    <Link href={`${getPath('/produkt')}/${p.slug}`} key={p.id} passHref>
                      <div
                        className="flex flex-col items-start text-start cursor-pointer"
                        onClick={() => {
                          logSearchClick(p.id);
                          onClose();
                        }}
                      >
                        <div className="w-[140px] h-[140px] bg-gray-200 rounded-lg mb-2">
                          <Image
                            height={140}
                            width={140}
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm font-medium">{p.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Kolekcje */}
            <div className="w-3/10">
              <h3 className="text-sm font-semibold mb-2">{t.search.whatsNew}</h3>
              {latestKolekcja && (
                <Link href={`${getPath('/kolekcje')}/${latestKolekcja.slug}`} passHref>
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
