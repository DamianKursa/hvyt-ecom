import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component'; // Import Layout
import { fetchKolekcjePostsWithImages } from '@/utils/api/woocommerce'; // API call for Kolekcje
import SkeletonKolekcjePage from '../components/Skeletons/SkeletonKolekcjePage'; // Import your custom skeleton loader

const KolekcjePage = () => {
  const [kolekcjePosts, setKolekcjePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchKolekcje = async () => {
      try {
        const kolekcjeWithImages = await fetchKolekcjePostsWithImages(); // Fetch Kolekcje with images
        setKolekcjePosts(kolekcjeWithImages);
        setLoading(false);
      } catch (error) {
        // Check if the error is an instance of Error and extract the message
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Error loading Kolekcje posts');
        } else {
          setErrorMessage('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchKolekcje();
  }, []);

  return (
    <Layout title="Kolekcje">
      <section className="w-full py-16 text-dark-pastel-red">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Page Title and Two-Column Text Section */}
          <div className="text-left mb-12">
            <h1 className="font-size-h1 font-bold text-dark-pastel-red">
              Kolekcje
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="font-size-text-medium text-neutral-darkest">
                Zanurz się w piękno minimalistycznych linii, geometrycznych
                kształtów i eleganckich wykończeń, które łatwo dopełnią Twoje
                wnętrze. Poznaj uchwyty wykonane z najwyższej jakości
                materiałów, takich jak litły mosiądz, stal nierdzewna i
                aluminium.
              </p>
            </div>
            <div>
              <p className="font-size-text-medium text-neutral-darkest">
                Niezależnie od tego, czy wolisz eleganckie i nowoczesne
                projekty, czy eklektyczne i ozdobne style, nasze kolekcje
                oferują różnorodne opcje, które zaspokoją każdy gust i estetykę.
                <Link href="#" className="text-dark-pastel-red font-bold">
                  {' '}
                  Zobacz co ostatnio nowego dodaliśmy dla Ciebie.
                </Link>
              </p>
            </div>
          </div>

          {/* Dynamic Content or Skeleton */}
          {loading ? (
            <SkeletonKolekcjePage />
          ) : (
            <>
              {/* First Row - 3 Columns, First Column Takes 2 Columns */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {kolekcjePosts.slice(0, 3).map((kolekcja, index) => (
                  <div
                    key={kolekcja.id}
                    className={`relative transition-all duration-300 ${index === 0 ? 'col-span-2' : 'col-span-1'}`}
                    style={{ height: '445px' }}
                  >
                    <Link href={`/kolekcje/${kolekcja.slug}`}>
                      <Image
                        src={kolekcja.imageUrl || '/placeholder.jpg'}
                        alt={kolekcja.title.rendered}
                        layout="fill"
                        objectFit="cover" // Ensure the image covers the full container
                        quality={100}
                        className="transition-transform duration-500 rounded-[16px] rtransform group-hover:scale-105"
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red transition-colors duration-300 group-hover:bg-dark-pastel-red group-hover:text-neutral-white">
                        {kolekcja.title.rendered}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Rest of the Rows - 4 Columns */}
              <div className="grid grid-cols-4 gap-6">
                {kolekcjePosts.slice(3).map((kolekcja) => (
                  <div
                    key={kolekcja.id}
                    className="relative col-span-1 transition-all duration-300"
                    style={{ height: '445px' }}
                  >
                    <Link href={`/kolekcje/${kolekcja.slug}`}>
                      <Image
                        src={kolekcja.imageUrl}
                        alt={kolekcja.title.rendered}
                        layout="fill"
                        objectFit="cover" // Ensure the image covers the full container
                        quality={100}
                        className="transition-transform  rounded-[16px] duration-500 transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-2 font-bold text-dark-pastel-red transition-colors duration-300 group-hover:bg-dark-pastel-red group-hover:text-neutral-white">
                        {kolekcja.title.rendered}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default KolekcjePage;
