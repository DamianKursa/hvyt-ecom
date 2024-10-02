import Image from 'next/image';
import React from 'react';
import { useEffect, useRef } from 'react';

const HeroOnas = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.animation = "overlayAnimation 3s ease-in-out forwards";
    }
  }, []);

  return (
    <section
      id="hero-o-nas"
      className="relative flex items-center w-full min-h-[795px] mx-auto bg-right bg-cover overflow-hidden"
      style={{
        backgroundImage: 'url("/images/o-nas-hero-bg.png")',
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        {/* Background boxes for future animation */}
        <div className="absolute right-0 top-0 grid grid-cols-3 grid-rows-4 gap-0 justify-end items-center overflow-hidden">
          {Array.from({ length: 12 }).map((_, idx) => {
            const hasBackground =
              (idx === 2) || // 1st column, 3rd row (top to bottom)
              (idx === 4 || idx === 7) || // 2nd column, 2nd and 4th rows
              (idx >= 8); // 3rd column, all rows

            return (
              <div
                key={idx}
                className="w-[200px] h-[200px]"
                style={{
                  background: hasBackground ? '#F5F5AD' : 'transparent',
                }}
              />
            );
          })}
        </div>

        {/* Overlay Image centered with animation */}
        <div
          className="absolute inset-0 flex justify-center items-center"
          style={{
            transformOrigin: 'center center',
          }}
        >
        </div>

        {/* Content in the Hero */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1 className="text-6xl font-bold leading-tight text-dark-pastel-red mb-4">
              Mała firma,<br />wielka oferta
            </h1>
            <p className="text-lg leading-relaxed text-neutral-darkest mb-6">
              HVYT powstał z miłości do designu i dodatków.<br /> Wierzymy, że to właśnie one są odpowiedzialne<br />
              za indywidualny charakter każdego wnętrza.<br /> Sami jesteśmy całkiem zakręceni, dlatego nasza<br />
              nazwa to alternatywny zapis słowa „chwyt„.<br /><br /> Staramy się aby nasza oferta była<br /> różnorodna i każdy
              mógł znaleźć coś dla siebie.
            </p>

            <div className="flex space-x-4">
              <a
                className="inline-block min-w-[162px] px-6 py-3 text-lg leading-relaxed text-neutral-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
                href="#"
              >
                Poznaj nas bliżej
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes overlayAnimation {
          0% {
            transform: rotate(-20deg);
            width: 1270px;
            height: 698px;
          }
          25% {
            transform: rotate(20deg);
            width: 1270px;
            height: 698px;
          }
          50% {
            transform: rotate(0deg);
            width: 1270px;
            height: 698px;
          }
          75% {
            transform: rotate(20deg);
            width: 1270px;
            height: 698px;
          }
          100% {
            transform: rotate(20deg);
            width: 1995.75px;
            height: 1096.88px;
          }
        }

        .animate-overlay {
          max-width: 100%; /* Ensure the image stays within the hero section */
          object-fit: cover;
        }

        a {
          padding: 12px 24px; /* 12px top/bottom and 24px left/right */
          font-weight: 300; /* Light font */
        }

        .hover-bg {
          background-color: #DAD3C8;
        }
      `}</style>
    </section>
  );
};

export default HeroOnas;
