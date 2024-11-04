import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { useAnimateOnScroll } from '../Animations/useAnimateOnScroll';

interface ColorItem {
  src: string;
  alt: string;
  title: string;
}

const WybierzColor = () => {
  const sectionRef = useRef(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  const colorItems: ColorItem[] = [
    { src: '/images/6.png', alt: 'Srebro', title: 'Srebro' },
    { src: '/images/5.png', alt: 'Czerń', title: 'Czerń' },
    { src: '/images/zloto.png', alt: 'Złoto', title: 'Złoto' },
    { src: '/images/4.png', alt: 'Kolory', title: 'Kolory' },
  ];

  return (
    <section
      className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16"
      ref={sectionRef}
    >
      {/* Title, Description, and Button */}
      <div className="flex flex-col items-start mb-8 md:flex-row md:justify-between md:items-center md:px-0 px-4">
        {/* Mobile and Desktop Title, Description */}
        <div className="flex flex-col mb-4 md:mb-0">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            Wybierz kolor, który lubisz
          </h2>
          <p className="font-size-text-medium text-neutral-darkest mt-2 md:mt-0">
            Diabeł tkwi w szczegółach, niech kolor podkręci Twoje wnętrze!
          </p>
        </div>
        {/* Button */}
        <Link
          href="#"
          className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all self-start md:self-auto"
        >
          Sprawdź wszystkie kolory →
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${
                isVisible ? 'min-h-[435px]' : 'min-h-[350px]'
              } w-[50%]`}
            >
              <Image
                src="/images/6.png"
                alt="Srebro"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Srebro
              </div>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${
                isVisible ? 'min-h-[435px]' : 'min-h-[350px]'
              } w-[50%]`}
            >
              <Image
                src="/images/5.png"
                alt="Czerń"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Czerń
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${
                isVisible ? 'w-[50%] min-h-[435px]' : 'w-[30%] min-h-[350px]'
              }`}
            >
              <Image
                src="/images/zloto.png"
                alt="Złoto"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Złoto
              </div>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${
                isVisible ? 'w-[50%] min-h-[435px]' : 'w-[70%] min-h-[350px]'
              }`}
            >
              <Image
                src="/images/4.png"
                alt="Kolory"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Kolory
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={colorItems}
          renderItem={(item: ColorItem) => (
            <div className="relative w-full h-[350px]">
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                {item.title}
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default WybierzColor;
