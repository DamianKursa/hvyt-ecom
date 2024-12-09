import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';

const WspolpracaPage = () => {
  return (
    <Layout title="Współpraca">
      <section className="w-full py-16 bg-beige-light">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-left mb-12">
            <h1 className="text-[56px] font-bold text-dark-pastel-red leading-tight mb-4">
              Współpracuj z nami
            </h1>
            <p className="text-[18px] font-light text-neutral-darkest leading-8">
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co <br />
              chodzi na tej podstronie. Tutaj tekst opisujący co użytkownik
              <br />
              tu może znaleźć, o co chodzi na tej podstronie.
            </p>
          </div>

          {/* Top Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              'Współpracuj z Pracowniami Projektowymi',
              'Współpraca ze stałymi partnerami',
              'Współpraca z Blogerami i Influencerami',
            ].map((title, index) => (
              <div
                key={index}
                className="relative rounded-[16px] overflow-hidden"
              >
                <Image
                  src={`/images/wspolpraca_boxy.png`}
                  alt={title}
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-t-[16px]"
                />
                <div className="py-6">
                  <h2 className="text-[18px] font-bold text-neutral-darkest mb-4">
                    {title}
                  </h2>
                  <Link
                    href="#"
                    className="text-[16px] text-dark-pastel-red flex items-center gap-2 font-light underline"
                  >
                    Sprawdź szczegóły
                    <img
                      src="/icons/arrow-right.svg"
                      alt="Arrow icon"
                      className="w-4 h-4"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Collaboration Sections */}
          <div className="grid grid-cols-1 gap-8">
            {/* Section 1: Image Left */}
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div className="rounded-[16px] overflow-hidden">
                <Image
                  src="/images/kolekcje_1_new.png"
                  alt="Współpraca z Pracowniami Projektowymi"
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-[16px]"
                />
              </div>
              <div className="md:pl-[72px] md:pr-[24px]">
                <h2 className="text-[24px] font-bold text-neutral-darkest mb-4">
                  Współpraca z Pracowniami Projektowymi
                </h2>
                <p className="text-[16px] font-light text-neutral-darkest leading-7 mb-6">
                  Razem możemy stworzyć coś niesamowitego! Jeśli prowadzisz
                  pracownię projektową i chciałbyś z nami współpracować, daj nam
                  znać! Oferujemy specjalne warunki współpracy oraz
                  preferencyjne ceny na próbki.
                </p>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] font-semibold text-dark-pastel-red flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <img
                    src="/icons/mail.svg"
                    alt="Mail icon"
                    className="w-4 h-4"
                  />
                </Link>
              </div>
            </div>

            {/* Section 2: Image Right */}
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div className="order-2 md:order-none md:pr-[72px] md:pl-[24px]">
                <h2 className="text-[24px] font-bold text-neutral-darkest mb-4">
                  Współpraca ze stałymi partnerami
                </h2>
                <p className="text-[16px] font-light text-neutral-darkest leading-7 mb-6">
                  Regularna współpraca z nami oznacza atrakcyjne rabaty na nasze
                  produkty dla naszych stałych klientów. Aby skorzystać z
                  naszych rabatów, skontaktuj się z nami i napisz kilka słów o
                  swojej działalności.
                </p>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] font-semibold text-dark-pastel-red flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <img
                    src="/icons/mail.svg"
                    alt="Mail icon"
                    className="w-4 h-4"
                  />
                </Link>
              </div>
              <div className="rounded-[16px] overflow-hidden order-1 md:order-none">
                <Image
                  src="/images/kolekcje_2_new.png"
                  alt="Współpraca ze stałymi partnerami"
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-[16px]"
                />
              </div>
            </div>

            {/* Section 3: Image Left */}
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div className="rounded-[16px] overflow-hidden">
                <Image
                  src="/images/kolekcje_3_new.png"
                  alt="Współpraca z Blogerami i Influencerami"
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-[16px]"
                />
              </div>
              <div className="md:pl-[72px] md:pr-[24px]">
                <h2 className="text-[24px] font-bold text-neutral-darkest mb-4">
                  Współpraca z Blogerami i Influencerami
                </h2>
                <p className="text-[16px] font-light text-neutral-darkest leading-7 mb-6">
                  Pasjonaci wnętrz? Zapraszamy do współpracy! Jeśli jesteś
                  blogerem lub influencerem z zamiłowaniem do wnętrz, daj nam
                  znać!
                </p>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] font-semibold text-dark-pastel-red flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <img
                    src="/icons/mail.svg"
                    alt="Mail icon"
                    className="w-4 h-4"
                  />
                </Link>
              </div>
            </div>

            {/* Section 4: Image Right */}
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div className="order-2 md:order-none md:pr-[72px] md:pl-[24px]">
                <h2 className="text-[24px] font-bold text-neutral-darkest mb-4">
                  Poznaj nasze produkty
                </h2>
                <p className="text-[16px] font-light text-neutral-darkest leading-7 mb-6">
                  Aby dowiedzieć się więcej o naszych produktach, zapraszamy do
                  zapoznania się z naszym katalogiem.
                </p>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] font-semibold text-dark-pastel-red flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <img
                    src="/icons/mail.svg"
                    alt="Mail icon"
                    className="w-4 h-4"
                  />
                </Link>
              </div>
              <div className="rounded-[16px] overflow-hidden order-1 md:order-none">
                <Image
                  src="/images/kolekcje_4_new.png"
                  alt="Poznaj nasze produkty"
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-[16px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WspolpracaPage;
