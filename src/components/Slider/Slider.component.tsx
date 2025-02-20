import { useState } from 'react';

const CustomSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/images/1.png',
      title:
        'Jeśli właśnie się urządzasz i chcesz wyróżnić swoje wnętrze to dobrze trafiłeś!',
    },
    {
      id: 2,
      image: '/images/2.png',
      title:
        'Pstrokata gałka, nowoczesny uchwyt czy elegancka klamka są w stanie zmienić obraz całego mieszkania',
    },
    {
      id: 3,
      image: '/images/3.png',
      title:
        'Jeśli natomiast masz już dość „starych” mebli. Gałki i uchwyty meblowe to doskonały pomysł na odświeżenie starej komody, szafki nocnej czy kuchni',
    },
    {
      id: 4,
      image: '/images/4-onas.png',
      title:
        'Jeśli nie wiesz, który model jest dla Ciebie odpowiedni – napisz do nas.',
    },
  ];

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto relative rounded-[24px] overflow-hidden bg-beige min-h-[400px] md:min-h-[695px]">
      {/* Grid: one column on mobile, two columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch h-full">
        {/* Background image section */}
        <div
          className="relative w-full h-full min-h-[280px] md:min-h-[695px] rounded-t-[24px] md:rounded-l-[24px] md:rounded-t-none bg-cover bg-center"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
          }}
        />

        {/* Text container */}
        <div className="relative">
          {/* Desktop Version – preserved exactly as your original */}
          <div className="hidden md:flex flex-col justify-center ml-[50px] pr-[50px] relative h-full">
            {/* Slide Title */}
            <h3 className="text-4xl font-bold text-neutral-darkest leading-tight mb-6">
              {slides[currentSlide].title}
            </h3>

            {/* Numbers and Navigation Controls (absolutely positioned) */}
            <div className="absolute top-0 pt-10 w-full flex justify-between items-center pr-[50px]">
              {/* Slide Numbers */}
              <div className="text-neutral-darkest text-large">
                <span className="text-black mr-2">{`0${currentSlide + 1}`}</span>
                <span className="text-gray-500">- 04</span>
              </div>

              {/* Navigation Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className={`p-3 rounded-full shadow-lg transition-colors duration-300 ${
                    currentSlide === 0
                      ? 'bg-neutral-light text-gray-400 cursor-not-allowed'
                      : 'bg-gray-400 text-white hover:bg-black'
                  }`}
                  disabled={currentSlide === 0}
                >
                  <img
                    src="/icons/arrow-left.svg"
                    alt="Prev"
                    className="h-5 w-5"
                  />
                </button>
                <button
                  onClick={handleNext}
                  className={`p-3 rounded-full shadow-lg transition-colors duration-300 ${
                    currentSlide === slides.length - 1
                      ? 'bg-neutral-light text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-700'
                  }`}
                  disabled={currentSlide === slides.length - 1}
                >
                  <img
                    src="/icons/arrow-right.svg"
                    alt="Next"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="flex flex-col justify-center p-4 md:hidden">
            {/* Navigation: Numbers and Controls in one row */}
            <div className="flex justify-between items-center">
              <div className="text-2xl text-neutral-darkest">
                <span className="text-black mr-2">{`0${currentSlide + 1}`}</span>
                <span className="text-gray-500">- 04</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-colors duration-300 ${
                    currentSlide === 0
                      ? 'bg-neutral-light text-gray-400 cursor-not-allowed'
                      : 'bg-gray-400 text-white hover:bg-black'
                  }`}
                  disabled={currentSlide === 0}
                >
                  <img
                    src="/icons/arrow-left.svg"
                    alt="Prev"
                    className="h-5 w-5"
                  />
                </button>
                <button
                  onClick={handleNext}
                  className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-colors duration-300 ${
                    currentSlide === slides.length - 1
                      ? 'bg-neutral-light text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-700'
                  }`}
                  disabled={currentSlide === slides.length - 1}
                >
                  <img
                    src="/icons/arrow-right.svg"
                    alt="Next"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
            {/* Slide Title (24px text) placed after navigation */}
            <h3 className="mt-4 text-[24px] font-bold text-black mt-[60px]">
              {slides[currentSlide].title}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomSlider;
