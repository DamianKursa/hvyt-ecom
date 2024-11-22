import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        router.push('/moje-konto');
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
      <div>
        <label className="block text-sm font-medium mb-2">Adres email*</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Hasło*</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <p
          className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline"
          onClick={() => router.push('/zapomniane-haslo')}
        >
          Nie pamiętam hasła
        </p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? 'Ładowanie...' : 'Zaloguj się'}
      </button>
    </form>
  );
};

export default LoginForm;
