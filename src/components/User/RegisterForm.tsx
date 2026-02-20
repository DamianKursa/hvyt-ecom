import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useI18n } from '@/utils/hooks/useI18n';

const RegisterForm: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    lang: router.locale
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password' && value.length < 8) {
      setPasswordError(t.auth.passwordMinLength);
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
        const errorData = await response.json();
        // Extract the exact error message from the response
        const exactMessage =
          errorData?.message ||
          t.auth.loginError;
        setError(exactMessage);
      }
    } catch (err) {
      setError(t.auth.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg flex items-center bg-red-500 text-white">
          <span>{error}</span>
        </div>
      )}
      {/* Success Message */}
      {success && (
        <div className="mt-4 px-4 py-2 rounded-lg flex items-center bg-[#2A5E45] text-white">
          <img
            src="/icons/circle-check.svg"
            alt={t.common.success}
            className="w-5 h-5 mr-2"
          />
          <span>{t.common.success}</span>
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
          {t.form.firstName}<span className="text-red-500">*</span>
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
          {t.form.lastName}<span className="text-red-500">*</span>
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
          {t.auth.emailAddress}<span className="text-red-500">*</span>
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
          {t.auth.password}<span className="text-red-500">*</span>
        </span>
        <img
          src="/icons/show-pass.svg"
          alt={t.common.showPassword}
          className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
        {passwordError && (
          <p className="text-red-500 text-xs mt-1 px-2">{passwordError}</p>
        )}
      </div>

      <p className="text-[14px] ml-[8px] font-light mt-4">
        {`${t.auth.messageAcceptance} `}
        <Link href="/regulamin" className="underline">
          {t.legal.terms}
        </Link>
        {`.  ${t.auth.messageReadPrivacyPolicy} `}
        <Link href="/polityka-prywatnosci" className="underline">
          {t.legal.privacy}
        </Link>
        .
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-full flex justify-center items-center"
        disabled={loading}
      >
        {loading ? t.modal.loading : t.auth.register}
      </button>
    </form>
  );
};

export default RegisterForm;
