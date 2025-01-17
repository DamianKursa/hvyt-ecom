import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Filters from '../../components/Filters/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '../../components/Filters/FiltersControls';
import Snackbar from '@/components/UI/Snackbar.component';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import FilterModal from '@/components/Filters/FilterModal';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchSortedProducts,
} from '@/utils/api/category';

interface Category {
  id: number;
  name: string;
}

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

interface CategoryPageProps {
  category: Category;
  initialProducts: any[];
  initialTotalProducts: number;
}

const CategoryPage = ({
  category,
  initialProducts,
  initialTotalProducts,
}: CategoryPageProps) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const [products, setProducts] = useState(initialProducts);
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState('Sortowanie');
  const [filteredProductCount, setFilteredProductCount] =
    useState(initialTotalProducts);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      setIsMobile(isCurrentlyMobile);
      setFiltersVisible(!isCurrentlyMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const handleSortingChange = async (sortingValue: string) => {
    try {
      if (sortingValue === 'Sortowanie') {
        setSortingOption('Sortowanie');
        // Reset to default sorting
        const { products: defaultProducts, totalProducts } =
          await fetchProductsByCategoryId(category.id, 1, 12, []);
        setProducts(defaultProducts);
        setFilteredProductCount(totalProducts);
        return;
      }

      setSortingOption(sortingValue);

      const sortingMap: Record<string, { orderby: string; order: string }> = {
        Bestsellers: { orderby: 'popularity', order: 'asc' },
        'Najnowsze produkty': { orderby: 'date', order: 'asc' },
        'Najwyższa cena': { orderby: 'price', order: 'desc' },
        'Najniższa cena': { orderby: 'price', order: 'asc' },
      };

      const sortingParams = sortingMap[sortingValue] || {
        orderby: 'menu_order',
        order: 'asc',
      };

      const { products: sortedProducts, totalProducts } =
        await fetchSortedProducts(
          category.id,
          sortingParams.orderby,
          sortingParams.order,
          1,
          12,
        );

      console.log('Sorted Products:', sortedProducts);
      setProducts(sortedProducts);
      setFilteredProductCount(totalProducts);
    } catch (error) {
      console.error('Error fetching sorted products:', error);
    }
  };

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    setActiveFilters(selectedFilters);
  };

  const applyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setFilteredProductCount(initialTotalProducts);
    setProducts(initialProducts);
    router.push({ pathname: router.pathname });
  };

  const getCategoryIcon = () => {
    if (slug && icons[slug]) {
      return (
        <Image
          src={icons[slug]}
          alt={`${slug} icon`}
          width={54}
          height={24}
          className="ml-2"
        />
      );
    }
    return null;
  };

  if (!category) {
    return (
      <Layout title="Loading...">
        <Snackbar message="Loading category..." type="error" visible={true} />
      </Layout>
    );
  }

  return (
    <Layout title={`Hvyt | ${category.name || 'Loading...'}`}>
      <div className="container max-w-[1440px] mt-[88px] px-4 md:px-0 lg:mt-[115px] mx-auto">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[40px] font-bold text-[#661F30]">
            {category.name}
          </h1>
          {getCategoryIcon()}
        </div>

        <FiltersControls
          filtersVisible={filtersVisible}
          toggleFilters={
            isMobile
              ? toggleFilterModal
              : () => setFiltersVisible(!filtersVisible)
          }
          filters={activeFilters}
          sorting={sortingOption}
          onSortingChange={handleSortingChange}
          onRemoveFilter={(filterToRemove) => {
            setActiveFilters((prev) =>
              prev.filter(
                (filter) =>
                  filter.name !== filterToRemove.name ||
                  filter.value !== filterToRemove.value,
              ),
            );
          }}
          isMobile={isMobile}
        />

        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className="w-1/4 pr-8">
              <Filters
                categoryId={category.id}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                setProducts={setProducts}
                setTotalProducts={setFilteredProductCount}
              />
            </div>
          )}

          <div
            className={`w-full ${filtersVisible && !isMobile ? 'lg:w-3/4' : ''}`}
          >
            <ProductArchive
              categoryId={category.id}
              filters={activeFilters}
              sortingOption={sortingOption}
              initialProducts={products}
              totalProducts={filteredProductCount}
            />
          </div>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        categoryId={category.id}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        setProducts={setProducts}
        setTotalProducts={setFilteredProductCount}
        productsCount={filteredProductCount}
        initialProductCount={initialTotalProducts}
      />

      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const fetchedCategory = await fetchCategoryBySlug(slug);
    const { products: fetchedProducts, totalProducts } =
      await fetchProductsByCategoryId(fetchedCategory.id, 1, 12, []);

    return {
      props: {
        category: fetchedCategory,
        initialProducts: fetchedProducts,
        initialTotalProducts: totalProducts,
      },
      revalidate: 60, // Optional revalidation for fresh data
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { slug: 'uchwyty-meblowe' } },
    { params: { slug: 'klamki' } },
    { params: { slug: 'wieszaki' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};

export default CategoryPage;
