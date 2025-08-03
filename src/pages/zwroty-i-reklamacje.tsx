import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';
import Head from 'next/head';

const ZwrotyReklamacjePage = () => {
  return (
    <Layout title="Zwroty i Reklamacje">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/zwroty-i-reklamacje`}
        />
      </Head>
      <section className="w-full">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-0 mt-16 md:mt-4">
          <div className="flex flex-col md:flex-row gap-10 font-light text-[18px] items-start mb-12">
            <div className="flex-1 md:flex-[3]">
              <h1 className="font-size-h1 font-bold text-black mb-6">Zwroty</h1>
              <p className="font-size-text-medium">
                Twój komfort zakupów jest dla nas priorytetem. Jeśli zakupione
                produkty nie spełniają Twoich oczekiwań, masz 30 dni na złożenie
                wniosku o zwrot.
              </p>
              <p className="mt-4">
                Aby zwrot został zaakceptowany, upewnij się, że:
              </p>
              <ul className="mt-4 list-disc list-inside ml-4">
                <li>Produkt nie był używany i jest w stanie nienaruszonym.</li>
                <li>Został zapakowany w oryginalne opakowanie.</li>
                <li>Dołączono do niego wypełniony formularz zwrotu.</li>
              </ul>
              <div className="mt-4">
                <a
                  href="/downloads/formularz_reklamacyjny_HVYT"
                  className="underline inline-flex items-center px-4 py-2 "
                  aria-label="Formularz zwrotu"
                >
                  <Image
                    src="/icons/download-single.svg"
                    alt="Download Icon"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  Formularz zwrotu
                </a>
              </div>
              <p className="font-size-h3 mt-4">
                Prosimy o przesłanie zwracanego towaru na adres:
              </p>
              <address className="mt-2 font-bold not-italic">
                HVYT
                <br />
                Głogoczów 996
                <br />
                32-444 Głogoczów
              </address>
              <p className="mt-4 text-dark">
                Koszty przesyłki zwrotnej ponosi kupujący. Możesz w tym celu
                skorzystać z
              </p>
              <div className="flex items-center mt-4">
                <Image
                  src="/images/wygodne-zwroty.png"
                  alt="Ikona Wygodnych Zwrotów"
                  width={79}
                  height={21}
                  className="mr-2"
                />
                <Link
                  href="/wygodne-zwroty"
                  className="text-black underline hover:text-gray-700 hover:no-underline"
                >
                  Wygodnych Zwrotów
                </Link>
              </div>
              <p className="mt-4">
                Po otrzymaniu Twojej przesyłki, dokonamy zwrotu płatności na
                Twoje konto w ciągu
                <span className="font-bold"> 7 dni roboczych</span>.
              </p>
            </div>

            {/* Image Column */}
            <div className="w-full h-[400px] md:flex-[2] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden relative">
              <Image
                src="/images/zwroty-zdjecie.png"
                alt="Zwroty"
                layout="fill"
                objectFit="cover"
                className="rounded-[16px]"
              />
            </div>
          </div>

          {/* Reklamacje Section */}
          <div className="flex flex-col md:flex-row gap-8 font-light text-[18px] items-start">
            {/* Text Column */}
            <div className="flex-1 md:flex-[3]">
              <h2 className="font-size-h1 font-bold mb-6">Reklamacje</h2>
              <p className="text-dark">
                Niestety, czasem rzeczy nie idą zawsze zgodnie z planem. Jeśli
                zauważysz wadę w zakupionym produkcie, nie wahaj się złożyć
                reklamacji.
              </p>
              <p className="mt-4">
                Jeżeli otrzymany towar jest wadliwy lub niezgodny z zamówieniem:
              </p>
              <ul className="mt-4 list-disc list-inside ml-4">
                <li>
                  Skontaktuj się z naszym działem obsługi klienta, wysyłając
                  e-mail na adres: hello@hvyt.pl
                </li>
                <li>
                  Opisz szczegółowo problem, dołączając zdjęcia wadliwego
                  produktu.
                </li>
                <li>
                  Wypełnij formularz reklamacyjny i dołącz go do wiadomości.
                </li>
              </ul>
              <p className="mt-4">
                Po otrzymaniu wiadomości o reklamacji, poinformujemy Cię o
                dalszych krokach. W przypadku uznania reklamacji, towar zostanie
                wymieniony na nowy lub, jeśli to niemożliwe, zwrócimy pełną
                kwotę zakupu.
              </p>
              <p className="mt-4">
                Nie musisz się martwić, jeśli coś pójdzie nie tak. Jesteśmy do
                Twojej dyspozycji, aby odpowiedzieć na pytania i pomóc Ci w
                procesie zwrotów i reklamacji. Chcemy, aby Twoje doświadczenie
                zakupowe było jak najbardziej satysfakcjonujące!
              </p>
            </div>

            {/* Image Column for Reklamacje (optional, if needed) */}
            <div className="flex-1 md:flex-[2]"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ZwrotyReklamacjePage;
