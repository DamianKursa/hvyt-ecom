import Image from 'next/image';

const HeroHvytObjects = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center w-full min-h-[795px] mx-auto bg-right bg-cover overflow-hidden"
      style={{
        backgroundImage: 'url("/images/hvyt-objects-hero-bg.png")', // Update with the appropriate background image
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        {/* Content in the Hero */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1 className="text-6xl font-bold leading-tight text-dark-pastel-red mb-4">
              Hvyt Objects
            </h1>
            <p className="text-lg leading-relaxed text-neutral-darkest mb-6">
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co chodzi na tej podstronie.<br />
              Tutaj tekst opisujący co użytkownik tu może znaleźć, o co chodzi na tej podstronie.
            </p>

            <div className="flex space-x-4">
              <a
                className="inline-block min-w-[162px] px-6 py-3 text-lg leading-relaxed text-neutral-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
                href="#"
              >
                Sprawdź najnowszą współpracę
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Static Image */}
        <div className="relative z-10 flex justify-end w-1/2 h-full">
          <Image
            src="/images/hvyt-objects-hero-image.png" // Update with the appropriate image
            alt="Hvyt Objects Hero Image"
            width={600}  // Adjust width and height as needed
            height={600}
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroHvytObjects;
