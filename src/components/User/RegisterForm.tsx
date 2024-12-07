import React, { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null); // Track focused field
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/aktywacja-konta?email=${formData.email}`);
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Wystąpił błąd podczas tworzenia konta');
      }
    } catch (err) {
      setError('Wystąpił błąd sieci. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name Input */}
      <div className="relative">
        <input
          type="text"
          value={formData.first_name}
          onFocus={() => setFocusedField('first_name')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none placeholder:font-light placeholder:text-gray-500"
          required
        />
        <span
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
            formData.first_name || focusedField === 'first_name'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
        >
          Imię<span className="text-red-500">*</span>
        </span>
      </div>

      {/* Last Name Input */}
      <div className="relative">
        <input
          type="text"
          value={formData.last_name}
          onFocus={() => setFocusedField('last_name')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none placeholder:font-light placeholder:text-gray-500"
          required
        />
        <span
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
            formData.last_name || focusedField === 'last_name'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
        >
          Nazwisko<span className="text-red-500">*</span>
        </span>
      </div>

      {/* Email Input */}
      <div className="relative">
        <input
          type="email"
          value={formData.email}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none placeholder:font-light placeholder:text-gray-500"
          required
        />
        <span
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
            formData.email || focusedField === 'email'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
        >
          Adres email<span className="text-red-500">*</span>
        </span>
      </div>

      {/* Password Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none placeholder:font-light placeholder:text-gray-500"
          required
        />
        <span
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
            formData.password || focusedField === 'password'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
        >
          Hasło<span className="text-red-500">*</span>
        </span>
        <img
          src="/icons/show-pass.svg" // Replace with actual path
          alt="Show Password"
          className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
        {/* Additional Text */}
        <p className="text-[12px] mt-1 px-2 font-light">
          Twoje hasło musi mieć co najmniej 8 znaków.
        </p>
      </div>

      <p className="text-[14px] font-light mt-4">
        Zakładając konto, akceptujesz nasz{' '}
        <a href="/regulamin" className="underline">
          Regulamin
        </a>
        . Przeczytaj naszą{' '}
        <a href="/polityka-prywatnosci" className="underline">
          Politykę prywatności
        </a>
        .
      </p>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">
          Konto zostało pomyślnie utworzone! Przekierowanie...
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-full"
        disabled={loading}
      >
        {loading ? 'Ładowanie...' : 'Zarejestruj się'}
      </button>
    </form>
  );
};

export default RegisterForm;
