import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { useRouter } from 'next/router';

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const { key, login } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!key || !login) {
      router.replace('/logowanie'); // Redirect if missing required parameters
    }
  }, [key, login, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Hasła się nie zgadzają.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/resetpassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password }),
      });

      if (response.ok) {
        setMessage('Hasło zostało pomyślnie zmienione.');
        setTimeout(() => router.push('/logowanie'), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Nie udało się zmienić hasła.');
      }
    } catch {
      setError('Nie udało się zmienić hasła. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Hvyt | Resetuj Hasło">
      <div className="bg-[#F9F6F2] flex justify-center items-center mt-12">
        <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section */}
            <div
              className="p-10 w-full md:w-1/2 flex flex-col justify-start"
              style={{
                backgroundImage: `url('/images/image-logowanie.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h1 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
                Zmień swoje hasło
              </h1>
            </div>

            {/* Right Section */}
            <div className="p-10 w-full md:w-1/2 flex flex-col justify-center">
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Password Input */}
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none font-light text-black text-left"
                    aria-label="Nowe hasło"
                    required
                  />
                  <span
                    className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
                      password ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Nowe hasło<span className="text-red-500">*</span>
                  </span>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none font-light text-black text-left"
                    aria-label="Powtórz hasło"
                    required
                  />
                  <span
                    className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${
                      confirmPassword ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Powtórz hasło<span className="text-red-500">*</span>
                  </span>
                </div>

                {/* Messages */}
                {message && (
                  <p className="text-green-600 text-sm" aria-live="polite">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-sm" aria-live="polite">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-full"
                  disabled={loading}
                >
                  {loading ? 'Ładowanie...' : 'Zmień hasło'}
                </button>
              </form>

              {/* Back to Login */}
              <button
                onClick={() => router.push('/logowanie')}
                className="mt-4 py-3 px-6 border-2 border-black text-black rounded-full"
              >
                Wróć do logowania
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
