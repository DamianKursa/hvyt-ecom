import React, { useState } from 'react';
import { submitProductReview } from '@/utils/api/woocommerce';

const ReviewForm = ({
  productId,
  onSubmit,
}: {
  productId: number;
  onSubmit: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitProductReview(
        productId,
        formData.name,
        formData.email,
        formData.content,
        formData.rating,
      );
      onSubmit();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Imię"
          className="border p-2 rounded w-full"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="border p-2 rounded w-full"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <textarea
        placeholder="Napisz opinię"
        className="border p-2 rounded w-full mt-4"
        rows={4}
        required
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      <select
        value={formData.rating}
        onChange={(e) =>
          setFormData({ ...formData, rating: parseInt(e.target.value, 10) })
        }
        className="border p-2 rounded w-full mt-4"
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <option key={rating} value={rating}>
            {rating} Star{rating > 1 && 's'}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-black text-white rounded-full w-full"
      >
        Dodaj opinię
      </button>
    </form>
  );
};

export default ReviewForm;
