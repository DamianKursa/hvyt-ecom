import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { fetchKolekcjePostsWithImages } from '@/utils/api/woocommerce'; // API call for Kolekcje
import SkeletonNaszeKolekcje from '@/components/Product/SkeletonNaszeKolekcje'; // Skeleton loader for loading state

const NaszeKolekcje = () => {
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

  if (loading) {
    return <SkeletonNaszeKolekcje />;
  }

  return (
    <section
      className="w-full pt-[88px] py-16"
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      <div className="container mx-auto max-w-grid-desktop">
        <div className="hidden md:block">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-size-h2 font-bold text-neutral-darkest">
                Sprawdź nasze kolekcje
              </h2>
              <p className="font-size-text-medium text-neutral-darkest">
                Zobacz co ostatnio nowego dodaliśmy dla Ciebie.
              </p>
            </div>
            <Link
              href="/kolekcje"
              className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz wszystkie kolekcje →
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 gap-6">
            {kolekcjePosts.slice(0, 4).map((kolekcja) => (
              <div  style={{ height: '445px' }} key={kolekcja.id} className="relative w-full">
                <Image
                  src={kolekcja.imageUrl || '/placeholder.jpg'}
                  alt={kolekcja.title.rendered}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg h-full"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red">
                  {kolekcja.title.rendered}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View: Swiper */}
        <div className="md:hidden">
          <Swiper spaceBetween={16} slidesPerView={1.2}>
            {kolekcjePosts.map((kolekcja) => (
              <SwiperSlide key={kolekcja.id}>
                <div className="relative w-full">
                  <Image
                    src={kolekcja.imageUrl || '/placeholder.jpg'}
                    alt={kolekcja.title.rendered}
                    width={400}
                    height={446}
                    layout="responsive"
                    objectFit="cover"
                    quality={100}
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest">
                    {kolekcja.title.rendered}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NaszeKolekcje;
