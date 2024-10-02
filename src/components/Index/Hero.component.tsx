import Image from 'next/image';
import { useEffect, useRef } from 'react';

const Hero = () => {
  const imageRef = useRef(null);
  const boxesRef = useRef([]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.animation = "overlayAnimation 2000ms ease-in-out forwards";
    }

    boxesRef.current.forEach((box, index) => {
      if (box) {
        box.style.animation = `boxMoveAnimation 2000ms ease-in-out ${index * 0.3}s forwards`;
      }
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex items-center w-full min-h-[795px] mx-auto bg-right bg-cover overflow-hidden"
      style={{
        background: 'linear-gradient(270deg, #E4D6B1 6.2%, #E6D8B5 95.01%)',
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        {/* Background boxes for animation */}
        <div className="absolute right-0 top-0 grid grid-cols-3 grid-rows-4 gap-0 justify-end items-center overflow-hidden">
          {Array.from({ length: 12 }).map((_, idx) => {
            const hasBackground =
              (idx === 2) || // 1st column, 3rd row (top to bottom)
              (idx === 4 || idx === 7) || // 2nd column, 2nd and 4th rows
              (idx >= 8); // 3rd column, all rows

            return (
              <div
                key={idx}
                ref={(el) => (boxesRef.current[idx] = el)} // Set ref for each box
                className={`w-[200px] h-[200px] ${hasBackground ? 'bg-[#F5F5AD]' : 'bg-transparent'}`}
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
          <Image
            src="/hero-overlay.png"
            alt="Overlay Image"
            width={1270}
            height={698}
            className="animate-overlay"
            ref={imageRef}
          />
        </div>

        {/* Content in the Hero */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1 className="text-6xl font-bold leading-tight text-dark-pastel-red mb-4">
              Wybierz<br />swój HVYT
            </h1>
            <p className="text-lg leading-relaxed text-neutral-darkest mb-6">
              Od eleganckich, nowoczesnych wzorów uchwytów <br />meblowych po
              ponadczasowe klasyki. Sprawdź jak<br />nasze Hvyt’y mogą odmienić Twoje
              wnętrze.
            </p>

            <div className="flex space-x-4">
              <a
                className="inline-block min-w-[162px]  px-6 py-3 text-lg leading-relaxed text-neutral-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
                href="#"
              >
                Zobacz uchwyty
              </a>
              <a
                className="inline-block min-w-[162px] px-6 py-3 text-lg leading-relaxed border border-black rounded-full hover:border-dark-pastel-red hover:text-dark-pastel-red transition-colors"
                href="#"
              >
                Zobacz gałki
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes overlayAnimation {
          0% {
            transform: rotate(0deg);
            width: 1270px;
            height: 698px;
            opacity: 0;
          }
          25% {
            transform: rotate(10deg);
            opacity: 0.4;
          }
          50% {
            transform: rotate(-10deg);
            opacity: 0.7;
          }
          75% {
            transform: rotate(0deg);
            opacity: 1;
            width: 1450px;
            height: 750px;
          }
          100% {
            transform: rotate(0deg);
            width: 1995.75px;
            height: 1096.88px;
          }
        }

        @keyframes boxMoveAnimation {
          0% {
            transform: translate(200px, 200px) scale(0.5);
            opacity: 0;
          }
          25% {
            transform: translate(150px, 150px) scale(0.7);
            opacity: 0.3;
          }
          50% {
            transform: translate(100px, 100px) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translate(50px, 50px) scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
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

export default Hero;
