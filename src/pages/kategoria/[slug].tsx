import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Filters/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '@/components/Filters/FiltersControls';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import FilterModal from '@/components/Filters/FilterModal';
import { 
  getPolishCategorySlug, 
  isEnglishCategorySlug, 
  getLocalizedCategorySlug,
  categorySlugMapping 
} from '@/utils/i18n/routing';
import { useI18n } from '@/utils/hooks/useI18n';
import { dropdownOption } from '@/types/filters';
import { getSortingOptions } from '@/utils/data/filters';
import { getCurrentLanguage } from '@/utils/i18n/config';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SEOData {
  yoastTitle: string;
  yoastDescription: string;
  description: string;
}

interface CategoryPageProps {
  category: Category;
  initialProducts: any[];
  initialTotalProducts: number;
  seoData: SEOData | null;
  initialAttributes: any[];
  lang?: string;
}
const filterOrder: Record<string, string[]> = {};
// const filterOrder: Record<string, string[]> = {
//   // Polish slugs
//   'uchwyty-meblowe': [
//     'pa_dlugosc',
//     'pa_kolor',
//     'pa_rozstaw',
//     'pa_material',
//     'pa_styl',
//     'pa_kolekcja',
//     'pa_przeznaczenie',
//   ],
//   klamki: ['Kształt rozety', 'Kolor', 'Materiał'],
//   wieszaki: ['Kolor', 'Materiał'],
//   meble: ['Rodzaj', 'Wykończenie', 'Styl'],
//   galki: ['Kolor', 'Materiał'],
//   // English slugs - same filters as Polish equivalents
//   'handles': [
//     'pa_dlugosc',
//     'pa_kolor',
//     'pa_rozstaw',
//     'pa_material',
//     'pa_styl',
//     'pa_kolekcja',
//     'pa_przeznaczenie',
//   ],
//   'door-handles': ['Kształt rozety', 'Kolor', 'Materiał'],
//   'wall-hooks': ['Kolor', 'Materiał'],
//   'furniture': ['Rodzaj', 'Wykończenie', 'Styl'],
//   'knobs': ['Kolor', 'Materiał'],
// };

const icons: Record<string, string> = {
  // Polish slugs
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
  meble: '/images/HVYT_meble_znak graficzny_burgundy.png',
  // English slugs
  'handles': '/icons/uchwyty-kształty.svg',
  'door-handles': '/icons/klamki-kształty.svg',
  'wall-hooks': '/icons/wieszaki-kształty.svg',
  'furniture': '/images/HVYT_meble_znak graficzny_burgundy.png',
};

const ignoredParams = new Set([
  'slug',
  'gad_source',
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_source',
  'utm_content',
  'utm_term',
  'utm_id',
  'fbclid',
  'srsltid',
  'gbraid',
  'mc_cid',
  'mc_eid',
  'UNIQID',
  'page',
]);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryPage = ({
  category,
  initialProducts,
  initialTotalProducts,
  seoData,
  initialAttributes,
  lang: serverLang,
}: CategoryPageProps) => {
  const router = useRouter();
  const { t } = useI18n()
  const [sortingOptions, updateSortingOptions] = useState<dropdownOption[]>(getSortingOptions(t));
  
  // Determine current language from server prop, locale, or slug
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;
  
  const currentLang = serverLang || (isEnglishCategorySlug(slug || '') ? 'en' : (router.locale || 'pl'));
  
  useEffect(() => {
    console.log('🛠 CategoryPage props on mount:', {
      category,
      initialProducts,
      initialTotalProducts,
      seoData,
      initialAttributes,
      lang: currentLang,
    });
  }, []);
console.log('thiscategory', category);

  const seoTitle =
    seoData && seoData.yoastTitle
      ? seoData.yoastTitle
      : `HVYT | ${category.name}`;
  const seoDescription =
    seoData && seoData.yoastDescription ? seoData.yoastDescription : '';

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState<dropdownOption>({key: 'sort', label: t.filters.sorting});
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Update filters from URL query parameters on initial load
  useEffect(() => {
    const updateFiltersFromQuery = () => {
      const queryFilters: { name: string; value: string }[] = [];
      let sortFromQuery = {key: 'sort', label: t.filters.sorting};
      
      const pageFromQuery = Number(router.query.page ?? 1);
      Object.keys(router.query).forEach((key) => {
        if (ignoredParams.has(key)) return;
        if (key === 'sort') {
          const sortOption = sortingOptions.find(option => option.key === router.query[key] as string);
          sortFromQuery = sortOption || {key: 'sort', label: t.filters.sorting};
          return;
        }
        const values = router.query[key];
        if (Array.isArray(values)) {
          values.forEach((value) => queryFilters.push({ name: key, value }));
        } else if (typeof values === 'string') {
          queryFilters.push({ name: key, value: values });
        }
      });
      setActiveFilters(queryFilters);
      if (sortFromQuery.key !== 'sort') {
        console.log('sortFromQuery', sortFromQuery);
        
        setSortingOption(sortFromQuery);
      }
      setCurrentPage(Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1);
    };

    if (router.isReady) {
      updateFiltersFromQuery();
    }
  }, [router.query, router.isReady]);

    useEffect(()=>{
      updateSortingOptions(getSortingOptions(t));      
    },[router.locale])

    useEffect(()=> {
      setSortingOption(prev => sortingOptions.find(option => option.key === prev.key) || {key: 'sort', label: t.filters.sorting})
    }, [sortingOptions])

  // Handle resizing to update mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setFiltersVisible(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build dynamic SWR key based on filters, sorting, and page
  const buildApiEndpoint = () => {
    if (activeFilters.length > 0) {
      return `/api/category?action=fetchProductsWithFilters&categoryId=${category.id}&lang=${getCurrentLanguage()}&filters=${encodeURIComponent(
        JSON.stringify(activeFilters),
      )}&page=${currentPage}&perPage=12`;
    } else if (sortingOption.key !== 'sort') {
      const sortingMap: Record<string, { orderby: string; order: string }> = {
        'bestseller': { orderby: 'popularity', order: 'desc' },
        'newest': { orderby: 'date', order: 'desc' },
        'pricehigh': { orderby: 'price', order: 'desc' },
        'pricelow': { orderby: 'price', order: 'asc' },
      };
      const sortingParams = sortingMap[sortingOption.key] || {
        orderby: 'menu_order',
        order: 'asc',
      };
      return `/api/category?action=fetchSortedProducts&categoryId=${category.id}&orderby=${sortingParams.orderby}&order=${sortingParams.order}&page=${currentPage}&perPage=12&lang=${currentLang}`;
    } else {
      return `/api/category?action=fetchProductsByCategoryId&categoryId=${category.id}&page=${currentPage}&perPage=12&lang=${currentLang}`;
    }
  };

  const swrKey = buildApiEndpoint();

  const fallback =
    activeFilters.length === 0 &&
      sortingOption.label === t.filters.sorting &&
      currentPage === 1
      ? { products: initialProducts, totalProducts: initialTotalProducts }
      : undefined;

  const { data, error } = useSWR(swrKey, fetcher, {
    fallbackData: fallback,
    revalidateOnFocus: false,
    errorRetryCount: Infinity,
    errorRetryInterval: 30000,
  });
  const products = data?.products || [];
  const filteredProductCount = data?.totalProducts || 0;

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    setActiveFilters(selectedFilters);
    setCurrentPage(1);
    updateUrlWithFilters(selectedFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
    router.push(
      { pathname: router.pathname, query: { slug: slug || '' } },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const handleSortingChange = (sortingValue: dropdownOption) => {
    setCurrentPage(1);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: sortingValue.key },
      },
      undefined,
      { shallow: true },
    );
  };


  const updateUrlWithFilters = (filters: { name: string; value: string }[]) => {
    const query: Record<string, string | string[]> = { slug: slug || '' };
    filters.forEach((filter) => {
      if (!query[filter.name]) {
        query[filter.name] = [];
      }
      if (Array.isArray(query[filter.name])) {
        if (!(query[filter.name] as string[]).includes(filter.value)) {
          query[filter.name] = [
            ...(query[filter.name] as string[]),
            filter.value,
          ];
        }
      } else {
        query[filter.name] = [filter.value];
      }
    });
    router.push({ pathname: router.pathname, query: { ...query, page: '1' } }, undefined, {
      shallow: true,
    });
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    // push page into URL so browser back/forward navigates pages correctly
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, slug: slug || '', page: String(page) },
      },
      undefined,
      { shallow: true },
    );
  };

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <Layout title={seoTitle}>
      <Head>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {/* <meta rel="canonical" href={`https://hvyt.pl/kategoria/${slug}`} /> */}
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/kategoria/${slug}`}
        />
      </Head>
      <div className="mx-auto max-w-[1440px] mt-[115px] px-4 md:px-4 lg:px-4 xl:px-4 min-[1440px]:px-0">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>
        <div className="flex items-center mb-8">
          <h1 className="text-[32px] mt-[24px] md:text-[40px] font-bold text-[#661F30] flex items-center gap-4">
            {category.name}
            {icons[slug || ''] && (
              <img
                src={icons[slug || '']}
                alt="Category Icon"
                className="ml-2 h-6 md:h-8"
              />
            )}
          </h1>
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
            const updatedFilters = activeFilters.filter(
              (filter) =>
                !(
                  filter.name === filterToRemove.name &&
                  filter.value === filterToRemove.value
                ),
            );
            setActiveFilters(updatedFilters);
            handleFilterChange(updatedFilters);
          }}
          isMobile={isMobile}
        />
        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className={`w-1/4 pr-8 ${filtersVisible ? '' : 'hidden'}`}>
              <Filters
                categoryId={category.id}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                setProducts={() => { }}
                setTotalProducts={() => { }}
                filterOrder={filterOrder[slug || ''] || []}
                initialAttributes={initialAttributes}
                categorySlug={slug as string}
              />
            </div>
          )}
          <div
            className={`w-full ${filtersVisible && !isMobile ? 'lg:w-3/4' : ''}`}
          >
            <ProductArchive
              products={products}
              totalProducts={filteredProductCount}
              loading={!data && !error}
              perPage={12}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categoryId={category.id}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {
          setIsFilterModalOpen(false);
          // SWR revalidates automatically on state change.
        }}
        onClearFilters={clearFilters}
        setProducts={() => { }}
        setTotalProducts={() => { }}
        productsCount={filteredProductCount}
        initialProductCount={initialTotalProducts}
        filterOrder={filterOrder[slug || ''] || []}
        initialAttributes={initialAttributes}
      />
      <div className="w-full">
        <div className="w-full">
          <CategoryDescription
            category={slug || ''}
            wpDescription={seoData?.description || ''}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const locale = context.locale || 'pl';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const wpApi =
    process.env.NEXT_PUBLIC_WP_REST_API || 'https://hvyt.pl/wp-json/wp/v2';

  // Determine language: check if slug is English or use locale
  const isEnSlug = isEnglishCategorySlug(slug);
  const lang = isEnSlug ? 'en' : (locale === 'en' ? 'en' : 'pl');
  
  // Get Polish slug for WP/WooCommerce queries (they use Polish slugs as primary)
  const polishSlug = getPolishCategorySlug(slug);
  
  // Get the appropriate slug for display based on language
  const displaySlug = getLocalizedCategorySlug(slug, lang as 'pl' | 'en');

  console.log(`[kategoria/${slug}] Language: ${lang}, Polish slug: ${polishSlug}, Display slug: ${displaySlug}`);

  let categoryInfo = { id: 0, name: 'Unknown', slug: displaySlug };
  let seoData: SEOData | null = null;

  try {
    // Fetch the WP product_cat term by Polish slug (includes yoast_head_json)
    // Add lang parameter for WPML support
    const langParam = lang === 'en' ? '&lang=en' : '';
    const termRes = await fetch(
      `${wpApi}/product_cat?slug=${encodeURIComponent(polishSlug)}` +
      `&_fields=id,name,description,yoast_head_json${langParam}`,
    );

    if (termRes.ok) {
      const terms = await termRes.json();
      const term = terms[0];
      if (term) {
        categoryInfo = { id: term.id, name: term.name, slug: displaySlug };
        seoData = {
          yoastTitle: term.yoast_head_json?.title ?? '',
          yoastDescription: term.yoast_head_json?.description ?? '',
          description: term.description ?? '',
        };
        console.log(`[kategoria/${slug}] Found category: id=${term.id}, name=${term.name}`);
      } else {
        console.warn(`[kategoria/${slug}] No category found for Polish slug: ${polishSlug}`);
      }
    } else {
      console.warn(
        `WP term fetch failed: ${termRes.status} ${termRes.statusText}`,
      );
    }
  } catch (err) {
    console.warn('Error fetching category term from WP:', err);
  }

  // If we didn't find the category with Polish slug and lang=en, try without lang parameter
  if (categoryInfo.id === 0 && lang === 'en') {
    try {
      const termRes = await fetch(
        `${wpApi}/product_cat?slug=${encodeURIComponent(polishSlug)}` +
        `&_fields=id,name,description,yoast_head_json`,
      );

      if (termRes.ok) {
        const terms = await termRes.json();
        const term = terms[0];
        if (term) {
          categoryInfo = { id: term.id, name: term.name, slug: displaySlug };
          seoData = {
            yoastTitle: term.yoast_head_json?.title ?? '',
            yoastDescription: term.yoast_head_json?.description ?? '',
            description: term.description ?? '',
          };
          console.log(`[kategoria/${slug}] Found category (fallback): id=${term.id}, name=${term.name}`);
        }
      }
    } catch (err) {
      console.warn('Error fetching category term from WP (fallback):', err);
    }
  }

  // aggregator fetch with lang parameter
  let aggregatorData = {
    category: categoryInfo,
    products: [] as any[],
    totalProducts: 0,
    attributes: [] as any[],
  };
  try {
    const aggRes = await fetch(
      `${baseUrl}/api/category-aggregator` +
      `?slug=${encodeURIComponent(polishSlug)}` +
      `&page=1&perPage=12&lang=${lang}`,
    );
    if (aggRes.ok) {
      aggregatorData = await aggRes.json();
      // Override slug in category to use display slug
      if (aggregatorData.category) {
        aggregatorData.category.slug = displaySlug;
      }
      console.log(`[kategoria/${slug}] Aggregator returned ${aggregatorData.products?.length || 0} products, category id: ${aggregatorData.category?.id}`);
    } else {
      console.error('Aggregator fetch failed:', await aggRes.text());
    }
  } catch (err) {
    console.error('Aggregator fetch error:', err);
  }

  // Use aggregator category if we have a valid one, otherwise use our fetched one
  const finalCategory = aggregatorData.category?.id ? aggregatorData.category : categoryInfo;
  // Ensure display slug is correct
  finalCategory.slug = displaySlug;

  return {
    props: {
      category: finalCategory,
      initialProducts: aggregatorData.products,
      initialTotalProducts: aggregatorData.totalProducts,
      initialAttributes: aggregatorData.attributes,
      seoData,
      lang, // Pass language to the component
    },
    revalidate: 21600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Include both Polish and English slugs for all categories
  const paths = [
    // Polish slugs
    { params: { slug: 'uchwyty-meblowe' } },
    { params: { slug: 'klamki' } },
    { params: { slug: 'wieszaki' } },
    { params: { slug: 'meble' } },
    { params: { slug: 'galki' } },
    { params: { slug: 'sale' } },
    // English slugs
    { params: { slug: 'handles' } },
    { params: { slug: 'door-handles' } },
    { params: { slug: 'wall-hooks' } },
    { params: { slug: 'furniture' } },
    { params: { slug: 'knobs' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};

export default CategoryPage;
