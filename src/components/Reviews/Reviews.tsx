import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { useI18n } from '@/utils/hooks/useI18n';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

const Reviews = ({ productId }: { productId: number }) => {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 2;

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleReviewSubmit = async () => {
    setSubmitted(true);
    setShowForm(false);
    try {
      await loadReviews();
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const totalSlides = Math.ceil(reviews.length / itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalSlides - 1;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section className="w-full bg-beige py-16">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-between mb-[40px]">
          <div className="flex px-[16px] lg:px-0 flex-col h-full">
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              {t.product.reviewsTitle}
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              {t.product.reviewsMessage}
            </p>
          </div>

          {/* Custom Navigation - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className={`p-3 rounded-full shadow-lg ${canGoPrev
                ? 'bg-black text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!canGoPrev}
            >
              <img src="/icons/arrow-left.svg" alt="Previous" />
            </button>
            <button
              onClick={handleNext}
              className={`p-3 rounded-full shadow-lg ${canGoNext
                ? 'bg-black text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!canGoNext}
            >
              <img src="/icons/arrow-right.svg" alt="Next" />
            </button>
          </div>
        </div>

        {/* Reviews Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="flex-shrink-0 flex w-full"
                style={{ width: '100%' }}
              >
                {reviews
                  .slice(
                    slideIndex * itemsPerPage,
                    slideIndex * itemsPerPage + itemsPerPage,
                  )
                  .map((review) => (
                    <div key={review.id} className="w-1/2 px-3">
                      <ReviewItem review={review} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center bg-green-800 text-white px-4 py-2 rounded-[25px]">
              <img
                src="/icons/circle-check.svg"
                alt="Success"
                className="w-5 h-5 mr-2"
              />
              <span>Dziękujemy za podzielenie się Twoją opinią.</span>
            </div>
          </div>
        )}

        {/* Add Review Button */}
        {!showForm && (
          <div className="flex justify-center mt-6 px-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-white transition-all"
            >
              {t.reviews.addReview} +
            </button>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="flex justify-center mt-6">
            <ReviewForm
              productId={productId}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
