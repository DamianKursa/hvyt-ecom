import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component'; // Adjust based on your project structure

const ZwrotyReklamacjePage = () => {
  return (
    <Layout title="Zwroty i Reklamacje">
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Heading */}
          <div className="text-left mb-12">
            <h1 className="font-size-h1 font-bold text-dark-pastel-red">
              Zwroty
            </h1>
          </div>

          {/* Zwroty Section */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="font-size-text-medium text-neutral-darkest">
                Twój komfort zakupów jest dla nas priorytetem. Jeśli zakupione
                produkty nie spełniają Twoich oczekiwań, masz 30 dni na złożenie
                wniosku o zwrot.
              </p>
              <ul className="mt-4 list-disc list-inside">
                <li>Produkt nie był używany i jest w stanie nienaruszonym.</li>
                <li>Został zapakowany w oryginalne opakowanie.</li>
                <li>Dołączono do niego wypełniony formularz zwrotu.</li>
              </ul>
              <div className="mt-4">
                <a
                  href="#"
                  className="px-6 py-3 text-lg font-bold border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
                >
                  Button label
                </a>
              </div>

              <h3 className="font-size-h3 font-bold mt-8">
                Prosimy o przesłanie zwracanego towaru na adres:
              </h3>
              <address className="mt-2 not-italic">
                HVYT
                <br />
                Głogoczów 996
                <br />
                32-444 Głogoczów
              </address>
              <div id="ak_returns_banner_59c63e5c-3a7e-4b8e-8165-999687ba3bc4">
                [BANER-WZ]
              </div>
              <p className="mt-4 text-sm text-neutral-darkest">
                <div id="ak_returns_banner_59c63e5c-3a7e-4b8e-8165-999687ba3bc4">
                  [BANER-WZ]
                </div>
                Koszty przesyłki zwrotnej ponosi kupujący. Możesz w tym celu
                skorzystać z{' '}
                <a
                  href="#"
                  className="text-dark-pastel-red underline hover:no-underline"
                >
                  Wygodnych Zwrotów
                </a>
                .
              </p>

              <p className="mt-4">
                Po otrzymaniu Twojej przesyłki, dokonamy zwrotu płatności na
                Twoje konto w ciągu <strong>7 dni roboczych</strong>.
              </p>
            </div>

            {/* Image */}
            <div className="relative h-full rounded-lg overflow-hidden">
              <Image
                src="/images/zwroty_image.jpg" // Replace with the actual image path
                alt="Zwroty"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Reklamacje Section */}
          <div className="mt-12">
            <h2 className="font-size-h1 font-bold text-dark-pastel-red mb-4">
              Reklamacje
            </h2>
            <p className="font-size-text-medium text-neutral-darkest">
              Niestety, czasem rzeczy nie idą zawsze zgodnie z planem. Jeśli
              zauważysz wadę w zakupionym produkcie, nie wahaj się złożyć
              reklamacji.
            </p>
            <ul className="mt-4 list-disc list-inside">
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
              wymieniony na nowy lub, jeśli to niemożliwe, zwrócimy pełną kwotę
              zakupu.
            </p>
            <p className="mt-4">
              Nie musisz się martwić, jeśli coś pójdzie nie tak. Jesteśmy do
              Twojej dyspozycji, aby odpowiedzieć na pytania i pomóc Ci w
              procesie zwrotów i reklamacji.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ZwrotyReklamacjePage;
