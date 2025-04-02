import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';

const ActivationPage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;

  return (
    <Layout title="Aktywacja konta">
      <div className="md:mt-0 rounded-[25px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
        <img src="/icons/Logo.svg" alt="Logo" className="w-28 h-28 mb-4" />
        <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
          Potwierdź email
        </h1>
        <p className="text-[18px] text-black text-center font-light mb-6">
          <span className="font-medium text-gray-700">{email}</span>.
          <br />W celu zakończenia rejestracji kliknij w link.
        </p>
        <h2 className="text-md font-semibold mb-2">Problemy z linkiem?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Nie widzisz maila? Sprawdź także w folderze spam.
        </p>
      </div>
    </Layout>
  );
};

export default ActivationPage;
