import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import CartProgress from '@/components/Cart/CartProgress';
import Head from 'next/head';

const ZamowienieOtrzymane = () => {
  return (
    <Layout title="Dziękujemy za zamówienie!">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/zamowienie-otrzymane`}
        />
      </Head>
      {/* Cart Progress */}
      <div className="mt-[55px] md:mt-0 container mx-auto px-4 mb-16 md:px-0">
        <CartProgress />
      </div>

      {/* Desktop Version */}
      <div className="mx-4 xl:mx-0 hidden md:grid grid-cols-10 min-h-[750px] rounded-[24px] overflow-hidden mb-10">
        <div className="col-span-4 bg-[#F0E0CF] flex flex-col justify-center pl-[40px]">
          <h1 className="text-[48px] font-bold text-black leading-tight">
            Dziękujemy za
            <br /> zakupy w naszym sklepie!
          </h1>
          <p className="text-[18px] mt-8 font-light text-black">
            Dziękujemy za zamówienie! <br />
            Aktualnie przetwarzamy Twoją płatność.
          </p>
        </div>
        <div
          className="col-span-6 relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/dziekujemy-hero.png')" }}
        >
          <div className="absolute bottom-0 left-0 bg-[#F0E0CF] w-[250px] h-[250px]" />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden mb-10 mx-4 rounded-[24px] overflow-hidden">
        <div className="bg-[#F0E0CF] p-4">
          <h1 className="text-[36px] mt-4 font-bold text-black leading-tight">
            Dziękujemy za
            <br /> zakupy w naszym sklepie!
          </h1>
          <p className="text-[18px] pb-8 mt-4 font-light text-black">
            Aktualnie przetwarzamy Twoją płatność.
          </p>
        </div>
        <div className="relative" style={{ height: '250px' }}>
          <img
            src="/images/dziekujemy-hero.png"
            alt="Dziękujemy Hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-0 left-0 bg-[#F0E0CF]"
            style={{ width: '154px', height: '154px' }}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 md:px-0 py-10">
        <div className="text-center mt-10">
          <Link
            href="/"
            className="w-full px-8 py-4 bg-black text-neutral-white text-[24px] font-light rounded-full hover:bg-neutral-dark transition"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ZamowienieOtrzymane;
