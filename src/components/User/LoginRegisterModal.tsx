import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.component';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        if (isLogin) {
          router.push('/user/moje-konto');
        } else {
          setIsLogin(true);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Hasło</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
            </button>
          )}
        </form>

        <p className="text-sm mt-4">
          {isLogin ? (
            <>
              Nie masz jeszcze konta?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 underline"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 underline"
              >
                Zaloguj się
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginRegisterModal;
