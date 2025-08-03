import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';

const ActivationPage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query;

  return (
    <Layout title="Potwierdź email">
      <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center px-4 py-8">
        <div className="w-[1000px] md:mt-0 rounded-[25px] bg-white p-8 shadow-sm">
          <div className="max-w-[600px] w-full flex flex-col items-center justify-center mx-auto">
            <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
              Potwierdź email
            </h1>
            <img
              src="/icons/email-icon.svg"
              alt="Potwierdź email"
              className="w-28 h-28 mb-4"
            />

            <p className="text-[18px] text-black text-center font-light mb-2">
              Link aktywacyjny został wysłany na adres e-mail: {email}
            </p>
            <p className="text-[18px] text-black text-center font-light mb-6">
              W celu zakończenia rejestracji kliknij w link.
            </p>
            <div className="mt-6 space-y-2 self-start">
              <p className="font-bold">Problemy z linkiem?</p>
              <p className="text-sm">
                Nie widzisz maila? Sprawdź także w folderze spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivationPage;
