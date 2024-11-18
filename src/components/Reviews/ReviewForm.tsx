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
    rating: 5, // Default to 5 stars
    consent: false,
  });

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert('Proszę zaakceptować zgodę.');
      return;
    }

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
      alert('Wystąpił błąd podczas przesyłania opinii.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6">Dodaj swoją opinię</h3>
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index + 1)}
              className={`text-lg ${
                formData.rating > index
                  ? 'text-dark-pastel-red'
                  : 'text-gray-300'
              } hover:text-dark-pastel-red transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        <span className="ml-2 text-lg font-medium">{formData.rating}/5</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Imię"
          className="border-b border-gray-300 focus:border-black outline-none px-2 py-1"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="border-b border-gray-300 focus:border-black outline-none px-2 py-1"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <textarea
        placeholder="Napisz opinię"
        className="border-b border-gray-300 focus:border-black outline-none w-full px-2 py-1 mb-6"
        rows={4}
        required
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="consent"
          className="w-5 h-5 border-gray-300 rounded"
          onChange={(e) =>
            setFormData({ ...formData, consent: e.target.checked })
          }
        />
        <label htmlFor="consent" className="text-sm">
          Tutaj zgody do zaakceptowania
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-dark-pastel-red transition-all"
        >
          Dodaj opinię
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
