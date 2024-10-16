import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component'; // Adjust based on your project structure

const DostawaPage = () => {
  return (
    <Layout title="Dostawa">
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Heading */}
          <div className="text-left mb-12">
            <h1 className="font-size-h1 font-bold text-dark-pastel-red">Dostawa</h1>
          </div>

          {/* Delivery Section */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              {/* Description Section */}
              <p className="font-size-text-medium text-neutral-darkest mb-8">
                Wasze zamówienia realizujemy do 24h od momentu ich otrzymania. Staramy się zawsze wysyłać jak najszybciej możemy, dlatego średni czas wysyłki jest o wiele krótszy. W weekend nie pracujemy, dlatego poniedziałki i kolejne dni robocze po świętach są u nas zawsze bardzo pracowite.
              </p>

              {/* Pricing and Shipping Options */}
              <div className="bg-light-beige p-8 rounded-lg" style={{ minHeight: '250px' }}>
                <h3 className="font-size-h3 font-bold text-neutral-darkest mb-6">Wysyłka możliwa jest:</h3>
                <ul className="mb-6">
                  <li className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Image src="/icons/inpost-icon.svg" alt="InPost" width={24} height={24} />
                      <span className="ml-2 text-neutral-darkest">Kurierem inPost</span>
                    </div>
                    <span className="font-semibold text-neutral-darkest">12,00 zł</span>
                  </li>
                  <li className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Image src="/icons/gls-icon.svg" alt="GLS" width={24} height={24} />
                      <span className="ml-2 text-neutral-darkest">Kurierem GLS</span>
                    </div>
                    <span className="font-semibold text-neutral-darkest">12,99 zł</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image src="/icons/gls-icon.svg" alt="GLS Free" width={24} height={24} />
                      <span className="ml-2 text-neutral-darkest">Kurierem GLS (powyżej 300 zł)</span>
                    </div>
                    <span className="font-semibold text-neutral-darkest">0,00 zł</span>
                  </li>
                </ul>
                <p className="text-neutral-darkest">
                  Czas dostawy powyższych przewoźników to od <strong>24h do 48h</strong> od momentu wysłania przez nas przesyłki.
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative h-full rounded-lg overflow-hidden" style={{ minHeight: '350px' }}>
              <Image
                src="/images/dostawa.png" // Replace with the actual image path
                alt="Dostawa"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DostawaPage;
