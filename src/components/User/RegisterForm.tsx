import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface RegisterFormProps {
  toggleForm: () => void; // Callback to toggle between forms
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    username: '',
    nazwisko: '',
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
      <div className="relative">
        <input
          type="text"
          value={formData.username}
          placeholder="Imię*"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none"
          required
        />
      </div>
      <div className="relative">
        <input
          type="text"
          value={formData.nazwisko}
          placeholder="Nazwisko*"
          onChange={(e) =>
            setFormData({ ...formData, nazwisko: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none"
          required
        />
      </div>
      <div className="relative">
        <input
          type="email"
          value={formData.email}
          placeholder="Adres email*"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none"
          required
        />
      </div>
      <div className="relative">
        <input
          type="password"
          value={formData.password}
          placeholder="Hasło*"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full border-b border-gray-300 focus:border-black px-2 py-2 focus:outline-none"
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
      <hr className="my-6 border-gray-300" />
      <button
        type="button"
        onClick={toggleForm}
        className="w-full py-2 px-6 rounded-full bg-white text-black border border-black font-bold"
      >
        Zaloguj się
      </button>
    </form>
  );
};

export default RegisterForm;
