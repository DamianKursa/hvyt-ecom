import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import { Kolekcja } from '../../utils/functions/interfaces';
import SkeletonCollectionPage from '@/components/Skeletons/SkeletonCollectionPage';
import ProductPreview from '../../components/Product/ProductPreview.component';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchKolekcjePostsWithImages,
  fetchMediaById,
} from '../../utils/api/woocommerce';
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

  // Function to strip HTML tags from content
  const stripHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slugString) return;

        // Fetch category by slug
        const categoryData = await fetchCategoryBySlug(slugString);

        // Fetch products by category ID
        const fetchedProducts = await fetchProductsByCategoryId(
          categoryData.id,
        );
        setProductsData(fetchedProducts); // Assuming fetchedProducts has { products: any[], totalProducts: number }

        // Fetch Kolekcje data for the slider
        const fetchedKolekcje = await fetchKolekcjePostsWithImages();
        setKolekcjeData(fetchedKolekcje);

        // Fetch Kolekcja details like content and featured image
        const currentKolekcja = fetchedKolekcje.find(
          (kolekcja: Kolekcja) => kolekcja.slug === slugString,
        );
        setContent(
          stripHTML(currentKolekcja?.content.rendered || 'Opis kolekcji.'),
        );

        // Fetch the featured image
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
      <Layout title="Loading...">
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
    <Layout title={slugString || 'Kolekcja'}>
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          {/* First Section: Title, Content, Featured Image */}
          <div
            className="grid grid-cols-2 gap-8 mb-12 rounded-lg"
            style={{ minHeight: '521px', backgroundColor: '#E9E5DF' }}
          >
            <div className="flex flex-col justify-end p-6">
              <h1 className="font-size-h1 font-bold text-dark-pastel-red">
                {slugString}
              </h1>
              <p className="font-size-text-medium text-neutral-darkest">
                {content}
              </p>
            </div>
            <div className="relative h-full rounded-lg overflow-hidden">
              {featuredImage && (
                <Image
                  src={featuredImage}
                  alt={slugString as string}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg h-full"
                />
              )}
            </div>
          </div>

          {/* Second Section: Slider with 6 visible boxes */}
          <div className="grid grid-cols-6 gap-4 mb-12">
            {kolekcjeData?.slice(0, 6).map((kolekcja: Kolekcja) => (
              <div
                key={kolekcja.id}
                className="relative h-[205px] w-full transition-transform duration-300 transform hover:scale-105 rounded-lg overflow-hidden"
                style={{ backgroundColor: 'var(--color-beige)' }}
                onClick={() => handleCollectionClick(kolekcja.slug)}
              >
                <Image
                  src={kolekcja.imageUrl || '/placeholder.jpg'}
                  alt={kolekcja.title.rendered}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest bg-white">
                  {kolekcja.title.rendered}
                </div>
              </div>
            ))}
          </div>

          {/* Third Section: Product Preview (3 Columns) */}
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
