import React, { useState, useEffect } from 'react';
import ReviewForm from '@/components/Reviews/ReviewForm';
import { fetchProductReviews } from '@/utils/api/woocommerce';
import Image from 'next/image';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

const Reviews = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
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

  if (loading) return <p>Loading reviews...</p>;

  return (
    <section className="bg-light py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold">Klienci o HVYT</h2>
        <p className="text-lg mb-6">
          Sprawdź co mówią osoby, które kupiły nasze produkty lub podziel się
          swoją opinią.
        </p>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-6 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/placeholder-user.jpg" // Replace with user images if available
                      alt={review.reviewer}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{review.reviewer}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date_created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm">{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews available for this product.</p>
        )}
        {submitted && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
            Dziękujemy za podzielenie się Twoją opinią.
          </div>
        )}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-6 px-4 py-2 bg-black text-white rounded-full"
        >
          {showForm ? 'Schowaj formularz' : 'Dodaj swoją opinię'}
        </button>
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
