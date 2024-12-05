import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';

const PotwierdzeniePage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query; // Retrieve email from the query string

  return (
    <Layout title="Potwiedzenie aktywacji email">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            Twoje konto zostało pomyślnie aktywowane!
          </h1>
          <img
            src="/icons/sukces.svg" // Update with the correct icon path
            alt="Email Icon"
            className="mx-auto mb-4"
          />
          <p className="text-sm mb-6">
            Dziękujemy za założenie konta. Twoje konto jest teraz aktywne, a Ty
            możesz w pełni korzystać z wszystkich funkcji naszej platformy.
          </p>
          <Link
            href="/logowanie"
            className="w-full py-3 px-6 border-2 border-black text-black rounded-full"
          >
            Zaloguj się
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PotwierdzeniePage;
