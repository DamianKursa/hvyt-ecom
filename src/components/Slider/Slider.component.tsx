import { useState } from 'react';

const CustomSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/images/01.png',
      title: 'Jeśli właśnie się urządzasz i chcesz wyróżnić swoje wnętrze to dobrze trafiłeś!',
    },
    {
      id: 2,
      image: '/images/02.png',
      title: 'Pstrokata gałka, nowoczesny uchwyt czy elegancka klamka są w stanie zmienić obraz całego mieszkania',
    },
    {
      id: 3,
      image: '/images/03.png',
      title: 'Jeśli natomiast masz już dość „starych” mebli. Gałki i uchwyty meblowe to doskonały pomysł na odświeżenie starej komody, szafki nocnej czy kuchni',
    },
    {
      id: 4,
      image: '/images/03.png',
      title: 'Jeśli nie wiesz, który model jest dla Ciebie odpowiedni – napisz do nas.',
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
    <section className="max-w-[1440px] mx-auto relative rounded-[24px] overflow-hidden bg-beige min-h-[695px]">
      <div className="grid grid-cols-2 items-stretch h-full">
        {/* Background image section */}
        <div
          className="relative w-full min-h-[695px] h-full rounded-l-[24px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
          }}
        />

        {/* Text section with numbers and controls */}
        <div className="relative flex flex-col justify-center ml-[50px] pr-[50px]">
          {/* Slide Title */}
          <h3 className="text-4xl font-bold text-neutral-darkest leading-tight mb-6">
            {slides[currentSlide].title}
          </h3>

          {/* Numbers and Navigation Controls */}
          <div className="absolute top-0 pt-10 w-full flex justify-between items-center pr-[50px]">
            {/* Slide Numbers */}
            <div className="text-neutral-darkest light text-large"> {/* Changed to text-base (16px) */}
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
                <img src="/icons/arrow-left.svg" alt="Prev" className="h-5 w-5" />
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
                <img src="/icons/arrow-right.svg" alt="Next" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomSlider;
