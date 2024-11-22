import React, { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    nazwisko: '', // New field for surname
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/logowanie'), 3000); // Redirect to login page
      } else {
        const data = await response.json();
        setError(data.message || 'Error creating account');
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
        <label className="block text-sm font-medium mb-2">Imię*</label>
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
        <label className="block text-sm font-medium mb-2">Nazwisko*</label>
        <input
          type="text"
          value={formData.nazwisko}
          onChange={(e) =>
            setFormData({ ...formData, nazwisko: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Adres email*</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">
          Konto zostało pomyślnie utworzone! Przekierowanie...
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? 'Ładowanie...' : 'Zarejestruj się'}
      </button>
    </form>
  );
};

export default RegisterForm;
