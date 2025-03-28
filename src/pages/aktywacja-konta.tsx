import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';

const ActivationPage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query; // Retrieve email from the query string

  return (
    <Layout title="Aktywacja konta">
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Potwierdź email</h1>
          <p className="text-sm mb-6">
            <span className="font-medium text-gray-700"> {email}</span>.
            <br />W celu zakończenia rejestracji kliknij w link.
          </p>
          <img
            src="/icons/email-icon.svg" // Update with the correct icon path
            alt="Email Icon"
            className="mx-auto mb-4"
          />
          <h2 className="text-md font-semibold mb-2">Problemy z linkiem?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Nie widzisz maila? Sprawdź także w folderze spam.
            <br />
            Mail nie dotarł?{' '}
            <a href="#" className="text-red-500">
              Wyślij ponownie
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ActivationPage;
