import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';

const PotwierdzeniePage: React.FC = () => {
  const router = useRouter();
  const { email } = router.query; // If needed, you can use this email

  return (
    <Layout title="Potwierdzenie aktywacji email">
      <div className="md:mt-0 rounded-[25px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
        <img src="/icons/sukces.svg" alt="Sukces" className="w-28 h-28 mb-4" />
        <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
          Twoje konto zostało pomyślnie aktywowane!
        </h1>
        <p className="text-[18px] text-black text-center font-light mb-6">
          Dziękujemy za założenie konta. Twoje konto jest teraz aktywne, a Ty
          możesz w pełni korzystać z wszystkich funkcji naszej platformy.
        </p>
        <Link
          href="/logowanie"
          className="w-full py-3 px-6 border-2 border-black text-black rounded-full text-center"
        >
          Zaloguj się
        </Link>
      </div>
    </Layout>
  );
};

export default PotwierdzeniePage;
