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
              <p className="font-size-text-medium text-neutral-darkest">
                Wasze zamówienia realizujemy do 24h od momentu ich otrzymania. Staramy się zawsze wysyłać jak najszybciej możemy, dlatego średni czas wysyłki jest o wiele krótszy. 
                W weekend nie pracujemy, dlatego poniedziałki i kolejne dni robocze po świętach są u nas zawsze bardzo pracowite.
              </p>

              <h3 className="font-size-h3 font-bold mt-8">Wysyłka możliwa jest przez:</h3>
              <ul className="mt-4 list-disc list-inside">
                <li>Kurierem inPost - 12,00 zł</li>
                <li>Kurierem GLS - 12,99 zł</li>
                <li>Kurierem GLS (powyżej 300 zł) - 0,00 zł</li>
              </ul>

              <p className="mt-4">
                Czas dostawy powyższych przewoźników to od <strong>24h do 48h</strong> od momentu wysłania przez nas przesyłki.
              </p>
            </div>

            {/* Image */}
            <div className="relative h-full rounded-lg overflow-hidden">
              <Image
                src="/images/dostawa_image.jpg" // Replace with the actual image path
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
