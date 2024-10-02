import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Product/Filters.component';
import ProductPreview from '@/components/Product/ProductPreview.component';
import SkeletonProductPreview from '@/components/Product/SkeletonProductPreview.component';
import { GET_PRODUCTS_FROM_CATEGORY } from '../../utils/gql/GQL_QUERIES';

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, loading, error } = useQuery(GET_PRODUCTS_FROM_CATEGORY, {
    variables: { id: slug },
  });
  console.log('Category data:', data);
  if (error) {
    console.error('Error fetching category data:', error);
    return <div>Error fetching category data: {error.message}</div>;
  }

  const products = data?.productCategory?.products?.nodes || [];

  return (
    <Layout title={data?.productCategory?.name || 'Category'}>
      <div className="container mx-auto flex">
        {/* Filters */}
        <div className="w-1/4 pr-8">
          <Filters attributes={[]} />
        </div>

        {/* Product listing grid */}
        <div className="w-3/4 grid grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonProductPreview key={index} />)
            : products.map((product) => <ProductPreview key={product.id} product={product} />)}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
