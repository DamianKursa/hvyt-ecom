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

const CategoryPage = () => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState('default');
  const [currentTotalProducts, setCurrentTotalProducts] = useState(0);
  const [filteredProductCount, setFilteredProductCount] = useState(0);

  // Handle mobile view and filter visibility
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

  // Fetch category and initial products
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!slug) return;

      try {
        const fetchedCategory = await fetchCategoryBySlug(slug);
        const { products: fetchedProducts, totalProducts } =
          await fetchProductsByCategoryId(fetchedCategory.id, 1, 12, []);

        setCategory(fetchedCategory);
        setProducts(fetchedProducts);
        setCurrentTotalProducts(totalProducts);
        setFilteredProductCount(totalProducts); // Set initial product count
      } catch (error: any) {
        setErrorMessage(error.message || 'Error loading category data');
      }
    };

    fetchInitialData();
  }, [slug]);

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    setActiveFilters(selectedFilters);
  };

  const applyFilters = () => {
    setIsFilterModalOpen(false); // Close modal after applying filters
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setFilteredProductCount(currentTotalProducts); // Reset product count
    setProducts([]); // Clear products
    router.push({ pathname: router.pathname }); // Remove filters from URL
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

  if (errorMessage) {
    return (
      <Layout title="Error">
        <Snackbar message={errorMessage} type="error" visible={true} />
      </Layout>
    );
  }

  return (
    <Layout title={category?.name || 'Category'}>
      <div className="container max-w-[1440px] mt-[88px] px-4 md:px-0 lg:mt-[115px] mx-auto">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[40px] font-bold text-[#661F30]">
            {category?.name}
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
          onSortingChange={setSortingOption}
          onRemoveFilter={(filterToRemove) => {
            setActiveFilters((prev) =>
              prev.filter(
                (filter) =>
                  filter.name !== filterToRemove.name ||
                  filter.value !== filterToRemove.value,
              ),
            );
          }}
          isArrowDown={false}
          setIsArrowDown={() => {}}
          isMobile={isMobile}
        />

        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className="w-1/4 pr-8">
              <Filters
                categoryId={category?.id || 0}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                setProducts={setProducts}
                setTotalProducts={setFilteredProductCount} // Update total products dynamically
              />
            </div>
          )}

          <div
            className={`w-full ${filtersVisible && !isMobile ? 'lg:w-3/4' : ''}`}
          >
            <ProductArchive
              categoryId={category?.id || 0}
              filters={activeFilters}
              sortingOption={sortingOption}
              initialProducts={products}
              totalProducts={currentTotalProducts}
            />
          </div>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        categoryId={category?.id || 0}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        onApplyFilters={applyFilters} // Provide onApplyFilters
        onClearFilters={clearFilters}
        setProducts={setProducts}
        setTotalProducts={setFilteredProductCount} // Dynamically update total product count
        productsCount={filteredProductCount} // Pass the updated product count
        initialProductCount={currentTotalProducts} // Pass initial total product count
      />

      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>
    </Layout>
  );
};

export default CategoryPage;
