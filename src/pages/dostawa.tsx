import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';

const DostawaPage = () => {
  return (
    <Layout title="Dostawa">
      <section className="w-full py-16 px-4 md:px-0 bg-light-beige">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Delivery Section */}
          <div
            className="grid rounded-[24px] bg-pastel-brown gap-4"
            style={{
              gridTemplateColumns: 'minmax(860px, 1fr) minmax(500px, 1fr)',
            }}
          >
            {/* Image Section */}
            <div className="overflow-hidden rounded-[24px] md:order-last relative min-w-[500px]">
              <Image
                src="/images/dostawa.png"
                alt="Dostawa"
                layout="fill"
                objectFit="cover"
                className="rounded-[16px] object-cover"
              />
              {/* Overlay Icon */}
              <div className="absolute inset-0 flex justify-center items-center">
                <Image
                  src="/icons/hvyt-icon.svg"
                  alt="HVYT Icon"
                  width={229}
                  height={144}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="my-[75px] flex flex-col justify-between px-10 min-w-[860px]">
              {/* Heading */}
              <div className="text-left mb-[40px]">
                <h1 className="text-[40px] md:text-[56px] font-bold text-black">
                  Dostawa
                </h1>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-black mb-2">
                  Wasze zamówienia realizujemy do 24h od momentu ich otrzymania.
                </h3>
                <p className="text-[18px] font-light text-black mb-2">
                  Staramy się zawsze wysyłać jak najszybciej możemy, dlatego
                  średni czas wysyłki jest o wiele krótszy.
                </p>
                <p className="text-[18px] font-light text-black mb-[40px]">
                  W weekend nie pracujemy, dlatego poniedziałki i kolejne dni
                  robocze po świętach są u nas zawsze bardzo pracowite.
                </p>

                <div>
                  <h3 className="text-[20px] font-bold text-black mb-6">
                    Wysyłka możliwa jest:
                  </h3>
                  <ul className="space-y-8">
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex justify-between items-center space-x-4">
                        <span className="text-[16px] text-black font-light">
                          Kurierem inPost
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white p-2 rounded-[8px]">
                          <Image
                            src="/icons/truck.svg"
                            alt="Truck Icon"
                            width={14}
                            height={14}
                          />
                          <span className="text-[14px] ml-[8px] font-bold">
                            InPost
                          </span>
                        </div>
                      </div>
                      <span className="text-[18px] font-bold">12,00 zł</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex justify-between flex items-center space-x-4">
                        <span className="text-[16px] text-black font-light">
                          Kurierem GLS
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white p-2 rounded-[8px]">
                          <Image
                            src="/icons/truck.svg"
                            alt="Truck Icon"
                            width={14}
                            height={14}
                          />
                          <span className="text-[14px] ml-[8px] font-bold">
                            GLS
                          </span>
                        </div>
                      </div>
                      <span className="text-[18px] font-bold">12,99 zł</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex justify-between flex items-center space-x-4">
                        <span className="text-[16px] text-black font-light">
                          Kurierem GLS (powyżej 300 zł)
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white p-2 rounded-[8px]">
                          <Image
                            src="/icons/truck.svg"
                            alt="Truck Icon"
                            width={14}
                            height={14}
                          />
                          <span className="text-[14px] ml-[8px] font-bold">
                            GLS
                          </span>
                        </div>
                      </div>
                      <span className="text-[18px] font-bold">0,00 zł</span>
                    </li>
                  </ul>
                  <p className="text-[18px] font-light text-black mt-10">
                    Czas dostawy powyższych przewoźników to od{' '}
                    <span className="font-bold">24h do 48h</span> od momentu
                    wysłania przez nas przesyłki.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DostawaPage;
