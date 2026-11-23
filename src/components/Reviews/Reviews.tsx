import React, { useState, useEffect, useRef } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import ExpandableSection from '@/components/UI/ExpandableSection';
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
  onTotal,
}: {
  productId: number;
  productIds?: number[];
  onTotal?: (total: number) => void;
}) => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const thanksRef = useRef<HTMLDivElement>(null);
  const productQuery = Array.from(new Set(
    [productId, ...productIds]
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0),
  )).join(',');

  const loadReviews = async (nextPage: number, append: boolean) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productQuery)}&page=${nextPage}`);
      if (!res.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.reviews;
      const nextReviews = Array.isArray(list) ? list : [];
      setReviews((current) => (append ? [...current, ...nextReviews] : nextReviews));
      setPage(Number(data?.page) || nextPage);
      setPerPage(Number(data?.perPage) || 0);
      setTotal(Math.max(0, Number(data?.total) || nextReviews.length));
      setTotalPages(Math.max(0, Number(data?.totalPages) || 0));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setReviews([]);
    setTotal(null);
    loadReviews(1, false);
  }, [productQuery]);

  useEffect(() => {
    if (total !== null) onTotal?.(total);
  }, [total, onTotal]);

  useEffect(() => {
    const openVisibleSection = () => {
      if (!sectionRef.current || sectionRef.current.getClientRects().length === 0) return;
      setExpanded(true);
    };
    window.addEventListener('hvyt-open-product-reviews', openVisibleSection);
    return () => window.removeEventListener('hvyt-open-product-reviews', openVisibleSection);
  }, []);

  useEffect(() => {
    if (!submitted) return;
    thanksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [submitted]);

  const handleReviewSubmit = async () => {
    setSubmitted(true);
    setShowForm(false);
  };

  const title = total === null
    ? t.product.productReviews
    : `${t.product.productReviews} (${total})`;
  const hasMore = page < totalPages;

  return (
    <div ref={sectionRef} data-product-reviews className="scroll-mt-24 md:scroll-mt-36">
    <ExpandableSection
      title={title}
      expanded={expanded}
      onToggle={() => setExpanded((open) => !open)}
    >
      <div className="flex flex-col gap- pt-[8px]" aria-busy={loading || loadingMore}>
        {loading
          ? Array.from({ length: perPage || 2 }, (_, index) => (
            <div key={index} className="animate-pulse" aria-hidden>
              <div className="h-5 w-40 bg-neutral-300 rounded mb-4" />
              <div className="h-4 w-full bg-neutral-300 rounded mb-2" />
              <div className="h-4 w-5/6 bg-neutral-300 rounded mb-2" />
              <div className="h-4 w-2/3 bg-neutral-300 rounded mb-4" />
              <div className="h-4 w-24 bg-neutral-300 rounded" />
            </div>
          ))
          : reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
      </div>

      {submitted && (
        <div ref={thanksRef} className="mt-6 scroll-mt-28">
          <div className="inline-flex items-center bg-green-800 text-white px-4 py-2 rounded-[25px]">
            <img
              src="/icons/circle-check.svg"
              alt=""
              className="w-5 h-5 mr-2"
            />
            <span>{t.reviews.thankYou}</span>
          </div>
        </div>
      )}

      {!loading && (hasMore || !showForm) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {hasMore && (
            <button
              type="button"
              onClick={() => loadReviews(page + 1, true)}
              disabled={loadingMore}
              className="px-6 py-3 text-[16px] font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-white transition-all disabled:opacity-50"
            >
              {t.common.showMore}
            </button>
          )}
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-6 py-3 text-[16px] font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-white transition-all"
            >
              {t.reviews.addReview} +
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="mt-6">
          <ReviewForm
            productId={productId}
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </ExpandableSection>
    </div>
  );
};

export default Reviews;
