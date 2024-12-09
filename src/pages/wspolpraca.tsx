import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import NaszeKolekcje from '@/components/Index/NaszeKolekcje';

const WspolpracaPage = () => {
  const sectionRefs = {
    pracownie: useRef<HTMLDivElement>(null),
    partnerzy: useRef<HTMLDivElement>(null),
    blogerzy: useRef<HTMLDivElement>(null),
    produkty: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    sectionRefs[section].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Layout title="Współpraca">
      <section className="w-full px-4 md:px-0">
        <div className="container max-w-grid-desktop mx-auto">
          {/* Header Section */}
          <div className="text-left mb-8">
            <h1 className="text-[36px] md:text-[56px] font-bold text-dark-pastel-red leading-tight mb-4">
              Współpracuj z nami
            </h1>
            <p className="text-[16px] md:text-[18px] font-light text-neutral-darkest leading-6 md:leading-8">
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co chodzi
              na tej podstronie. Tutaj tekst opisujący co użytkownik tu może
              znaleźć, o co chodzi na tej podstronie.
            </p>
          </div>

          {/* Top Image Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
            {[
              {
                title: 'Współpracuj z Pracowniami Projektowymi',
                section: 'pracownie',
              },
              {
                title: 'Współpraca ze stałymi partnerami',
                section: 'partnerzy',
              },
              {
                title: 'Współpraca z Blogerami i Influencerami',
                section: 'blogerzy',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative rounded-[16px] overflow-hidden"
              >
                <Image
                  src={`/images/wspolpraca_boxy.png`}
                  alt={item.title}
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-t-[16px]"
                />
                <div className="py-4 flex flex-col gap-4">
                  <h2 className="text-[18px] font-bold text-neutral-darkest">
                    {item.title}
                  </h2>
                  <button
                    onClick={() =>
                      scrollToSection(item.section as keyof typeof sectionRefs)
                    }
                    className="flex items-center justify-between w-full px-4 py-2 border border-black rounded-full text-[16px] font-light text-black"
                  >
                    Sprawdź szczegóły
                    <Image
                      src="/icons/next.svg"
                      alt="Arrow icon"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Collaboration Sections */}
          <div className="grid grid-cols-1 gap-8">
            {/* Section 1 */}
            <div
              ref={sectionRefs.pracownie}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px]">
                <Image
                  src="/images/kolekcje_1_new.png"
                  alt="Współpraca z Pracowniami Projektowymi"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    Współpraca z Pracowniami Projektowymi
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6">
                    Razem możemy stworzyć coś niesamowitego!
                    <br />
                    Jeśli prowadzisz pracownię projektową i chciałbyś z nami
                    współpracować, daj nam znać! Jesteśmy otwarci na nowe
                    pomysły i kolaboracje. Oferujemy specjalne warunki
                    współpracy oraz preferencyjne ceny na próbki. Aby dowiedzieć
                    się więcej, wyślij nam e-mail z danymi rejestrowymi Twojej
                    firmy.
                  </p>
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 2 */}
            <div
              ref={sectionRefs.partnerzy}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px] md:order-last">
                <Image
                  src="/images/kolekcje_2_new.png"
                  alt="Współpraca ze stałymi partnerami"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    Współpraca ze stałymi partnerami
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6">
                    Osiągajmy Razem Niesamowite Wyniki!
                    <br /> Regularna współpraca z nami oznacza atrakcyjne rabaty
                    na nasze produkty dla naszych stałych klientów. Aby
                    skorzystać z naszych rabatów, skontaktuj się z nami i napisz
                    kilka słów o swojej działalności. Chętnie omówimy dostępne
                    opcje rabatowe.
                  </p>
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 3 */}
            <div
              ref={sectionRefs.blogerzy}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px]">
                <Image
                  src="/images/kolekcje_3_new.png"
                  alt="Współpraca z Blogerami i Influencerami"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    Współpraca z Blogerami i Influencerami
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6">
                    Pasjonaci Wnętrz, Zapraszamy do Współpracy!
                    <br /> Jeśli jesteś blogerem lub influencerem z zamiłowaniem
                    do wnętrz, daj nam znać! Chętnie współpracujemy z osobami,
                    które dzielą się swoimi pomysłami i inspiracjami dotyczącymi
                    wnętrz. Wystarczy wysłać do nas wiadomość e-mail lub
                    skontaktować się przez nasze media społecznościowe.
                  </p>
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  Wyślij mail: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 4 */}
            <div
              ref={sectionRefs.produkty}
              className=" h-auto md:h-[520px] grid border border-beige-dark rounded-[24px] md:grid-cols-2 items-center gap-8"
            >
              <div className="order-2 md:order-none md:pr-[72px] md:pl-[24px]">
                <h3 className="text-[40px] font-bold text-black mb-4">
                  Poznaj nasze produkty
                </h3>
                <p className="text-[16px] font-light text-black leading-7 mb-6">
                  Aby dowiedzieć się więcej o naszych produktach,
                  <br /> zapraszamy do zapoznania się z naszym{' '}
                  <Link href="#" className="underline">
                    katalogiem
                  </Link>
                  <br /> Dziękujemy za zainteresowanie naszą ofertą!
                </p>
              </div>
              <div className="h-[520px] overflow-hidden rounded-[24px] order-1 md:order-none">
                <Image
                  src="/images/kolekcje_4_new.png"
                  alt="Poznaj nasze produkty"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[24px] object-cover"
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
