import React from 'react';
import Image from 'next/image';

const HeroOnas = () => {
  const staticBoxes = [
    { index: 2, bgColor: '#F5F5AD' },
    { index: 5, bgColor: '#F5F5AD' },
    { index: 4, bgColor: '#F5F5AD' },
    { index: 6, bgColor: '#F5F5AD' },
    { index: 8, bgColor: '#F5F5AD' },
    { index: 10, bgColor: '#F5F5AD' },
    { index: 11, bgColor: '#F5F5AD' },
  ];

  return (
    <section
      id="hero-o-nas"
      className="relative flex pt-[125px] md:items-center w-full min-h-[795px] mx-auto overflow-hidden px-4 md:px-0 bg-right bg-cover"
      style={{
        backgroundImage: 'url("/images/o-nas-hero-bg.png")',
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        {/* Static Background Boxes - hidden on mobile */}
        <div className="hidden md:grid grid-cols-3 grid-rows-4 gap-0 justify-end items-center overflow-hidden absolute right-0 top-0">
          {Array.from({ length: 12 }).map((_, idx) => {
            const boxConfig = staticBoxes.find((box) => box.index === idx);
            return (
              <div
                key={idx}
                className="w-[200px] h-[200px] relative"
                style={{
                  background: boxConfig ? boxConfig.bgColor : 'transparent',
                }}
              >
                {idx === 6 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/icons/onas-ikon.svg"
                      alt="Onas Icon"
                      width={65}
                      height={89}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1
              className="text-[40px] md:text-6xl font-bold leading-tight text-dark-pastel-red mb-4"
              dangerouslySetInnerHTML={{
                __html: 'Mała firma,<br /> wielka oferta',
              }}
            ></h1>

            {/* Mobile Description (without forced <br />) */}
            <p className="block md:hidden text-lg leading-relaxed text-neutral-darkest mb-6">
              HVYT powstał z miłości do designu i dodatków. Wierzymy, że to
              właśnie one są odpowiedzialne za indywidualny charakter każdego
              wnętrza. Sami jesteśmy całkiem zakręceni, dlatego nasza nazwa to
              alternatywny zapis słowa „chwyt“. Staramy się aby nasza oferta
              była różnorodna i każdy mógł znaleźć coś dla siebie.
            </p>
            {/* Desktop Description */}
            <p
              className="hidden md:block text-lg leading-relaxed text-neutral-darkest mb-6"
              dangerouslySetInnerHTML={{
                __html:
                  'HVYT powstał z miłości do designu i dodatków.<br /> Wierzymy, że to właśnie one są odpowiedzialne<br /> za indywidualny charakter każdego wnętrza.<br /> Sami jesteśmy całkiem zakręceni, dlatego nasza<br /> nazwa to alternatywny zapis słowa „chwyt„.<br /><br /> Staramy się aby nasza oferta była<br /> różnorodna i każdy mógł znaleźć coś dla siebie.',
              }}
            ></p>
          </div>
        </div>
      </div>

      {/* Mobile-Only Overlay at Bottom Right */}
      <div className="absolute bottom-0 right-0 block md:hidden">
        <Image
          src="/images/bg-mobile-hero.svg"
          alt="Onas Mobile Overlay"
          width={300}
          height={200}
          priority
        />
      </div>
    </section>
  );
};

export default HeroOnas;
