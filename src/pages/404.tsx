import React from 'react';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <Layout title="404 - Nie znaleziono">
      <div className="mt-[64px] min-h-[500px] md:mt-0 rounded-[25px] py-[90px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
        <img
          src="/icons/empty-cart-icon.svg"
          alt="Pusty panel"
          className="w-28 h-28 mb-4"
        />
        <h2 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
          404 - Nie znaleziono strony
        </h2>
        <p className="text-[18px] text-black text-center font-light mb-6">
          Przepraszamy, ale ta strona nie istnieje. Przejdź do głównej strony
          lub sprawdź naszą ofertę.
        </p>
        <div className="flex gap-4">
          <Link href="/kategoria/uchwyty-meblowe" legacyBehavior>
            <a className="px-10 md:px-16 py-3 bg-black text-white rounded-full text-sm font-[16px]">
              Uchwyty
            </a>
          </Link>
          <Link href="/" legacyBehavior>
            <a className="px-6 md:px-16 py-3 border border-black text-black rounded-full text-sm font-medium">
              Strona Główna
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404;
