import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '@/context/UserContext';
import { useI18n } from '@/utils/hooks/useI18n';

const LoginForm: React.FC<{ onForgotPassword: () => void }> = ({
  onForgotPassword,
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUserContext();
  const { redirect } = router.query as { redirect?: string };

  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, '');
  };

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
        const userData = await response.json();
        setUser(userData);
        router.push(redirect && redirect.length > 0 ? redirect : '/moje-konto/moje-zamowienia');
      } else {
        const data = await response.json();
        const cleanedMessage =
          data.message && typeof data.message === 'string'
            ? stripHtmlTags(data.message)
            : t.auth.loginError;
        setError(cleanedMessage);
      }
    } catch (err) {
      setError(t.auth.loginError);
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
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.username || focusedField === 'username'
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
          className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.password || focusedField === 'password'
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
      </div>
      {/* Forgot Password Link */}
      <p
        className="text-sm underline font-light text-black mt-2 cursor-pointer"
        onClick={onForgotPassword}
      >
        {t.auth.forgotPassword}
      </p>
      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg flex items-center bg-red-500 text-white">
          <span>{error}</span>
        </div>
      )}
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-full"
        disabled={loading}
      >
        {loading ? t.auth.loading : t.auth.login}
      </button>
    </form>
  );
};

export default LoginForm;
