import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { fetchKolekcjePostsWithImages } from '@/utils/api/woocommerce';
import SkeletonNaszeKolekcje from '@/components/Skeletons/SkeletonNaszeKolekcje';

const NaszeKolekcje = () => {
  const [kolekcjePosts, setKolekcjePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchKolekcje = async () => {
      try {
        const kolekcjeWithImages = await fetchKolekcjePostsWithImages();
        setKolekcjePosts(kolekcjeWithImages);
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
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
      className="w-full pt-[88px] py-16 sm:px-4 md:px-0"
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      <div className="container mx-auto max-w-grid-desktop">
        {/* Title, Description, and Button */}
        <div className=" px-[16px] lg:px-0  flex flex-col items-start mb-8 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Sprawdź nasze kolekcje
            </h2>
            <p className="font-size-text-medium text-neutral-darkest">
              Zobacz co ostatnio nowego dodaliśmy dla Ciebie.
            </p>
          </div>
          {/* Button for both desktop and mobile */}
          <Link
            href="/kolekcje"
            className="block w-full md:w-auto px-6 py-3 mt-6 md:mt-0 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
          >
            Zobacz wszystkie kolekcje →
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {kolekcjePosts.slice(0, 4).map((kolekcja) => (
            <a
              href={`/kolekcje/${kolekcja.slug}`}
              key={kolekcja.id}
              className="relative w-full"
              style={{ height: '445px' }}
            >
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
            </a>
          ))}
        </div>

        {/* Mobile View: Responsive Slider */}
        <div className="md:hidden">
          <ResponsiveSlider
            items={kolekcjePosts}
            renderItem={(kolekcja) => (
              <a
                href={`/kolekcje/${kolekcja.slug}`}
                className="relative w-full"
              >
                <div className="relative w-full h-[445px]">
                  <Image
                    src={kolekcja.imageUrl || '/placeholder.jpg'}
                    alt={kolekcja.title.rendered}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                    {kolekcja.title.rendered}
                  </div>
                </div>
              </a>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default NaszeKolekcje;
