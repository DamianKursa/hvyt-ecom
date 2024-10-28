import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider'; // Assuming ResponsiveSlider is used only for mobile

interface NewArrivalItem {
  src: string;
  alt: string;
  title?: string; // Optional title for mobile view
}

const NewArrivalsSection = () => {
  const newArrivalsItems: NewArrivalItem[] = [
    { src: '/images/new-arrivals-1.png', alt: 'New Arrival 1', title: 'Nowość 1' },
    { src: '/images/new-arrivals-2.png', alt: 'New Arrival 2', title: 'Nowość 2' },
    { src: '/images/new-arrivals-3.png', alt: 'New Arrival 3' },
    { src: '/images/new-arrivals-4.png', alt: 'New Arrival 4' },
  ];

  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] py-16">
      {/* Heading, Description, and Button - Visible on both Desktop and Mobile */}
      <div className="flex flex-col items-start mb-8 md:hidden">
        <h2 className="font-size-h2 font-bold text-neutral-darkest">
          Zobacz nasze nowości
        </h2>
        <p className="font-size-text-medium text-neutral-darkest mt-2">
          Nowa Kolekcja Santi to samo dobro i moc opcji.
        </p>
        <Link
          href="#"
          className="mt-4 px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
        >
          Zobacz nowości →
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-6 h-[650px]">
        {/* First Column */}
        <div className="flex flex-col w-1/2">
          {/* Desktop-only Heading, Text, and Button */}
          <div className="flex flex-col h-full mb-[120px]">
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Zobacz nasze nowości
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Nowa Kolekcja Santi to samo dobro i moc opcji.
            </p>
            <Link
              href="#"
              className="w-1/3 mt-[40px] inline-block px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz nowości →
            </Link>
          </div>
          {/* Two images at the bottom */}
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

        {/* Second Column */}
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

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={newArrivalsItems}
          renderItem={(item: NewArrivalItem) => (
            <div className="relative w-full h-[350px]">
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              {item.title && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {item.title}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default NewArrivalsSection;
