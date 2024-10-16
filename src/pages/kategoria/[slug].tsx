import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Product/Filters.component';
import ProductPreview from '@/components/Product/ProductPreview.component';
import SkeletonProductPreview from '@/components/Product/SkeletonProductPreview.component';
import FilterSkeleton from '@/components/Product/SkeletonFilter.component';
import Snackbar from '@/components/UI/Snackbar.component';
import { fetchCategoryBySlug, fetchProductsByCategoryId, fetchProductAttributesWithTerms } from '../../utils/api/woocommerce';

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch category by slug
        const categoryData = await fetchCategoryBySlug(slug as string);
        setCategory(categoryData);

        // Fetch products by category ID
        const productsData = await fetchProductsByCategoryId(categoryData.id);
        setProducts(productsData);

        // Fetch attributes with terms
        const attributesData = await fetchProductAttributesWithTerms();
        setAttributes(attributesData);

        setLoading(false);
      } catch (error: any) {
        console.error('Error loading category data:', error);
        setErrorMessage(error.message || 'Error loading category data');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto flex">
          <div className="w-1/4 pr-8">
            <FilterSkeleton />
            <FilterSkeleton />
            <FilterSkeleton />
            <FilterSkeleton />
          </div>
          <div className="w-3/4 grid grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonProductPreview key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout title="Error">
        <Snackbar message={errorMessage} type="error" visible={true} />
        <div className="container mx-auto flex">
          <div className="w-1/4 pr-8">
            <FilterSkeleton />
          </div>
          <div className="w-3/4 grid grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonProductPreview key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={category?.name || 'Category'}>
      <div className="container mx-auto flex">
        <div className="w-1/4 pr-8">
          {attributes.length ? (
            <Filters attributes={attributes} />
          ) : (
            <FilterSkeleton />
          )}
        </div>

        <div className="w-3/4 grid grid-cols-3 gap-8">
          {products.length ? (
            products.map((product: any) => (
              <ProductPreview key={product.id} product={product} />
            ))
          ) : (
            <Snackbar message="No products found in this category" type="error" visible={true} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
