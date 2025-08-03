import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';

const PotwierdzeniePage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;

  return (
    <Layout title="Potwierdź email">
      <div className="md:mt-0 rounded-[25px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
        <img
          src="/icons/email.svg"
          alt="Potwierdź email"
          className="w-28 h-28 mb-4"
        />
        <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
          Potwierdź email
        </h1>
        <p className="text-[18px] text-black text-center font-light mb-2">
          Link aktywacyjny został wysłany na adres e-mail: {email}
        </p>
        <p className="text-[18px] text-black text-center font-light mb-6">
          W celu zakończenia rejestracji kliknij w link.
        </p>

        <p className="font-semibold mb-2">Problemy z linkiem?</p>
        <p className="mb-1">Nie widzisz maila? Sprawdź także w folderze spam.</p>
      </div>
    </Layout>
  );
};

export default PotwierdzeniePage;
