import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  const [passwordError, setPasswordError] = useState(''); // Password validation error
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password length
    if (name === 'password' && value.length < 8) {
      setPasswordError('Hasło musi mieć co najmniej 8 znaków.');
    } else {
      setPasswordError('');
    }
  };

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
      {/* Success and Error Messages */}
      {error && (
        <div
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex flex-col"
          dangerouslySetInnerHTML={{ __html: error }}
        ></div>
      )}
      {success && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
          <img
            src="/icons/circle-check.svg"
            alt="Success"
            className="w-5 h-5 mr-2"
          />
          <span>Konto zostało pomyślnie utworzone!</span>
        </div>
      )}

      {/* First Name Input */}
      <div className="relative">
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onFocus={() => setFocusedField('first_name')}
          onBlur={() => setFocusedField(null)}
          onChange={handleInputChange}
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
          name="last_name"
          value={formData.last_name}
          onFocus={() => setFocusedField('last_name')}
          onBlur={() => setFocusedField(null)}
          onChange={handleInputChange}
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
          name="email"
          value={formData.email}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          onChange={handleInputChange}
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
          name="password"
          value={formData.password}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          onChange={handleInputChange}
          className={`w-full border-b ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          } focus:border-black px-2 py-2 focus:outline-none placeholder:font-light placeholder:text-gray-500`}
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
          src="/icons/show-pass.svg"
          alt="Show Password"
          className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
        {passwordError && (
          <p className="text-red-500 text-xs mt-1 px-2">{passwordError}</p>
        )}
      </div>

      <p className="text-[14px] ml-[8px] font-light mt-4">
        Zakładając konto, akceptujesz nasz
        <Link href="/regulamin" className="underline">
          Regulamin
        </Link>
        . Przeczytaj naszą{' '}
        <Link href="/polityka-prywatnosci" className="underline">
          Politykę prywatności
        </Link>
        .
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-full flex justify-center items-center"
        disabled={loading}
      >
        {loading ? 'Ładowanie...' : 'Zarejestruj się'}
      </button>
    </form>
  );
};

export default RegisterForm;
