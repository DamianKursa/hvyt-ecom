import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const NewArrivalsSection = () => {
  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] py-16">
      {/* Desktop view */}
      <div className="md:flex gap-6 h-[650px]">
        {/* First column */}
        <div className="flex flex-col w-1/2">
          {/* Title, text, and button */}
          <div className="flex flex-col h-full">
            <div>
              <h2 className="font-size-h2 font-bold text-neutral-darkest">
                Zobacz nasze nowości
              </h2>
              <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
                Nowa Kolekcja Santi to samo dobro i moc opcji.
              </p>
            </div>
            <Link
              href="#"
              className="w-1/3 mb-[120px] mt-[40px] inline-block px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz nowości →
            </Link>
          </div>
      {/* Swiper for mobile view */}
      <div className="block md:hidden">
        <Swiper spaceBetween={8} slidesPerView={1.5}>
          <SwiperSlide>
            <Image
              src="/images/new-arrivals-1.png"
              alt="New Arrival 1"
              width={245}
              height={245}
              className="w-full h-auto object-cover rounded-lg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/images/new-arrivals-2.png"
              alt="New Arrival 2"
              width={245}
              height={245}
              className="w-full h-auto object-cover rounded-lg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/images/new-arrivals-3.png"
              alt="New Arrival 3"
              width={245}
              height={642}
              className="w-full h-auto object-cover rounded-lg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/images/new-arrivals-4.png"
              alt="New Arrival 4"
              width={245}
              height={642}
              className="w-full h-auto object-cover rounded-lg"
            />
          </SwiperSlide>
        </Swiper>
      </div>
          {/* Two images in the first column */}
          <div className="flex gap-6">
            <div className="w-full h-[250px]">
              <Image
                src="/images/new-arrivals-1.png"
                alt="New Arrival 1"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-full h-[250px]">
              <Image
                src="/images/new-arrivals-2.png"
                alt="New Arrival 2"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Second column */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            {/* Two images placed next to each other with responsive dimensions */}
            <div className="w-full h-full">
              <Image
                src="/images/new-arrivals-3.png"
                alt="New Arrival 3"
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-lg"
              />
            </div>
            <div className="w-full h-full">
              <Image
                src="/images/new-arrivals-4.png"
                alt="New Arrival 4"
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
