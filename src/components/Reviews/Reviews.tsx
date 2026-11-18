import React, { useState, useEffect, useRef } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { useI18n } from '@/utils/hooks/useI18n';
import { ReviewMediaItem } from '@/lib/reviewMedia';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  media?: ReviewMediaItem[];
  meta?: Record<string, unknown>;
  meta_data?: Array<{ key: string; value: unknown }>;
}

const Reviews = ({
  productId,
  productIds = [],
}: {
  productId: number;
  productIds?: number[];
}) => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const productQuery = Array.from(new Set(
    [productId, ...productIds]
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0),
  )).join(',');

  const loadReviews = async (nextPage: number, scroll: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productQuery)}&page=${nextPage}`);
      if (!res.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.reviews;
      setReviews(Array.isArray(list) ? list : []);
      setPage(Number(data?.page) || nextPage);
      setPerPage(Number(data?.perPage) || 0);
      setTotalPages(Math.max(0, Number(data?.totalPages) || 0));
      if (scroll) {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadReviews(1, false);
  }, [productQuery]);

  const handleReviewSubmit = async () => {
    setSubmitted(true);
    setShowForm(false);
    try {
      await loadReviews(page, false);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  return (
    <section ref={sectionRef} className="w-full bg-beige py-16">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex px-[16px] lg:px-0 flex-col h-full mb-[40px]">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            {t.product.reviewsTitle}
          </h2>
          <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
            {t.product.reviewsMessage}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-busy={loading}>
          {loading
            ? Array.from({ length: perPage || reviews.length || 2 }, (_, index) => (
              <div
                key={index}
                className="border-2 border-[#661F30]/30 rounded-xl p-6 h-full animate-pulse"
                aria-hidden
              >
                <div className="h-4 w-28 bg-neutral-300 rounded mb-6" />
                <div className="h-3 w-full bg-neutral-300 rounded mb-2" />
                <div className="h-3 w-5/6 bg-neutral-300 rounded mb-2" />
                <div className="h-3 w-2/3 bg-neutral-300 rounded mb-8" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neutral-300" />
                  <div className="h-3 w-24 bg-neutral-300 rounded" />
                </div>
              </div>
            ))
            : reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
        </div>

        {totalPages > 1 && (
          <nav className="flex justify-center items-center mt-8 space-x-2" aria-label="Strony opinii">
            <button
              type="button"
              onClick={() => loadReviews(page - 1, true)}
              disabled={page <= 1 || loading}
              className="p-2 disabled:opacity-40"
              aria-label="Poprzednia strona"
            >
              <img
                src={page <= 1 ? '/icons/arrow-left-pagination.svg' : '/icons/arrow-left-black-pagination.svg'}
                alt=""
                className="w-4 h-4"
              />
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const current = pageNumber === page;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => loadReviews(pageNumber, true)}
                  disabled={loading}
                  aria-current={current ? 'page' : undefined}
                  className={`w-8 h-8 flex items-center justify-center ${current ? 'text-black font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => loadReviews(page + 1, true)}
              disabled={page >= totalPages || loading}
              className="p-2 disabled:opacity-40"
              aria-label="Następna strona"
            >
              <img
                src={page >= totalPages ? '/icons/arrow-right-pagination.svg' : '/icons/arrow-right-black-pagination.svg'}
                alt=""
                className="w-4 h-4"
              />
            </button>
          </nav>
        )}

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
