import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginForm: React.FC<{ onForgotPassword: () => void }> = ({
  onForgotPassword,
}) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null); // Track focused field
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter(); // Next.js router for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to user account page
        router.push('/moje-konto/moje-zamowienia');
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="relative">
        <input
          type="text"
          value={formData.username}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full text-left border-b border-gray-300 focus:border-black px-2 py-2 text-black focus:outline-none font-light"
          required
        />
        <span
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
            formData.username || focusedField === 'username'
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
          className="w-full text-left border-b border-gray-300 focus:border-black px-2 py-2 text-black focus:outline-none font-light"
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
      </div>

      {/* Forgot Password Link */}
      <p
        className="text-sm underline font-light text-black mt-2 cursor-pointer"
        onClick={onForgotPassword}
      >
        Nie pamiętam hasła
      </p>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-full"
        disabled={loading}
      >
        {loading ? 'Ładowanie...' : 'Zaloguj się'}
      </button>
    </form>
  );
};

export default LoginForm;
