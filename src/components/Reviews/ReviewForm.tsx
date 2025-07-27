import React, { useState } from 'react';
import Link from 'next/link';

const ReviewForm: React.FC<{ productId: number; onSubmit: () => void; onCancel: () => void }> = ({
  productId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    rating: 5,
    consent: false,
  });
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [k: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Uzupełnij imię';
    if (!formData.email.trim()) errors.email = 'Uzupełnij adres e-mail';
    if (!formData.content.trim()) errors.content = 'Napisz opinię';
    if (!formData.consent) errors.consent = 'Musisz zaakceptować zgodę';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: formData.name,
          email: formData.email,
          content: formData.content,
          rating: formData.rating,
          status: 'hold',
        }),
      });
      if (!res.ok) {
        throw new Error('Error submitting review');
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Wystąpił błąd podczas przesyłania opinii.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white w-full max-w-[900px] mx-4 p-6 rounded-[24px] shadow-lg"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
        aria-label="Close form"
      >
        &times;
      </button>
      <h3 className="text-xl font-bold mb-6">Dodaj swoją opinię</h3>
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index + 1)}
              className={`text-lg ${formData.rating > index
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Name Field */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Imię"
            className={`border-b ${fieldErrors.name
              ? 'border-[#A83232]'
              : 'border-gray-300'} focus:border-black outline-none px-2 py-2 w-full`}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {fieldErrors.name && (
            <div className="flex items-center text-[#A83232] text-sm mt-1">
              <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
              <span>{fieldErrors.name}</span>
            </div>
          )}
        </div>
        {/* Email Field */}
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="E-mail"
            className={`border-b ${fieldErrors.email
              ? 'border-[#A83232]'
              : 'border-gray-300'} focus:border-black outline-none px-2 py-2 w-full`}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {fieldErrors.email && (
            <div className="flex items-center text-[#A83232] text-sm mt-1">
              <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>
      </div>
      <textarea
        placeholder="Napisz opinię"
        className={`border-b ${fieldErrors.content ? 'border-[#A83232]' : 'border-gray-300'} focus:border-black outline-none w-full px-2 py-2 mb-6`}
        rows={4}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      {fieldErrors.content && (
        <div className="flex items-center text-[#A83232] text-sm mb-6 -mt-4">
          <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
          <span>{fieldErrors.content}</span>
        </div>
      )}
      {/* Removed file attachment section */}
      {/* Styled Checkbox */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) =>
              setFormData({ ...formData, consent: e.target.checked })
            }
            className="hidden"
          />
          <span
            className={`w-12 h-5 md:w-5 flex items-center justify-center border rounded ${formData.consent ? 'bg-black text-white' : 'border-black'
              }`}
          >
            {formData.consent && <img src="/icons/check.svg" alt="check" />}
          </span>
          <span>
            Potwierdzam, że zapoznałam/em się z treścią{' '}
            <Link className="underline" href="/regulamin">
              Regulaminu
            </Link>{' '}
            i{' '}
            <Link className="underline" href="/polityka-prywatnosci">
              Polityki Prywatności
            </Link>{' '}
            oraz akceptuję ich postanowienia.
          </span>
        </label>
        {fieldErrors.consent && (
          <div className="flex items-center text-[#A83232] text-sm mt-1">
            <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
            <span>{fieldErrors.consent}</span>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-[75px] font-light py-3 bg-black text-white rounded-full hover:bg-dark-pastel-red transition-all"
        >
          Dodaj opinię
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
