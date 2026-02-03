import React, { useState } from 'react';
import PasswordChangeConfirmation from '@/components/User/PasswordChangeConfirmation';
import { useI18n } from '@/utils/hooks/useI18n';

const ForgotPassword: React.FC<{ onBackToLogin: () => void }> = ({
  onBackToLogin,
}) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [message, setMessage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage(true);

    try {
      const response = await fetch('/api/auth/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to send reset email.');
        setMessage(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setMessage(false);
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return <PasswordChangeConfirmation onBackToLogin={onBackToLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full  md:h-[305px] bg-white rounded-[40px] shadow-md">
      <div
        className="p-10 w-full md:w-1/2 flex flex-col"
        style={{
          backgroundImage: `url('/images/image-logowanie.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-2xl font-bold text-black">{t.auth.forgotPassword}</h1>
      </div>

      <div className="p-10 w-full md:w-1/2 flex flex-col justify-center items-center">
        <form onSubmit={handleForgotPassword} className="w-full space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none font-light text-black text-left"
              required
            />
            <span
              className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
                email || focusedField === 'email' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {t.auth.emailAddress}<span className="text-red-500">*</span>
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full"
            disabled={loading}
          >
            {loading ? t.auth.loading : t.auth.sendResetLink}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3 border-2 border-black text-black rounded-full"
          >
            {t.auth.backToLogin}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
