import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component'; // Adjust based on your project structure

const WspolpracaPage = () => {
  return (
    <Layout title="Współpraca z nami">
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          <div className="text-left mb-12">
            <h1 className="font-size-h1 font-bold text-dark-pastel-red">Współpracuj z nami</h1>
            <p className="font-size-text-medium text-neutral-darkest">
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co chodzi na tej podstronie.
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co chodzi na tej podstronie.
            </p>
          </div>

          {/* Top Image Cards */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {['Współpracuj z Pracowniami Projektowymi', 'Współpraca ze stałymi partnerami', 'Współpraca z Blogerami i Influencerami'].map((title, index) => (
              <div key={index} className="relative">
                <Image
                  src={`/images/wspolpraca_${index + 1}.jpg`} // Replace with correct paths
                  alt={title}
                  width={400}
                  height={400}
                  layout="responsive"
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-lg font-bold text-neutral-darkest">{title}</h2>
                  <Link href="#" legacyBehavior>
                    <a className="text-sm text-dark-pastel-red hover:underline">Sprawdź szczegóły</a>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Collaboration Sections */}
          <div className="grid grid-cols-2 gap-6">
            {/* Section 1 */}
            <div className="relative bg-light-beige p-8 rounded-lg flex flex-col justify-between">
              <div>
                <Image
                  src="/images/kolekcje_1.png" // Replace with correct path
                  alt="Współpraca z Pracowniami Projektowymi"
                  width={400}
                  height={200}
                  layout="responsive"
                  className="rounded-lg"
                />
                <h2 className="font-size-h2 font-bold mt-4">Współpraca z Pracowniami Projektowymi</h2>
                <p className="text-sm mt-2">
                  Razem możemy stworzyć coś niesamowitego! Jeśli prowadzisz pracownię projektową i chciałbyś z nami współpracować, daj nam znać! 
                  Oferujemy specjalne warunki współpracy oraz preferencyjne ceny na próbki.
                </p>
              </div>
              <div className="mt-4">
                <Link href="mailto:hello@hvyt.pl" legacyBehavior>
                  <a className="text-sm font-semibold text-dark-pastel-red hover:underline">
                    Wyślij mail: hello@hvyt.pl
                  </a>
                </Link>
              </div>
            </div>

            {/* Section 2 */}
            <div className="relative bg-light-beige p-8 rounded-lg flex flex-col justify-between">
              <Image
                src="/images/kolekcje_2.png" // Replace with correct path
                alt="Współpraca ze stałymi partnerami"
                width={400}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
              <h2 className="font-size-h2 font-bold mt-4">Współpraca ze stałymi partnerami</h2>
              <p className="text-sm mt-2">
                Regularna współpraca z nami oznacza atrakcyjne rabaty na nasze produkty dla naszych stałych klientów.
                Aby skorzystać z naszych rabatów, skontaktuj się z nami i napisz kilka słów o swojej działalności.
              </p>
              <div className="mt-4">
                <Link href="mailto:hello@hvyt.pl" legacyBehavior>
                  <a className="text-sm font-semibold text-dark-pastel-red hover:underline">
                    Wyślij mail: hello@hvyt.pl
                  </a>
                </Link>
              </div>
            </div>

            {/* Section 3 */}
            <div className="relative bg-light-beige p-8 rounded-lg flex flex-col justify-between">
              <Image
                src="/images/kolekcje_3.png" // Replace with correct path
                alt="Współpraca z Blogerami i Influencerami"
                width={400}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
              <h2 className="font-size-h2 font-bold mt-4">Współpraca z Blogerami i Influencerami</h2>
              <p className="text-sm mt-2">
                Pasjonaci wnętrz? Zapraszamy do współpracy! Jeśli jesteś blogerem lub influencerem z zamiłowaniem do wnętrz, daj nam znać!
              </p>
              <div className="mt-4">
                <Link href="mailto:hello@hvyt.pl" legacyBehavior>
                  <a className="text-sm font-semibold text-dark-pastel-red hover:underline">
                    Wyślij mail: hello@hvyt.pl
                  </a>
                </Link>
              </div>
            </div>

            {/* Section 4 */}
            <div className="relative bg-light-beige p-8 rounded-lg flex flex-col justify-between">
              <Image
                src="/images/kolekcje_4.png" // Replace with correct path
                alt="Poznaj nasze produkty"
                width={400}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
              <h2 className="font-size-h2 font-bold mt-4">Poznaj nasze produkty</h2>
              <p className="text-sm mt-2">
                Aby dowiedzieć się więcej o naszych produktach, zapraszamy do zapoznania się z naszym katalogiem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WspolpracaPage;
