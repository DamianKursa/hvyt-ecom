import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Head from 'next/head';

const DostawaPage = () => {
  return (
    <Layout title="Hvyt | Dostawa">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/dostawa`}
        />
      </Head>
      <section className="w-full py-16 px-4 md:px-0 bg-light-beige">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Delivery Section */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(860px,1fr)_minmax(500px,1fr)] rounded-[24px] bg-pastel-brown gap-4 md:p-4 md:p-0">
            {/* Content Section */}
            <div className="my-[75px] flex flex-col justify-between px-4 md:px-10 min-w-0 md:min-w-[860px]">
              {/* Heading */}
              <div className="text-left mb-[40px]">
                <h1 className="text-[40px] md:text-[56px] font-bold text-neutral-darkest">
                  Dostawa
                </h1>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-neutral-darkest mb-2">
                  Wasze zamówienia realizujemy do 24h od momentu ich otrzymania.
                </h3>
                <p className="text-[18px] font-light text-neutral-darkest mb-2">
                  Staramy się zawsze wysyłać jak najszybciej możemy, dlatego
                  średni czas wysyłki jest o wiele krótszy. W weekend nie
                  pracujemy, dlatego poniedziałki i kolejne dni robocze Po
                  Świętach są u nas zawsze bardzo pracowite.
                </p>
                <p className="text-[18px] font-light text-neutral-darkest mb-[40px]"></p>

                <div>
                  <h3 className="text-[20px] font-bold text-neutral-darkest mb-6">
                    Wysyłka możliwa jest:
                  </h3>
                  <ul className="space-y-8">
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Kurierem InPost
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        18,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Paczkomaty InPost
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        15,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Punkty GLS
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        15,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Kurierem GLS
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        15,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Kurierem GLS Pobranie
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        25,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Kurierem GLS (powyżej 300 zł)
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        0,00 zł
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="w-[340px] flex flex-col items-start md:flex-row md:justify-between md:items-center md:space-x-4">
                        <span className="text-[16px] text-neutral-darkest font-light">
                          Paczkomaty InPost (powyżej 300 zł)
                        </span>
                        <div className="min-w-[97px] flex px-4 py-1 flex-row bg-white rounded-[8px]">
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
                      <span className="text-[18px] font-bold min-w-[120px] md:text-start text-end whitespace-nowrap mt-2 md:mt-0">
                        0,00 zł
                      </span>
                    </li>
                  </ul>
                  <p className="text-[18px] font-light text-neutral-darkest mt-10">
                    Czas dostawy powyższych przewoźników to od{' '}
                    <span className="font-bold">24h do 48h</span> od momentu
                    wysłania przez nas przesyłki.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="overflow-hidden rounded-[24px] relative min-w-0 md:min-w-[500px] h-64 md:h-auto">
              <Image
                src="/images/hvyt(1).png"
                alt="Dostawa"
                layout="fill"
                objectFit="cover"
                className="rounded-[16px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DostawaPage;
