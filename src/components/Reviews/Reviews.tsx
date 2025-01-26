import React, { useState, useEffect } from 'react';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { fetchProductReviews } from '@/utils/api/woocommerce';
import { useRouter } from 'next/router';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

const fallbackReviews: Review[] = [
  {
    id: 1,
    reviewer: 'Sample Reviewer 1',
    review: 'This is a sample review. It shows how a review will appear.',
    rating: 5,
    date_created: '2024-11-01',
  },
  {
    id: 2,
    reviewer: 'Sample Reviewer 2',
    review: 'Another review to showcase the slider functionality.',
    rating: 4,
    date_created: '2024-11-02',
  },
];

const Reviews = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2.8;
  const gutter = 24;

  const router = useRouter();

  // Determine if this section should be full-width based on the route
  const noMarginPages = ['/', '/o-nas', '/hvyt-objects', '/blog'];
  const fullWidthCategories = [
    'uchwyty-meblowe',
    'klamki',
    'wieszaki',
    'produkt',
  ];
  const isFullWidth =
    noMarginPages.includes(router.pathname) ||
    fullWidthCategories.some((slug) => router.asPath.includes(`/${slug}`));

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  const handleReviewSubmit = () => {
    setSubmitted(true);
    setShowForm(false);

    // Refresh reviews after submission
    const refreshReviews = async () => {
      try {
        const data = await fetchProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error('Error refreshing reviews:', error);
      }
    };

    refreshReviews();
  };

  const displayedReviews = loading ? fallbackReviews : reviews || [];
  const totalItems = displayedReviews.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section
      className={`${
        isFullWidth ? 'w-full' : 'container mx-auto'
      } bg-beige py-16`}
    >
      {/* Content Container with max-width 1440px */}
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-between mb-[40px]">
          <div className="flex px-[16px] lg:px-0 flex-col h-full">
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Klienci o HVYT
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Sprawdź co mówią osoby, które kupiły nasze produkty lub podziel
              się swoją opinią.
            </p>
          </div>

          {/* Custom Navigation - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className={`p-3 rounded-full shadow-lg ${
                canGoPrev
                  ? 'bg-black text-white'
                  : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canGoPrev}
              aria-disabled={!canGoPrev}
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Previous"
                className="h-6 w-6"
              />
            </button>
            <button
              onClick={handleNext}
              className={`p-3 rounded-full shadow-lg ${
                canGoNext
                  ? 'bg-black text-white'
                  : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canGoNext}
              aria-disabled={!canGoNext}
            >
              <img
                src="/icons/arrow-right.svg"
                alt="Next"
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              gap: `${gutter}px`,
            }}
          >
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="flex-none"
                style={{
                  width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                  transition: 'all 0.3s ease',
                }}
              >
                <ReviewItem review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View: Responsive Slider */}
        <div className="md:hidden">
          <ResponsiveSlider
            items={displayedReviews}
            renderItem={(review: Review) => <ReviewItem review={review} />}
          />
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            Dziękujemy za podzielenie się Twoją opinią.
          </div>
        )}

        {/* Add Review Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all flex items-center space-x-2"
          >
            <span>{showForm ? 'Schowaj formularz' : 'Dodaj swoją opinię'}</span>
            <img src="/icons/plus.svg" alt="Add Icon" className="h-5 w-5" />
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mt-6">
            <ReviewForm productId={productId} onSubmit={handleReviewSubmit} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
