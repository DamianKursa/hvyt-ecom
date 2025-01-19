import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '@/components/Layout/Layout.component';
import IconRenderer from '@/components/UI/IconRenderer'; // Import IconRenderer
import { Kolekcja } from '../../utils/functions/interfaces';
import SkeletonCollectionPage from '@/components/Skeletons/SkeletonCollectionPage';
import ProductPreview from '../../components/Product/ProductPreview.component';
import {
  fetchKolekcjePostsWithImages,
  fetchMediaById,
} from '../../utils/api/woocommerce';

import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
} from '../../utils/api/category';

import { useRouter } from 'next/router';

const CollectionPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const slugString = Array.isArray(slug) ? slug[0] : slug;

  const [productsData, setProductsData] = useState<{
    products: any[];
    totalProducts: number;
  } | null>(null);
  const [kolekcjeData, setKolekcjeData] = useState<Kolekcja[] | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slugString) return;

        const categoryData = await fetchCategoryBySlug(slugString);
        const fetchedProducts = await fetchProductsByCategoryId(
          categoryData.id,
        );
        setProductsData(fetchedProducts);

        const fetchedKolekcje = await fetchKolekcjePostsWithImages();
        setKolekcjeData(fetchedKolekcje);

        const currentKolekcja = fetchedKolekcje.find(
          (kolekcja: Kolekcja) => kolekcja.slug === slugString,
        );
        setContent(
          stripHTML(currentKolekcja?.content.rendered || 'Opis kolekcji.'),
        );

        if (currentKolekcja?.featured_media) {
          const featuredImageUrl = await fetchMediaById(
            currentKolekcja.featured_media,
          );
          setFeaturedImage(featuredImageUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching collection data:', error);
        setErrorMessage('Error loading collection data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slugString]);

  const handleCollectionClick = (kolekcjaSlug: string) => {
    setLoading(true);
    router.push(`/kolekcje/${kolekcjaSlug}`);
  };

  if (loading) {
    return (
      <Layout title="Hvyt | Ładowanie...">
        <SkeletonCollectionPage />
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout title="Error">
        <div className="container mx-auto">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Hvyt | ${slugString || 'Ładowanie...'}`}>
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          {/* First Section: Title, Content, Featured Image */}
          <div
            className="grid grid-cols-2 gap-8 mb-12 rounded-[25px] relative"
            style={{ minHeight: '521px', backgroundColor: '#E9E5DF' }}
          >
            <div className="flex flex-col justify-end p-6 relative">
              {kolekcjeData && (
                <IconRenderer
                  icons={[
                    kolekcjeData[0]?.acf?.ikonka_1 ?? '',
                    kolekcjeData[0]?.acf?.ikonka_2 ?? '',
                    kolekcjeData[0]?.acf?.ikonka_3 ?? '',
                    kolekcjeData[0]?.acf?.ikonka_4 ?? '',
                  ]}
                  iconPath="/icons/kolekcja/"
                  iconHeight={24}
                  gap={5}
                />
              )}
              <h1 className="font-size-h1 capitalize mb-[32px] font-bold text-dark-pastel-red">
                {slugString}
              </h1>
              <p className="font-size-text-medium mb-[48px] text-neutral-darkest">
                {content}
              </p>
            </div>
            <div className="relative h-full overflow-hidden">
              {featuredImage && (
                <Image
                  src={featuredImage}
                  alt={slugString as string}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[25px] h-full"
                />
              )}
            </div>
          </div>

          {/* Second Section: Slider */}
          <div className="mb-12">
            <Swiper
              spaceBetween={16}
              slidesPerView={6}
              breakpoints={{
                320: { slidesPerView: 1.3 },
                768: { slidesPerView: 3.3 },
                1024: { slidesPerView: 4.3 },
                1280: { slidesPerView: 6.3 },
              }}
            >
              {kolekcjeData?.map((kolekcja: Kolekcja) => (
                <SwiperSlide key={kolekcja.id}>
                  <div
                    className="relative h-[205px] w-full transition-transform duration-300 transform hover:scale-105 rounded-lg overflow-hidden"
                    style={{ backgroundColor: 'var(--color-beige)' }}
                    onClick={() => handleCollectionClick(kolekcja.slug)}
                  >
                    {/* IconRenderer */}
                    <IconRenderer
                      icons={[
                        kolekcja.acf?.ikonka_1 ?? '',
                        kolekcja.acf?.ikonka_2 ?? '',
                        kolekcja.acf?.ikonka_3 ?? '',
                        kolekcja.acf?.ikonka_4 ?? '',
                      ]}
                      iconPath="/icons/kolekcja/"
                      iconHeight={24} // Uniform height
                      gap={5} // Adjust gap between icons
                    />

                    {/* Background Image */}
                    <Image
                      src={kolekcja.imageUrl || '/placeholder.jpg'}
                      alt={kolekcja.title.rendered}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />

                    {/* Title */}
                    <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest bg-white z-10">
                      {kolekcja.title.rendered}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Third Section: Product Preview */}
          <div className="grid grid-cols-3 gap-6">
            {productsData?.products.map((product) => (
              <ProductPreview key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CollectionPage;
