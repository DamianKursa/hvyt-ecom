import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '@/components/Layout/Layout.component';
import IconRenderer from '@/components/UI/IconRenderer';
import { Kolekcja } from '../../utils/functions/interfaces';
import SkeletonCollectionPage from '@/components/Skeletons/SkeletonCollectionPage';
import ProductPreview from '../../components/Product/ProductPreview.component';
import {
  fetchKolekcjePostsWithImages,
  fetchMediaById,
} from '../../pages/api/woocommerce';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
} from '../../pages/api/category';
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

  // Compute currentKolekcja on render so that it is available everywhere
  const currentKolekcja = kolekcjeData?.find(
    (kolekcja: Kolekcja) => kolekcja.slug === slugString,
  );

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
        <div className="container mx-auto px-4">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Hvyt | ${currentKolekcja?.title.rendered || slugString || 'Ładowanie...'}`}
    >
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop px-4 md:px-0">
          {/* HERO SECTION */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 mb-12 rounded-[25px] relative"
            style={{ minHeight: '521px', backgroundColor: '#E9E5DF' }}
          >
            <div className="relative order-1 md:order-2 overflow-hidden h-[280px] md:h-auto">
              {featuredImage && (
                <Image
                  src={featuredImage}
                  alt={slugString || 'Default collection title'}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[25px]"
                />
              )}
            </div>

            <div className="flex flex-col justify-start md:justify-end px-6 relative order-2 md:order-1">
              {kolekcjeData && (
                <div className="mb-16">
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
                </div>
              )}
              <h1 className="font-size-h1 capitalize mb-[32px] font-bold text-dark-pastel-red">
                {currentKolekcja?.title.rendered || 'Domyślny Tytuł Kolekcji'}
              </h1>

              <p className="font-size-text-medium mb-[48px] text-neutral-darkest">
                {content}
              </p>
            </div>
          </div>

          {/* SWIPER SLIDER (mobile: 1.5 slides) */}
          <div className="mb-12">
            <Swiper
              spaceBetween={16}
              slidesPerView={6}
              breakpoints={{
                320: { slidesPerView: 1.5 },
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
                    <IconRenderer
                      icons={[
                        kolekcja.acf?.ikonka_1 ?? '',
                        kolekcja.acf?.ikonka_2 ?? '',
                        kolekcja.acf?.ikonka_3 ?? '',
                        kolekcja.acf?.ikonka_4 ?? '',
                      ]}
                      iconPath="/icons/kolekcja/"
                      iconHeight={24}
                      gap={5}
                    />
                    <Image
                      src={kolekcja.imageUrl || '/placeholder.jpg'}
                      alt={kolekcja.title.rendered}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest bg-white z-10">
                      {kolekcja.title.rendered}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* PRODUCTS LIST (mobile: 1 column, desktop: 3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
